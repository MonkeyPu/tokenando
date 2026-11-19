import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { LOOK_SYSTEM_PROMPT, sanitizeLook } from "@/lib/assistant";

export const runtime = "nodejs";

const hits = new Map<string, number[]>();
function tooMany(user: string) {
  const now = Date.now();
  const recent = (hits.get(user) ?? []).filter((t) => now - t < 10 * 60 * 1000);
  recent.push(now);
  hits.set(user, recent);
  return recent.length > 10;
}

export async function POST(req: Request) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return NextResponse.json({ error: "not_configured" }, { status: 503 });

  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false },
  });
  const { data: auth, error: authError } = await sb.auth.getUser(token);
  if (authError || !auth.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (tooMany(auth.user.id)) return NextResponse.json({ error: "slow_down" }, { status: 429 });

  const body = (await req.json().catch(() => null)) as { description?: string } | null;
  const description = typeof body?.description === "string" ? body.description.trim().slice(0, 200) : "";
  if (!description) return NextResponse.json({ error: "bad_request" }, { status: 400 });

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5",
        max_tokens: 200,
        system: LOOK_SYSTEM_PROMPT,
        messages: [{ role: "user", content: `<description>${description}</description>` }],
      }),
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) return NextResponse.json({ error: "upstream" }, { status: 502 });
    const data = (await res.json()) as { content?: { type: string; text?: string }[] };
    const text = (data.content ?? []).filter((b) => b.type === "text").map((b) => b.text).join("");
    const match = text.match(/\{[\s\S]*\}/);
    // Whatever the AI returns is checked against the allowed shapes, colours, eyes and accessories.
    const look = match ? sanitizeLook(JSON.parse(match[0])) : null;
    if (!look) return NextResponse.json({ error: "bad_look" }, { status: 502 });
    return NextResponse.json({ look });
  } catch {
    return NextResponse.json({ error: "upstream" }, { status: 502 });
  }
}
