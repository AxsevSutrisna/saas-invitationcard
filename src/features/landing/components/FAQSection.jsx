"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export function FAQSection({ faqs = [] }) {
  const [openIndex, setOpenIndex] = useState(-1);

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
    <section id="faq" className="py-20 md:py-28 bg-[#F8F6F2]">
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
                className={`rounded-3xl border transition-all duration-300 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md hover:bg-white/60 dark:hover:bg-zinc-800/60 shadow-sm ${
                  isOpen
                    ? "border-[#C8A96A]/80 shadow-[0_6px_25px_rgba(200,169,106,0.08)] bg-white/60 dark:bg-zinc-900/60"
                    : "border-[#C8A96A]/15"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="w-full p-6 text-left flex items-center justify-between font-semibold text-foreground text-sm sm:text-base hover:text-[#C8A96A] transition-colors cursor-pointer"
                >
                  <span className="font-poppins">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#C8A96A] shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed border-t border-[#C8A96A]/10 pt-4 font-normal">
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
          className="rounded-[32px] bg-[#2C2723] text-white p-10 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden border border-[#C8A96A]/40"
        >

          <div className="space-y-3 relative z-10">
            <h3 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight font-cormorant script-glow">
              Your Story is Ready to be Shared
            </h3>
            <p className="text-zinc-300 text-sm sm:text-base max-w-lg mx-auto font-light leading-relaxed">
              Jadikan momen janji terpenting dalam hidup Anda sebagai awal baru yang indah dan bermakna bersama IKARA.
            </p>
          </div>

          <div className="pt-2 relative z-10">
            <Link href={ROUTES.LOGIN}>
              <Button
                size="lg"
                className="h-13 px-8 rounded-2xl bg-[#C8A96A] hover:bg-[#b39150] text-white font-medium text-base flex items-center gap-2 mx-auto cursor-pointer shadow-md hover:shadow-lg transition-all active:scale-95"
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
