import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function Footer() {
  const t = await getTranslations("common");
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-dark-600 bg-dark-800 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
        <p className="font-heading text-sm text-text-secondary">
          © {year} {t("brand")}
        </p>
        <div className="flex gap-6 text-sm text-text-muted">
          <Link href="/courses" className="hover:text-text-primary">
            {t("courses")}
          </Link>
          <Link href="/about" className="hover:text-text-primary">
            {t("about")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
