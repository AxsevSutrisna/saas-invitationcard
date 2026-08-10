"use client";

import { motion } from "framer-motion";
import { UserPlus, Palette, Send } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

/**
 * HowItWorksSection Component
 * 3 Langkah praktis pembuatan undangan digital.
 * Menggunakan <GlassCard variant="full"> dari @/components/ui/GlassCard.
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
    <section
      id="cara-kerja"
      className="py-20 md:py-28 bg-[#2C2723] border-y border-[#C8A96A]/20 relative overflow-hidden"
    >
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
            Sederhana & Bermakna
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white">
            Bagaimana Kisah Anda Dimulai
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base font-light leading-relaxed">
            IKARA dirancang agar proses mengabadikan kisah dan janji terpenting
            dalam hidup terasa personal, tenang, dan menyenangkan.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="h-full flex flex-col"
              >
                {/*
                  Komponen Kartu Solid
                */}
                <GlassCard
                  variant="full"
                  className="p-7 sm:p-8 flex flex-col gap-5 h-full group hover:scale-[1.02] transition-transform duration-300"
                >
                  {/* Step Number Badge */}
                  <span className="absolute top-5 right-6 font-heading text-[36px] font-extrabold text-[#9e7e40] select-none">
                    {item.step}
                  </span>

                  {/* Icon */}
                  <div className="w-12 h-12 rounded-2xl bg-[#9e7e40] text-white flex items-center justify-center shadow-md shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <h3 className="font-heading text-[20px] font-bold text-white">
                      {item.title}
                    </h3>
                    <p className="text-[16px] text-zinc-300 leading-relaxed font-semibold">
                      {item.desc}
                    </p>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
