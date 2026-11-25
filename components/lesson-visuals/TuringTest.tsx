import type { CSSProperties } from "react";

// Teaches the Turing Test by showing it: you ask the same question, two answers
// come back in identical style, and the "which one is the computer?" stamp lands
// with the punchline. The animation is the sequence, so nothing is revealed early.

const REPLY = "Nope — I'm a person typing this.";

export default function TuringTest() {
  const delay = (s: number): CSSProperties => ({ animationDelay: `${s}s` });

  return (
    <div className="lv lv-turing">
      <div className="lv-chat">
        <div className="lv-you lv-in" style={delay(0.1)}>
          <p>Are you a machine?</p>
          <span className="lv-tag">You</span>
        </div>

        <div className="lv-lanes">
          <div className="lv-lane lv-in" style={delay(0.8)}>
            <span className="lv-avatar">A</span>
            <p>{REPLY}</p>
          </div>
          <div className="lv-lane lv-in" style={delay(1.3)}>
            <span className="lv-avatar">B</span>
            <p>{REPLY}</p>
          </div>
        </div>
      </div>

      <div className="lv-stamp lv-stamp-in" style={delay(2.1)}>
        <b>?</b>
        <span>Which one is the computer?</span>
        <em>You can't tell — that's the test.</em>
      </div>
    </div>
  );
}
