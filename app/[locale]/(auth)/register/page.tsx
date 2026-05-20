import { setRequestLocale } from "next-intl/server";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <RegisterForm locale={locale} />
    </div>
  );
}
