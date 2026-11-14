import { notFound } from "next/navigation";
import { courses } from "@/lib/courses";

export function generateStaticParams() {
  return courses.map((c) => ({ slug: c.slug }));
}

export default async function CoursePath({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = courses.find((c) => c.slug === slug);
  if (!course) notFound();

  return (
    <>
      <h1>{course.title}</h1>
      <p className="lede">{course.blurb}</p>
      <ol className="path" style={{ listStyle: "none", padding: 0 }}>
        {course.lessons.map((lesson, i) => (
          <li key={lesson} className="node" style={{ transform: `translateX(${Math.round(Math.sin(i * 1.3) * 60)}px)` }}>
            <div className="dot" aria-hidden>{i + 1}</div>
            <div className="node-label">
              {lesson}
              <span>Coming soon</span>
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}
