"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const tokens = ["Learn", " how", " A", "I", " works", " by", " play", "ing", " with", " it"];

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/courses");
    });
  }, [router]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setNotice(""); setBusy(true);
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError("That email and password don't match. Check them and try again.");
      else router.replace("/courses");
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else if (data.session) router.replace("/courses");
      else setNotice("Check your email for a link to confirm your account, then log in.");
    }
    setBusy(false);
  }

  return (
    <div className="login">
      <section className="login-hero">
        <div className="wordmark">tokenando <b>junior</b></div>
        <h1>AI is built from tokens.</h1>
        <div className="tokens" aria-hidden>
          {tokens.map((t, i) => (
            <span key={i} className={`token${i === 3 ? " hot" : ""}`}>{t.replace(/ /g, "\u00a0")}</span>
          ))}
        </div>
        <p className="caption">AI reads text in small pieces called tokens. Start a course to see what it does with them.</p>
      </section>

      <form className="login-form" onSubmit={submit}>
        <h2>{mode === "login" ? "Log in" : "Create your account"}</h2>
        <label className="field">Email
          <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="field">Password
          <input type="password" required minLength={6} autoComplete={mode === "login" ? "current-password" : "new-password"}
            value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        {error && <p className="error" role="alert">{error}</p>}
        {notice && <p className="notice" role="status">{notice}</p>}
        <button className="btn" disabled={busy}>{mode === "login" ? "Log in" : "Create account"}</button>
        <button type="button" className="linkish" onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); setNotice(""); }}>
          {mode === "login" ? "New here? Create an account" : "Already have an account? Log in"}
        </button>
      </form>
    </div>
  );
}
