import { setRequestLocale } from "next-intl/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Link } from "@/i18n/navigation";
import { submitCourseForReview } from "@/lib/actions/instructor";
import { Button } from "@/components/ui/Button";

export default async function InstructorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await auth();
  if (!session?.user) return null;

  const courses = await prisma.course.findMany({
    where: { creatorId: session.user.id },
    orderBy: { updatedAt: "desc" },
  });

  const statusAr: Record<string, string> = {
    DRAFT: "مسودة",
    PENDING_REVIEW: "بانتظار الموافقة",
    PUBLISHED: "منشورة",
    REJECTED: "مرفوضة",
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">
          {locale === "ar" ? "لوحة المدرب" : "Instructor panel"}
        </h1>
        <Link href="/instructor/courses/new">
          <Button size="sm">
            {locale === "ar" ? "دورة جديدة" : "New course"}
          </Button>
        </Link>
      </div>
      <ul className="mt-8 space-y-3">
        {courses.map((c) => (
          <li
            key={c.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-dark-600 bg-dark-800 p-4"
          >
            <div>
              <p className="font-medium">{c.titleAr}</p>
              <p className="text-sm text-text-muted">
                {locale === "ar"
                  ? statusAr[c.approvalStatus]
                  : c.approvalStatus}
              </p>
            </div>
            {c.approvalStatus === "DRAFT" && (
              <form
                action={async () => {
                  "use server";
                  await submitCourseForReview(c.id);
                }}
              >
                <Button type="submit" variant="secondary" size="sm">
                  {locale === "ar" ? "إرسال للمراجعة" : "Submit for review"}
                </Button>
              </form>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
