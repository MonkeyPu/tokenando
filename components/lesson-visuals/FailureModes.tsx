import type { CSSProperties } from "react";
import type { Look } from "@/lib/assistant";
import Mascot from "@/components/Mascot";

// Four tiles arrive in order so the list is countable, and only the last one
// lights up red: a hallucination is the failure people actually meet, and the
// red is what the next card is about.

const MODES = [
  { t: "False data", s: "a wrong fact in the pile is learned as true" },
  { t: "Mixed sources", s: "different sites claim different things" },
  { t: "Out of date", s: "it repeats facts from years ago" },
  { t: "Hallucination", s: "it doesn't know — and makes it up anyway", hot: true },
];

export default function FailureModes({ look }: { look: Look }) {
  const d = (s: number): CSSProperties => ({ animationDelay: `${s}s` });

  return (
    <div className="lv lv-fm">
      {MODES.map((m, i) => (
        <div key={m.t} className={`lv-fm-tile lv-pop${m.hot ? " hot" : ""}`} style={d(0.2 + i * 0.34)}>
          <b>
            {i + 1}. {m.t}
          </b>
          <span>{m.s}</span>
        </div>
      ))}

      <div className="lv-fm-mascot lv-in" style={d(2.1)}>
        <Mascot look={look} mood="oops" prop="none" size={76} />
      </div>
    </div>
  );
}
