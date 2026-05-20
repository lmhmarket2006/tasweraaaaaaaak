import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(
  amount: number | string,
  currency: string,
  locale: string
) {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-SA", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(value);
}

export function generateRequestNumber() {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `TAS-${n}`;
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function parseVideoUrl(url: string): {
  provider: "YOUTUBE" | "VIMEO";
  id: string;
} | null {
  if (!url) return null;
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (ytMatch) return { provider: "YOUTUBE", id: ytMatch[1] };
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) return { provider: "VIMEO", id: vimeoMatch[1] };
  return null;
}

export function whatsappLink(
  phone: string,
  message: string
): string {
  const clean = phone.replace(/\D/g, "");
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}
