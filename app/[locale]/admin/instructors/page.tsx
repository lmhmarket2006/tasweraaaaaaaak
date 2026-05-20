import { setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/db";
import { approveInstructor } from "@/lib/actions/instructor";
import { Button } from "@/components/ui/Button";

export default async function AdminInstructorsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const apps = await prisma.instructorApplication.findMany({
    where: { status: "PENDING" },
    include: { user: { select: { name: true, email: true } } },
  });

  return (
    <div>
      <h2 className="font-heading text-xl font-semibold">
        {locale === "ar" ? "طلبات المدربين" : "Instructor applications"}
      </h2>
      <ul className="mt-6 space-y-4">
        {apps.map((app) => (
          <li
            key={app.id}
            className="rounded-xl border border-dark-600 bg-dark-800 p-4"
          >
            <p className="font-medium">
              {app.user.name} — {app.user.email}
            </p>
            <p className="mt-2 text-sm text-text-secondary line-clamp-3">
              {app.bio}
            </p>
            {app.portfolioUrl && (
              <a
                href={app.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 block text-sm text-brand-blue"
              >
                Portfolio
              </a>
            )}
            <form
              action={async () => {
                "use server";
                await approveInstructor(app.userId);
              }}
              className="mt-3"
            >
              <Button type="submit" size="sm">
                {locale === "ar" ? "قبول كمدرب" : "Approve instructor"}
              </Button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
