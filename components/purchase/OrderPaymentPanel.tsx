"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { saveReceiptUrl } from "@/lib/actions/purchase";
import { formatPrice, whatsappLink } from "@/lib/utils";
import { MessageCircle, Upload } from "lucide-react";
import toast from "react-hot-toast";

type PaymentSettings = {
  bankName: string;
  bankNameEn: string | null;
  accountName: string;
  accountNameEn: string | null;
  accountNumber: string;
  iban: string | null;
  instructionsAr: string | null;
  instructionsEn: string | null;
  whatsappNumber: string;
};

export function OrderPaymentPanel({
  requestId,
  requestNumber,
  amount,
  currency,
  courseTitle,
  locale,
  settings,
  existingReceipt,
}: {
  requestId: string;
  requestNumber: string;
  amount: number;
  currency: string;
  courseTitle: string;
  locale: string;
  settings: PaymentSettings;
  existingReceipt?: string | null;
}) {
  const [uploading, setUploading] = useState(false);
  const [receiptUrl, setReceiptUrl] = useState(existingReceipt);
  const inputRef = useRef<HTMLInputElement>(null);

  const bankName =
    locale === "ar" ? settings.bankName : settings.bankNameEn || settings.bankName;
  const accountName =
    locale === "ar"
      ? settings.accountName
      : settings.accountNameEn || settings.accountName;
  const instructions =
    locale === "ar"
      ? settings.instructionsAr
      : settings.instructionsEn || settings.instructionsAr;

  const waMessage =
    locale === "ar"
      ? `مرحباً، أرغب بالاشتراك في دورة "${courseTitle}"\nرقم الطلب: ${requestNumber}\nالمبلغ: ${formatPrice(amount, currency, locale)}`
      : `Hi, I'd like to enroll in "${courseTitle}"\nRequest: ${requestNumber}\nAmount: ${formatPrice(amount, currency, locale)}`;

  const waUrl = whatsappLink(
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || settings.whatsappNumber,
    waMessage
  );

  async function handleUpload(file: File) {
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    form.append("requestId", requestId);
    try {
      const res = await fetch("/api/upload/receipt", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      await saveReceiptUrl(requestId, data.url);
      setReceiptUrl(data.url);
      toast.success(locale === "ar" ? "تم رفع الإيصال" : "Receipt uploaded");
    } catch (e) {
      toast.error(String(e));
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-6 rounded-2xl border border-dark-600 bg-dark-800 p-6">
      <div>
        <p className="text-sm text-text-muted">
          {locale === "ar" ? "رقم الطلب" : "Request #"}
        </p>
        <p className="font-heading text-xl font-bold text-brand-teal">
          {requestNumber}
        </p>
        <p className="mt-2 font-heading text-2xl font-bold">
          {formatPrice(amount, currency, locale)}
        </p>
      </div>

      <div className="space-y-2 text-sm">
        <p>
          <span className="text-text-muted">
            {locale === "ar" ? "البنك: " : "Bank: "}
          </span>
          {bankName}
        </p>
        <p>
          <span className="text-text-muted">
            {locale === "ar" ? "اسم الحساب: " : "Account: "}
          </span>
          {accountName}
        </p>
        <p>
          <span className="text-text-muted">
            {locale === "ar" ? "رقم الحساب: " : "Number: "}
          </span>
          <span className="font-mono">{settings.accountNumber}</span>
        </p>
        {settings.iban && (
          <p>
            <span className="text-text-muted">IBAN: </span>
            <span className="font-mono">{settings.iban}</span>
          </p>
        )}
        {instructions && (
          <p className="text-text-secondary whitespace-pre-line">{instructions}</p>
        )}
      </div>

      <a href={waUrl} target="_blank" rel="noopener noreferrer">
        <Button variant="secondary" className="w-full gap-2">
          <MessageCircle className="h-4 w-4" />
          {locale === "ar" ? "إرسال عبر واتساب" : "Send via WhatsApp"}
        </Button>
      </a>

      <div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleUpload(f);
          }}
        />
        <Button
          className="w-full gap-2"
          variant="primary"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="h-4 w-4" />
          {uploading
            ? "..."
            : locale === "ar"
              ? "رفع إيصال التحويل"
              : "Upload receipt"}
        </Button>
        {receiptUrl && (
          <div className="mt-4">
            <p className="mb-2 text-sm text-brand-teal">
              {locale === "ar" ? "تم رفع الإيصال" : "Receipt on file"}
            </p>
            {receiptUrl.match(/\.(jpg|jpeg|png|webp|gif)$/i) ? (
              <Image
                src={receiptUrl}
                alt="receipt"
                width={400}
                height={300}
                className="rounded-lg border border-dark-600"
              />
            ) : (
              <a
                href={receiptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-brand-blue underline"
              >
                {locale === "ar" ? "عرض الملف" : "View file"}
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
