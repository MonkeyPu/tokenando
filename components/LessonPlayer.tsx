"use client";

import Link from "next/link";
import { useState } from "react";
import type { Card, Question } from "@/lib/types";
import { saveLesson } from "@/lib/progress";

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
  const total = cards.length + questions.length;
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [saved, setSaved] = useState<"idle" | "saving" | "ok" | "failed">("idle");

  const finished = step >= total;
  const onCard = step < cards.length;
  const qi = step - cards.length;
  const q = questions[qi];

  async function finish(all: Result[]) {
    setSaved("saving");
    const status = all.every((r) => r === "skipped") ? "skipped" : "done";
    const ok = await saveLesson(slug, lessonIndex, status);
    setSaved(ok ? "ok" : "failed");
  }

  function nextCard() {
    setStep(step + 1);
  }

  function record(r: Result) {
    const next = [...results, r];
    setResults(next);
    setPicked(null);
    setChecked(false);
    setStep(step + 1);
    if (step + 1 >= total) finish(next);
  }

  const bar = (
    <div className="bar" aria-hidden>
      {Array.from({ length: total }, (_, n) => {
        const skipped = n >= cards.length && results[n - cards.length] === "skipped";
        const cls = n < step ? (skipped ? "skip" : "on") : n === step ? "now" : "";
        return <i key={n} className={cls} />;
      })}
    </div>
  );

  if (finished) {
    const right = results.filter((r) => r === "correct").length;
    const skipped = results.filter((r) => r === "skipped").length;
    return (
      <div className="player">
        {bar}
        <h2>Lesson finished</h2>
        <p className="lede">
          You got {right} of {questions.length} right.
          {skipped > 0 && ` You skipped ${skipped}, and that's fine.`}
        </p>
        {saved === "saving" && <p className="notice">Saving your progress…</p>}
        {saved === "failed" && (
          <p className="error" role="alert">
            Your progress didn't save.{" "}
            <button className="linkish" onClick={() => finish(results)}>Try again</button>
          </p>
        )}
        <div className="actions">
          {nextHref && <Link href={nextHref} className="btn">Next lesson</Link>}
          <Link href={`/courses/${slug}`} className={nextHref ? "btn ghost" : "btn"}>Back to the path</Link>
        </div>
      </div>
    );
  }

  if (onCard) {
    const c = cards[step];
    return (
      <div className="player">
        {bar}
        <p className="lede" style={{ margin: 0 }}>{title}</p>
        <h2>{c.title}</h2>
        <div className="lesson-text">
          {c.text.split("\n\n").map((para, n) => <p key={n}>{para}</p>)}
        </div>
        <div className="actions">
          <button className="btn" onClick={nextCard}>Continue</button>
        </div>
      </div>
    );
  }

  const isRight = checked && picked === q.answer;

  return (
    <div className="player">
      {bar}
      <p className="lede" style={{ margin: 0 }}>{title}</p>
      <h2 id="prompt">{q.prompt}</h2>

      <div className="options" role="radiogroup" aria-labelledby="prompt">
        {q.options.map((opt, n) => {
          let cls = "option";
          if (checked && n === q.answer) cls += " right";
          else if (checked && n === picked) cls += " wrong";
          return (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={picked === n}
              className={cls}
              disabled={checked}
              onClick={() => setPicked(n)}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {checked && (
        <div className="feedback" role="status">
          <strong>{isRight ? "Nice!" : "Not quite."}</strong> {q.explanation}
        </div>
      )}

      <div className="actions">
        {!checked ? (
          <>
            <button className="btn" disabled={picked === null} onClick={() => setChecked(true)}>Check</button>
            <button className="btn ghost" onClick={() => record("skipped")}>Skip</button>
          </>
        ) : (
          <button className="btn" onClick={() => record(isRight ? "correct" : "wrong")}>
            {qi === questions.length - 1 ? "Finish" : "Continue"}
          </button>
        )}
      </div>
    </div>
  );
}
