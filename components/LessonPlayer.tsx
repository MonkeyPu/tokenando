"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Confetti from "./Confetti";
import SpeechBubble from "./SpeechBubble";
import type { Card, Question } from "@/lib/types";
import { saveLesson } from "@/lib/progress";
import { say, clip, quoted, type Mood, type Prop, type SayVars } from "@/lib/assistant";
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

// The mascot's hint is just the first line of the explanation, so it nudges without spoiling the answer.
function firstSentence(text: string) {
  const cut = text.search(/[.!?](\s|$)/);
  return cut === -1 ? text : text.slice(0, cut + 1);
}

export default function LessonPlayer({ slug, lessonIndex, title, cards, questions, nextHref }: Props) {
  const { name, look, personality } = useAssistant();
  const total = cards.length + questions.length;
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<(number | null)[]>(() => questions.map(() => null));
  const [checked, setChecked] = useState<boolean[]>(() => questions.map(() => false));
  const [skipped, setSkipped] = useState<boolean[]>(() => questions.map(() => false));
  const [justSkipped, setJustSkipped] = useState(false);
  const [saved, setSaved] = useState<"idle" | "saving" | "ok" | "failed">("idle");
  const [typing, setTyping] = useState(false);
  const [combo, setCombo] = useState(0);
  const [best, setBest] = useState(0);
  const [burst, setBurst] = useState<string | null>(null);
  const [hints, setHints] = useState<boolean[]>(() => questions.map(() => false));

  const finished = step >= total;
  const onCard = step < cards.length;
  const qi = step - cards.length;
  const q = questions[qi];
  const lines = personality.lines;
  const n = lessonIndex * 7 + step;

  // Everything the mascot is allowed to mention, so its line matches what's on screen.
  const vars: SayVars = {
    name,
    lesson: title,
    card: onCard ? cards[step]?.title : cards[cards.length - 1]?.title,
    q: q ? quoted(q.prompt, 70) : undefined,
    answer: q ? quoted(q.options[q.answer]) : undefined,
    picked: q && picked[qi] !== null ? quoted(q.options[picked[qi] as number]) : undefined,
    explain: q ? clip(firstSentence(q.explanation), 120) : undefined,
  };

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
    const right = picked[qi] === q.answer;
    const run = right ? combo + 1 : 0;
    setCombo(run);
    if (run > best) setBest(run);
    if (right) setBurst(`${qi}-${run}`);
  }

  function skip() {
    const s = [...skipped];
    s[qi] = true;
    setSkipped(s);
    setJustSkipped(true);
    setCombo(0);
    go();
  }

  function next() {
    setJustSkipped(false);
    go();
  }

  function showHint() {
    const h = [...hints];
    h[qi] = true;
    setHints(h);
  }

  // Keyboard play: 1-4 to answer, Enter to check or move on.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      // Holding a key down shouldn't fire through three cards in a row.
      if (e.repeat) return;
      const el = e.target as HTMLElement | null;
      if (el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) return;
      if (finished) return;

      if (e.key === "Enter") {
        // A focused button already reacts to Enter; don't advance twice.
        if (el && el.tagName === "BUTTON") return;
        e.preventDefault();
        if (onCard) next();
        else if (!checked[qi]) { if (picked[qi] !== null) check(); }
        else next();
        return;
      }

      if (onCard || !q) return;
      const i = Number(e.key) - 1;
      if (!Number.isInteger(i) || i < 0 || i >= q.options.length) return;
      if (checked[qi]) return;
      e.preventDefault();
      pick(i);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

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
      <div className="stage-mascot">
        <Mascot look={look} mood={mood} prop={prop} size={130} speaking={typing} />
        {combo >= 2 && mood !== "oops" && (
          <span key={combo} className="combo">🔥 {combo} in a row</span>
        )}
      </div>
      <SpeechBubble key={text} text={text} onTyping={setTyping} />
      {burst && mood === "cheer" && <Confetti key={burst} once count={22} />}
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
        {stage("celebrate", say(lines.finish, n, { ...vars, score: `${right} of ${questions.length} right` }))}
        <h2>Lesson finished</h2>
        <p className="lede">
          You got {right} of {questions.length} right.
          {best >= 2 && ` Best streak: ${best} in a row.`}
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
        {stage(mood, say(first ? lines.greet : lines.card, n, vars), prop)}
        <p className="lede" style={{ margin: 0 }}>{title}</p>
        <h2>{c.title}</h2>
        <div className="lesson-text" key={step}>
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

  const hinted = Boolean(hints[qi]);
  let mood: Mood = "think";
  let text = say(justSkipped ? lines.skip : lines.ask, n, vars);
  if (!isChecked && hinted) {
    mood = "hint";
    text = say(lines.hint, n, vars);
  }
  if (isChecked) {
    mood = isRight ? "cheer" : "oops";
    text = say(isRight ? lines.correct : lines.wrong, n, vars);
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
              key={`${qi}-${i}`}
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

      <p className="kbd-hint">Press 1–{q.options.length} to pick an answer, Enter to continue.</p>

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
            {!hinted && (
              <button className="btn ghost" onClick={showHint}>Hint from {name}</button>
            )}
            <button className="btn ghost" onClick={skip}>Skip</button>
          </>
        ) : (
          <button className="btn" onClick={next}>{qi === questions.length - 1 ? "Finish" : "Continue"}</button>
        )}
      </div>
    </div>
  );
}
