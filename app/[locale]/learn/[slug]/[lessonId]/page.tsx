import { notFound, redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { VideoPlayer } from "@/components/course/VideoPlayer";
import { Link } from "@/i18n/navigation";

export default async function LearnPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string; lessonId: string }>;
}) {
  const { locale, slug, lessonId } = await params;
  setRequestLocale(locale);
  const session = await auth();
  if (!session?.user) {
    redirect(`/${locale}/login`);
  }

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      sections: {
        orderBy: { order: "asc" },
        include: { lessons: { orderBy: { order: "asc" } } },
      },
    },
  });
  if (!course) notFound();

  const lesson = await prisma.lesson.findFirst({
    where: { id: lessonId, section: { courseId: course.id } },
  });
  if (!lesson) notFound();

  const canWatch =
    lesson.isFree ||
    (await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: course.id,
        },
      },
    }));

  if (!canWatch) {
    redirect(`/${locale}/courses/${slug}`);
  }

  const title = locale === "ar" ? lesson.titleAr : lesson.title;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h1 className="font-heading text-2xl font-bold">{title}</h1>
          {lesson.videoUrl ? (
            <div className="mt-6">
              <VideoPlayer url={lesson.videoUrl} />
            </div>
          ) : (
            <p className="mt-4 text-text-muted">No video</p>
          )}
        </div>
        <aside>
          <h2 className="font-heading font-semibold">
            {locale === "ar" ? "المحاضرات" : "Lessons"}
          </h2>
          <ul className="mt-4 space-y-1 text-sm">
            {course.sections.map((section) =>
              section.lessons.map((l) => (
                <li key={l.id}>
                  <Link
                    href={`/learn/${slug}/${l.id}`}
                    className={
                      l.id === lessonId
                        ? "text-brand-teal font-medium"
                        : "text-text-secondary hover:text-text-primary"
                    }
                  >
                    {locale === "ar" ? l.titleAr : l.title}
                  </Link>
                </li>
              ))
            )}
          </ul>
        </aside>
      </div>
    </div>
  );
}
