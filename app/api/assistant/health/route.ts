import { NextResponse } from "next/server";
import { GEMINI_MODELS, provider } from "@/lib/llm";

// Read-only diagnosis for "the mascot won't talk". Reports WHICH provider is
// configured and whether the key is accepted — never the key itself.
// No auth, so the output is deliberately boring: booleans, a 4-char prefix,
// and a status code. Cached briefly so it can't be used to hammer the API.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

let cache: { at: number; body: unknown } | null = null;

type Shape = {
  present: boolean;
  prefix?: string;
  lengthOk?: boolean;
  hasWhitespace?: boolean;
  hasQuotes?: boolean;
};

function shape(value: string | undefined): Shape {
  const v = value ?? "";
  if (!v) return { present: false };
  return {
    present: true,
    prefix: v.slice(0, 4),
    lengthOk: v.trim().length >= 30,
    hasWhitespace: v !== v.trim(),
    hasQuotes: /^["']|["']$/.test(v),
  };
}

async function testGemini(key: string, model: string) {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: "POST",
        headers: { "content-type": "application/json", "x-goog-api-key": key.trim() },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: "ping" }] }],
          generationConfig: { maxOutputTokens: 1, thinkingConfig: { thinkingBudget: 0 } },
        }),
        signal: AbortSignal.timeout(15000),
      }
    );
    let reason: string | undefined;
    let message: string | undefined;
    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as {
        error?: { status?: string; message?: string };
      } | null;
      reason = body?.error?.status;
      // Google echoes request details in errors; make sure a key can never ride along.
      message = body?.error?.message?.replaceAll(key.trim(), "[redacted]").slice(0, 160);
    }
    return { http: res.status, ok: res.ok, reason, message };
  } catch {
    return { http: 0, ok: false as const, reason: "network_error" };
  }
}

export async function GET() {
  if (cache && Date.now() - cache.at < 60_000) return NextResponse.json(cache.body);

  const which = provider();
  const geminiKey = process.env.GEMINI_API_KEY ?? "";
  const anthropicKey = process.env.ANTHROPIC_API_KEY ?? "";
  const geminiModel = process.env.GEMINI_MODEL || "";
  const anthropicModel = process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5";

  // Test every model name in the fallback chain, so it's obvious which one the
  // key is actually allowed to use — that's what a retired name looks like.
  const live =
    which === "gemini"
      ? await Promise.all(
          GEMINI_MODELS.map(async (model) => ({ model, ...(await testGemini(geminiKey, model)) }))
        )
      : null;

  const body = {
    provider: which, // "gemini" | "anthropic" | null
    route: which === "gemini" ? GEMINI_MODELS : which === "anthropic" ? [anthropicModel] : [],
    modelOverride: geminiModel || null,
    gemini: shape(geminiKey),
    anthropic: shape(anthropicKey),
    live,
  };

  cache = { at: Date.now(), body };
  return NextResponse.json(body);
}
