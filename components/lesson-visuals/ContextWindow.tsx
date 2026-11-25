import type { CSSProperties } from "react";
import type { Look } from "@/lib/assistant";
import Mascot from "@/components/Mascot";

// The context window as an actual container: it fills up, then the earliest
// messages grey out and fall off the left edge. Losing early details is shown,
// not claimed.

const SEGMENTS = 12;

export default function ContextWindow({ look }: { look: Look }) {
  const d = (s: number): CSSProperties => ({ animationDelay: `${s}s` });

  return (
    <div className="lv lv-cw">
      <div className="lv-cw-head">
        <span className="lv-mini">Context window</span>
        <span className="lv-cw-count">full</span>
      </div>

      <div className="lv-cw-bar">
        {Array.from({ length: SEGMENTS }, (_, i) => (
          <span
            key={i}
            className={`lv-cw-seg${i < 2 ? " old" : ""}`}
            style={i < 2 ? undefined : d(0.1 + i * 0.1)}
          />
        ))}
      </div>

      <div className="lv-cw-tags">
        <span className="lv-cw-tag lv-in" style={d(2.1)}>
          earliest messages: summarised or dropped
        </span>
      </div>

      <div className="lv-cw-foot">
        <Mascot look={look} mood="think" prop="none" size={70} />
        <p className="lv-cap lv-in" style={d(2.4)}>
          Past the limit the AI can lose early details — and every added token means more
          comparisons, so long chats also slow down.
        </p>
      </div>
    </div>
  );
}
