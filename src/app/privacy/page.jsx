import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { db } from "@/lib/db";
import { ShieldCheck, Eye } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Kebijakan Privasi — IKARA",
  description: "Kebijakan perlindungan data pribadi dan privasi pengguna platform IKARA.",
};

export default async function PrivacyPage() {
  const whatsappSetting = await db.systemSetting.findUnique({
    where: { key: "CS_WHATSAPP_NUMBER" },
  });
  const whatsappNumber = whatsappSetting?.value || "6281234567890";

  const navigationItems = [
    { id: "pendahuluan", label: "Pendahuluan" },
    { id: "data-dikumpul", label: "Data yang Dikumpulkan" },
    { id: "penggunaan", label: "Penggunaan Informasi" },
    { id: "keamanan", label: "Keamanan Data" },
    { id: "hak-user", label: "Hak Pengguna" },
    { id: "berbagi-data", label: "Pihak Ketiga & Berbagi Data" },
    { id: "cookies", label: "Teknologi Cookie" },
    { id: "kontak", label: "Kontak & Keluhan" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F6F2] dark:bg-[#191919] text-foreground font-sans selection:bg-[#C8A96A]/20 selection:text-[#C8A96A]">
      <Navbar />
      
      {/* Editorial Header Banner */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-20 overflow-hidden bg-gradient-to-b from-[#e8dec6]/30 to-transparent dark:from-zinc-800/10">
        <div className="absolute inset-0 bg-[radial-gradient(#C8A96A_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.07] pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C8A96A]/10 border border-[#C8A96A]/20 text-[#9e7e40] dark:text-[#E2C785] text-[10px] font-bold uppercase tracking-widest">
            <ShieldCheck className="w-3.5 h-3.5" />
            Perlindungan Data
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight text-[#1F1F1F] dark:text-zinc-50 font-cormorant">
            Kebijakan Privasi
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto font-light leading-relaxed">
            Bagaimana kami mengumpulkan, menggunakan, menyimpan, dan melindungi data pribadi Anda secara bertanggung jawab.
          </p>
          <div className="pt-2 text-xs text-muted-foreground/80 flex items-center justify-center gap-4 font-light">
            <span>Berlaku sejak: 3 Agustus 2026</span>
            <span>•</span>
            <span>Versi: 1.0</span>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Sticky Left Navigation (Desktop Only) */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-28 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1A1A1A] border border-border/60 shadow-sm">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-4 font-poppins">
              Navigasi Cepat
            </h4>
            <nav className="flex flex-col gap-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.id}
                  href={`#${item.id}`}
                  className="text-xs text-muted-foreground hover:text-[#C8A96A] hover:translate-x-1 transition-all py-1.5 font-light block border-b border-border/30 last:border-0"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content Body */}
        <article className="lg:col-span-9 space-y-12">
          {/* Commitment Notice Box */}
          <div className="p-6 rounded-3xl bg-[#C8A96A]/5 dark:bg-[#C8A96A]/2 border border-[#C8A96A]/20 flex items-start gap-4">
            <div className="p-2 bg-[#C8A96A]/10 rounded-xl text-[#9e7e40] dark:text-[#E2C785] shrink-0">
              <Eye className="w-5 h-5" />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-sm font-semibold text-[#1F1F1F] dark:text-white">Komitmen Privasi Kami</h4>
              <p className="text-xs text-muted-foreground leading-relaxed font-light">
                IKARA berkomitmen penuh untuk melindungi privasi data pribadi Anda. Kami **tidak pernah menjual** informasi pribadi Anda kepada pihak ketiga mana pun. Data Anda hanya digunakan untuk memberikan fungsionalitas dan kualitas layanan pembuatan undangan digital terbaik.
              </p>
            </div>
          </div>

          {/* Sections List */}
          <div className="space-y-10">
            
            {/* Section 1 */}
            <section id="pendahuluan" className="scroll-mt-28 space-y-3.5">
              <div className="flex items-center gap-3">
                <span className="font-heading text-xl font-bold text-[#C8A96A] font-cormorant">01.</span>
                <h3 className="font-heading text-xl font-bold text-[#1F1F1F] dark:text-zinc-100 font-poppins">
                  Pendahuluan
                </h3>
              </div>
              <div className="text-sm text-muted-foreground leading-relaxed font-light space-y-3">
                <p>
                  Kebijakan Privasi ini menjelaskan praktik pengumpulan, pemrosesan, dan penyimpanan data pribadi oleh IKARA ketika Anda mendaftarkan diri, mengunggah informasi acara, atau menggunakan fitur-fitur yang disediakan oleh platform kami.
                </p>
                <p>
                  *Isi penjelasan lengkap mengenai pendahuluan privasi dapat Anda tentukan dan lengkapi kemudian di sini.*
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section id="data-dikumpul" className="scroll-mt-28 space-y-3.5 border-t border-border/50 pt-8">
              <div className="flex items-center gap-3">
                <span className="font-heading text-xl font-bold text-[#C8A96A] font-cormorant">02.</span>
                <h3 className="font-heading text-xl font-bold text-[#1F1F1F] dark:text-zinc-100 font-poppins">
                  Data yang Dikumpulkan
                </h3>
              </div>
              <div className="text-sm text-muted-foreground leading-relaxed font-light space-y-3">
                <p>
                  Data yang kami kumpulkan meliputi informasi pendaftaran akun (nama, email, kata sandi terenkripsi), detail acara pernikahan (nama mempelai, tanggal, lokasi map, cerita cinta), media (foto galeri pre-wedding), dan data transaksi pembayaran.
                </p>
                <p>
                  *Isi penjelasan lengkap mengenai detail data pribadi yang dikumpulkan dapat Anda tentukan dan lengkapi kemudian di sini.*
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section id="penggunaan" className="scroll-mt-28 space-y-3.5 border-t border-border/50 pt-8">
              <div className="flex items-center gap-3">
                <span className="font-heading text-xl font-bold text-[#C8A96A] font-cormorant">03.</span>
                <h3 className="font-heading text-xl font-bold text-[#1F1F1F] dark:text-zinc-100 font-poppins">
                  Penggunaan Informasi
                </h3>
              </div>
              <div className="text-sm text-muted-foreground leading-relaxed font-light space-y-3">
                <p>
                  Kami menggunakan informasi yang dikumpulkan untuk menyajikan halaman undangan digital Anda secara publik, memverifikasi pembayaran Anda, memantau statistik kunjungan tamu, dan mengirim notifikasi status keanggotaan.
                </p>
                <p>
                  *Isi penjelasan lengkap mengenai tujuan penggunaan data dapat Anda tentukan dan lengkapi kemudian di sini.*
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section id="keamanan" className="scroll-mt-28 space-y-3.5 border-t border-border/50 pt-8">
              <div className="flex items-center gap-3">
                <span className="font-heading text-xl font-bold text-[#C8A96A] font-cormorant">04.</span>
                <h3 className="font-heading text-xl font-bold text-[#1F1F1F] dark:text-zinc-100 font-poppins">
                  Keamanan Data
                </h3>
              </div>
              <div className="text-sm text-muted-foreground leading-relaxed font-light space-y-3">
                <p>
                  Kami mengimplementasikan enkripsi kata sandi yang kuat serta proteksi SSL untuk melindungi data Anda dari akses tanpa izin. Kami juga bermitra dengan penyedia database cloud bereputasi tinggi guna menjamin kestabilan penyimpanan data.
                </p>
                <p>
                  *Isi penjelasan lengkap mengenai protokol keamanan data dapat Anda tentukan dan lengkapi kemudian di sini.*
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section id="hak-user" className="scroll-mt-28 space-y-3.5 border-t border-border/50 pt-8">
              <div className="flex items-center gap-3">
                <span className="font-heading text-xl font-bold text-[#C8A96A] font-cormorant">05.</span>
                <h3 className="font-heading text-xl font-bold text-[#1F1F1F] dark:text-zinc-100 font-poppins">
                  Hak Pengguna
                </h3>
              </div>
              <div className="text-sm text-muted-foreground leading-relaxed font-light space-y-3">
                <p>
                  Pengguna memiliki hak penuh untuk mengakses, memperbarui, mengubah informasi pribadi, atau mengajukan permohonan penghapusan akun beserta seluruh konten undangan yang telah diunggah ke server kami.
                </p>
                <p>
                  *Isi penjelasan lengkap mengenai hak-hak kepemilikan data dapat Anda tentukan dan lengkapi kemudian di sini.*
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section id="berbagi-data" className="scroll-mt-28 space-y-3.5 border-t border-border/50 pt-8">
              <div className="flex items-center gap-3">
                <span className="font-heading text-xl font-bold text-[#C8A96A] font-cormorant">06.</span>
                <h3 className="font-heading text-xl font-bold text-[#1F1F1F] dark:text-zinc-100 font-poppins">
                  Pihak Ketiga & Berbagi Data
                </h3>
              </div>
              <div className="text-sm text-muted-foreground leading-relaxed font-light space-y-3">
                <p>
                  Kami tidak membagikan data pribadi Anda dengan pihak ketiga, kecuali dengan penyedia layanan eksternal terpercaya yang membantu kami menjalankan situs (seperti Midtrans untuk pembayaran dan Cloudflare untuk penyimpanan gambar).
                </p>
                <p>
                  *Isi penjelasan lengkap mengenai pihak ketiga dapat Anda tentukan dan lengkapi kemudian di sini.*
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section id="cookies" className="scroll-mt-28 space-y-3.5 border-t border-border/50 pt-8">
              <div className="flex items-center gap-3">
                <span className="font-heading text-xl font-bold text-[#C8A96A] font-cormorant">07.</span>
                <h3 className="font-heading text-xl font-bold text-[#1F1F1F] dark:text-zinc-100 font-poppins">
                  Teknologi Cookie
                </h3>
              </div>
              <div className="text-sm text-muted-foreground leading-relaxed font-light space-y-3">
                <p>
                  Kami menggunakan cookie untuk mengenali sesi masuk Anda pada dashboard, menganalisis performa kunjungan halaman publik, dan meningkatkan kenyamanan antarmuka pengguna saat bernavigasi di situs kami.
                </p>
                <p>
                  *Isi penjelasan lengkap mengenai penggunaan cookie dapat Anda tentukan dan lengkapi kemudian di sini.*
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section id="kontak" className="scroll-mt-28 space-y-3.5 border-t border-border/50 pt-8">
              <div className="flex items-center gap-3">
                <span className="font-heading text-xl font-bold text-[#C8A96A] font-cormorant">08.</span>
                <h3 className="font-heading text-xl font-bold text-[#1F1F1F] dark:text-zinc-100 font-poppins">
                  Kontak & Keluhan
                </h3>
              </div>
              <div className="text-sm text-muted-foreground leading-relaxed font-light space-y-3">
                <p>
                  Jika Anda memiliki pertanyaan, saran, atau keluhan terkait dengan kebijakan privasi data pribadi ini, Anda dapat menghubungi kami melalui email support kami di asepsutrisnasp@gmail.com atau melalui kontak WhatsApp CS kami.
                </p>
                <p>
                  *Isi penjelasan lengkap mengenai saluran aduan privasi data dapat Anda tentukan dan lengkapi kemudian di sini.*
                </p>
              </div>
            </section>

          </div>
        </article>
      </main>

      <Footer />
      <WhatsAppButton phoneNumber={whatsappNumber} />
    </div>
  );
}
