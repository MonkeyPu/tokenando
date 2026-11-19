"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { LOOKS } from "@/lib/assistant";
import Mascot from "@/components/Mascot";

// Kids sign up with just a username. Supabase needs an email, so we turn the username into a private one.
// (Turn off "Confirm email" in Supabase so no real email is ever needed.)
const EMAIL_DOMAIN = "tokenando.app";
const toEmail = (username: string) => `${username}@${EMAIL_DOMAIN}`;
const validName = /^[a-z0-9_]{3,20}$/;

const tokens = ["Learn", " how", " A", "I", " works", " by", " play", "ing", " with", " it"];

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/courses");
    });
  }, [router]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const name = username.trim().toLowerCase();
    if (!validName.test(name)) {
      setError("Use 3 to 20 letters, numbers or underscores for your username.");
      return;
    }
    setBusy(true);
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email: toEmail(name), password });
      if (error) setError("That username and password don't match. Check them and try again.");
      else router.replace("/courses");
    } else {
      const { data, error } = await supabase.auth.signUp({
        email: toEmail(name),
        password,
        options: { data: { display_name: name } },
      });
      if (error) setError(/already/i.test(error.message) ? "That username is taken. Try another one." : error.message);
      else if (data.session) router.replace("/courses");
      else setError("Sign-up isn't ready yet. Ask the site owner to turn off email confirmation in Supabase.");
    }
    setBusy(false);
  }

  return (
    <div className="login">
      <section className="login-hero">
        <div className="wordmark">tokenando <b>junior</b></div>
        <Mascot look={LOOKS[0]} mood="wave" size={130} />
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
        <label className="field">Username
          <input type="text" required minLength={3} maxLength={20} autoComplete="username" autoCapitalize="none" autoCorrect="off" spellCheck={false}
            value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <label className="field">Password
          <input type="password" required minLength={6} autoComplete={mode === "login" ? "current-password" : "new-password"}
            value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        {error && <p className="error" role="alert">{error}</p>}
        <button className="btn" disabled={busy}>{mode === "login" ? "Log in" : "Create account"}</button>
        <button type="button" className="btn ghost" onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}>
          {mode === "login" ? "New here? Create an account" : "Already have an account? Log in"}
        </button>
      </form>
    </div>
  );
}
