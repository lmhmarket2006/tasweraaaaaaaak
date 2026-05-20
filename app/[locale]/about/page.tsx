import { setRequestLocale } from "next-intl/server";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-heading text-3xl font-bold">
        {locale === "ar" ? "من نحن" : "About Taswerak"}
      </h1>
      <p className="mt-6 text-lg text-text-secondary leading-relaxed">
        {locale === "ar"
          ? "تصويرك أول منصة متخصصة في تعليم التصوير باللغة العربية في الوطن العربي. نقدّم دورات مسجلة باحترافية مع مدربين مختارين بعناية."
          : "Taswerak is the first Arabic-focused photography learning platform in the region. We offer professional recorded courses with carefully selected instructors."}
      </p>
    </div>
  );
}
