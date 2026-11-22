import { supabase } from "./supabase";

export type Status = "done" | "skipped";

function localDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// Streak goes up by one for each new day with a finished lesson. Missing a day resets it to 1.
async function bumpStreak(userId: string) {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const todayStr = localDate(today);

  const { data } = await supabase.from("profiles").select("streak_count,last_active").eq("id", userId).single();
  if (!data || data.last_active === todayStr) return;
  const next = data.last_active === localDate(yesterday) ? (data.streak_count ?? 0) + 1 : 1;
  await supabase.from("profiles").update({ streak_count: next, last_active: todayStr }).eq("id", userId);
}

// Returns true if the progress was saved.
export async function saveLesson(slug: string, index: number, status: Status): Promise<boolean> {
  const { data: sessionData } = await supabase.auth.getSession();
  const user = sessionData.session?.user;
  if (!user) return false;

  // Replaying a lesson and skipping everything never turns "done" back into "skipped".
  if (status === "skipped") {
    const { data: existing } = await supabase
      .from("lesson_progress").select("status")
      .eq("user_id", user.id).eq("course_slug", slug).eq("lesson_index", index).maybeSingle();
    if (existing?.status === "done") return true;
  }

  const { error } = await supabase.from("lesson_progress").upsert(
    { user_id: user.id, course_slug: slug, lesson_index: index, status, updated_at: new Date().toISOString() },
    { onConflict: "user_id,course_slug,lesson_index" }
  );
  if (error) return false;
  await bumpStreak(user.id);
  return true;
}

// Wipes every finished/skipped lesson and the streak. Assistant settings stay.
// Returns true if the progress was cleared.
export async function resetProgress(): Promise<boolean> {
  const { data: sessionData } = await supabase.auth.getSession();
  const user = sessionData.session?.user;
  if (!user) return false;

  const { error } = await supabase.from("lesson_progress").delete().eq("user_id", user.id);
  if (error) return false;

  // Streak is a separate column on profiles; a failure there shouldn't undo the reset above.
  await supabase.from("profiles").update({ streak_count: 0, last_active: null }).eq("id", user.id);
  return true;
}

export async function loadProgress(slug: string): Promise<Record<number, Status>> {
  const { data } = await supabase.from("lesson_progress").select("lesson_index,status").eq("course_slug", slug);
  const out: Record<number, Status> = {};
  for (const row of data ?? []) out[row.lesson_index] = row.status;
  return out;
}
