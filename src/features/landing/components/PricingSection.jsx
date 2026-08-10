"use client";

import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

/**
 * PricingSection Component
 * Paket harga SaaS (FREE, BASIC, PRO) sesuai skema monetisasi.
 * Menggunakan <GlassCard variant="full"> dari @/components/ui/GlassCard.
 */
export function PricingSection({ packages = [] }) {
  const displayPlans =
    packages.length > 0
      ? packages.map((pkg) => {
          let desc = "Cocok untuk kebutuhan Anda.";
          let popular = false;
          let ctaText = `Pilih Paket ${pkg.name}`;
          let ctaVariant = "outline";

          if (pkg.slug === "free") {
            desc = "Cocok untuk mencoba fitur dasar platform.";
            ctaText = "Mulai Gratis";
          } else if (pkg.slug === "basic") {
            desc = "Pilihan favorit untuk sepasang calon pengantin.";
            popular = true;
            ctaText = "Pilih Paket Basic";
            ctaVariant = "default";
          } else if (pkg.slug === "pro") {
            desc = "Solusi profesional untuk Wedding Organizer & Studio Foto.";
            ctaText = "Berlangganan Pro";
          }

          const priceFormatted =
            pkg.price === 0
              ? "Rp 0"
              : new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(pkg.price);

          const periodText =
            pkg.slug === "free"
              ? "selamanya"
              : pkg.type === "RECURRING"
              ? "/ bulan"
              : "sekali bayar";

          let features = [];
          try {
            features =
              typeof pkg.features === "string"
                ? JSON.parse(pkg.features)
                : pkg.features || [];
          } catch {
            features = [];
          }

          return {
            name: pkg.name.toUpperCase(),
            price: priceFormatted,
            period: periodText,
            desc,
            features,
            popular,
            ctaText,
            ctaVariant,
          };
        })
      : [
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
    <section id="harga" className="py-20 md:py-28 bg-[#2C2723] border-y border-[#C8A96A]/20 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 space-y-16">
        {/* Header */}
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
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white">
            Ruang Terbaik untuk Janji Terpenting
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base font-light leading-relaxed">
            Pilih tingkat ruang yang sesuai untuk membagikan kisah dan janji
            pernikahan Anda dengan tenang dan elegan.
          </p>
        </motion.div>

        {/* Plans Grid — GlassCard variant="full" dengan tinggi seragam */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {displayPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className={plan.popular ? "md:-translate-y-3 md:z-10 h-full flex flex-col" : "h-full flex flex-col"}
            >
              {/*
                Komponen Kartu Solid
                Paket popular mendapat border emas tambahan via className.
              */}
              <GlassCard
                variant="full"
                className={[
                  "p-7 sm:p-8 flex flex-col justify-between gap-6 h-full transition-transform duration-300",
                  plan.popular
                    ? "!border-[#C8A96A]/80 shadow-[0_0_40px_rgba(200,169,106,0.25)] hover:scale-[1.02]"
                    : "hover:scale-[1.02]",
                ].join(" ")}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#C8A96A] to-[#b39150] text-white text-[12px] font-bold uppercase tracking-wider shadow-md flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 fill-current" /> Most Popular
                  </div>
                )}

                <div className={`space-y-5 flex-1 flex flex-col justify-between ${plan.popular ? "pt-7" : ""}`}>
                  <div className="space-y-5">
                    {/* Plan Name & Description */}
                    <div className="space-y-1.5">
                      <h3 className="font-heading text-[24px] font-bold text-white">
                        {plan.name}
                      </h3>
                      <p className="text-[12px] text-zinc-300 leading-relaxed font-semibold">
                        {plan.desc}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-heading text-[32px] sm:text-[36px] font-extrabold text-white">
                        {plan.price}
                      </span>
                      <span className="text-[12px] text-zinc-400 font-bold">
                        {plan.period}
                      </span>
                    </div>

                    {/* Features */}
                    <div className="border-t border-[#C8A96A]/30 pt-4 space-y-2.5">
                      <p className="text-[12px] font-extrabold text-white uppercase tracking-wider">
                        Yang Didapat:
                      </p>
                      <ul className="space-y-2 text-[12px] text-white font-semibold">
                        {plan.features.map((feat, idx) => (
                          <li key={idx} className="flex items-center gap-2.5">
                            <Check className="w-4 h-4 text-[#9e7e40] shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="pt-4">
                  <Link href={ROUTES.LOGIN} className="w-full block">
                    <Button
                      variant={plan.ctaVariant}
                      className={[
                        "w-full h-12 rounded-xl text-[16px] font-semibold transition-all cursor-pointer",
                        plan.popular
                          ? "liquid-gold-button text-white"
                          : "border-2 border-[#C8A96A]/40 bg-white/50 hover:bg-[#C8A96A] text-[#9e7e40] hover:text-white hover:shadow-md hover:shadow-[#C8A96A]/10",
                      ].join(" ")}
                    >
                      {plan.ctaText}
                    </Button>
                  </Link>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
