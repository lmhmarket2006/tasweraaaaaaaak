import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("Admin@12345", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@taswerak.com" },
    update: {},
    create: {
      email: "admin@taswerak.com",
      name: "Admin",
      nameAr: "مدير المنصة",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const instructorPassword = await bcrypt.hash("Instructor@123", 12);
  const instructor = await prisma.user.upsert({
    where: { email: "ahmed@taswerak.com" },
    update: {},
    create: {
      email: "ahmed@taswerak.com",
      name: "Ahmed Zaghloul",
      nameAr: "أحمد زغلول",
      password: instructorPassword,
      role: "INSTRUCTOR",
    },
  });

  await prisma.paymentSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      bankName: "البنك الأهلي السعودي",
      bankNameEn: "Al Ahli Bank",
      accountName: "منصة تصويرك",
      accountNameEn: "Taswerak Platform",
      accountNumber: "1234567890123",
      iban: "SA00 0000 0000 0000 0000 0000",
      whatsappNumber: "966500000000",
      instructionsAr:
        "حوّل المبلغ إلى الحساب أعلاه، ثم ارفع إيصال التحويل أو أرسله عبر واتساب مع رقم الطلب.",
      instructionsEn:
        "Transfer the amount to the account above, then upload your receipt or send it via WhatsApp with your request number.",
    },
  });

  const courses = [
    {
      slug: "makeup-mobile",
      title: "Mobile Makeup Photography",
      titleAr: "تصوير الميكب بالجوال",
      description: "Learn professional mobile makeup tutorial photography.",
      descriptionAr:
        "تعلّم تصوير توتوريال الميكب بالجوال باحترافية مع تقنيات الإضاءة والتأليف.",
      thumbnail:
        "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&q=80",
      previewVideo: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      price: 35,
      originalPrice: 250,
      featured: true,
      lessons: [
        {
          title: "Introduction",
          titleAr: "مقدمة",
          videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          isFree: true,
        },
        {
          title: "Lighting setup",
          titleAr: "إعداد الإضاءة",
          videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        },
      ],
    },
    {
      slug: "makeup-tutorial-pro",
      title: "Makeup Tutorial Final Look",
      titleAr: "تعلم أسرار تصوير فيديوهات الميكب توتوريال",
      description: "Beauty reels and tutorial filming secrets.",
      descriptionAr:
        "هل أنت مصور بيوتي؟ تعلّم أسرار تصوير الريلز وتوتوريال الميكب والفاينل لوك.",
      thumbnail:
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80",
      price: 35,
      originalPrice: 250,
      featured: true,
      lessons: [
        {
          title: "Course overview",
          titleAr: "نظرة على الدورة",
          videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          isFree: true,
        },
      ],
    },
    {
      slug: "food-photography",
      title: "Food Photography Lighting",
      titleAr: "تصوير وتقنيات الإضاءة في تصوير الأطعمة",
      description: "Professional food photography lighting techniques.",
      descriptionAr:
        "تصوير الأطعمة فن يجمع الإبداع والتقنية — تعلّم الإضاءة والتنسيق الاحترافي.",
      thumbnail:
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
      price: 188,
      originalPrice: 250,
      featured: false,
      lessons: [
        {
          title: "Intro to food styling",
          titleAr: "مقدمة في ستايلنج الطعام",
          videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          isFree: true,
        },
      ],
    },
  ];

  for (const c of courses) {
    const course = await prisma.course.upsert({
      where: { slug: c.slug },
      update: {},
      create: {
        slug: c.slug,
        title: c.title,
        titleAr: c.titleAr,
        description: c.description,
        descriptionAr: c.descriptionAr,
        thumbnail: c.thumbnail,
        previewVideo: c.previewVideo,
        price: c.price,
        originalPrice: c.originalPrice,
        currency: "SAR",
        level: "BEGINNER",
        duration: 120,
        approvalStatus: "PUBLISHED",
        published: true,
        featured: c.featured,
        creatorId: instructor.id,
      },
    });

    const existingSection = await prisma.section.findFirst({
      where: { courseId: course.id },
    });
    if (!existingSection) {
      const section = await prisma.section.create({
        data: {
          title: "Main content",
          titleAr: "المحتوى الرئيسي",
          order: 0,
          courseId: course.id,
        },
      });
      for (let i = 0; i < c.lessons.length; i++) {
        const l = c.lessons[i];
        await prisma.lesson.create({
          data: {
            title: l.title,
            titleAr: l.titleAr,
            videoUrl: l.videoUrl,
            videoProvider: "YOUTUBE",
            order: i,
            isFree: l.isFree ?? false,
            duration: 600,
            sectionId: section.id,
          },
        });
      }
    }
  }

  console.log("Seed OK");
  console.log("Admin: admin@taswerak.com / Admin@12345");
  console.log("Instructor: ahmed@taswerak.com / Instructor@123");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
