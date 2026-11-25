import type { CSSProperties } from "react";
import type { Look } from "@/lib/assistant";
import Mascot from "@/components/Mascot";

// The strawberry trap, played out: the question, a confident "Two", then the letters
// counted out with the three r's marked. The mistake is shown, not described.

const WORD = "strawberry";

export default function StrawberryAsk({ look }: { look: Look }) {
  const d = (s: number): CSSProperties => ({ animationDelay: `${s}s` });

  return (
    <div className="lv lv-sb">
      <div className="lv-you lv-in" style={d(0.1)}>
        <span className="lv-tag">You</span>
        <p>How many r&apos;s are in &ldquo;strawberry&rdquo;?</p>
      </div>

      <div className="lv-lanes">
        <div className="lv-lane lv-in" style={d(0.6)}>
          <span className="lv-avatar">AI</span>
          <p className="lv-sb-answer">
            <b>Two!</b> <span className="lv-cap">said without hesitating</span>
          </p>
        </div>
      </div>

      <div className="lv-ts-row lv-sb-letters">
        {WORD.split("").map((c, i) => (
          <span
            key={i}
            className={`lv-tile lv-pop${c === "r" ? " hit" : ""}`}
            style={d(1.1 + i * 0.06)}
          >
            {c}
          </span>
        ))}
      </div>

      <div className="lv-sb-foot">
        <div className="lv-stamp lv-stamp-in" style={d(2.1)}>
          <b>3</b>
          <span>the real answer</span>
          <em>straw + berry</em>
        </div>
        <div className="lv-sb-side">
          <Mascot look={look} mood="oops" prop="none" size={70} />
        </div>
        <p className="lv-cap lv-in" style={d(2.2)}>
          It never saw s-t-r-a-w-b-e-r-r-y letter by letter — so it guessed from patterns.
        </p>
      </div>
    </div>
  );
}
