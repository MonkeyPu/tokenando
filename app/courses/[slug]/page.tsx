import Link from "next/link";
import { notFound } from "next/navigation";
import { courses } from "@/lib/courses";
import PathNodes from "@/components/PathNodes";

export function generateStaticParams() {
  return courses.map((c) => ({ slug: c.slug }));
}

export default async function CoursePath({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = courses.find((c) => c.slug === slug);
  if (!course) notFound();

  return (
    <>
      <Link href="/courses" className="linkish">All courses</Link>
      <h1 style={{ marginTop: "1rem" }}>{course.title}</h1>
      <p className="lede">{course.blurb}</p>
      <PathNodes slug={course.slug} lessons={course.lessons} />
    </>
  );
}
