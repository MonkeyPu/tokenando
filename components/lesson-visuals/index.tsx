import type { ComponentType } from "react";
import TuringTest from "./TuringTest";
import HistoryTimeline from "./HistoryTimeline";

// Register a scene here and reference its key from a card's `visual` field.
export const VISUALS: Record<string, ComponentType> = {
  "turing-test": TuringTest,
  "history-timeline": HistoryTimeline,
};

export default function LessonVisual({ id }: { id: string }) {
  const Scene = VISUALS[id];
  if (!Scene) return null;
  return (
    <figure className="lv-wrap" aria-hidden="true">
      <Scene />
    </figure>
  );
}
