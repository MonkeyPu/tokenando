import type { CSSProperties } from "react";
import type { Look } from "@/lib/assistant";
import Mascot from "@/components/Mascot";

// King − man + woman = queen, drawn. Both arrows point the same way: that shared
// direction *is* the reason the arithmetic works, which the caption then states.

export default function VectorMath({ look }: { look: Look }) {
  const d = (s: number): CSSProperties => ({ animationDelay: `${s}s` });

  return (
    <div className="lv lv-vx">
      <svg className="lv-vx-map" viewBox="0 0 220 118" role="presentation">
        <line
          className="lv-vx-arrow lv-vx-arrow-b"
          x1={44}
          y1={88}
          x2={166}
          y2={88}
          pathLength={1}
          style={d(0.5)}
        />
        <line
          className="lv-vx-arrow"
          x1={44}
          y1={30}
          x2={166}
          y2={30}
          pathLength={1}
          style={d(0.9)}
        />

        <circle className="lv-vx-dot" cx={44} cy={88} r={5} />
        <circle className="lv-vx-dot" cx={166} cy={88} r={5} />
        <circle className="lv-vx-dot hot" cx={44} cy={30} r={5} />
        <circle className="lv-vx-dot hot" cx={166} cy={30} r={5} />

        <text className="lv-vx-lbl" x={44} y={105} textAnchor="middle">
          man
        </text>
        <text className="lv-vx-lbl" x={166} y={105} textAnchor="middle">
          woman
        </text>
        <text className="lv-vx-lbl hot" x={44} y={19} textAnchor="middle">
          king
        </text>
        <text className="lv-vx-lbl hot" x={166} y={19} textAnchor="middle">
          queen
        </text>
      </svg>

      <div className="lv-vx-foot">
        <div className="lv-vx-eq">
          <span className="lv-tk lv-pop" style={d(1.3)}>
            king
          </span>
          <span className="lv-vx-op lv-in" style={d(1.45)}>
            −
          </span>
          <span className="lv-tk lv-pop" style={d(1.5)}>
            man
          </span>
          <span className="lv-vx-op lv-in" style={d(1.65)}>
            +
          </span>
          <span className="lv-tk lv-pop" style={d(1.7)}>
            woman
          </span>
          <span className="lv-vx-op lv-in" style={d(1.85)}>
            =
          </span>
          <span className="lv-tk hot lv-pop" style={d(1.9)}>
            queen
          </span>
        </div>
        <div className="lv-vx-side">
          <Mascot look={look} mood="hint" prop="none" size={66} />
        </div>
      </div>

      <p className="lv-cap lv-in" style={d(2.2)}>
        The arrows are parallel: <b>male → female</b> is one consistent direction on the
        map, so the sum lands near &ldquo;queen&rdquo;.
      </p>
    </div>
  );
}
