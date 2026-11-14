import Link from "next/link";
import { courses } from "@/lib/courses";

export default function CoursesPage() {
  return (
    <>
      <h1>Pick a course</h1>
      <p className="lede">Start anywhere. You can skip what you already know.</p>
      <div className="grid">
        {courses.map((c) => (
          <Link key={c.slug} href={`/courses/${c.slug}`} className="card">
            <h3>{c.title}</h3>
            <p>{c.blurb}</p>
            <small>{c.lessons.length} lessons</small>
          </Link>
        ))}
      </div>
    </>
  );
}
