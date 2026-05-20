"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";
import type { PaymentSettings } from "@prisma/client";

export function PaymentSettingsForm({
  locale,
  settings,
}: {
  locale: string;
  settings: PaymentSettings | null;
}) {
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/payment-settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form.entries())),
    });
    setLoading(false);
    if (!res.ok) toast.error("Error");
    else toast.success(locale === "ar" ? "تم الحفظ" : "Saved");
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 max-w-lg space-y-4">
      {(
        [
          ["bankName", "البنك", "Bank name"],
          ["bankNameEn", "البنك (EN)", "Bank name EN"],
          ["accountName", "اسم الحساب", "Account name"],
          ["accountNameEn", "اسم الحساب (EN)", "Account name EN"],
          ["accountNumber", "رقم الحساب", "Account number"],
          ["iban", "IBAN", "IBAN"],
          ["whatsappNumber", "واتساب", "WhatsApp"],
          ["instructionsAr", "تعليمات (عربي)", "Instructions AR"],
          ["instructionsEn", "تعليمات (EN)", "Instructions EN"],
        ] as const
      ).map(([name, ar, en]) => (
        <div key={name}>
          <label className="text-sm text-text-secondary">
            {locale === "ar" ? ar : en}
          </label>
          <input
            name={name}
            defaultValue={settings?.[name as keyof PaymentSettings]?.toString() ?? ""}
            className="mt-1 w-full rounded-lg border border-dark-600 bg-dark-900 px-3 py-2"
          />
        </div>
      ))}
      <Button type="submit" disabled={loading}>
        {locale === "ar" ? "حفظ" : "Save"}
      </Button>
    </form>
  );
}
