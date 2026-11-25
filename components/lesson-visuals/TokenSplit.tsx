import type { CSSProperties } from "react";
import type { Look } from "@/lib/assistant";
import Mascot from "@/components/Mascot";

// "Chunks, not letters": the same word is shown twice — once as the ten letters a
// human sees, once as the two pieces a tokenizer actually produces. The contrast
// is the lesson, so the caption only carries the rule of thumb.

const LETTERS = "strawberry".split("");
const PIECES = ["straw", "berry"];

export default function TokenSplit({ look }: { look: Look }) {
  const d = (s: number): CSSProperties => ({ animationDelay: `${s}s` });

  return (
    <div className="lv lv-ts">
      <div className="lv-ts-body">
        <div className="lv-ts-col">
          <span className="lv-mini">What you see</span>
          <div className="lv-ts-row">
            {LETTERS.map((c, i) => (
              <span key={i} className="lv-tile lv-pop" style={d(i * 0.055)}>
                {c}
              </span>
            ))}
          </div>

          <span className="lv-mini">What the model sees</span>
          <div className="lv-ts-row">
            {PIECES.map((p, i) => (
              <span key={p} className="lv-tk lv-pop" style={d(0.9 + i * 0.22)}>
                {p}
              </span>
            ))}
            <span className="lv-tk tiny lv-pop" style={d(1.34)}>
              .
            </span>
          </div>
        </div>

        <div className="lv-ts-side">
          <Mascot look={look} mood="point" prop="none" size={76} />
        </div>
      </div>

      <p className="lv-rule lv-in" style={d(1.8)}>
        <b>750 words</b> <span>≈</span> <b>1,000 tokens</b>
      </p>
    </div>
  );
}
