import { setRequestLocale } from "next-intl/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Link } from "@/i18n/navigation";
import { formatPrice } from "@/lib/utils";

export default async function OrdersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await auth();
  if (!session?.user) return null;

  const orders = await prisma.purchaseRequest.findMany({
    where: { userId: session.user.id },
    include: { course: true },
    orderBy: { createdAt: "desc" },
  });

  const statusLabel: Record<string, string> =
    locale === "ar"
      ? {
          PENDING: "قيد المراجعة",
          APPROVED: "مقبول",
          REJECTED: "مرفوض",
          CANCELLED: "ملغي",
        }
      : {
          PENDING: "Pending",
          APPROVED: "Approved",
          REJECTED: "Rejected",
          CANCELLED: "Cancelled",
        };

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">
        {locale === "ar" ? "طلباتي" : "My orders"}
      </h1>
      <ul className="mt-6 space-y-3">
        {orders.map((o) => (
          <li
            key={o.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-dark-600 bg-dark-800 p-4"
          >
            <div>
              <p className="font-medium">
                {locale === "ar" ? o.course.titleAr : o.course.title}
              </p>
              <p className="text-sm text-text-muted">
                {o.requestNumber} · {statusLabel[o.status]}
              </p>
              {o.status === "REJECTED" && o.rejectionReason && (
                <p className="mt-1 text-sm text-brand-red">{o.rejectionReason}</p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-brand-teal">
                {formatPrice(Number(o.amount), o.currency, locale)}
              </span>
              {o.status === "PENDING" && (
                <Link
                  href={`/dashboard/orders/${o.id}`}
                  className="text-sm text-brand-blue hover:underline"
                >
                  {locale === "ar" ? "رفع إيصال" : "Upload receipt"}
                </Link>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
