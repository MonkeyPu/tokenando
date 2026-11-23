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
// Comma-separated. gemini-flash-latest turned out to be just an alias for the
// newest Flash, so it 503s at the same moment as the primary — no spare
// capacity there. The previous generation and the lite model are what actually
// answer when the newest one is having a spike.
const GEMINI_FALLBACK_MODEL =
  process.env.GEMINI_FALLBACK_MODEL || "gemini-3.6-flash,gemini-flash-lite-latest";
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5";

export const GEMINI_MODELS: string[] = [GEMINI_MODEL, ...GEMINI_FALLBACK_MODEL.split(",")]
  .map((m) => m.trim())
  .filter((m, i, all) => Boolean(m) && all.indexOf(m) === i);

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

  // One attempt at one model. thinkingBudget:0 stops 3.x Flash spending
  // hundreds of thinking tokens on a one-line reply (measured: 303 thoughts for
  // a 5-token answer), but the lite models reject the field outright with
  // 400 INVALID_ARGUMENT — so it is opt-in per attempt, not per model name.
  async function attempt(model: string, withThinking: boolean) {
    const generationConfig: Record<string, unknown> = { maxOutputTokens: maxTokens, temperature: 0.9 };
    if (withThinking && !/pro/i.test(model)) generationConfig.thinkingConfig = { thinkingBudget: 0 };

    const res = await fetch(
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

    const raw = (await res.json().catch(() => ({}))) as {
      candidates?: { content?: { parts?: { text?: string; thought?: boolean }[] } }[];
      error?: { status?: string; message?: string };
    };
    const text = (raw.candidates?.[0]?.content?.parts ?? [])
      .filter((p) => !p.thought && typeof p.text === "string")
      .map((p) => p.text)
      .join("")
      .trim();
    return { status: res.status, ok: res.ok, text, error: raw.error };
  }

  let lastError: string | undefined;
  for (const model of GEMINI_MODELS) {
    let r = await attempt(model, true);
    if (r.status === 400 && /invalid argument|thinking/i.test(r.error?.message ?? "")) {
      r = await attempt(model, false); // this model refuses thinkingConfig
    }
    if (r.ok && r.text) return { ok: true, text: r.text };

    lastError = `${model} ${r.status} ${r.error?.status ?? ""} ${r.error?.message ?? ""}`.trim();
    if (r.status === 429) return { ok: false, error: "slow_down", status: 429 };
    if (r.status === 401 || r.status === 403) break; // bad key: other names won't help
    // 404 = retired name for this key, 503 = "high demand" spike, 400/500 = next name.
  }

  console.warn("[llm] every Gemini model failed:", lastError);
  return { ok: false, error: "upstream", status: 502 };
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
