import type { CSSProperties } from "react";
import type { Look } from "@/lib/assistant";
import Mascot from "@/components/Mascot";

// "Trained on a massive pile of text" made literal: sources slide in one by one,
// pile into the model, and what comes out the far side is patterns — not a stored
// copy of the text. The right-hand column is the honest part of the lesson.

const SOURCES = ["websites", "books", "articles", "code"];

const LEARNT = [
  "“token” → often followed by “cost”",
  "“thanks” → often followed by “!”",
  "billions of examples, not one library",
];

export default function TrainingPile({ look }: { look: Look }) {
  const d = (s: number): CSSProperties => ({ animationDelay: `${s}s` });

  return (
    <div className="lv lv-tp">
      <div className="lv-tp-in">
        <span className="lv-mini">Training data</span>
        {SOURCES.map((s, i) => (
          <span key={s} className="lv-src" style={d(0.15 + i * 0.26)}>
            {s}
          </span>
        ))}
      </div>

      <div className="lv-tp-mid">
        <Mascot look={look} mood="point" prop="none" size={78} />
        <div className="lv-box lv-pop" style={d(1.5)}>
          <b>Model</b>
          <span>finds patterns</span>
        </div>
      </div>

      <div className="lv-tp-out">
        <span className="lv-mini">What it learns</span>
        {LEARNT.map((t, i) => (
          <span key={t} className="lv-learn lv-in" style={d(2.1 + i * 0.4)}>
            {t}
          </span>
        ))}
        <span className="lv-learn lv-learn-warn lv-in" style={d(3.4)}>
          not the text itself — it can't look it back up
        </span>
      </div>
    </div>
  );
}
