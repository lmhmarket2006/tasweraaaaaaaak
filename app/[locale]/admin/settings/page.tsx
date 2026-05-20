import { setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/db";
import { PaymentSettingsForm } from "@/components/admin/PaymentSettingsForm";

export default async function AdminSettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const settings = await prisma.paymentSettings.findUnique({
    where: { id: "default" },
  });

  return (
    <div>
      <h2 className="font-heading text-xl font-semibold">
        {locale === "ar" ? "إعدادات التحويل البنكي" : "Bank transfer settings"}
      </h2>
      <PaymentSettingsForm locale={locale} settings={settings} />
    </div>
  );
}
