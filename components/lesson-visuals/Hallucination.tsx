import type { CSSProperties } from "react";
import type { Look } from "@/lib/assistant";
import Mascot from "@/components/Mascot";

// A convincing fake citation is the clearest possible demo of "plausible is not
// true": it passes the only test people actually run (does it read well?) and
// fails the one they skip (can it be found?). The stamp lands last, like the
// Turing Test card, so the verdict is the punchline rather than the setup.

export default function Hallucination({ look }: { look: Look }) {
  const d = (s: number): CSSProperties => ({ animationDelay: `${s}s` });

  return (
    <div className="lv lv-hal">
      <div className="lv-book lv-in">
        <b>The Silent Garden</b>
        <span>M. Aldridge · 1987 · quoted on page 42</span>
        <em>This book does not exist.</em>
      </div>

      <div className="lv-checks">
        <span className="lv-check ok lv-in" style={d(0.9)}>
          Reads smoothly, cites a page ✓
        </span>
        <span className="lv-check no lv-in" style={d(1.6)}>
          In any library or database? Not found ✗
        </span>
      </div>

      <div className="lv-stamp lv-stamp-in" style={d(2.4)}>
        <b>✗</b>
        <span>Made up</span>
        <em>Confident is not the same as correct.</em>
      </div>

      <div className="lv-hal-mascot lv-in" style={d(2.6)}>
        <Mascot look={look} mood="oops" prop="none" size={68} />
      </div>
    </div>
  );
}
