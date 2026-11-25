import type { CSSProperties } from "react";
import type { Look } from "@/lib/assistant";
import Mascot from "@/components/Mascot";

// Two panels make the timing clear: the training text is shut away, while the
// answer is built live, one piece at a time. The feedback strip is the second,
// separate round of training the card mentions.

const TOKENS = ["Because", "each", "word", "costs", "compute"];

export default function AfterTraining({ look }: { look: Look }) {
  const d = (s: number): CSSProperties => ({ animationDelay: `${s}s` });

  return (
    <div className="lv lv-at">
      <div className="lv-at-card lv-in">
        <b>Its training text</b>
        <span className="lv-lock">closed</span>
        <p className="lv-cap">It can't flip back and look things up.</p>
      </div>

      <div className="lv-at-card lv-in" style={d(0.5)}>
        <b>Your question</b>
        <p className="lv-ph">“Why do tokens cost money?”</p>
        <div className="lv-tok">
          {TOKENS.map((t, i) => (
            <span key={t} className="lv-chip lv-pop" style={d(1 + i * 0.26)}>
              {t}
            </span>
          ))}
        </div>
        <p className="lv-cap">Generated piece by piece, from patterns.</p>
      </div>

      <div className="lv-at-feedback lv-in" style={d(2.8)}>
        <Mascot look={look} mood="cheer" prop="none" size={58} />
        <span>People rate the answers — that's how it learns to be helpful.</span>
      </div>
    </div>
  );
}
