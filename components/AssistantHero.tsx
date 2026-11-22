"use client";

import Mascot from "./Mascot";
import { useAssistant } from "./AssistantProvider";
import { say } from "@/lib/assistant";

// The assistant says hello at the top of the Courses page.
export default function AssistantHero() {
  const { name, look, personality } = useAssistant();
  return (
    <div className="stage">
      <Mascot look={look} mood="wave" size={120} />
      <div className="bubble">{say(personality.lines.greet, 0, { name, lesson: "a new lesson" })}</div>
    </div>
  );
}
