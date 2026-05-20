import { setRequestLocale } from "next-intl/server";
import { NewCourseForm } from "@/components/instructor/NewCourseForm";

export default async function NewCoursePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="max-w-xl">
      <h1 className="font-heading text-2xl font-bold">
        {locale === "ar" ? "دورة جديدة" : "New course"}
      </h1>
      <NewCourseForm locale={locale} />
    </div>
  );
}
