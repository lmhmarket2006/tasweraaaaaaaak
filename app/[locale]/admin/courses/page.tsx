import { setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/db";
import { approveCourse } from "@/lib/actions/instructor";
import { Button } from "@/components/ui/Button";

export default async function AdminCoursesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const pending = await prisma.course.findMany({
    where: { approvalStatus: "PENDING_REVIEW" },
    include: { creator: { select: { name: true, email: true } } },
  });

  const published = await prisma.course.findMany({
    where: { published: true },
    take: 20,
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-10">
      <section>
        <h2 className="font-heading text-xl font-semibold">
          {locale === "ar" ? "بانتظار الموافقة" : "Pending review"}
        </h2>
        <ul className="mt-4 space-y-3">
          {pending.map((c) => (
            <li
              key={c.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-dark-600 bg-dark-800 p-4"
            >
              <div>
                <p className="font-medium">{c.titleAr}</p>
                <p className="text-sm text-text-muted">{c.creator.email}</p>
              </div>
              <form
                action={async () => {
                  "use server";
                  await approveCourse(c.id);
                }}
              >
                <Button type="submit" size="sm">
                  {locale === "ar" ? "نشر" : "Publish"}
                </Button>
              </form>
            </li>
          ))}
          {pending.length === 0 && (
            <p className="text-text-muted">—</p>
          )}
        </ul>
      </section>
      <section>
        <h2 className="font-heading text-xl font-semibold">
          {locale === "ar" ? "منشورة" : "Published"}
        </h2>
        <ul className="mt-4 space-y-2 text-sm text-text-secondary">
          {published.map((c) => (
            <li key={c.id}>{c.titleAr}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
