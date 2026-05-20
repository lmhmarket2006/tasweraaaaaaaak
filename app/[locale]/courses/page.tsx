import { getTranslations, setRequestLocale } from "next-intl/server";
import { CourseCard } from "@/components/marketing/CourseCard";
import { prisma } from "@/lib/db";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return {
    title:
      locale === "ar"
        ? "دورات التصوير | تصويرك"
        : "Photography Courses | Taswerak",
  };
}

export default async function CoursesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("courses");

  const courses = await prisma.course
    .findMany({
      where: { published: true },
      include: {
        creator: { select: { name: true, nameAr: true, image: true } },
        sections: { include: { _count: { select: { lessons: true } } } },
      },
      orderBy: { createdAt: "desc" },
    })
    .catch(() => []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="font-heading text-3xl font-bold">{t("title")}</h1>
      <p className="mt-2 text-text-secondary">{t("subtitle")}</p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            locale={locale}
            lessonsLabel={t("lessons")}
          />
        ))}
      </div>
    </div>
  );
}
