import type { CSSProperties } from "react";
import type { Look } from "@/lib/assistant";
import Mascot from "@/components/Mascot";

// Same idea, two languages, different bill. The rows use token chips rather than
// exact counts, so the shape of the inequality is right even if a tokenizer
// disagrees by one — the caption states the cost, not a precise number.

const ROWS = [
  { lang: "English", line: "Hello, how are you today?", chips: ["Hello", ",", " how", " are", " you", " today", "?"], hot: false },
  { lang: "Spanish", line: "Hola, ¿cómo estás hoy?", chips: ["Hola", ",", " ¿", "cómo", " estás", " hoy", "?"], hot: true },
];

export default function LanguageCost({ look }: { look: Look }) {
  const d = (s: number): CSSProperties => ({ animationDelay: `${s}s` });

  return (
    <div className="lv lv-lc">
      {ROWS.map((r, ri) => (
        <div key={r.lang} className="lv-lc-row">
          <b>{r.lang}</b>
          <div className="lv-lc-chips">
            {r.chips.map((c, i) => (
              <span
                key={`${r.lang}-${i}`}
                className={`lv-tk tiny lv-pop${r.hot ? " hot" : ""}`}
                style={d(0.15 + ri * 0.5 + i * 0.07)}
              >
                {c.trim() === "" ? "·" : c.trim()}
              </span>
            ))}
          </div>
        </div>
      ))}

      <div className="lv-lc-foot">
        <Mascot look={look} mood="think" prop="none" size={68} />
        <div className="lv-lc-notes lv-in" style={d(1.5)}>
          <span className="lv-cap">
            Tokenizers learned mostly from English, so other languages need more pieces for
            the same meaning.
          </span>
          <span className="lv-learn">more tokens = higher cost + less room</span>
        </div>
      </div>
    </div>
  );
}
