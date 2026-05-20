import { auth } from "@/lib/auth";
import { Link } from "@/i18n/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/Button";
import { Camera } from "lucide-react";

export async function Navbar() {
  const t = await getTranslations("common");
  const locale = await getLocale();
  const session = await auth();
  const otherLocale = locale === "ar" ? "en" : "ar";

  return (
    <header className="sticky top-0 z-50 border-b border-dark-600/80 bg-dark-900/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-heading text-lg font-bold">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-brand">
            <Camera className="h-5 w-5 text-white" />
          </span>
          <span className="text-gradient-brand">{t("brand")}</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/courses" className="text-sm text-text-secondary hover:text-text-primary">
            {t("courses")}
          </Link>
          <Link href="/about" className="text-sm text-text-secondary hover:text-text-primary">
            {t("about")}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            locale={otherLocale}
            className="rounded-md px-2 py-1 text-xs uppercase text-text-muted hover:text-text-primary"
          >
            {otherLocale}
          </Link>

          {session?.user ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  {t("dashboard")}
                </Button>
              </Link>
              {session.user.role === "INSTRUCTOR" && (
                <Link href="/instructor">
                  <Button variant="ghost" size="sm">
                    {t("instructor")}
                  </Button>
                </Link>
              )}
              {session.user.role === "ADMIN" && (
                <Link href="/admin">
                  <Button variant="ghost" size="sm">
                    {t("admin")}
                  </Button>
                </Link>
              )}
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  {t("login")}
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">{t("register")}</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
