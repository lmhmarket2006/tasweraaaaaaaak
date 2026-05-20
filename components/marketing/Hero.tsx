"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";

export function Hero({
  title,
  subtitle,
  ctaCourses,
  ctaRegister,
}: {
  title: string;
  subtitle: string;
  ctaCourses: string;
  ctaRegister: string;
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-hero py-24 sm:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(27,154,170,0.15),transparent_50%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <h1 className="font-heading text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            <span className="text-gradient-brand">{title}</span>
          </h1>
          <p className="mt-6 text-lg text-text-secondary sm:text-xl">{subtitle}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/courses">
              <Button size="lg">{ctaCourses}</Button>
            </Link>
            <Link href="/register">
              <Button variant="secondary" size="lg">
                {ctaRegister}
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
