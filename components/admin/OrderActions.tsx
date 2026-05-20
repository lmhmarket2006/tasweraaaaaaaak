"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import {
  approvePurchaseRequest,
  rejectPurchaseRequest,
} from "@/lib/actions/purchase";
import toast from "react-hot-toast";

export function OrderActions({
  requestId,
  locale,
}: {
  requestId: string;
  locale: string;
}) {
  const router = useRouter();
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  async function approve() {
    setLoading(true);
    const res = await approvePurchaseRequest(requestId);
    setLoading(false);
    if (res.error) toast.error(res.error);
    else {
      toast.success(locale === "ar" ? "تم القبول" : "Approved");
      router.refresh();
    }
  }

  async function reject() {
    if (!reason.trim()) {
      toast.error(locale === "ar" ? "أدخل سبب الرفض" : "Enter rejection reason");
      return;
    }
    setLoading(true);
    const res = await rejectPurchaseRequest(requestId, reason);
    setLoading(false);
    if (res.error) toast.error(res.error);
    else {
      toast.success(locale === "ar" ? "تم الرفض" : "Rejected");
      router.refresh();
    }
  }

  return (
    <div className="mt-4 space-y-3">
      <Button onClick={approve} disabled={loading}>
        {locale === "ar" ? "قبول الطلب" : "Approve"}
      </Button>
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder={locale === "ar" ? "سبب الرفض (عند الرفض)" : "Rejection reason"}
        className="w-full rounded-lg border border-dark-600 bg-dark-900 px-3 py-2 text-sm"
        rows={2}
      />
      <Button variant="danger" onClick={reject} disabled={loading}>
        {locale === "ar" ? "رفض الطلب" : "Reject"}
      </Button>
    </div>
  );
}
