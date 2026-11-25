import type { CSSProperties } from "react";
import type { Look } from "@/lib/assistant";
import Mascot from "@/components/Mascot";

// Same word, two views, side by side: you get letters, the model gets two chunks.
// Once the difference is on screen, "it has to guess" needs no argument.

const WORD = "strawberry";
const PIECES = ["straw", "berry"];

export default function LetterBlind({ look }: { look: Look }) {
  const d = (s: number): CSSProperties => ({ animationDelay: `${s}s` });

  return (
    <div className="lv lv-lb">
      <div className="lv-lb-col lv-in" style={d(0.1)}>
        <b>You see</b>
        <div className="lv-ts-row">
          {WORD.split("").map((c, i) => (
            <span key={i} className={`lv-tile${c === "r" ? " hit" : ""}`}>
              {c}
            </span>
          ))}
        </div>
        <span className="lv-cap">Three r&apos;s. Counted in a second.</span>
      </div>

      <div className="lv-lb-col lv-in" style={d(0.75)}>
        <b>The model sees</b>
        <div className="lv-ts-row">
          {PIECES.map((p, i) => (
            <span key={p} className="lv-tk lv-pop" style={d(1.1 + i * 0.22)}>
              {p}
            </span>
          ))}
        </div>
        <span className="lv-cap">No letters in there to count.</span>
      </div>

      <div className="lv-lb-side lv-pop" style={d(1.6)}>
        <Mascot look={look} mood="think" prop="none" size={68} />
      </div>
    </div>
  );
}
