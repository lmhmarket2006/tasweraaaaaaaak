"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { applyAsInstructor } from "@/lib/actions/instructor";
import toast from "react-hot-toast";

export function InstructorApplyForm({ locale }: { locale: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const res = await applyAsInstructor({
      bio: String(form.get("bio")),
      bioEn: String(form.get("bioEn") || ""),
      portfolioUrl: String(form.get("portfolioUrl") || ""),
    });
    setLoading(false);
    if (res.error) toast.error(String(res.error));
    else {
      toast.success(locale === "ar" ? "تم إرسال الطلب" : "Application sent");
      router.refresh();
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <div>
        <label className="text-sm text-text-secondary">
          {locale === "ar" ? "نبذة عنك" : "Bio (Arabic)"}
        </label>
        <textarea
          name="bio"
          required
          rows={4}
          className="mt-1 w-full rounded-lg border border-dark-600 bg-dark-800 px-3 py-2"
        />
      </div>
      <div>
        <label className="text-sm text-text-secondary">Bio (English)</label>
        <textarea
          name="bioEn"
          rows={3}
          className="mt-1 w-full rounded-lg border border-dark-600 bg-dark-800 px-3 py-2"
        />
      </div>
      <div>
        <label className="text-sm text-text-secondary">Portfolio URL</label>
        <input
          name="portfolioUrl"
          type="url"
          className="mt-1 w-full rounded-lg border border-dark-600 bg-dark-800 px-3 py-2"
        />
      </div>
      <Button type="submit" disabled={loading}>
        {locale === "ar" ? "إرسال الطلب" : "Submit"}
      </Button>
    </form>
  );
}
