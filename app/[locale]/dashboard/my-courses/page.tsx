import { setRequestLocale } from "next-intl/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Link } from "@/i18n/navigation";

export default async function MyCoursesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await auth();
  if (!session?.user) return null;

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: session.user.id },
    include: {
      course: {
        include: {
          sections: {
            orderBy: { order: "asc" },
            include: { lessons: { orderBy: { order: "asc" }, take: 1 } },
          },
        },
      },
    },
  });

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">
        {locale === "ar" ? "دوراتي" : "My courses"}
      </h1>
      <div className="mt-6 space-y-4">
        {enrollments.map((e) => {
          const lesson = e.course.sections[0]?.lessons[0];
          return (
            <div
              key={e.id}
              className="rounded-xl border border-dark-600 bg-dark-800 p-4"
            >
              <h3 className="font-medium">
                {locale === "ar" ? e.course.titleAr : e.course.title}
              </h3>
              {lesson && (
                <Link
                  href={`/learn/${e.course.slug}/${lesson.id}`}
                  className="mt-2 inline-block text-brand-teal hover:underline"
                >
                  {locale === "ar" ? "ابدأ / تابع" : "Start / continue"}
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
