// One small provider shim for the mascot's brain.
//
// Google AI Studio (Gemini) is preferred because its free tier is generous;
// Anthropic stays as a fallback so nothing breaks if GEMINI_API_KEY is unset.
// Both are called from the server only — the key never reaches the browser.

export type Msg = { role: "user" | "assistant"; text: string };

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5";

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

  const generationConfig: Record<string, unknown> = { maxOutputTokens: maxTokens, temperature: 0.9 };
  // 2.5 Flash thinks before answering unless told not to; that burns free-tier
  // tokens and latency on what are one-line replies. Pro models refuse 0.
  if (!/pro/i.test(GEMINI_MODEL)) generationConfig.thinkingConfig = { thinkingBudget: 0 };

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(GEMINI_MODEL)}:generateContent`,
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
