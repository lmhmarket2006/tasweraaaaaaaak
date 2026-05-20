"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { createPurchaseRequest } from "@/lib/actions/purchase";
import toast from "react-hot-toast";

export function EnrollSection({
  courseId,
  courseTitle,
  locale,
  isLoggedIn,
}: {
  courseId: string;
  courseTitle: string;
  locale: string;
  isLoggedIn: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleEnroll() {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    setLoading(true);
    const result = await createPurchaseRequest(courseId);
    setLoading(false);

    if (result.error === "PENDING_EXISTS" && result.requestId) {
      router.push(`/dashboard/orders/${result.requestId}`);
      return;
    }
    if (result.error) {
      toast.error(result.error);
      return;
    }
    if (result.requestId) {
      toast.success(locale === "ar" ? "تم إنشاء الطلب" : "Request created");
      router.push(`/dashboard/orders/${result.requestId}`);
    }
  }

  return (
    <Button
      className="mt-4 w-full"
      onClick={handleEnroll}
      disabled={loading}
    >
      {loading
        ? "..."
        : locale === "ar"
          ? `اشترك في ${courseTitle}`
          : `Enroll in ${courseTitle}`}
    </Button>
  );
}
