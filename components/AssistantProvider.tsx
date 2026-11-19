"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  DEFAULT_SETTINGS,
  cleanSettings,
  resolveLook,
  resolvePersonality,
  type AssistantSettings,
  type Look,
  type Personality,
} from "@/lib/assistant";

type Value = {
  settings: AssistantSettings;
  name: string;
  look: Look;
  personality: Personality;
  ready: boolean;
  // Saves to this device and to the account. Resolves to true if the account save worked.
  save: (next: AssistantSettings) => Promise<boolean>;
};

const Ctx = createContext<Value | null>(null);

export function useAssistant(): Value {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAssistant must be used inside AssistantProvider");
  return v;
}

type Row = {
  assistant_name: string | null;
  assistant_personality: string | null;
  assistant_personality_custom?: string | null;
  assistant_look: { preset?: string; custom?: unknown; description?: string } | null;
};

function fromRow(row: Row): AssistantSettings {
  const lk = row.assistant_look ?? {};
  return cleanSettings({
    name: row.assistant_name ?? undefined,
    personality: row.assistant_personality ?? undefined,
    personalityCustom: row.assistant_personality_custom ?? "",
    look: typeof lk.preset === "string" ? lk.preset : undefined,
    lookCustom: (lk.custom as AssistantSettings["lookCustom"]) ?? null,
    lookDescription: typeof lk.description === "string" ? lk.description : "",
  });
}

export default function AssistantProvider({ userId, children }: { userId: string; children: React.ReactNode }) {
  const [settings, setSettings] = useState<AssistantSettings>(DEFAULT_SETTINGS);
  const [ready, setReady] = useState(false);
  const storeKey = `assistant:${userId}`;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storeKey);
      if (raw) setSettings(cleanSettings(JSON.parse(raw)));
    } catch {}

    supabase
      .from("profiles")
      .select("assistant_name,assistant_personality,assistant_personality_custom,assistant_look")
      .eq("id", userId)
      .maybeSingle()
      .then(({ data, error }) => {
        // If the columns aren't there yet (setup SQL not run), keep what's on this device.
        if (!error && data) {
          const next = fromRow(data as Row);
          setSettings(next);
          try { localStorage.setItem(storeKey, JSON.stringify(next)); } catch {}
        }
        setReady(true);
      });
  }, [userId, storeKey]);

  async function save(next: AssistantSettings) {
    const clean = cleanSettings(next);
    setSettings(clean);
    try { localStorage.setItem(storeKey, JSON.stringify(clean)); } catch {}
    const { error } = await supabase
      .from("profiles")
      .update({
        assistant_name: clean.name,
        assistant_personality: clean.personality,
        assistant_personality_custom: clean.personalityCustom,
        assistant_look: { preset: clean.look, custom: clean.lookCustom, description: clean.lookDescription },
      })
      .eq("id", userId);
    return !error;
  }

  const value: Value = {
    settings,
    name: settings.name,
    look: resolveLook(settings),
    personality: resolvePersonality(settings),
    ready,
    save,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
