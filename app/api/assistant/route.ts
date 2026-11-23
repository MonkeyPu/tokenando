import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { DEFAULT_SETTINGS, PERSONALITIES, buildSystemPrompt, cleanName } from "@/lib/assistant";
import { generateText, provider } from "@/lib/llm";

export const runtime = "nodejs";
// The model chain may try 3 names (and retry one without thinkingConfig), which
// can outlast Vercel's 10s default and surface as a bare 504.
export const maxDuration = 30;

// Light protection against runaway use. This is per server instance, so it's a speed bump, not a wall.
const hits = new Map<string, number[]>();
function tooMany(user: string) {
  const now = Date.now();
  const recent = (hits.get(user) ?? []).filter((t) => now - t < 10 * 60 * 1000);
  recent.push(now);
  hits.set(user, recent);
  return recent.length > 30;
}

export async function POST(req: Request) {
  // No provider configured yet: the app shows the assistant's "not connected" message.
  if (!provider()) return NextResponse.json({ error: "not_configured" }, { status: 503 });

  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false },
  });
  const { data: auth, error: authError } = await sb.auth.getUser(token);
  if (authError || !auth.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (tooMany(auth.user.id)) return NextResponse.json({ error: "slow_down" }, { status: 429 });

  const body = (await req.json().catch(() => null)) as { messages?: { role?: string; text?: string }[] } | null;
  const messages = (body?.messages ?? [])
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.text === "string" && m.text.trim())
    .slice(-20)
    .map((m) => ({ role: m.role as "user" | "assistant", text: (m.text as string).trim().slice(0, 1000) }));
  if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  // Read the assistant's name and personality from the database, never from the browser.
  const { data: row } = await sb
    .from("profiles")
    .select("assistant_name,assistant_personality,assistant_personality_custom")
    .eq("id", auth.user.id)
    .maybeSingle();
  const name = cleanName(row?.assistant_name ?? DEFAULT_SETTINGS.name);
  const id = row?.assistant_personality ?? DEFAULT_SETTINGS.personality;
  const preset = PERSONALITIES.find((p) => p.id === id);
  const custom = id === "custom" && typeof row?.assistant_personality_custom === "string" && row.assistant_personality_custom.trim();
  const system = buildSystemPrompt(
    name,
    custom ? { custom: true, text: (row!.assistant_personality_custom as string).slice(0, 300) } : { custom: false, text: (preset ?? PERSONALITIES[0]).prompt }
  );

  const result = await generateText({ system, messages, maxTokens: 500 });
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json({ reply: result.text });
}
