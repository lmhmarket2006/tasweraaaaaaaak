import { auth } from "@/lib/auth";
import { redirect } from "@/i18n/navigation";
import { setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/db";
import { InstructorApplyForm } from "@/components/instructor/InstructorApplyForm";

export default async function BecomeInstructorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await auth();
  if (!session?.user) {
    return redirect({ href: "/login", locale });
  }
  const user = session.user;

  if (user.role === "INSTRUCTOR" || user.role === "ADMIN") {
    redirect({ href: "/instructor", locale });
  }

  const existing = await prisma.instructorApplication.findUnique({
    where: { userId: user.id },
  });

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <h1 className="font-heading text-2xl font-bold">
        {locale === "ar" ? "انضم كمدرب" : "Apply as instructor"}
      </h1>
      {existing?.status === "PENDING" ? (
        <p className="mt-4 text-brand-orange">
          {locale === "ar"
            ? "طلبك قيد المراجعة"
            : "Your application is pending"}
        </p>
      ) : (
        <InstructorApplyForm locale={locale} />
      )}
    </div>
  );
}
