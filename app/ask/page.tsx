"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { findFaqAnswer } from "@/lib/faq";
import { say, stripMarkdown, type Mood } from "@/lib/assistant";
import Mascot from "@/components/Mascot";
import TypedText from "@/components/TypedText";
import { useAssistant } from "@/components/AssistantProvider";

type Msg = { role: "user" | "assistant"; text: string };

export default function AskPage() {
  const { name, look, personality } = useAssistant();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [mood, setMood] = useState<Mood>("wave");
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [msgs, busy]);

  // /ask is a public page, but the AI route needs a signed-in user (so the key
  // can't be used anonymously). Know that before they type, not after.
  useEffect(() => {
    let live = true;
    supabase.auth.getSession().then(({ data }) => live && setSignedIn(Boolean(data.session)));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setSignedIn(Boolean(session)));
    return () => {
      live = false;
      sub.subscription.unsubscribe();
    };
  }, []);

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
      setMsgs([...history, { role: "assistant", text: stripMarkdown(t) }]);
      setMood(m);
      setBusy(false);
    };

    // 1. Ready-made answers first. These work without the API.
    const faq = await findFaqAnswer(text);
    if (faq) return reply(faq, "cheer");

    // 2. Then the AI. It needs a signed-in user, so an anonymous visitor can't
    //    spend the free quota.
    const { data: sess } = await supabase.auth.getSession();
    const token = sess.session?.access_token ?? "";
    if (!token) {
      setSignedIn(false);
      return reply(`I can do the basics, but my real AI brain needs you to sign in first — use the Sign in link under the chat.`, "oops");
    }
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "content-type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ messages: history.slice(-20) }),
      });
      const json = (await res.json().catch(() => ({}))) as { reply?: string; error?: string };
      if (res.status === 401) {
        setSignedIn(false);
        return reply("Your session ran out. Sign in again and my brain switches back on.", "oops");
      }
      if (res.status === 429) return reply("Whoa, slow down a second — I can only think so fast. Ask me again in a moment.", "oops");
      if (res.status === 503) return reply(say(personality.lines.offline, history.length, name), "oops");
      if (!res.ok || !json.reply) return reply(`My AI brain glitched (${res.status}). Try that again?`, "oops");
      reply(json.reply, "idle");
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
          <div key={i} className={`msg ${m.role === "user" ? "me" : "bot"}`}>
            {m.role === "assistant" ? (
              <TypedText
                text={m.text}
                onProgress={() => endRef.current?.scrollIntoView({ block: "nearest" })}
              />
            ) : (
              m.text
            )}
          </div>
        ))}
        {busy && <div className="msg bot dim">{name} is thinking…</div>}
        <div ref={endRef} />
      </div>

      {signedIn === false && (
        <p className="lede" style={{ margin: "0 0 0.5rem" }}>
          <a href="/login" style={{ textDecoration: "underline" }}>Sign in</a> to ask {name} real AI questions — the ready-made answers below work without an account.
        </p>
      )}

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
