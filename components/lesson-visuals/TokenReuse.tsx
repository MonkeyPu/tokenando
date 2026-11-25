import type { CSSProperties } from "react";
import type { Look } from "@/lib/assistant";
import Mascot from "@/components/Mascot";

// "Reusable pieces": three different words are built from the same 'run' chunk.
// The shared chip stays green every time, so the saving is visible rather than
// asserted — and the vocabulary total explains why models hold ~200k pieces.

const WORDS = [
  { head: "run", tail: "" },
  { head: "run", tail: "ning" },
  { head: "run", tail: "ner" },
];

export default function TokenReuse({ look }: { look: Look }) {
  const d = (s: number): CSSProperties => ({ animationDelay: `${s}s` });

  return (
    <div className="lv lv-ru">
      <div className="lv-ru-body">
        <div className="lv-ru-col">
          {WORDS.map((w, i) => (
            <div key={w.head + w.tail} className="lv-ru-row lv-in" style={d(0.15 + i * 0.3)}>
              <span className="lv-tk hot">{w.head}</span>
              {w.tail ? <span className="lv-tk">{w.tail}</span> : null}
              <span className="lv-ru-n">
                {i === 0 ? "one piece" : "same piece reused"}
              </span>
            </div>
          ))}
        </div>

        <div className="lv-ru-side">
          <Mascot look={look} mood="hint" prop="none" size={74} />
        </div>
      </div>

      <div className="lv-vocab lv-pop" style={d(1.35)}>
        <b>≈200,000</b>
        <span className="lv-cap">pieces can build almost any word — not millions</span>
      </div>
    </div>
  );
}
