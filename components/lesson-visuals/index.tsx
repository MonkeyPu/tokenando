import type { ComponentType } from "react";
import TuringTest from "./TuringTest";
import HistoryTimeline from "./HistoryTimeline";

// Register a scene here and reference its key from a card's `visual` field.
export const VISUALS: Record<string, ComponentType> = {
  "turing-test": TuringTest,
  "history-timeline": HistoryTimeline,
};

export default function LessonVisual({ id, instant = false }: { id: string; instant?: boolean }) {
  const Scene = VISUALS[id];
  if (!Scene) return null;
  return (
    <figure className={instant ? "lv-wrap lv-instant" : "lv-wrap"} aria-hidden="true">
      <Scene key={id} />
    </figure>
  );
}
