"use client";

import { motion } from "framer-motion";
import { Heart, Sparkles, BookOpen } from "lucide-react";

/**
 * TrustBarSection Component
 * Strip ringkas 3 poin keunggulan utama platform.
 */
export function TrustBarSection() {
  const items = [
    {
      icon: Heart,
      title: "Intimate & Personal",
      desc: "Dirancang khusus untuk menuturkan kisah cinta Anda",
    },
    {
      icon: Sparkles,
      title: "Modern Editorial",
      desc: "Visual tenang, elegan, dan estetik tanpa ornamen ramai",
    },
    {
      icon: BookOpen,
      title: "Sacred & Meaningful",
      desc: "Ruang terindah untuk mengabadikan janji pernikahan",
    },
  ];

  return (
    <section className="py-8 bg-white/70 dark:bg-[#1F1F1F]/70 backdrop-blur-md border-y border-border/50">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/50 dark:bg-zinc-800/50 border border-border/40 shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-[#C8A96A]/15 text-[#C8A96A] flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-sm">
                    {item.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
