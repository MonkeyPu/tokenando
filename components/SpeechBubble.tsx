"use client";

import { useEffect, useRef, useState } from "react";

type Props = { text: string; onTyping?: (busy: boolean) => void };

// Types the mascot's line out one letter at a time so it feels like it is talking.
// Tapping the bubble finishes the line immediately.
export default function SpeechBubble({ text, onTyping }: Props) {
  const [shown, setShown] = useState(text);
  const [done, setDone] = useState(true);
  const timer = useRef<number | null>(null);
  const notify = useRef(onTyping);
  notify.current = onTyping;

  useEffect(() => {
    if (timer.current) window.clearInterval(timer.current);
    timer.current = null;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setShown(text);
      setDone(true);
      notify.current?.(false);
      return;
    }

    let i = 0;
    setShown("");
    setDone(false);
    notify.current?.(true);
    // Long lines type a little faster so nobody waits around.
    const speed = Math.max(9, Math.min(26, 900 / Math.max(text.length, 1)));
    timer.current = window.setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) {
        if (timer.current) window.clearInterval(timer.current);
        timer.current = null;
        setDone(true);
        notify.current?.(false);
      }
    }, speed);

    return () => {
      if (timer.current) window.clearInterval(timer.current);
      timer.current = null;
      notify.current?.(false);
    };
  }, [text]);

  function finish() {
    if (timer.current) window.clearInterval(timer.current);
    timer.current = null;
    setShown(text);
    setDone(true);
    notify.current?.(false);
  }

  return (
    <div className="bubble" role="status" aria-label={text} onClick={finish}>
      <span className="bubble-text">{shown}</span>
      {!done && <span className="caret" aria-hidden />}
    </div>
  );
}
