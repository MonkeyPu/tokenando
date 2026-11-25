import type { ComponentType } from "react";
import type { Look } from "@/lib/assistant";
import TuringTest from "./TuringTest";
import HistoryTimeline from "./HistoryTimeline";
import NextToken from "./NextToken";
import SmartAutocomplete from "./SmartAutocomplete";
import TrainingPile from "./TrainingPile";
import AfterTraining from "./AfterTraining";
import FailureModes from "./FailureModes";
import Hallucination from "./Hallucination";

// Register a scene here and reference its key from a card's `visual` field.
// Scenes that show the mascot receive the learner's own `look`, so changing the
// mascot on the profile page changes it inside the lessons too — no extra work.
export const VISUALS: Record<string, ComponentType<{ look: Look }>> = {
  "turing-test": TuringTest,
  "history-timeline": HistoryTimeline,
  "next-token": NextToken,
  "smart-autocomplete": SmartAutocomplete,
  "training-pile": TrainingPile,
  "after-training": AfterTraining,
  "failure-modes": FailureModes,
  hallucination: Hallucination,
};

export default function LessonVisual({
  id,
  look,
  instant = false,
}: {
  id: string;
  look: Look;
  instant?: boolean;
}) {
  const Scene = VISUALS[id];
  if (!Scene) return null;
  return (
    <figure className={instant ? "lv-wrap lv-instant" : "lv-wrap"} aria-hidden="true">
      <Scene key={id} look={look} />
    </figure>
  );
}
