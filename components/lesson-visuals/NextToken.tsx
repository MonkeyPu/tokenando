import type { CSSProperties } from "react";
import type { Look } from "@/lib/assistant";
import Mascot from "@/components/Mascot";

// Teaches next-token prediction by showing the actual decision: one blank, three
// candidates, bars filling in by likelihood, the winner landing. The bar lengths
// *are* the lesson, so nothing else in the card needs to explain it twice.

const CANDS = [
  { word: "mat", p: 71, win: true },
  { word: "floor", p: 18 },
  { word: "moon", p: 2 },
];

export default function NextToken({ look }: { look: Look }) {
  const d = (s: number): CSSProperties => ({ animationDelay: `${s}s` });

  return (
    <div className="lv lv-nt">
      <div className="lv-nt-side">
        <Mascot look={look} mood="think" prop="none" size={82} />
      </div>

      <div className="lv-nt-main">
        <p className="lv-sent">
          The cat sat on the <span className="lv-blank">?</span>
        </p>

        <div className="lv-cands">
          {CANDS.map((c, i) => (
            <div key={c.word} className={`lv-cand lv-in${c.win ? " win" : ""}`} style={d(0.25 + i * 0.22)}>
              <span className="lv-word">{c.word}</span>
              <span className="lv-bar">
                <i style={{ width: `${c.p}%`, animationDelay: `${0.7 + i * 0.22}s` }} />
              </span>
              <span className="lv-pct">{c.p}%</span>
            </div>
          ))}
        </div>

        <p className="lv-cap lv-in" style={d(2.1)}>
          Pick the likeliest next chunk, then do it again. That's the whole engine.
        </p>
      </div>
    </div>
  );
}
