"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { loadProgress, type Status } from "@/lib/progress";

export default function PathNodes({ slug, lessons }: { slug: string; lessons: string[] }) {
  const [progress, setProgress] = useState<Record<number, Status>>({});

  useEffect(() => {
    loadProgress(slug).then(setProgress);
  }, [slug]);

  return (
    <ol className="path" style={{ listStyle: "none", padding: 0 }}>
      {lessons.map((lesson, i) => {
        const status = progress[i];
        return (
          <li key={lesson} className="node" style={{ transform: `translateX(${Math.round(Math.sin(i * 1.3) * 60)}px)` }}>
            <Link href={`/courses/${slug}/${i + 1}`} className="node-link">
              <div className={`dot ${status ?? "todo"}`} aria-hidden>{status === "done" ? "✓" : i + 1}</div>
              <div className="node-label">
                {lesson}
                <span>{status === "done" ? "Done" : status === "skipped" ? "Skipped" : "Start"}</span>
              </div>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
