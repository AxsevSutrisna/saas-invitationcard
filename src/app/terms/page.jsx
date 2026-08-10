import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { db } from "@/lib/db";
import { Scale, Shield } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Syarat & Ketentuan — IKARA",
  description: "Ketentuan dan aturan penggunaan platform undangan digital digital storytelling IKARA.",
};

export default async function TermsPage() {
  const whatsappSetting = await db.systemSetting.findUnique({
    where: { key: "CS_WHATSAPP_NUMBER" },
  });
  const whatsappNumber = whatsappSetting?.value || "6281234567890";

  const navigationItems = [
    { id: "penerimaan", label: "Penerimaan Syarat" },
    { id: "layanan", label: "Deskripsi Layanan" },
    { id: "akun", label: "Keamanan Akun" },
    { id: "pembayaran", label: "Metode Pembayaran" },
    { id: "konten", label: "Kebijakan Konten" },
    { id: "hak-cipta", label: "Hak Kekayaan Intelektual" },
    { id: "larangan", label: "Larangan & Penyalahgunaan" },
    { id: "penghentian", label: "Penghentian Layanan" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F6F2] dark:bg-[#191919] text-foreground font-sans selection:bg-[#C8A96A]/20 selection:text-[#C8A96A]">
      <Navbar />
      
      {/* Editorial Header Banner */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-20 overflow-hidden bg-gradient-to-b from-[#e8dec6]/30 to-transparent dark:from-zinc-800/10">
        <div className="absolute inset-0 bg-[radial-gradient(#C8A96A_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.07] pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C8A96A]/10 border border-[#C8A96A]/20 text-[#9e7e40] dark:text-[#E2C785] text-[10px] font-bold uppercase tracking-widest">
            <Scale className="w-3.5 h-3.5" />
            Dokumen Hukum
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight text-[#1F1F1F] dark:text-zinc-50 font-cormorant">
            Syarat & Ketentuan
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto font-light leading-relaxed">
            Ketentuan penggunaan yang mengatur hubungan antara Anda sebagai pengguna dan platform IKARA.
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
          {/* Important Notice Box */}
          <div className="p-6 rounded-3xl bg-[#C8A96A]/5 dark:bg-[#C8A96A]/2 border border-[#C8A96A]/20 flex items-start gap-4">
            <div className="p-2 bg-[#C8A96A]/10 rounded-xl text-[#9e7e40] dark:text-[#E2C785] shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-sm font-semibold text-[#1F1F1F] dark:text-white">Pemberitahuan Penting</h4>
              <p className="text-xs text-muted-foreground leading-relaxed font-light">
                Dengan membuat akun atau menggunakan layanan IKARA, Anda menyatakan telah membaca, memahami, dan menyetujui seluruh isi Syarat & Ketentuan ini. Jika Anda tidak menyetujui salah satu poin di dalamnya, mohon untuk tidak melanjutkan penggunaan platform ini.
              </p>
            </div>
          </div>

          {/* Sections List */}
          <div className="space-y-10">
            
            {/* Section 1 */}
            <section id="penerimaan" className="scroll-mt-28 space-y-3.5">
              <div className="flex items-center gap-3">
                <span className="font-heading text-xl font-bold text-[#C8A96A] font-cormorant">01.</span>
                <h3 className="font-heading text-xl font-bold text-[#1F1F1F] dark:text-zinc-100 font-poppins">
                  Penerimaan Syarat
                </h3>
              </div>
              <div className="text-sm text-muted-foreground leading-relaxed font-light space-y-3">
                <p>
                  Perjanjian ini mengatur akses dan penggunaan Anda terhadap platform IKARA ("Kami", "Platform") yang dimiliki oleh Asep Sutrisna Suhada Putra. Dengan menggunakan layanan kami dalam bentuk apa pun, Anda dianggap secara sadar dan sukarela telah mengikatkan diri dalam kontrak hukum yang sah ini.
                </p>
                <p>
                  *Isi penjelasan lengkap mengenai detail penerimaan syarat dapat Anda tentukan dan lengkapi kemudian di sini.*
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section id="layanan" className="scroll-mt-28 space-y-3.5 border-t border-border/50 pt-8">
              <div className="flex items-center gap-3">
                <span className="font-heading text-xl font-bold text-[#C8A96A] font-cormorant">02.</span>
                <h3 className="font-heading text-xl font-bold text-[#1F1F1F] dark:text-zinc-100 font-poppins">
                  Deskripsi Layanan
                </h3>
              </div>
              <div className="text-sm text-muted-foreground leading-relaxed font-light space-y-3">
                <p>
                  IKARA menyediakan layanan pembuatan undangan digital berbasis web yang interaktif dengan fitur *storytelling* (kisah cinta), album galeri foto/video, RSVP tamu undangan, amplop digital kado nikah, dan pemutar musik latar belakang.
                </p>
                <p>
                  *Isi penjelasan lengkap mengenai detail spesifikasi layanan dapat Anda tentukan dan lengkapi kemudian di sini.*
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section id="akun" className="scroll-mt-28 space-y-3.5 border-t border-border/50 pt-8">
              <div className="flex items-center gap-3">
                <span className="font-heading text-xl font-bold text-[#C8A96A] font-cormorant">03.</span>
                <h3 className="font-heading text-xl font-bold text-[#1F1F1F] dark:text-zinc-100 font-poppins">
                  Keamanan Akun
                </h3>
              </div>
              <div className="text-sm text-muted-foreground leading-relaxed font-light space-y-3">
                <p>
                  Pengguna bertanggung jawab penuh untuk menjaga kerahasiaan informasi login (email dan sandi), serta memegang kendali atas setiap aktivitas yang dilakukan di bawah akun terdaftar tersebut.
                </p>
                <p>
                  *Isi penjelasan lengkap mengenai tanggung jawab akun dapat Anda tentukan dan lengkapi kemudian di sini.*
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section id="pembayaran" className="scroll-mt-28 space-y-3.5 border-t border-border/50 pt-8">
              <div className="flex items-center gap-3">
                <span className="font-heading text-xl font-bold text-[#C8A96A] font-cormorant">04.</span>
                <h3 className="font-heading text-xl font-bold text-[#1F1F1F] dark:text-zinc-100 font-poppins">
                  Metode Pembayaran
                </h3>
              </div>
              <div className="text-sm text-muted-foreground leading-relaxed font-light space-y-3">
                <p>
                  IKARA menggunakan penyedia gerbang pembayaran pihak ketiga yang berlisensi (**Midtrans**) untuk memproses transaksi paket premium secara aman. Semua pembayaran bersifat final dan tidak dapat dikembalikan.
                </p>
                <p>
                  *Isi penjelasan lengkap mengenai detail ketentuan refund dan tagihan dapat Anda tentukan dan lengkapi kemudian di sini.*
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section id="konten" className="scroll-mt-28 space-y-3.5 border-t border-border/50 pt-8">
              <div className="flex items-center gap-3">
                <span className="font-heading text-xl font-bold text-[#C8A96A] font-cormorant">05.</span>
                <h3 className="font-heading text-xl font-bold text-[#1F1F1F] dark:text-zinc-100 font-poppins">
                  Kebijakan Konten
                </h3>
              </div>
              <div className="text-sm text-muted-foreground leading-relaxed font-light space-y-3">
                <p>
                  Pengguna memegang hak cipta atas konten pribadi (foto, teks kisah cinta) yang diunggah ke platform. Namun, pengguna memberikan hak non-eksklusif bagi sistem IKARA untuk menayangkan konten tersebut pada URL undangan yang dibuat.
                </p>
                <p>
                  *Isi penjelasan lengkap mengenai hak atas konten dapat Anda tentukan dan lengkapi kemudian di sini.*
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section id="hak-cipta" className="scroll-mt-28 space-y-3.5 border-t border-border/50 pt-8">
              <div className="flex items-center gap-3">
                <span className="font-heading text-xl font-bold text-[#C8A96A] font-cormorant">06.</span>
                <h3 className="font-heading text-xl font-bold text-[#1F1F1F] dark:text-zinc-100 font-poppins">
                  Hak Kekayaan Intelektual
                </h3>
              </div>
              <div className="text-sm text-muted-foreground leading-relaxed font-light space-y-3">
                <p>
                  Seluruh kode sumber, desain template, grafis ornamen, logo, tulisan, dan aset platform IKARA merupakan kekayaan intelektual milik IKARA yang dilindungi undang-undang dan dilarang untuk disalin tanpa izin tertulis.
                </p>
                <p>
                  *Isi penjelasan lengkap mengenai hak cipta visual template dapat Anda tentukan dan lengkapi kemudian di sini.*
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section id="larangan" className="scroll-mt-28 space-y-3.5 border-t border-border/50 pt-8">
              <div className="flex items-center gap-3">
                <span className="font-heading text-xl font-bold text-[#C8A96A] font-cormorant">07.</span>
                <h3 className="font-heading text-xl font-bold text-[#1F1F1F] dark:text-zinc-100 font-poppins">
                  Larangan & Penyalahgunaan
                </h3>
              </div>
              <div className="text-sm text-muted-foreground leading-relaxed font-light space-y-3">
                <p>
                  Pengguna dilarang keras mengunggah konten yang mengandung pornografi, SARA, perjudian, pencemaran nama baik, pelecehan, atau konten penipuan berkedok sumbangan di undangan.
                </p>
                <p>
                  *Isi penjelasan lengkap mengenai daftar larangan penggunaan dapat Anda tentukan dan lengkapi kemudian di sini.*
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section id="penghentian" className="scroll-mt-28 space-y-3.5 border-t border-border/50 pt-8">
              <div className="flex items-center gap-3">
                <span className="font-heading text-xl font-bold text-[#C8A96A] font-cormorant">08.</span>
                <h3 className="font-heading text-xl font-bold text-[#1F1F1F] dark:text-zinc-100 font-poppins">
                  Penghentian Layanan
                </h3>
              </div>
              <div className="text-sm text-muted-foreground leading-relaxed font-light space-y-3">
                <p>
                  IKARA berhak untuk menangguhkan, memblokir, atau menghapus akun dan halaman undangan pengguna secara sepihak jika ditemukan pelanggaran terhadap aturan Syarat & Ketentuan ini tanpa adanya kewajiban pengembalian dana.
                </p>
                <p>
                  *Isi penjelasan lengkap mengenai pemutusan akses dapat Anda tentukan dan lengkapi kemudian di sini.*
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
