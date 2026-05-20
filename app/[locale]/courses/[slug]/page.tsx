import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { EnrollSection } from "@/components/course/EnrollSection";
import { VideoPlayer } from "@/components/course/VideoPlayer";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("courses");
  const session = await auth();

  const course = await prisma.course.findUnique({
    where: { slug, published: true },
    include: {
      creator: { select: { name: true, nameAr: true, image: true } },
      sections: {
        orderBy: { order: "asc" },
        include: { lessons: { orderBy: { order: "asc" } } },
      },
    },
  });

  if (!course) notFound();

  const title = locale === "ar" ? course.titleAr : course.title;
  const description =
    locale === "ar" ? course.descriptionAr : course.description;

  let enrolled = false;
  if (session?.user) {
    const e = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: { userId: session.user.id, courseId: course.id },
      },
    });
    enrolled = !!e;
  }

  const lessonCount = course.sections.reduce(
    (acc, s) => acc + s.lessons.length,
    0
  );
  const firstLesson = course.sections[0]?.lessons[0];
  const previewUrl = course.previewVideo || firstLesson?.videoUrl;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {previewUrl && (
            <div className="mb-8">
              <VideoPlayer url={previewUrl} />
            </div>
          )}
          <h1 className="font-heading text-3xl font-bold">{title}</h1>
          <p className="mt-4 whitespace-pre-line text-text-secondary">
            {description}
          </p>

          <h2 className="mt-10 font-heading text-xl font-semibold">
            {t("curriculum")} ({lessonCount} {t("lessons")})
          </h2>
          <div className="mt-4 space-y-4">
            {course.sections.map((section) => (
              <div
                key={section.id}
                className="rounded-xl border border-dark-600 bg-dark-800 p-4"
              >
                <h3 className="font-medium">
                  {locale === "ar" ? section.titleAr : section.title}
                </h3>
                <ul className="mt-2 space-y-1 text-sm text-text-secondary">
                  {section.lessons.map((lesson) => (
                    <li key={lesson.id} className="flex justify-between gap-2">
                      <span>
                        {locale === "ar" ? lesson.titleAr : lesson.title}
                        {lesson.isFree && (
                          <span className="ms-2 text-brand-teal text-xs">
                            ({t("freePreview")})
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="overflow-hidden rounded-2xl border border-dark-600 bg-dark-800">
            <div className="relative aspect-video">
              <Image
                src={course.thumbnail}
                alt={title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <p className="font-heading text-2xl font-bold text-brand-teal">
                {formatPrice(Number(course.price), course.currency, locale)}
              </p>
              {enrolled && firstLesson ? (
                <a
                  href={`/${locale}/learn/${course.slug}/${firstLesson.id}`}
                  className="mt-4 block w-full rounded-lg bg-gradient-brand py-3 text-center font-medium text-white"
                >
                  {locale === "ar" ? "ابدأ التعلم" : "Start learning"}
                </a>
              ) : (
                <EnrollSection
                  courseId={course.id}
                  courseTitle={title}
                  locale={locale}
                  isLoggedIn={!!session?.user}
                />
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
