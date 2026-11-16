import Link from "next/link";
import { courses } from "@/lib/courses";
import LogoutButton from "@/components/LogoutButton";

export default function CoursesPage() {
  return (
    <>
      <h1>Pick a course</h1>
      <p className="lede">Start anywhere. You can skip what you already know.</p>
      <div className="grid">
        {courses.map((c) =>
          c.comingSoon ? (
            <div key={c.slug} className="card soon">
              <h3>{c.title}</h3>
              <p>{c.blurb}</p>
              <small>Coming soon</small>
            </div>
          ) : (
            <Link key={c.slug} href={`/courses/${c.slug}`} className="card">
              <h3>{c.title}</h3>
              <p>{c.blurb}</p>
              <small>{c.lessons.length} lessons</small>
            </Link>
          )
        )}
      </div>
      <p style={{ marginTop: "3rem" }}><LogoutButton /></p>
    </>
  );
}
