import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { OrderPaymentPanel } from "@/components/purchase/OrderPaymentPanel";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const session = await auth();
  if (!session?.user) return null;

  const order = await prisma.purchaseRequest.findUnique({
    where: { id },
    include: { course: true },
  });
  if (!order || order.userId !== session.user.id) notFound();

  let settings = await prisma.paymentSettings.findUnique({
    where: { id: "default" },
  });
  if (!settings) {
    settings = {
      id: "default",
      bankName: "البنك",
      bankNameEn: "Bank",
      accountName: "تصويرك",
      accountNameEn: "Taswerak",
      accountNumber: "0000000000",
      iban: null,
      instructionsAr: "حوّل المبلغ ثم ارفع الإيصال أو أرسله عبر واتساب",
      instructionsEn: "Transfer then upload or send receipt via WhatsApp",
      whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "966500000000",
      updatedAt: new Date(),
    };
  }

  const courseTitle =
    locale === "ar" ? order.course.titleAr : order.course.title;

  if (order.status !== "PENDING") {
    return (
      <div>
        <h1 className="font-heading text-2xl font-bold">{order.requestNumber}</h1>
        <p className="mt-4 text-text-secondary">
          {locale === "ar" ? "حالة الطلب: " : "Status: "}
          {order.status}
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">
        {locale === "ar" ? "إتمام الاشتراك" : "Complete enrollment"}
      </h1>
      <p className="mt-2 text-text-secondary">{courseTitle}</p>
      <div className="mt-8 max-w-lg">
        <OrderPaymentPanel
          requestId={order.id}
          requestNumber={order.requestNumber}
          amount={Number(order.amount)}
          currency={order.currency}
          courseTitle={courseTitle}
          locale={locale}
          settings={settings}
          existingReceipt={order.receiptUrl}
        />
      </div>
    </div>
  );
}
