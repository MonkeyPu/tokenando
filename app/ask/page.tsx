"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { findFaqAnswer } from "@/lib/faq";
import { say, type Mood } from "@/lib/assistant";
import Mascot from "@/components/Mascot";
import { useAssistant } from "@/components/AssistantProvider";

type Msg = { role: "user" | "assistant"; text: string };

export default function AskPage() {
  const { name, look, personality } = useAssistant();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [mood, setMood] = useState<Mood>("wave");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [msgs, busy]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    const history: Msg[] = [...msgs, { role: "user", text }];
    setMsgs(history);
    setBusy(true);
    setMood("think");

    const reply = (t: string, m: Mood = "idle") => {
      setMsgs([...history, { role: "assistant", text: t }]);
      setMood(m);
      setBusy(false);
    };

    // 1. Ready-made answers first. These work without the API.
    const faq = await findFaqAnswer(text);
    if (faq) return reply(faq, "cheer");

    // 2. Then the AI, once the API key is set up.
    try {
      const { data } = await supabase.auth.getSession();
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "content-type": "application/json", Authorization: `Bearer ${data.session?.access_token ?? ""}` },
        body: JSON.stringify({ messages: history.slice(-20) }),
      });
      if (res.status === 503) return reply(say(personality.lines.offline, history.length, name), "oops");
      if (!res.ok) return reply("Something went wrong on my end. Try again in a moment.", "oops");
      const json = (await res.json()) as { reply?: string };
      reply(json.reply || "I'm not sure what to say to that.", "idle");
    } catch {
      reply("I couldn't reach my brain. Check your connection and try again.", "oops");
    }
  }

  return (
    <>
      <div className="stage">
        <Mascot look={look} mood={mood} size={110} />
        <div>
          <h1>Ask {name}</h1>
          <p className="lede" style={{ margin: "0.25rem 0 0" }}>Questions about AI, school and how to use it well.</p>
        </div>
      </div>

      <div className="chat" aria-live="polite">
        <div className="msg bot">{say(personality.lines.greet, 0, { name, lesson: "how AI works" })}</div>
        {msgs.map((m, i) => (
          <div key={i} className={`msg ${m.role === "user" ? "me" : "bot"}`}>{m.text}</div>
        ))}
        {busy && <div className="msg bot dim">{name} is thinking…</div>}
        <div ref={endRef} />
      </div>

      <form className="chat-form" onSubmit={send}>
        <input
          aria-label={`Message ${name}`}
          placeholder={`Ask ${name} something...`}
          maxLength={500}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="btn" disabled={busy || !input.trim()}>Send</button>
      </form>
    </>
  );
}
