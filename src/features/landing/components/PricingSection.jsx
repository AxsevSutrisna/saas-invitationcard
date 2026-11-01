"use client";

import { Reveal } from "@/components/ui/Reveal";
import { Check, Sparkles, Plus, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { formatRupiah } from "@/lib/format";
import { siteConfig } from "@/config/site.config";

// --- Helper: normalisasi data paket dari DB ---------------------------------
function parseFeatures(pkg) {
  try {
    const f = typeof pkg.features === "string" ? JSON.parse(pkg.features) : pkg.features;
    return Array.isArray(f) ? f : [];
  } catch {
    return [];
  }
}

function periodOf(pkg) {
  if (pkg.price === 0) return "selamanya";
  return pkg.saleType === "SUBSCRIPTION" ? "/ bulan" : "sekali bayar";
}

const SLUG_DESC = {
  free: "Cocok untuk mencoba fitur dasar platform.",
  basic: "Pilihan favorit untuk sepasang calon pengantin.",
  pro: "Solusi profesional untuk Wedding Organizer & Studio Foto.",
};

function descOf(pkg) {
  return pkg.description || SLUG_DESC[pkg.slug] || "Lengkapi undangan Anda.";
}

function ctaOf(pkg) {
  if (pkg.price === 0) return "Mulai Gratis";
  if (pkg.slug === "basic") return "Pilih Paket Basic";
  if (pkg.slug === "pro") return "Berlangganan Pro";
  return `Pilih ${pkg.name}`;
}

const KIND_TAG = { ADDON: "Add-on", BUNDLE: "Paket Hemat" };

// Paket contoh bila DB kosong (mis. saat testing).
const FALLBACK_PLANS = [
  {
    name: "FREE", price: 0, period: "selamanya",
    desc: "Cocok untuk mencoba fitur dasar platform.",
    features: ["1 Undangan Aktif", "Pilihan Tema Terbatas", "Masa Aktif 30 Hari"],
    popular: false, ctaText: "Mulai Gratis",
  },
  {
    name: "BASIC", price: 99000, period: "sekali bayar",
    desc: "Pilihan favorit untuk sepasang calon pengantin.",
    features: ["1 Undangan Premium", "Tanpa Watermark", "Semua Pilihan Tema", "Fitur Amplop Digital & QRIS", "Masa Aktif 180 Hari"],
    popular: true, ctaText: "Pilih Paket Basic",
  },
  {
    name: "PRO", price: 199000, period: "/ bulan",
    desc: "Solusi profesional untuk Wedding Organizer & Studio Foto.",
    features: ["Hingga 10 Undangan/Bulan", "Tanpa Watermark", "Semua Tema Premium", "RSVP & QR Check-in", "Dukungan Custom Domain"],
    popular: false, ctaText: "Berlangganan Pro",
  },
];

export function PricingSection({ packages = [] }) {
  // Landing hanya menampilkan paket untuk konsumen (reseller/vendor = B2B,
  // tersedia di dashboard reseller — bukan di sini).
  const consumer = packages.filter((p) => p.saleType !== "RESELLER");

  const plans =
    consumer.length > 0
      ? consumer
          .filter((p) => p.kind === "PLAN")
          .map((pkg) => ({
            name: pkg.name.toUpperCase(),
            price: pkg.price,
            period: periodOf(pkg),
            desc: descOf(pkg),
            features: parseFeatures(pkg),
            popular: pkg.isHighlighted || pkg.slug === "basic",
            ctaText: ctaOf(pkg),
          }))
      : FALLBACK_PLANS;

  const extras = consumer
    .filter((p) => p.kind === "ADDON" || p.kind === "BUNDLE")
    .map((pkg) => ({
      name: pkg.name,
      tag: KIND_TAG[pkg.kind] || "Tambahan",
      price: pkg.price,
      desc: descOf(pkg),
      features: parseFeatures(pkg),
    }));

  // --- JSON-LD (SEO: Product + daftar Offer) --------------------------------
  const offers = [...plans, ...extras].map((p) => ({
    "@type": "Offer",
    name: p.name,
    price: String(p.price ?? 0),
    priceCurrency: "IDR",
    availability: "https://schema.org/InStock",
    url: `${siteConfig.url}${ROUTES.LOGIN}`,
  }));
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Undangan Pernikahan Digital IKARA",
    description:
      "Paket undangan pernikahan digital premium IKARA: tema eksklusif, tanpa watermark, RSVP, amplop digital, dan add-on seperti domain kustom.",
    brand: { "@type": "Brand", name: siteConfig.name },
    offers,
  };

  return (
    <section
      id="harga"
      aria-labelledby="harga-title"
      className="scroll-mt-28 py-20 md:py-28 bg-[#2C2723] border-y border-gold-400/20 relative overflow-hidden"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-6xl mx-auto px-6 space-y-14">
        {/* Header */}
        <Reveal direction="up" duration={0.5} className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-gold-400">
            Investasi Abadi
          </span>
          <h2 id="harga-title" className="font-heading text-3xl sm:text-4xl font-bold text-white">
            Ruang Terbaik untuk Janji Terpenting
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base font-light leading-relaxed">
            Pilih paket yang sesuai untuk membagikan kisah dan janji pernikahan Anda
            dengan tenang dan elegan.
          </p>
        </Reveal>

        {/* ============ PAKET UTAMA ============ */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7 items-stretch list-none">
          {plans.map((plan, index) => {
            const titleId = `plan-${plan.name.toLowerCase().replace(/\s+/g, "-")}`;
            return (
              <li key={plan.name} className="h-full">
                <Reveal
                  direction="up"
                  duration={0.5}
                  delay={index * 0.12}
                  className="flex h-full w-full"
                >
                  <GlassCard
                    as="article"
                    aria-labelledby={titleId}
                    variant="full"
                    className={[
                      "relative flex h-full w-full flex-col gap-5 p-7 transition-transform duration-300 hover:scale-[1.015]",
                      plan.popular
                        ? "border-gold-400/70! shadow-[0_0_40px_rgba(200,169,106,0.22)] lg:-translate-y-2"
                        : "",
                    ].join(" ")}
                  >
                    {/* Slot badge (dicadangkan di semua kartu agar harga sejajar) */}
                    <div className="flex h-7 items-center">
                      {plan.popular && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-linear-to-r from-gold-400 to-gold-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-md">
                          <Sparkles className="h-3 w-3 fill-current" aria-hidden="true" />
                          Paling Populer
                        </span>
                      )}
                    </div>

                    {/* Nama & deskripsi */}
                    <div className="space-y-1.5">
                      <h3 id={titleId} className="font-heading text-2xl font-bold text-white">
                        {plan.name}
                      </h3>
                      <p className="text-xs leading-relaxed text-zinc-400">{plan.desc}</p>
                    </div>

                    {/* Harga */}
                    <p className="flex items-baseline gap-1.5">
                      <span className="font-heading text-4xl font-extrabold text-white">
                        {formatRupiah(plan.price)}
                      </span>
                      <span className="text-xs font-semibold text-zinc-400">{plan.period}</span>
                    </p>

                    {/* Fitur (flex-1 → mendorong CTA ke bawah; tinggi seragam) */}
                    <div className="flex-1 border-t border-gold-400/20 pt-5">
                      <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-gold-400/90">
                        Yang Didapat
                      </p>
                      <ul className="space-y-2.5">
                        {plan.features.map((feat, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-[13px] text-zinc-200">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" aria-hidden="true" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA — selalu rata bawah */}
                    <Link href={ROUTES.LOGIN} className="block" aria-label={plan.ctaText}>
                      <Button
                        variant={plan.popular ? "primary" : "outline"}
                        className={[
                          "h-12 w-full rounded-xl text-sm font-semibold",
                          plan.popular
                            ? ""
                            : "border-gold-400/50 bg-white/5 text-white hover:bg-gold-400/15 hover:text-white hover:border-gold-400",
                        ].join(" ")}
                      >
                        {plan.ctaText}
                      </Button>
                    </Link>
                  </GlassCard>
                </Reveal>
              </li>
            );
          })}
        </ul>

        {/* ============ ADD-ON & PAKET HEMAT ============ */}
        {extras.length > 0 && (
          <Reveal direction="up" duration={0.5} className="space-y-5">
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-gold-400">
                Lengkapi Paket Anda
              </span>
              <span className="h-px flex-1 bg-gold-400/15" aria-hidden="true" />
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-5 list-none">
              {extras.map((ex) => {
                const titleId = `extra-${ex.name.toLowerCase().replace(/\s+/g, "-")}`;
                const Icon = ex.tag === "Paket Hemat" ? Gift : Plus;
                return (
                  <li key={ex.name}>
                    <article
                      aria-labelledby={titleId}
                      className="flex h-full flex-col gap-4 rounded-2xl border border-gold-400/20 bg-black/20 p-5 transition-colors hover:border-gold-400/50 sm:flex-row sm:items-center"
                    >
                      <div className="flex-1 space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1 rounded-full bg-gold-400/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold-300">
                            <Icon className="h-3 w-3" aria-hidden="true" />
                            {ex.tag}
                          </span>
                          <h3 id={titleId} className="font-heading text-lg font-bold text-white">
                            {ex.name}
                          </h3>
                        </div>
                        <p className="text-xs text-zinc-400">{ex.desc}</p>
                        {ex.features.length > 0 && (
                          <p className="text-[11px] text-zinc-300">
                            {ex.features.slice(0, 3).join(" · ")}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                        <p className="whitespace-nowrap">
                          <span className="font-heading text-xl font-extrabold text-white">
                            {formatRupiah(ex.price)}
                          </span>
                          <span className="ml-1 text-[10px] text-zinc-400">sekali bayar</span>
                        </p>
                        <Link href={ROUTES.LOGIN} aria-label={`Pilih ${ex.name}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-lg border-gold-400/50 bg-white/5 text-xs font-semibold text-white hover:bg-gold-400/15 hover:text-white hover:border-gold-400"
                          >
                            Pilih
                          </Button>
                        </Link>
                      </div>
                    </article>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        )}
      </div>
    </section>
  );
}
