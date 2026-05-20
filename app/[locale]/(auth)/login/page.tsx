import { setRequestLocale } from "next-intl/server";
import { LoginForm } from "@/components/auth/LoginForm";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <LoginForm locale={locale} />
    </div>
  );
}
