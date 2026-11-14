"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { courses } from "@/lib/courses";
import ThemeToggle from "./ThemeToggle";

// Wraps every signed-in page: checks the session, shows the top bar and course tabs.
export default function Shell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.replace("/login");
      else setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) router.replace("/login");
    });
    return () => sub.subscription.unsubscribe();
  }, [router]);

  if (!ready) return null;

  return (
    <>
      <header className="topbar">
        <Link href="/courses" className="wordmark">tokenando <b>junior</b></Link>
        <div className="topbar-actions">
          <ThemeToggle />
          <button className="btn ghost" onClick={() => supabase.auth.signOut()}>Log out</button>
        </div>
      </header>
      <nav className="tabs" aria-label="Courses">
        <Link href="/courses" className="tab" aria-current={pathname === "/courses" ? "page" : undefined}>All courses</Link>
        {courses.map((c) => (
          <Link key={c.slug} href={`/courses/${c.slug}`} className="tab"
            aria-current={pathname === `/courses/${c.slug}` || pathname.startsWith(`/courses/${c.slug}/`) ? "page" : undefined}>
            {c.tab}
          </Link>
        ))}
      </nav>
      <main className="main">{children}</main>
    </>
  );
}
