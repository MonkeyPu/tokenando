import Link from "next/link";
import { notFound } from "next/navigation";
import { courses } from "@/lib/courses";
import LessonPlayer from "@/components/LessonPlayer";

export function generateStaticParams() {
  return courses.flatMap((c) => c.lessons.map((_, i) => ({ slug: c.slug, lesson: String(i + 1) })));
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string; lesson: string }> }) {
  const { slug, lesson } = await params;
  const course = courses.find((c) => c.slug === slug);
  const number = Number(lesson);
  if (!course || !Number.isInteger(number) || number < 1 || number > course.lessons.length) notFound();

  const index = number - 1;
  const current = course.lessons[index];
  const nextHref = number < course.lessons.length ? `/courses/${slug}/${number + 1}` : null;

  return (
    <>
      <Link href={`/courses/${slug}`} className="btn red small">Back to course</Link>
      <LessonPlayer
        key={`${slug}-${number}`}
        slug={slug}
        lessonIndex={index}
        title={current.title}
        cards={current.cards}
        questions={current.questions}
        nextHref={nextHref}
      />
    </>
  );
}
