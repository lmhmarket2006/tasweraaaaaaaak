import { setRequestLocale } from "next-intl/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Link } from "@/i18n/navigation";

export default async function DashboardPage({
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
            take: 1,
            include: { lessons: { take: 1, orderBy: { order: "asc" } } },
          },
        },
      },
    },
    orderBy: { enrolledAt: "desc" },
  }).catch(() => []);

  const pendingOrders = await prisma.purchaseRequest.count({
    where: { userId: session.user.id, status: "PENDING" },
  }).catch(() => 0);

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">
        {locale === "ar"
          ? `مرحباً، ${session.user.name || ""}`
          : `Welcome, ${session.user.name || ""}`}
      </h1>
      {pendingOrders > 0 && (
        <p className="mt-2 text-brand-orange">
          {locale === "ar"
            ? `لديك ${pendingOrders} طلب قيد المراجعة`
            : `You have ${pendingOrders} pending order(s)`}{" "}
          <Link href="/dashboard/orders" className="underline">
            {locale === "ar" ? "عرض" : "View"}
          </Link>
        </p>
      )}

      <h2 className="mt-8 font-heading text-lg font-semibold">
        {locale === "ar" ? "دوراتي" : "My courses"}
      </h2>
      {enrollments.length === 0 ? (
        <p className="mt-4 text-text-muted">
          {locale === "ar"
            ? "لم تسجّل في دورة بعد. "
            : "No courses yet. "}
          <Link href="/courses" className="text-brand-teal underline">
            {locale === "ar" ? "تصفح الدورات" : "Browse courses"}
          </Link>
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {enrollments.map((e) => {
            const title =
              locale === "ar" ? e.course.titleAr : e.course.title;
            const lesson = e.course.sections[0]?.lessons[0];
            return (
              <li
                key={e.id}
                className="rounded-xl border border-dark-600 bg-dark-800 p-4"
              >
                <p className="font-medium">{title}</p>
                {lesson && (
                  <Link
                    href={`/learn/${e.course.slug}/${lesson.id}`}
                    className="mt-2 inline-block text-sm text-brand-teal hover:underline"
                  >
                    {locale === "ar" ? "متابعة التعلم" : "Continue learning"}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
