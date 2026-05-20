import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { OrderActions } from "@/components/admin/OrderActions";

export default async function AdminOrdersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const orders = await prisma.purchaseRequest.findMany({
    where: { status: "PENDING" },
    include: {
      user: { select: { name: true, email: true } },
      course: { select: { title: true, titleAr: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h2 className="font-heading text-xl font-semibold">
        {locale === "ar" ? "طلبات قيد المراجعة" : "Pending orders"}
      </h2>
      <div className="mt-6 space-y-6">
        {orders.length === 0 && (
          <p className="text-text-muted">
            {locale === "ar" ? "لا توجد طلبات" : "No pending orders"}
          </p>
        )}
        {orders.map((o) => (
          <div
            key={o.id}
            className="rounded-xl border border-dark-600 bg-dark-800 p-6"
          >
            <div className="flex flex-wrap justify-between gap-4">
              <div>
                <p className="font-heading text-lg font-bold">{o.requestNumber}</p>
                <p className="text-text-secondary">
                  {locale === "ar" ? o.course.titleAr : o.course.title}
                </p>
                <p className="mt-1 text-sm">
                  {o.user.name} — {o.user.email}
                </p>
                <p className="mt-1 font-medium text-brand-teal">
                  {formatPrice(Number(o.amount), o.currency, locale)}
                </p>
              </div>
              {o.receiptUrl && (
                <div>
                  {o.receiptUrl.match(/\.(jpg|jpeg|png|webp)$/i) ? (
                    <Image
                      src={o.receiptUrl}
                      alt="receipt"
                      width={200}
                      height={150}
                      className="rounded-lg border border-dark-600"
                    />
                  ) : (
                    <a
                      href={o.receiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-blue underline"
                    >
                      {locale === "ar" ? "عرض الإيصال" : "View receipt"}
                    </a>
                  )}
                </div>
              )}
            </div>
            <OrderActions requestId={o.id} locale={locale} />
          </div>
        ))}
      </div>
    </div>
  );
}
