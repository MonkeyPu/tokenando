import type { CSSProperties } from "react";
import type { Look } from "@/lib/assistant";
import Mascot from "@/components/Mascot";

// Card 3 closes the loop: the pipeline that turns your sentence back into the next
// token. Stages light up left to right, then the answer arrives — the same engine
// from lesson "Predicting, not thinking", now with the vector step shown.

const STAGES = [
  { t: "your words", s: "“how do tokens”" },
  { t: "vectors", s: "[0.21 −0.44 0.80 …]" },
  { t: "nearest ideas", s: "cost · limit · word" },
];

export default function VectorPredict({ look }: { look: Look }) {
  const d = (s: number): CSSProperties => ({ animationDelay: `${s}s` });

  return (
    <div className="lv lv-vp">
      <div className="lv-vp-flow">
        {STAGES.map((st, i) => (
          <div key={st.t} className="lv-vp-stage lv-pop" style={d(0.15 + i * 0.42)}>
            <b>{st.t}</b>
            <span>{st.s}</span>
          </div>
        ))}
        <div className="lv-vp-stage out lv-pop" style={d(1.5)}>
          <b>next token</b>
          <span>“work” · 64%</span>
        </div>
      </div>

      <div className="lv-vp-foot">
        <Mascot look={look} mood="point" prop="none" size={72} />
        <p className="lv-cap lv-in" style={d(1.9)}>
          Then the new token is added to the sentence and the whole thing runs again — until
          the answer is finished.
        </p>
      </div>
    </div>
  );
}
