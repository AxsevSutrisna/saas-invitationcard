"use client";

import { motion } from "framer-motion";
import { UserPlus, Palette, Send } from "lucide-react";

/**
 * HowItWorksSection Component
 * 3 Langkah praktis pembuatan undangan digital.
 */
export function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      icon: UserPlus,
      title: "Tell Your Journey",
      desc: "Tuliskan momen rasa, pertemuan, dan garis waktu perjalanan cinta Anda.",
    },
    {
      step: "02",
      icon: Palette,
      title: "Declare Your Promise",
      desc: "Lengkapi detail ikrar pernikahan dan pilih tampilan yang mencerminkan jiwa Anda.",
    },
    {
      step: "03",
      icon: Send,
      title: "Invite Loved Ones",
      desc: "Undang keluarga dan sahabat untuk merayakan awal baru kisah bahagia Anda.",
    },
  ];

  return (
    <section id="cara-kerja" className="py-20 md:py-28 bg-white/60 dark:bg-[#1F1F1F]/60 backdrop-blur-md border-y border-border/40">
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
            Sederhana & Bermakna
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#1F1F1F] dark:text-zinc-50">
            Bagaimana Kisah Anda Dimulai
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base font-light leading-relaxed">
            IKARA dirancang agar proses mengabadikan kisah dan janji terpenting dalam hidup terasa personal, tenang, dan menyenangkan.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-border shadow-md relative group hover:shadow-xl transition-all"
              >
                {/* Step Number Badge */}
                <span className="absolute top-6 right-6 font-heading text-4xl font-extrabold text-[#C8A96A]/20 group-hover:text-[#C8A96A]/40 transition-colors">
                  {item.step}
                </span>

                <div className="w-14 h-14 rounded-2xl bg-[#C8A96A]/15 text-[#C8A96A] flex items-center justify-center mb-6 shadow-sm">
                  <Icon className="w-7 h-7" />
                </div>

                <h3 className="font-heading text-xl font-bold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
