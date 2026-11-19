"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { LOOKS, PERSONALITIES, cleanName, resolveLook, resolvePersonality, sanitizeLook, type AssistantSettings } from "@/lib/assistant";
import Mascot from "@/components/Mascot";
import LogoutButton from "@/components/LogoutButton";
import { useAssistant } from "@/components/AssistantProvider";
import type { Mood } from "@/lib/assistant";

export default function ProfilePage() {
  const { settings, ready, save } = useAssistant();
  const [draft, setDraft] = useState<AssistantSettings>(settings);
  const [loaded, setLoaded] = useState(false);
  const [username, setUsername] = useState("");
  const [mood, setMood] = useState<Mood>("idle");
  const [status, setStatus] = useState("");
  const [lookMsg, setLookMsg] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (ready && !loaded) {
      setDraft(settings);
      setLoaded(true);
    }
  }, [ready, loaded, settings]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user;
      if (u) setUsername((u.user_metadata?.display_name as string) || (u.email ?? "").split("@")[0]);
    });
  }, []);

  const update = (patch: Partial<AssistantSettings>) => {
    setStatus("");
    setDraft((d) => ({ ...d, ...patch }));
  };

  const previewLook = resolveLook(draft);
  const previewName = cleanName(draft.name);
  const previewPersonality = resolvePersonality(draft);

  function sayHi() {
    setMood("wave");
    setTimeout(() => setMood("idle"), 2200);
  }

  async function createLook() {
    const description = draft.lookDescription.trim();
    if (!description) {
      setLookMsg("Describe how you want your assistant to look first.");
      return;
    }
    setCreating(true);
    setLookMsg("");
    try {
      const { data } = await supabase.auth.getSession();
      const res = await fetch("/api/assistant/look", {
        method: "POST",
        headers: { "content-type": "application/json", Authorization: `Bearer ${data.session?.access_token ?? ""}` },
        body: JSON.stringify({ description }),
      });
      if (res.status === 503) {
        setLookMsg("The look creator isn't switched on yet. Pick a ready-made look for now.");
      } else if (!res.ok) {
        setLookMsg("Couldn't create a look. Try again in a moment.");
      } else {
        const look = sanitizeLook(((await res.json()) as { look?: unknown }).look);
        if (look) {
          update({ look: "custom", lookCustom: look });
          setLookMsg("Here's your new look! Press Save to keep it.");
        } else {
          setLookMsg("Couldn't create a look. Try describing it differently.");
        }
      }
    } catch {
      setLookMsg("Couldn't reach the look creator. Check your connection.");
    }
    setCreating(false);
  }

  async function onSave() {
    const ok = await save(draft);
    setStatus(ok ? "Saved!" : "Saved on this device, but it couldn't sync to your account yet.");
  }

  return (
    <>
      <h1>Profile</h1>
      <p className="lede">{username ? `Signed in as ${username}.` : " "}</p>

      <section className="panel">
        <h2>Your assistant</h2>
        <div className="stage">
          <Mascot look={previewLook} mood={mood} size={150} />
          <div>
            <p className="big-name">{previewName}</p>
            <p className="lede" style={{ margin: "0.2rem 0 0.75rem" }}>{previewPersonality.name}</p>
            <button className="btn ghost small" onClick={sayHi}>Say hi</button>
          </div>
        </div>

        <label className="field">Name
          <input value={draft.name} maxLength={20} onChange={(e) => update({ name: e.target.value })} />
        </label>

        <h3>Personality</h3>
        <div className="opts" role="radiogroup" aria-label="Personality">
          {PERSONALITIES.map((p) => (
            <button key={p.id} type="button" role="radio" aria-checked={draft.personality === p.id} className="opt" onClick={() => update({ personality: p.id })}>
              <strong>{p.name}</strong>
              <span>{p.blurb}</span>
            </button>
          ))}
          <button type="button" role="radio" aria-checked={draft.personality === "custom"} className="opt wide" onClick={() => update({ personality: "custom" })}>
            <strong>Custom</strong>
            <span>Describe exactly how your assistant should act.</span>
          </button>
        </div>
        {draft.personality === "custom" && (
          <label className="field">Describe the personality
            <textarea
              rows={3}
              maxLength={300}
              placeholder="e.g. A laid-back surfer who explains everything with ocean comparisons"
              value={draft.personalityCustom}
              onChange={(e) => update({ personalityCustom: e.target.value })}
            />
            <small className="hint">This changes the tone only. It takes effect once the AI is switched on.</small>
          </label>
        )}

        <h3>Look</h3>
        <div className="opts looks" role="radiogroup" aria-label="Look">
          {LOOKS.map((l) => (
            <button key={l.id} type="button" role="radio" aria-checked={draft.look === l.id} className="opt look" onClick={() => update({ look: l.id })}>
              <Mascot look={l} size={84} />
              <strong>{l.name}</strong>
            </button>
          ))}
          {draft.lookCustom && (
            <button type="button" role="radio" aria-checked={draft.look === "custom"} className="opt look" onClick={() => update({ look: "custom" })}>
              <Mascot look={draft.lookCustom} size={84} />
              <strong>Your look</strong>
            </button>
          )}
        </div>
        <label className="field">Or describe a new look
          <textarea
            rows={2}
            maxLength={200}
            placeholder="e.g. A purple robot wearing a crown"
            value={draft.lookDescription}
            onChange={(e) => update({ lookDescription: e.target.value })}
          />
        </label>
        <div className="actions">
          <button className="btn ghost" onClick={createLook} disabled={creating}>{creating ? "Creating…" : "Create look"}</button>
          {lookMsg && <span className="hint" role="status">{lookMsg}</span>}
        </div>

        <div className="actions" style={{ marginTop: "1.5rem" }}>
          <button className="btn" onClick={onSave}>Save</button>
          {status && <span className="notice" role="status">{status}</span>}
        </div>
      </section>

      <p style={{ marginTop: "2.5rem" }}><LogoutButton /></p>
    </>
  );
}
