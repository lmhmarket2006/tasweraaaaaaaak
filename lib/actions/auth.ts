"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { registerSchema } from "@/lib/validations/auth";

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  const parsed = registerSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const email = parsed.data.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: { email: ["Email already registered"] } };
  }

  const hashed = await bcrypt.hash(parsed.data.password, 12);
  await prisma.user.create({
    data: {
      email,
      name: parsed.data.name,
      nameAr: parsed.data.name,
      password: hashed,
      role: "STUDENT",
    },
  });

  return { success: true };
}
