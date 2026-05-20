"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateRequestNumber } from "@/lib/utils";

export async function createPurchaseRequest(courseId: string) {
  const session = await auth();
  if (!session?.user) return { error: "UNAUTHORIZED" };

  const course = await prisma.course.findUnique({
    where: { id: courseId, published: true },
  });
  if (!course) return { error: "COURSE_NOT_FOUND" };

  const enrolled = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: { userId: session.user.id, courseId },
    },
  });
  if (enrolled) return { error: "ALREADY_ENROLLED" };

  const pending = await prisma.purchaseRequest.findFirst({
    where: {
      userId: session.user.id,
      courseId,
      status: "PENDING",
    },
  });
  if (pending) return { error: "PENDING_EXISTS", requestId: pending.id };

  const request = await prisma.purchaseRequest.create({
    data: {
      requestNumber: generateRequestNumber(),
      userId: session.user.id,
      courseId,
      amount: course.price,
      currency: course.currency,
      status: "PENDING",
    },
  });

  revalidatePath("/dashboard/orders");
  return { success: true, requestId: request.id, requestNumber: request.requestNumber };
}

export async function approvePurchaseRequest(
  requestId: string,
  adminNote?: string
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return { error: "FORBIDDEN" };
  }

  const request = await prisma.purchaseRequest.findUnique({
    where: { id: requestId },
    include: { course: true, user: true },
  });
  if (!request || request.status !== "PENDING") {
    return { error: "INVALID_REQUEST" };
  }

  await prisma.$transaction([
    prisma.purchaseRequest.update({
      where: { id: requestId },
      data: {
        status: "APPROVED",
        reviewedById: session.user.id,
        reviewedAt: new Date(),
        adminNote,
      },
    }),
    prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: request.userId,
          courseId: request.courseId,
        },
      },
      create: {
        userId: request.userId,
        courseId: request.courseId,
      },
      update: {},
    }),
    prisma.notification.create({
      data: {
        userId: request.userId,
        title: "Enrollment approved",
        titleAr: "تم قبول طلب الاشتراك",
        message: `You now have access to ${request.course.title}`,
        messageAr: `تم تفعيل دورة ${request.course.titleAr}`,
        link: `/dashboard/my-courses`,
      },
    }),
  ]);

  revalidatePath("/admin/orders");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function rejectPurchaseRequest(
  requestId: string,
  rejectionReason: string
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return { error: "FORBIDDEN" };
  }

  const request = await prisma.purchaseRequest.findUnique({
    where: { id: requestId },
    include: { course: true },
  });
  if (!request || request.status !== "PENDING") {
    return { error: "INVALID_REQUEST" };
  }

  await prisma.$transaction([
    prisma.purchaseRequest.update({
      where: { id: requestId },
      data: {
        status: "REJECTED",
        rejectionReason,
        reviewedById: session.user.id,
        reviewedAt: new Date(),
      },
    }),
    prisma.notification.create({
      data: {
        userId: request.userId,
        title: "Request rejected",
        titleAr: "تم رفض طلب الاشتراك",
        message: rejectionReason,
        messageAr: rejectionReason,
        link: `/dashboard/orders`,
      },
    }),
  ]);

  revalidatePath("/admin/orders");
  return { success: true };
}

export async function saveReceiptUrl(requestId: string, receiptUrl: string) {
  const session = await auth();
  if (!session?.user) return { error: "UNAUTHORIZED" };

  const request = await prisma.purchaseRequest.findUnique({
    where: { id: requestId },
  });
  if (!request || request.userId !== session.user.id) {
    return { error: "NOT_FOUND" };
  }
  if (request.status !== "PENDING") {
    return { error: "NOT_PENDING" };
  }

  await prisma.purchaseRequest.update({
    where: { id: requestId },
    data: {
      receiptUrl,
      receiptUploadedAt: new Date(),
    },
  });

  revalidatePath("/dashboard/orders");
  revalidatePath("/admin/orders");
  return { success: true };
}
