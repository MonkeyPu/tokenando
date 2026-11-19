import { supabase } from "./supabase";

// The assistant checks the `faq` table first, so common questions are answered without any AI call.
type Faq = { question: string; answer: string };

let cache: Faq[] | null = null;

const STOP = new Set(["the", "a", "an", "is", "are", "what", "whats", "how", "why", "do", "does", "did", "i", "you", "me", "my", "of", "to", "in", "it", "can", "and", "or", "for", "on", "with", "about", "tell", "please", "mean", "means"]);

const words = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter((w) => w.length > 1 && !STOP.has(w));

export async function findFaqAnswer(text: string): Promise<string | null> {
  try {
    if (!cache) {
      const { data, error } = await supabase.from("faq").select("question,answer");
      if (error) return null;
      cache = (data ?? []) as Faq[];
    }
    const asked = words(text);
    if (asked.length === 0) return null;
    let best: { score: number; answer: string } | null = null;
    for (const f of cache) {
      const qw = new Set(words(f.question));
      if (qw.size === 0) continue;
      const overlap = asked.filter((w) => qw.has(w)).length;
      const score = overlap / Math.max(qw.size, asked.length);
      if (overlap >= 1 && score >= 0.6 && (!best || score > best.score)) best = { score, answer: f.answer };
    }
    return best ? best.answer : null;
  } catch {
    return null;
  }
}
