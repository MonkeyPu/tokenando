"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AssistantProvider from "./AssistantProvider";
import TabBar from "./TabBar";

// Wraps every signed-in page: sends people to /login if they aren't signed in,
// shares the assistant's settings, and shows the bottom bar.
export default function Shell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.replace("/login");
      else setUserId(data.session.user.id);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) router.replace("/login");
    });
    return () => sub.subscription.unsubscribe();
  }, [router]);

  if (!userId) return null;

  return (
    <AssistantProvider userId={userId}>
      <main className="main">{children}</main>
      <TabBar />
    </AssistantProvider>
  );
}
