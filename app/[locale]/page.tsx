import { getTranslations, setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/marketing/Hero";
import { CourseCard } from "@/components/marketing/CourseCard";
import { prisma } from "@/lib/db";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tc = await getTranslations("courses");

  const courses = await prisma.course.findMany({
    where: { published: true, featured: true },
    take: 6,
    include: { creator: { select: { name: true, nameAr: true, image: true } } },
    orderBy: { createdAt: "desc" },
  }).catch(() => []);

  const totalCourses = await prisma.course.count({ where: { published: true } }).catch(() => 0);
  const totalStudents = await prisma.user.count({ where: { role: "STUDENT" } }).catch(() => 0);

  return (
    <>
      <Hero
        title={t("heroTitle")}
        subtitle={t("heroSubtitle")}
        ctaCourses={t("ctaCourses")}
        ctaRegister={t("ctaRegister")}
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-10 grid grid-cols-3 gap-4 rounded-2xl border border-dark-600 bg-dark-800 p-6 text-center sm:gap-8">
          <div>
            <p className="font-heading text-2xl font-bold text-brand-teal sm:text-3xl">
              {totalStudents}+
            </p>
            <p className="text-sm text-text-muted">{t("statsStudents")}</p>
          </div>
          <div>
            <p className="font-heading text-2xl font-bold text-brand-teal sm:text-3xl">
              {totalCourses}+
            </p>
            <p className="text-sm text-text-muted">{t("statsCourses")}</p>
          </div>
          <div>
            <p className="font-heading text-2xl font-bold text-brand-teal sm:text-3xl">
              500+
            </p>
            <p className="text-sm text-text-muted">{t("statsHours")}</p>
          </div>
        </div>

        <h2 className="font-heading text-2xl font-bold">{t("featured")}</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.length > 0 ? (
            courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                locale={locale}
                lessonsLabel={tc("lessons")}
              />
            ))
          ) : (
            <p className="col-span-full text-text-muted">
              {locale === "ar"
                ? "شغّل قاعدة البيانات و seed لعرض الدورات"
                : "Run database seed to display courses"}
            </p>
          )}
        </div>
      </section>
    </>
  );
}
