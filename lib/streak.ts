// Answer-streak state that outlives a single lesson.
// Without this the counter resets on every lesson (and every reload), so the
// best possible streak was however many questions one lesson contains.
const KEY = "tokenando.streak.v1";

export type Streak = { combo: number; best: number };

const EMPTY: Streak = { combo: 0, best: 0 };

function clean(n: unknown): number {
  return typeof n === "number" && Number.isFinite(n) ? Math.max(0, Math.floor(n)) : 0;
}

export function loadStreak(): Streak {
  if (typeof window === "undefined") return { ...EMPTY };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { ...EMPTY };
    const parsed = JSON.parse(raw) as Partial<Streak>;
    const combo = clean(parsed.combo);
    return { combo, best: Math.max(combo, clean(parsed.best)) };
  } catch {
    return { ...EMPTY };
  }
}

export function saveStreak(s: Streak) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ combo: clean(s.combo), best: clean(s.best) }));
  } catch {
    // Private mode or a full quota: the streak just won't persist.
  }
}

export function clearStreak() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // Nothing to do.
  }
}
