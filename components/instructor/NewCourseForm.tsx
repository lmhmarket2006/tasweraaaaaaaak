"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { createCourse } from "@/lib/actions/instructor";
import toast from "react-hot-toast";

export function NewCourseForm({ locale }: { locale: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const res = await createCourse({
      title: String(form.get("titleEn")),
      titleAr: String(form.get("titleAr")),
      description: String(form.get("descriptionEn")),
      descriptionAr: String(form.get("descriptionAr")),
      slug: String(form.get("slug")),
      thumbnail: String(form.get("thumbnail")),
      price: form.get("price"),
      originalPrice: form.get("originalPrice") || undefined,
      level: form.get("level"),
      previewVideo: String(form.get("previewVideo") || ""),
    });
    setLoading(false);
    if (res.error) {
      toast.error(locale === "ar" ? "تحقق من البيانات" : "Check input");
      return;
    }
    toast.success(locale === "ar" ? "تم إنشاء الدورة" : "Course created");
    router.push("/instructor");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <input
        name="titleAr"
        placeholder="العنوان بالعربية"
        required
        className="w-full rounded-lg border border-dark-600 bg-dark-800 px-3 py-2"
      />
      <input
        name="titleEn"
        placeholder="Title (English)"
        required
        className="w-full rounded-lg border border-dark-600 bg-dark-800 px-3 py-2"
      />
      <input
        name="slug"
        placeholder="slug-url"
        className="w-full rounded-lg border border-dark-600 bg-dark-800 px-3 py-2"
      />
      <textarea
        name="descriptionAr"
        placeholder="الوصف بالعربية"
        required
        rows={4}
        className="w-full rounded-lg border border-dark-600 bg-dark-800 px-3 py-2"
      />
      <textarea
        name="descriptionEn"
        placeholder="Description (English)"
        required
        rows={4}
        className="w-full rounded-lg border border-dark-600 bg-dark-800 px-3 py-2"
      />
      <input
        name="thumbnail"
        type="url"
        placeholder="https://images.unsplash.com/..."
        required
        className="w-full rounded-lg border border-dark-600 bg-dark-800 px-3 py-2"
      />
      <input
        name="previewVideo"
        type="url"
        placeholder="YouTube/Vimeo preview URL"
        className="w-full rounded-lg border border-dark-600 bg-dark-800 px-3 py-2"
      />
      <div className="flex gap-4">
        <input
          name="price"
          type="number"
          placeholder="Price SAR"
          required
          className="w-full rounded-lg border border-dark-600 bg-dark-800 px-3 py-2"
        />
        <input
          name="originalPrice"
          type="number"
          placeholder="Original price"
          className="w-full rounded-lg border border-dark-600 bg-dark-800 px-3 py-2"
        />
      </div>
      <select
        name="level"
        className="w-full rounded-lg border border-dark-600 bg-dark-800 px-3 py-2"
        defaultValue="BEGINNER"
      >
        <option value="BEGINNER">Beginner</option>
        <option value="INTERMEDIATE">Intermediate</option>
        <option value="ADVANCED">Advanced</option>
      </select>
      <Button type="submit" disabled={loading}>
        {locale === "ar" ? "حفظ مسودة" : "Save draft"}
      </Button>
    </form>
  );
}
