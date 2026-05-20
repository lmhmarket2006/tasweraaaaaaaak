import { auth } from "@/lib/auth";
import { redirect } from "@/i18n/navigation";
import Link from "next/link";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return redirect({ href: "/login", locale });
  }

  const links =
    locale === "ar"
      ? [
          ["طلبات الشراء", "/admin/orders"],
          ["الدورات", "/admin/courses"],
          ["المدربون", "/admin/instructors"],
          ["إعدادات الدفع", "/admin/settings"],
        ]
      : [
          ["Orders", "/admin/orders"],
          ["Courses", "/admin/courses"],
          ["Instructors", "/admin/instructors"],
          ["Payment settings", "/admin/settings"],
        ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="font-heading text-2xl font-bold text-brand-orange">
        {locale === "ar" ? "لوحة الإدارة" : "Admin"}
      </h1>
      <nav className="mt-4 flex flex-wrap gap-3">
        {links.map(([label, href]) => (
          <Link
            key={href}
            href={`/${locale}${href}`}
            className="rounded-lg border border-dark-600 px-3 py-1.5 text-sm hover:bg-dark-800"
          >
            {label}
          </Link>
        ))}
      </nav>
      <div className="mt-8">{children}</div>
    </div>
  );
}
