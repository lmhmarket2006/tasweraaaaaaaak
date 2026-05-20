import { IBM_Plex_Sans_Arabic, Noto_Kufi_Arabic } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Toaster } from "react-hot-toast";
import { routing } from "@/i18n/routing";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "../globals.css";

export const dynamic = "force-dynamic";

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
});

const notoKufi = Noto_Kufi_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500"],
  variable: "--font-body",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as "ar" | "en")) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir}>
      <body
        className={`${ibmPlexArabic.variable} ${notoKufi.variable} font-body min-h-screen bg-dark-900 text-text-primary antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <main className="min-h-[calc(100vh-8rem)]">{children}</main>
          <Footer />
          <Toaster position={dir === "rtl" ? "top-left" : "top-right"} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
