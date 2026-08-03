"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

/**
 * FAQSection Component
 * Akordion tanya jawab umum (FAQ) + Closing Conversion Banner.
 */
export function FAQSection({ faqs = [] }) {
  const [openIndex, setOpenIndex] = useState(0);

  const displayFaqs = faqs.length > 0 
    ? faqs.map((f) => ({ q: f.question, a: f.answer }))
    : [
        {
          q: "Berapa lama proses pembuatan undangan digital?",
          a: "Hanya butuh waktu sekitar 5 menit! Anda cukup mendaftar akun, memilih tema yang disukai, lalu mengisi informasi pengantin & lokasi acara melalui form yang sudah disediakan.",
        },
        {
          q: "Apakah saya bisa mengubah data undangan setelah dipublikasikan?",
          a: "Tentu saja! Anda memiliki akses penuh ke Dashboard 24/7 untuk mengedit nama, tanggal, lokasi, atau menambah foto kapan saja tanpa biaya tambahan.",
        },
        {
          q: "Bagaimana cara tamu memberikan konfirmasi RSVP?",
          a: "Tamu Anda cukup mengisi form RSVP sederhana yang ada di bagian bawah undangan. Hasil konfirmasi kehadiran dan jumlah tamu akan langsung masuk ke Dashboard Anda.",
        },
        {
          q: "Apakah fitur Amplop Digital aman?",
          a: "100% Aman. Uang hadiah atau transfer akan langsung masuk ke rekening bank/e-wallet pribadi Anda sendiri tanpa dipotong komisi oleh pihak kami.",
        },
      ];

  return (
    <section id="faq" className="py-20 md:py-28 bg-white/60 dark:bg-[#1F1F1F]/60 backdrop-blur-md border-t border-border/40 relative">
      <div className="max-w-4xl mx-auto px-6 space-y-16">
        {/* Header FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-3"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C8A96A]">
            Pertanyaan Umum
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#1F1F1F] dark:text-zinc-50">
            Sering Ditanyakan (FAQ)
          </h2>
        </motion.div>

        {/* Accordion FAQ */}
        <div className="space-y-4">
          {displayFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-white dark:bg-zinc-900 rounded-2xl border border-border/70 overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="w-full p-5 text-left flex items-center justify-between font-semibold text-foreground text-sm sm:text-base hover:text-[#C8A96A] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#C8A96A] shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/30 pt-3">
                    {faq.a}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Closing Conversion CTA Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl bg-gradient-to-r from-[#1F1F1F] via-[#2D281E] to-[#1F1F1F] text-white p-10 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden border border-[#C8A96A]/40"
        >
          {/* Background Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C8A96A]/20 blur-3xl rounded-full pointer-events-none" />

          <div className="space-y-3 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#C8A96A]/20 text-[#E2C785] text-xs font-semibold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 fill-current" /> Begin Your Story
            </span>
            <h3 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight">
              Your Story is Ready to be Shared
            </h3>
            <p className="text-zinc-300 text-sm sm:text-base max-w-lg mx-auto font-light leading-relaxed">
              Jadikan momen janji terpenting dalam hidup Anda sebagai awal baru yang indah dan bermakna bersama IKARA.
            </p>
          </div>

          <div className="pt-2 relative z-10">
            <Link href={ROUTES.REGISTER}>
              <Button
                size="lg"
                className="h-13 px-8 rounded-full bg-gradient-to-r from-[#C8A96A] to-[#b39150] hover:from-[#b39150] hover:to-[#9e7e40] text-white font-medium text-base shadow-xl flex items-center gap-2 mx-auto hover:scale-105 transition-all"
              >
                Begin Your Story <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
