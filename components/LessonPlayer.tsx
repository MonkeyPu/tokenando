"use client";

import Link from "next/link";
import { useState } from "react";
import type { Card, Question } from "@/lib/types";
import { saveLesson } from "@/lib/progress";
import { say, type Mood, type Prop } from "@/lib/assistant";
import Mascot from "./Mascot";
import { useAssistant } from "./AssistantProvider";

type Result = "correct" | "wrong" | "skipped";

type Props = {
  slug: string;
  lessonIndex: number;
  title: string;
  cards: Card[];
  questions: Question[];
  nextHref: string | null;
};

export default function LessonPlayer({ slug, lessonIndex, title, cards, questions, nextHref }: Props) {
  const { name, look, personality } = useAssistant();
  const total = cards.length + questions.length;
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<(number | null)[]>(() => questions.map(() => null));
  const [checked, setChecked] = useState<boolean[]>(() => questions.map(() => false));
  const [skipped, setSkipped] = useState<boolean[]>(() => questions.map(() => false));
  const [justSkipped, setJustSkipped] = useState(false);
  const [saved, setSaved] = useState<"idle" | "saving" | "ok" | "failed">("idle");

  const finished = step >= total;
  const onCard = step < cards.length;
  const qi = step - cards.length;
  const q = questions[qi];
  const lines = personality.lines;
  const n = lessonIndex * 7 + step;

  function resultsOf(p: (number | null)[], c: boolean[]): Result[] {
    return questions.map((question, i) => (c[i] ? (p[i] === question.answer ? "correct" : "wrong") : "skipped"));
  }

  async function finish(all: Result[]) {
    setSaved("saving");
    const status = all.every((r) => r === "skipped") ? "skipped" : "done";
    const ok = await saveLesson(slug, lessonIndex, status);
    setSaved(ok ? "ok" : "failed");
  }

  function go(p = picked, c = checked) {
    const next = step + 1;
    setStep(next);
    if (next >= total) finish(resultsOf(p, c));
  }

  function back() {
    setJustSkipped(false);
    setStep(Math.max(0, step - 1));
  }

  function pick(i: number) {
    setJustSkipped(false);
    const p = [...picked];
    p[qi] = i;
    setPicked(p);
  }

  function check() {
    setJustSkipped(false);
    const c = [...checked];
    c[qi] = true;
    setChecked(c);
  }

  function skip() {
    const s = [...skipped];
    s[qi] = true;
    setSkipped(s);
    setJustSkipped(true);
    go();
  }

  function next() {
    setJustSkipped(false);
    go();
  }

  const bar = (
    <div className="bar" aria-hidden>
      {Array.from({ length: total }, (_, i) => {
        const isSkipped = i >= cards.length && !checked[i - cards.length];
        const cls = i < step ? (isSkipped ? "skip" : "on") : i === step ? "now" : "";
        return <i key={i} className={cls} />;
      })}
    </div>
  );

  const stage = (mood: Mood, text: string, prop?: Prop) => (
    <div className="stage">
      <Mascot look={look} mood={mood} prop={prop} size={130} />
      <div className="bubble">{text}</div>
    </div>
  );

  const backButton = step > 0 && (
    <button className="btn ghost" onClick={back}>Back</button>
  );

  if (finished) {
    const results = resultsOf(picked, checked);
    const right = results.filter((r) => r === "correct").length;
    const skippedCount = results.filter((r) => r === "skipped").length;
    return (
      <div className="player">
        {bar}
        {stage("celebrate", say(lines.finish, n, name))}
        <h2>Lesson finished</h2>
        <p className="lede">
          You got {right} of {questions.length} right.
          {skippedCount > 0 && ` You skipped ${skippedCount}, and that's fine.`}
        </p>
        {saved === "saving" && <p className="notice">Saving your progress…</p>}
        {saved === "failed" && (
          <p className="error" role="alert">
            Your progress didn't save.{" "}
            <button className="btn ghost small" onClick={() => finish(resultsOf(picked, checked))}>Try again</button>
          </p>
        )}
        <div className="actions">
          {nextHref && <Link href={nextHref} className="btn">Next lesson</Link>}
          <Link href={`/courses/${slug}`} className={nextHref ? "btn ghost" : "btn"}>Back to the path</Link>
          <button className="btn ghost" onClick={() => setStep(0)}>Review answers</button>
        </div>
      </div>
    );
  }

  if (onCard) {
    const c = cards[step];
    const first = step === 0;
    const last = step === cards.length - 1;
    const mood: Mood = c.scene?.mood ?? (first ? "wave" : last ? "idle" : "point");
    const prop: Prop = c.scene?.prop ?? (first ? "book" : last ? "lightbulb" : "none");
    return (
      <div className="player">
        {bar}
        {stage(mood, say(first ? lines.greet : lines.card, n, name), prop)}
        <p className="lede" style={{ margin: 0 }}>{title}</p>
        <h2>{c.title}</h2>
        <div className="lesson-text">
          {c.text.split("\n\n").map((para, i) => <p key={i}>{para}</p>)}
        </div>
        <div className="actions">
          {backButton}
          <button className="btn" onClick={next}>Continue</button>
        </div>
      </div>
    );
  }

  const isChecked = checked[qi];
  const isRight = isChecked && picked[qi] === q.answer;
  const selected = picked[qi];

  let mood: Mood = "think";
  let text = say(justSkipped ? lines.skip : lines.ask, n, name);
  if (isChecked) {
    mood = isRight ? "cheer" : "oops";
    text = say(isRight ? lines.correct : lines.wrong, n, name);
  }

  return (
    <div className="player">
      {bar}
      {stage(mood, text)}
      <p className="lede" style={{ margin: 0 }}>{title}</p>
      <h2 id="prompt">{q.prompt}</h2>

      <div className="options" role="radiogroup" aria-labelledby="prompt">
        {q.options.map((opt, i) => {
          let cls = "option";
          if (isChecked && i === q.answer) cls += " right";
          else if (isChecked && i === selected) cls += " wrong";
          return (
            <button
              key={i}
              type="button"
              role="radio"
              aria-checked={selected === i}
              className={cls}
              disabled={isChecked}
              onClick={() => pick(i)}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {isChecked && (
        <div className="feedback" role="status">
          <strong>{isRight ? "Nice!" : "Not quite."}</strong> {q.explanation}
        </div>
      )}

      <div className="actions">
        {backButton}
        {!isChecked ? (
          <>
            <button className="btn" disabled={selected === null} onClick={check}>Check</button>
            <button className="btn ghost" onClick={skip}>Skip</button>
          </>
        ) : (
          <button className="btn" onClick={next}>{qi === questions.length - 1 ? "Finish" : "Continue"}</button>
        )}
      </div>
    </div>
  );
}
