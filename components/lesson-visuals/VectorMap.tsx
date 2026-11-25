import type { CSSProperties } from "react";
import type { Look } from "@/lib/assistant";
import Mascot from "@/components/Mascot";

// Words as coordinates: two clusters drift in, and the closeness *is* the similarity.
// No vectors are printed here — the point is the neighbourhood, not the numbers.

const DOTS = [
  { w: "king", x: 22, y: 30 },
  { w: "queen", x: 38, y: 20 },
  { w: "monarch", x: 30, y: 45 },
  { w: "crown", x: 18, y: 55 },
  { w: "castle", x: 44, y: 48 },
  { w: "apple", x: 76, y: 68 },
  { w: "fruit", x: 86, y: 78 },
  { w: "pear", x: 66, y: 80 },
  { w: "banana", x: 78, y: 90 },
];

export default function VectorMap({ look }: { look: Look }) {
  const d = (s: number): CSSProperties => ({ animationDelay: `${s}s` });

  return (
    <div className="lv lv-vmw">
      <div className="lv-vm">
        <span className="lv-vm-label" style={{ left: "6%", top: "6%" }}>
          meaning-map
        </span>
        <span className="lv-vm-label near-a" style={d(1.5)}>
          royalty
        </span>
        <span className="lv-vm-label near-b" style={d(1.8)}>
          fruit
        </span>

        {DOTS.map((p, i) => (
          <span
            key={p.w}
            className={`lv-vm-dot lv-fade${i > 4 ? " b" : ""}`}
            style={{ left: `${p.x}%`, top: `${p.y}%`, animationDelay: `${0.15 + i * 0.13}s` }}
          >
            <i />
            {p.w}
          </span>
        ))}
      </div>

      <div className="lv-vmw-foot">
        <Mascot look={look} mood="point" prop="none" size={70} />
        <p className="lv-cap lv-in" style={d(2.2)}>
          Each token becomes a long list of numbers — its coordinates. Words used in
          similar ways land close together.
        </p>
      </div>
    </div>
  );
}
