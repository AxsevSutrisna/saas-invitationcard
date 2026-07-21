"use client";

import { motion } from "framer-motion";
import { Check, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

/**
 * PricingSection Component
 * Paket harga SaaS (FREE, BASIC, PRO) sesuai skema monetisasi.
 */
export function PricingSection() {
  const plans = [
    {
      name: "FREE",
      price: "Rp 0",
      period: "selamanya",
      desc: "Cocok untuk mencoba fitur dasar platform.",
      features: [
        "1 Undangan Aktif",
        "Watermark Platform Aktif",
        "Pilihan Tema Terbatas",
        "Masa Aktif 30 Hari",
      ],
      popular: false,
      ctaText: "Mulai Gratis",
      ctaVariant: "outline",
    },
    {
      name: "BASIC",
      price: "Rp 99.000",
      period: "sekali bayar",
      desc: "Pilihan favorit untuk sepasang calon pengantin.",
      features: [
        "1 Undangan Premium Eksklusif",
        "Tanpa Watermark",
        "Semua Pilihan Tema",
        "Fitur Amplop Digital & QRIS",
        "Masa Aktif 180 Hari",
      ],
      popular: true,
      ctaText: "Pilih Paket Basic",
      ctaVariant: "default",
    },
    {
      name: "PRO",
      price: "Rp 199.000",
      period: "/ bulan",
      desc: "Solusi profesional untuk Wedding Organizer & Studio Foto.",
      features: [
        "Hingga 10 Undangan Aktif/Bulan",
        "Tanpa Watermark",
        "Semua Pilihan Tema Premium",
        "Fitur RSVP & QR Check-in",
        "Dukungan Custom Domain",
      ],
      popular: false,
      ctaText: "Berlangganan Pro",
      ctaVariant: "outline",
    },
  ];

  return (
    <section id="harga" className="py-20 md:py-28 relative">
      <div className="max-w-6xl mx-auto px-6 space-y-16">
        {/* Header Teks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto space-y-3"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C8A96A]">
            Investasi Abadi
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#1F1F1F] dark:text-zinc-50">
            Ruang Terbaik untuk Janji Terpenting
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base font-light leading-relaxed">
            Pilih tingkat ruang yang sesuai untuk membagikan kisah dan janji pernikahan Anda dengan tenang dan elegan.
          </p>
        </motion.div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className={`rounded-3xl p-8 border flex flex-col justify-between relative shadow-lg ${
                plan.popular
                  ? "bg-white dark:bg-zinc-900 border-[#C8A96A] ring-2 ring-[#C8A96A]/30 scale-105 z-10"
                  : "bg-white/80 dark:bg-zinc-900/80 border-border"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#C8A96A] to-[#b39150] text-white text-xs font-bold uppercase tracking-wider shadow-md flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 fill-current" /> Most Popular
                </div>
              )}

              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="font-heading text-2xl font-bold text-foreground">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {plan.desc}
                  </p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="font-heading text-4xl font-extrabold text-foreground">
                    {plan.price}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">
                    {plan.period}
                  </span>
                </div>

                <div className="border-t border-border/50 pt-6 space-y-3">
                  <p className="text-xs font-semibold text-foreground uppercase tracking-wider">
                    Fitur Yang Didapat:
                  </p>
                  <ul className="space-y-2.5 text-xs text-muted-foreground">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-[#C8A96A] shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-8">
                <Link href={ROUTES.REGISTER} className="w-full">
                  <Button
                    variant={plan.ctaVariant}
                    className={`w-full h-12 rounded-xl text-sm font-semibold transition-all ${
                      plan.popular
                        ? "bg-gradient-to-r from-[#C8A96A] to-[#b39150] hover:from-[#b39150] hover:to-[#9e7e40] text-white shadow-md"
                        : "border-[#C8A96A]/40 hover:bg-[#C8A96A] hover:text-white"
                    }`}
                  >
                    {plan.ctaText}
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
