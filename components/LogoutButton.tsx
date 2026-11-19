"use client";

import { supabase } from "@/lib/supabase";

export default function LogoutButton() {
  return <button className="btn red" onClick={() => supabase.auth.signOut()}>Log out</button>;
}
