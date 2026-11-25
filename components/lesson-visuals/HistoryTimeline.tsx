import type { CSSProperties } from "react";

// The whole history at a glance: the rail draws itself left to right, then each
// milestone pops in year order. The AI Winter node is dimmed and snowing so the
// "dry spell" is visible as a gap in the line, not just a sentence to read.

type Event = { year: string; label: string; icon: string; winter?: boolean };

const EVENTS: Event[] = [
  { year: "1950", label: "Turing asks: can machines think?", icon: "?" },
  { year: "1974–93", label: "AI Winters: funding dries up", icon: "❄", winter: true },
  { year: "1997", label: "Deep Blue beats Kasparov at chess", icon: "♟" },
  { year: "2012", label: "A network learns to spot cats", icon: "🐱" },
  { year: "2022", label: "ChatGPT goes mainstream", icon: "💬" },
];

export default function HistoryTimeline() {
  return (
    <div className="lv lv-timeline">
      <div className="lv-rail" aria-hidden="true" />
      <ol className="lv-events">
        {EVENTS.map((e, i) => (
          <li
            key={e.year}
            className={e.winter ? "lv-ev winter lv-pop" : "lv-ev lv-pop"}
            style={{ animationDelay: `${0.35 + i * 0.32}s` } as CSSProperties}
          >
            <span className="lv-dot">
              {e.icon}
              {e.winter && (
                <span className="lv-snow" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
              )}
            </span>
            <b>{e.year}</b>
            <span className="lv-lbl">{e.label}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
