// One small provider shim for the mascot's brain.
//
// Google AI Studio (Gemini) is preferred because its free tier is generous;
// Anthropic stays as a fallback so nothing breaks if GEMINI_API_KEY is unset.
// Both are called from the server only — the key never reaches the browser.

export type Msg = { role: "user" | "assistant"; text: string };

// Google retires model names for newly created keys — 2.5 Flash just did that
// ("no longer available to new users"). So the name is env-overridable and a
// *-latest alias is tried if the primary 404s; otherwise a retired name means
// silence forever with no clue why.
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash";
const GEMINI_FALLBACK_MODEL = process.env.GEMINI_FALLBACK_MODEL || "gemini-flash-latest";
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5";

export const GEMINI_MODELS = [GEMINI_MODEL, GEMINI_FALLBACK_MODEL].filter(
  (m, i, all) => Boolean(m) && all.indexOf(m) === i
);

export type Provider = "gemini" | "anthropic" | null;

export function provider(): Provider {
  if (process.env.GEMINI_API_KEY?.trim()) return "gemini";
  if (process.env.ANTHROPIC_API_KEY?.trim()) return "anthropic";
  return null;
}

export type Failure = { ok: false; error: "not_configured" | "upstream" | "slow_down"; status: number };
export type Success = { ok: true; text: string };
export type Result = Success | Failure;

// Gemini wants the system prompt separately and uses "model" instead of "assistant".
async function viaGemini(system: string, messages: Msg[], maxTokens: number): Promise<Result> {
  const key = process.env.GEMINI_API_KEY!.trim();

  // Gemini rejects a conversation that starts with a model turn.
  const contents = messages
    .filter((m, i) => !(i === 0 && m.role === "assistant"))
    .map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.text }] }));

  let res: Response | null = null;
  for (const model of GEMINI_MODELS) {
    const generationConfig: Record<string, unknown> = { maxOutputTokens: maxTokens, temperature: 0.9 };
    // 2.5 Flash thinks before answering unless told not to; that burns free-tier
    // tokens and latency on what are one-line replies. Pro models refuse 0.
    if (!/pro/i.test(model)) generationConfig.thinkingConfig = { thinkingBudget: 0 };

    res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: "POST",
        headers: { "content-type": "application/json", "x-goog-api-key": key },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents,
          generationConfig,
        }),
        signal: AbortSignal.timeout(25000),
      }
    );

    // 404 = this model name isn't offered to this key, so try the next one.
    // 429/400/403 are real answers about the request, so stop there.
    if (res.status !== 404) break;
  }

  if (!res) return { ok: false, error: "upstream", status: 502 };
  if (res.status === 429) return { ok: false, error: "slow_down", status: 429 };
  if (!res.ok) return { ok: false, error: "upstream", status: 502 };

  const data = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string; thought?: boolean }[] } }[];
  };
  const text = (data.candidates?.[0]?.content?.parts ?? [])
    .filter((p) => !p.thought && typeof p.text === "string")
    .map((p) => p.text)
    .join("")
    .trim();
  if (!text) return { ok: false, error: "upstream", status: 502 };
  return { ok: true, text };
}

async function viaAnthropic(system: string, messages: Msg[], maxTokens: number): Promise<Result> {
  const key = process.env.ANTHROPIC_API_KEY!.trim();
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: maxTokens,
      system,
      messages: messages.map((m) => ({ role: m.role, content: m.text })),
    }),
    signal: AbortSignal.timeout(25000),
  });
  if (res.status === 429) return { ok: false, error: "slow_down", status: 429 };
  if (!res.ok) return { ok: false, error: "upstream", status: 502 };

  const data = (await res.json()) as { content?: { type: string; text?: string }[] };
  const text = (data.content ?? [])
    .filter((b) => b.type === "text" && typeof b.text === "string")
    .map((b) => b.text)
    .join("")
    .trim();
  if (!text) return { ok: false, error: "upstream", status: 502 };
  return { ok: true, text };
}

export async function generateText(opts: {
  system: string;
  messages: Msg[];
  maxTokens?: number;
}): Promise<Result> {
  const which = provider();
  if (!which) return { ok: false, error: "not_configured", status: 503 };
  const maxTokens = opts.maxTokens ?? 500;
  try {
    return which === "gemini"
      ? await viaGemini(opts.system, opts.messages, maxTokens)
      : await viaAnthropic(opts.system, opts.messages, maxTokens);
  } catch {
    return { ok: false, error: "upstream", status: 502 };
  }
}
