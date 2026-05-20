"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";

export function LoginForm({ locale }: { locale: string }) {
  const t = useTranslations("auth");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      toast.error(locale === "ar" ? "بيانات غير صحيحة" : "Invalid credentials");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-dark-600 bg-dark-800 p-8">
      <h1 className="font-heading text-2xl font-bold">{t("loginTitle")}</h1>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <label className="text-sm text-text-secondary">{t("email")}</label>
          <input
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded-lg border border-dark-600 bg-dark-900 px-4 py-2.5 text-text-primary outline-none focus:border-brand-blue"
          />
        </div>
        <div>
          <label className="text-sm text-text-secondary">{t("password")}</label>
          <input
            name="password"
            type="password"
            required
            className="mt-1 w-full rounded-lg border border-dark-600 bg-dark-900 px-4 py-2.5 text-text-primary outline-none focus:border-brand-blue"
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {t("loginTitle")}
        </Button>
      </form>
      <Button
        variant="secondary"
        className="mt-3 w-full"
        type="button"
        onClick={() => signIn("google", { callbackUrl: `/${locale}/dashboard` })}
      >
        {t("google")}
      </Button>
      <p className="mt-6 text-center text-sm text-text-muted">
        {t("noAccount")}{" "}
        <Link href="/register" className="text-brand-teal hover:underline">
          {locale === "ar" ? "سجّل الآن" : "Sign up"}
        </Link>
      </p>
    </div>
  );
}
