import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();

  await prisma.paymentSettings.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      bankName: body.bankName || "",
      bankNameEn: body.bankNameEn || null,
      accountName: body.accountName || "",
      accountNameEn: body.accountNameEn || null,
      accountNumber: body.accountNumber || "",
      iban: body.iban || null,
      whatsappNumber: body.whatsappNumber || "",
      instructionsAr: body.instructionsAr || null,
      instructionsEn: body.instructionsEn || null,
    },
    update: {
      bankName: body.bankName,
      bankNameEn: body.bankNameEn,
      accountName: body.accountName,
      accountNameEn: body.accountNameEn,
      accountNumber: body.accountNumber,
      iban: body.iban,
      whatsappNumber: body.whatsappNumber,
      instructionsAr: body.instructionsAr,
      instructionsEn: body.instructionsEn,
    },
  });

  return NextResponse.json({ ok: true });
}
