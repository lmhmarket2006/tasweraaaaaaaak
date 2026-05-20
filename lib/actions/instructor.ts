"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { courseSchema } from "@/lib/validations/course";
import { slugify } from "@/lib/utils";

export async function applyAsInstructor(data: {
  bio: string;
  bioEn?: string;
  portfolioUrl?: string;
}) {
  const session = await auth();
  if (!session?.user) return { error: "UNAUTHORIZED" };

  const existing = await prisma.instructorApplication.findUnique({
    where: { userId: session.user.id },
  });
  if (existing?.status === "PENDING") return { error: "ALREADY_PENDING" };
  if (existing?.status === "APPROVED") return { error: "ALREADY_INSTRUCTOR" };

  await prisma.instructorApplication.upsert({
    where: { userId: session.user.id },
    create: {
      userId: session.user.id,
      bio: data.bio,
      bioEn: data.bioEn,
      portfolioUrl: data.portfolioUrl,
      status: "PENDING",
    },
    update: {
      bio: data.bio,
      bioEn: data.bioEn,
      portfolioUrl: data.portfolioUrl,
      status: "PENDING",
      adminNote: null,
      reviewedAt: null,
    },
  });

  revalidatePath("/admin/instructors");
  return { success: true };
}

export async function approveInstructor(userId: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return { error: "FORBIDDEN" };
  }

  await prisma.$transaction([
    prisma.instructorApplication.update({
      where: { userId },
      data: {
        status: "APPROVED",
        reviewedAt: new Date(),
      },
    }),
    prisma.user.update({
      where: { id: userId },
      data: { role: "INSTRUCTOR" },
    }),
    prisma.notification.create({
      data: {
        userId,
        title: "Instructor approved",
        titleAr: "تم قبول طلب التدريس",
        message: "You can now create courses",
        messageAr: "يمكنك الآن إنشاء الدورات من لوحة المدرب",
        link: "/instructor",
      },
    }),
  ]);

  revalidatePath("/admin/instructors");
  return { success: true };
}

export async function createCourse(data: Record<string, unknown>) {
  const session = await auth();
  if (!session?.user) return { error: "UNAUTHORIZED" };
  if (!["INSTRUCTOR", "ADMIN"].includes(session.user.role)) {
    return { error: "FORBIDDEN" };
  }

  const parsed = courseSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten() };

  const slug =
    parsed.data.slug || slugify(parsed.data.title);
  const exists = await prisma.course.findUnique({ where: { slug } });
  if (exists) return { error: "SLUG_EXISTS" };

  const isAdmin = session.user.role === "ADMIN";

  const course = await prisma.course.create({
    data: {
      ...parsed.data,
      slug,
      creatorId: session.user.id,
      approvalStatus: isAdmin ? "PUBLISHED" : "PENDING_REVIEW",
      published: isAdmin,
      originalPrice: parsed.data.originalPrice ?? null,
      previewVideo: parsed.data.previewVideo || null,
    },
  });

  revalidatePath("/instructor");
  revalidatePath("/admin/courses");
  return { success: true, courseId: course.id };
}

export async function submitCourseForReview(courseId: string) {
  const session = await auth();
  if (!session?.user) return { error: "UNAUTHORIZED" };

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course || course.creatorId !== session.user.id) {
    return { error: "NOT_FOUND" };
  }

  await prisma.course.update({
    where: { id: courseId },
    data: {
      approvalStatus: "PENDING_REVIEW",
      published: false,
    },
  });

  revalidatePath("/admin/courses");
  return { success: true };
}

export async function approveCourse(courseId: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return { error: "FORBIDDEN" };
  }

  await prisma.course.update({
    where: { id: courseId },
    data: {
      approvalStatus: "PUBLISHED",
      published: true,
    },
  });

  revalidatePath("/admin/courses");
  revalidatePath("/courses");
  return { success: true };
}
