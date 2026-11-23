"use client";

import { useEffect, useRef, useState } from "react";

type Props = { text: string; onProgress?: () => void };

// Types a chat reply out one letter at a time so the mascot reads as if it is
// speaking. Clicking finishes the line immediately.
export default function TypedText({ text, onProgress }: Props) {
  const [shown, setShown] = useState(text);
  const [done, setDone] = useState(true);
  const timer = useRef<number | null>(null);
  const tick = useRef(onProgress);
  tick.current = onProgress;

  useEffect(() => {
    if (timer.current) window.clearInterval(timer.current);
    timer.current = null;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || text.length === 0) {
      setShown(text);
      setDone(true);
      return;
    }

    let i = 0;
    setShown("");
    setDone(false);
    // Longer replies type a bit faster so nobody waits around.
    const speed = Math.max(9, Math.min(24, 1000 / Math.max(text.length, 1)));
    timer.current = window.setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      tick.current?.();
      if (i >= text.length) {
        if (timer.current) window.clearInterval(timer.current);
        timer.current = null;
        setDone(true);
      }
    }, speed);

    return () => {
      if (timer.current) window.clearInterval(timer.current);
      timer.current = null;
    };
  }, [text]);

  function finish() {
    if (!done) {
      if (timer.current) window.clearInterval(timer.current);
      timer.current = null;
      setShown(text);
      setDone(true);
    }
  }

  return (
    <span onClick={finish} role="status" aria-label={text}>
      <span aria-hidden>{shown}</span>
      {!done && <span className="caret" aria-hidden />}
    </span>
  );
}
