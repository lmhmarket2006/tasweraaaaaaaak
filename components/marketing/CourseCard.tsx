import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { formatPrice } from "@/lib/utils";
import type { Course, User } from "@prisma/client";
import { Clock, PlayCircle } from "lucide-react";

type CourseWithCreator = Course & { creator: Pick<User, "name" | "nameAr" | "image"> };

export function CourseCard({
  course,
  locale,
  lessonsLabel,
}: {
  course: CourseWithCreator;
  locale: string;
  lessonsLabel: string;
}) {
  const title = locale === "ar" ? course.titleAr : course.title;
  const instructor =
    locale === "ar"
      ? course.creator.nameAr || course.creator.name
      : course.creator.name;
  const price = formatPrice(Number(course.price), course.currency, locale);
  const original =
    course.originalPrice &&
    formatPrice(Number(course.originalPrice), course.currency, locale);

  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-dark-600 bg-dark-800 transition hover:-translate-y-1 hover:border-brand-blue/40 hover:shadow-xl hover:shadow-brand-blue/10"
    >
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={course.thumbnail}
          alt={title}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition group-hover:opacity-100">
          <PlayCircle className="h-12 w-12 text-white" />
        </div>
        {course.featured && (
          <span className="absolute start-3 top-3 rounded-full bg-brand-orange px-2 py-0.5 text-xs font-medium text-white">
            {locale === "ar" ? "مميز" : "Featured"}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-heading font-semibold text-text-primary line-clamp-2">
          {title}
        </h3>
        {instructor && (
          <p className="mt-1 text-sm text-text-muted">{instructor}</p>
        )}
        <div className="mt-3 flex items-center gap-2 text-xs text-text-secondary">
          <Clock className="h-3.5 w-3.5" />
          <span>
            {Math.round(course.duration / 60)}h · {lessonsLabel}
          </span>
        </div>
        <div className="mt-auto flex items-baseline gap-2 pt-4">
          <span className="font-heading text-lg font-bold text-brand-teal">
            {price}
          </span>
          {original && (
            <span className="text-sm text-text-muted line-through">{original}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
