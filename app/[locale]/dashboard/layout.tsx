import { auth } from "@/lib/auth";
import { redirect } from "@/i18n/navigation";
import { DashboardNav } from "@/components/dashboard/DashboardNav";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();
  if (!session?.user) {
    return redirect({ href: "/login", locale });
  }

  return (
    <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8 sm:px-6">
      <DashboardNav locale={locale} role={session.user.role} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
