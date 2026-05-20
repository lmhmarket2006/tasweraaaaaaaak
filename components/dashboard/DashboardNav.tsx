import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { Role } from "@prisma/client";
import { BookOpen, ClipboardList, LayoutDashboard } from "lucide-react";

export function DashboardNav({
  locale,
  role,
}: {
  locale: string;
  role: Role;
}) {
  const links = [
    {
      href: "/dashboard",
      label: locale === "ar" ? "نظرة عامة" : "Overview",
      icon: LayoutDashboard,
    },
    {
      href: "/dashboard/my-courses",
      label: locale === "ar" ? "دوراتي" : "My courses",
      icon: BookOpen,
    },
    {
      href: "/dashboard/orders",
      label: locale === "ar" ? "طلباتي" : "My orders",
      icon: ClipboardList,
    },
  ];

  return (
    <aside className="hidden w-52 shrink-0 md:block">
      <nav className="space-y-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-secondary hover:bg-dark-800 hover:text-text-primary"
            )}
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </Link>
        ))}
        {role === "STUDENT" && (
          <Link
            href="/become-instructor"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-brand-orange hover:bg-dark-800"
          >
            {locale === "ar" ? "انضم كمدرب" : "Become instructor"}
          </Link>
        )}
      </nav>
    </aside>
  );
}
