"use client";

import { motion } from "framer-motion";
import { Heart, Sparkles, BookOpen } from "lucide-react";

export function TrustBarSection() {
  const items = [
    {
      icon: Heart,
      title: "Intimate & Personal",
      desc: "Dirancang secara mendetail untuk menuturkan kisah cinta Anda dengan sentuhan yang personal dan penuh makna.",
    },
    {
      icon: Sparkles,
      title: "Modern Editorial",
      desc: "Desain visual yang tenang, elegan, dan estetik tanpa ornamen berlebihan untuk kesan premium.",
    },
    {
      icon: BookOpen,
      title: "Sacred & Meaningful",
      desc: "Menciptakan ruang digital terindah dan berkelas untuk mengabadikan momen suci janji pernikahan Anda.",
    },
  ];

  return (
    <section className="py-24 md:py-32 bg-[#F8F6F2] relative border-y border-[#C8A96A]/10">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* SEO & Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-zinc-900 mb-4"
          >
            The <span className="italic font-serif font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#C8A96A] to-[#b39150]">IKARA</span> Experience
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-zinc-600 text-base md:text-lg leading-relaxed"
          >
            Lebih dari sekadar undangan digital. Kami menghadirkan pengalaman visual kelas atas untuk merayakan momen terpenting dalam hidup Anda.
          </motion.p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="group flex flex-col items-center text-center p-10 lg:p-12 rounded-[2.5rem] bg-white border border-border/30 shadow-sm hover:shadow-2xl hover:-translate-y-2 hover:border-[#C8A96A]/30 transition-all duration-500 cursor-default"
              >
                <div className="w-20 h-20 rounded-2xl bg-[#F8F6F2] group-hover:bg-[#C8A96A]/10 text-[#C8A96A] flex items-center justify-center shrink-0 mb-8 transition-colors duration-500">
                  <Icon className="w-10 h-10" />
                </div>
                <h3 className="font-heading font-bold text-zinc-900 text-xl lg:text-2xl mb-4">
                  {item.title}
                </h3>
                <p className="text-sm md:text-base text-zinc-600 leading-relaxed">
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
