import type { CSSProperties } from "react";
import type { Look } from "@/lib/assistant";
import Mascot from "@/components/Mascot";

// The point of the card is the contrast, so the diagram is a side-by-side:
// you learn the world by living in it (a thing actually falls), the model learns
// which words follow which (suggestions appearing under a sentence).

const SUGGESTIONS = ["pie", "juice", "tastes"];

export default function SmartAutocomplete({ look }: { look: Look }) {
  const d = (s: number): CSSProperties => ({ animationDelay: `${s}s` });

  return (
    <div className="lv lv-ac">
      <div className="lv-ac-card lv-in">
        <b>You</b>
        <div className="lv-ac-demo">
          <span className="lv-ball" />
          <span className="lv-ground" />
          <span className="lv-ac-tag">it falls</span>
        </div>
        <p className="lv-cap">You've dropped things. You know how the world behaves.</p>
      </div>

      <div className="lv-ac-card lv-in" style={d(0.5)}>
        <b>Model</b>
        <p className="lv-ph">The apple tastes ___</p>
        <div className="lv-sug">
          {SUGGESTIONS.map((s, i) => (
            <span key={s} className="lv-chip lv-pop" style={d(1 + i * 0.28)}>
              {s}
            </span>
          ))}
        </div>
        <p className="lv-cap">It has read a lot of text. It knows which words follow which.</p>
      </div>

      <div className="lv-ac-mascot lv-in" style={d(2)}>
        <Mascot look={look} mood="point" prop="none" size={74} />
      </div>
    </div>
  );
}
