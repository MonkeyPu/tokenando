"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAssistant } from "./AssistantProvider";

const icon = { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export default function TabBar() {
  const pathname = usePathname();
  const { name } = useAssistant();

  // Lessons are full-focus, so the bar hides there.
  if (/^\/courses\/[^/]+\/\d+$/.test(pathname)) return null;

  const tabs = [
    {
      href: "/ask",
      label: `Ask ${name}`,
      svg: <svg {...icon} aria-hidden><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" /></svg>,
    },
    {
      href: "/courses",
      label: "Courses",
      svg: <svg {...icon} aria-hidden><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5z" /><path d="M4 21.5V5.5" /></svg>,
    },
    {
      href: "/profile",
      label: "Profile",
      svg: <svg {...icon} aria-hidden><circle cx="12" cy="8" r="4" /><path d="M4 21c1-4 4.5-6 8-6s7 2 8 6" /></svg>,
    },
  ];

  return (
    <nav className="tabbar" aria-label="Main">
      {tabs.map((t) => {
        const active = pathname === t.href || pathname.startsWith(`${t.href}/`);
        return (
          <Link key={t.href} href={t.href} className="tab" aria-current={active ? "page" : undefined}>
            {t.svg}
            <span>{t.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
