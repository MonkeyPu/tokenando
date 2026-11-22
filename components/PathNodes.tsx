"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { loadProgress, type Status } from "@/lib/progress";
import Mascot from "./Mascot";
import { useAssistant } from "./AssistantProvider";

export default function PathNodes({ slug, lessons }: { slug: string; lessons: string[] }) {
  const { look } = useAssistant();
  const [progress, setProgress] = useState<Record<number, Status>>({});

  useEffect(() => {
    loadProgress(slug).then(setProgress);
  }, [slug]);

  // The mascot waits beside the next lesson that isn't finished yet, pointing the way.
  const upNext = lessons.findIndex((_, i) => progress[i] !== "done");

  return (
    <ol className="path" style={{ listStyle: "none", padding: 0 }}>
      {lessons.map((lesson, i) => {
        const status = progress[i];
        return (
          <li
            key={lesson}
            className="node"
            style={{ transform: `translateX(${Math.round(Math.sin(i * 1.3) * 60)}px)`, animationDelay: `${i * 70}ms` }}
          >
            <Link href={`/courses/${slug}/${i + 1}`} className="node-link">
              <div className={`dot ${status ?? "todo"}${i === upNext ? " next" : ""}`} aria-hidden>{status === "done" ? (
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                ) : i + 1}</div>
              <div className="node-label">
                {lesson}
                <span>{status === "done" ? "Done" : status === "skipped" ? "Skipped" : "Start"}</span>
              </div>
            </Link>
            {i === upNext && (
              <span className="node-guide" aria-hidden>
                <Mascot look={look} mood="point" size={62} lively={false} />
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
