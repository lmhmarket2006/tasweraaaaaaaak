"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { registerUser } from "@/lib/actions/auth";
import toast from "react-hot-toast";

export function RegisterForm({ locale }: { locale: string }) {
  const t = useTranslations("auth");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const result = await registerUser({
      name: String(form.get("name")),
      email: String(form.get("email")),
      password: String(form.get("password")),
    });
    setLoading(false);

    if (result.error) {
      toast.error(locale === "ar" ? "تحقق من البيانات" : "Check your input");
      return;
    }

    await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
    });
    toast.success(locale === "ar" ? "تم إنشاء الحساب" : "Account created");
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-dark-600 bg-dark-800 p-8">
      <h1 className="font-heading text-2xl font-bold">{t("registerTitle")}</h1>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <label className="text-sm text-text-secondary">{t("name")}</label>
          <input
            name="name"
            required
            className="mt-1 w-full rounded-lg border border-dark-600 bg-dark-900 px-4 py-2.5 outline-none focus:border-brand-blue"
          />
        </div>
        <div>
          <label className="text-sm text-text-secondary">{t("email")}</label>
          <input
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded-lg border border-dark-600 bg-dark-900 px-4 py-2.5 outline-none focus:border-brand-blue"
          />
        </div>
        <div>
          <label className="text-sm text-text-secondary">{t("password")}</label>
          <input
            name="password"
            type="password"
            required
            minLength={8}
            className="mt-1 w-full rounded-lg border border-dark-600 bg-dark-900 px-4 py-2.5 outline-none focus:border-brand-blue"
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {t("registerTitle")}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-text-muted">
        {t("hasAccount")}{" "}
        <Link href="/login" className="text-brand-teal hover:underline">
          {t("loginTitle")}
        </Link>
      </p>
    </div>
  );
}
