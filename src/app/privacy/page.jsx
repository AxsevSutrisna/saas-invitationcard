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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C8A96A]/10 border border-[#C8A96A]/20 text-[#9e7e40] dark:text-[#E2C785] text-[12px] font-bold uppercase tracking-widest font-poppins">
            <ShieldCheck className="w-4 h-4" />
            Perlindungan Data
          </div>
          <h1 className="font-heading text-[36px] sm:text-[48px] font-bold tracking-tight text-[#1F1F1F] dark:text-zinc-50 font-cormorant leading-tight">
            Kebijakan Privasi
          </h1>
          <p className="text-[16px] sm:text-[20px] text-muted-foreground max-w-xl mx-auto font-light leading-relaxed font-sans">
            Bagaimana kami mengumpulkan, menggunakan, menyimpan, dan melindungi data pribadi Anda secara bertanggung jawab.
          </p>
          <div className="pt-2 text-[12px] text-muted-foreground/80 flex items-center justify-center gap-4 font-light font-sans">
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
            <h4 className="text-[12px] font-bold text-foreground uppercase tracking-wider mb-4 font-poppins">
              Navigasi Cepat
            </h4>
            <nav className="flex flex-col gap-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.id}
                  href={`#${item.id}`}
                  className="text-[12px] text-muted-foreground hover:text-[#C8A96A] hover:translate-x-1 transition-all py-1.5 font-light block border-b border-border/30 last:border-0 font-poppins"
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
              <h4 className="text-[16px] font-semibold text-[#1F1F1F] dark:text-white font-poppins">Komitmen Privasi Kami</h4>
              <p className="text-[12px] sm:text-[16px] text-muted-foreground leading-relaxed font-light font-sans">
                IKARA berkomitmen penuh untuk melindungi privasi data pribadi Anda. Kami <strong className="font-semibold text-foreground">tidak pernah menjual atau menyewakan</strong> informasi pribadi Anda kepada pihak ketiga mana pun. Data Anda hanya digunakan secara profesional untuk memberikan fungsi dan kualitas layanan pembuatan undangan digital terbaik.
              </p>
            </div>
          </div>

          {/* Sections List */}
          <div className="space-y-10">
            
            {/* Section 1 */}
            <section id="pendahuluan" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3">
                <span className="font-heading text-[20px] sm:text-[24px] font-bold text-[#C8A96A] font-cormorant">01.</span>
                <h3 className="font-heading text-[20px] sm:text-[24px] font-bold text-[#1F1F1F] dark:text-zinc-100 font-poppins">
                  Pendahuluan
                </h3>
              </div>
              <div className="text-[16px] text-muted-foreground leading-relaxed font-light space-y-4 font-sans">
                <p>
                  Kebijakan Privasi ini menjelaskan prinsip dan tata cara platform <strong className="font-semibold text-foreground">IKARA</strong> dalam mengumpulkan, mengolah, menyimpan, dan melindungi informasi pribadi pengguna saat Anda membuat akun, mengunggah data pernikahan, atau mengakses halaman undangan kami.
                </p>
                <p>
                  Dengan menggunakan layanan IKARA, Anda memberikan persetujuan terhadap praktik pemrosesan data sebagaimana diuraikan dalam dokumen ini. Kebijakan ini dibuat sebagai wujud transparansi dan kepatuhan kami terhadap regulasi perlindungan data pribadi yang berlaku.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section id="data-dikumpul" className="scroll-mt-28 space-y-4 border-t border-border/50 pt-8">
              <div className="flex items-center gap-3">
                <span className="font-heading text-[20px] sm:text-[24px] font-bold text-[#C8A96A] font-cormorant">02.</span>
                <h3 className="font-heading text-[20px] sm:text-[24px] font-bold text-[#1F1F1F] dark:text-zinc-100 font-poppins">
                  Data yang Dikumpulkan
                </h3>
              </div>
              <div className="text-[16px] text-muted-foreground leading-relaxed font-light space-y-4 font-sans">
                <p>
                  Untuk memberikan layanan undangan digital yang interaktif dan memikat, kami mengumpulkan jenis informasi berikut:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-[16px] text-muted-foreground">
                  <li><strong className="font-semibold text-foreground">Informasi Akun:</strong> Nama pengguna, alamat email, dan kata sandi yang telah terenkripsi secara aman saat pendaftaran.</li>
                  <li><strong className="font-semibold text-foreground">Detail Acara Pernikahan:</strong> Nama mempelai pria dan wanita, nama orang tua, tanggal dan waktu akad/resepsi, lokasi acara, serta tautan petunjuk arah Google Maps.</li>
                  <li><strong className="font-semibold text-foreground">Konten Media & Storytelling:</strong> Foto album <em className="italic">pre-wedding</em>, berkas video, dan narasi teks perjalanan cinta (<em className="italic">Love Story</em>).</li>
                  <li><strong className="font-semibold text-foreground">Data Amplop Digital:</strong> Nomor rekening bank, nama pemilik rekening, atau gambar kode QRIS untuk penerimaan hadiah pernikahan.</li>
                  <li><strong className="font-semibold text-foreground">Data Konfirmasi Tamu (RSVP) & Ucapan:</strong> Nama tamu undangan, konfirmasi kehadiran, jumlah tamu yang hadir, serta pesan doa restu yang dikirimkan melalui undangan Anda.</li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section id="penggunaan" className="scroll-mt-28 space-y-4 border-t border-border/50 pt-8">
              <div className="flex items-center gap-3">
                <span className="font-heading text-[20px] sm:text-[24px] font-bold text-[#C8A96A] font-cormorant">03.</span>
                <h3 className="font-heading text-[20px] sm:text-[24px] font-bold text-[#1F1F1F] dark:text-zinc-100 font-poppins">
                  Penggunaan Informasi
                </h3>
              </div>
              <div className="text-[16px] text-muted-foreground leading-relaxed font-light space-y-4 font-sans">
                <p>
                  Informasi yang dikumpulkan oleh IKARA digunakan khusus untuk tujuan profesional berikut:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-[16px] text-muted-foreground">
                  <li>Menayangkan halaman undangan digital interaktif milik Anda sesuai dengan sub-domain/tautan publik yang dikustomisasi.</li>
                  <li>Memproses verifikasi transaksi pembayaran paket layanan melalui gerbang pembayaran tepercaya (<strong className="font-semibold text-foreground">Midtrans</strong>).</li>
                  <li>Menyediakan statistik rekapitulasi jumlah tamu yang memberikan ucapan dan konfirmasi kehadiran di panel dasbor pengguna.</li>
                  <li>Mengirimkan pemberitahuan penting terkait status akun, pembaruan keamanan, atau bantuan teknis dari tim dukungan.</li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section id="keamanan" className="scroll-mt-28 space-y-4 border-t border-border/50 pt-8">
              <div className="flex items-center gap-3">
                <span className="font-heading text-[20px] sm:text-[24px] font-bold text-[#C8A96A] font-cormorant">04.</span>
                <h3 className="font-heading text-[20px] sm:text-[24px] font-bold text-[#1F1F1F] dark:text-zinc-100 font-poppins">
                  Keamanan Data
                </h3>
              </div>
              <div className="text-[16px] text-muted-foreground leading-relaxed font-light space-y-4 font-sans">
                <p>
                  Keamanan data Anda adalah prioritas utama bagi IKARA. Kami menerapkan langkah-langkah perlindungan teknis dan organisasi yang ketat:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-[16px] text-muted-foreground">
                  <li>Enkripsi kata sandi menggunakan standar pemangkasan (<em className="italic">hashing</em>) industri yang aman.</li>
                  <li>Penggunaan protokol komunikasi terenkripsi SSL/TLS (HTTPS) 256-bit untuk seluruh pertukaran data pada situs kami.</li>
                  <li>Penyimpanan berkas media pada infrastruktur <em className="italic">cloud storage</em> aman dengan proteksi firewall dan kontrol akses berlapis.</li>
                </ul>
              </div>
            </section>

            {/* Section 5 */}
            <section id="hak-user" className="scroll-mt-28 space-y-4 border-t border-border/50 pt-8">
              <div className="flex items-center gap-3">
                <span className="font-heading text-[20px] sm:text-[24px] font-bold text-[#C8A96A] font-cormorant">05.</span>
                <h3 className="font-heading text-[20px] sm:text-[24px] font-bold text-[#1F1F1F] dark:text-zinc-100 font-poppins">
                  Hak Pengguna
                </h3>
              </div>
              <div className="text-[16px] text-muted-foreground leading-relaxed font-light space-y-4 font-sans">
                <p>
                  Sebagai pemilik data pribadi, Anda memiliki hak-hak berikut atas informasi yang tersimpan di platform IKARA:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-[16px] text-muted-foreground">
                  <li><strong className="font-semibold text-foreground">Hak Mengakses & Mengubah:</strong> Anda dapat memperbarui data pribadi, foto, dan informasi acara kapan saja melalui panel dasbor pengguna.</li>
                  <li><strong className="font-semibold text-foreground">Hak Mengunduh Rekap:</strong> Anda berhak mengunduh data konfirmasi kehadiran tamu (RSVP) serta daftar ucapan doa restu.</li>
                  <li><strong className="font-semibold text-foreground">Hak Penghapusan Permanen:</strong> Anda berhak mengajukan permohonan penghapusan akun secara permanen beserta seluruh berkas media yang terkait dari server IKARA.</li>
                </ul>
              </div>
            </section>

            {/* Section 6 */}
            <section id="berbagi-data" className="scroll-mt-28 space-y-4 border-t border-border/50 pt-8">
              <div className="flex items-center gap-3">
                <span className="font-heading text-[20px] sm:text-[24px] font-bold text-[#C8A96A] font-cormorant">06.</span>
                <h3 className="font-heading text-[20px] sm:text-[24px] font-bold text-[#1F1F1F] dark:text-zinc-100 font-poppins">
                  Pihak Ketiga & Berbagi Data
                </h3>
              </div>
              <div className="text-[16px] text-muted-foreground leading-relaxed font-light space-y-4 font-sans">
                <p>
                  IKARA tidak menjual atau memperjualbelikan data Anda kepada broker data atau jaringan iklan pihak ketiga. Kami hanya membagikan data kepada mitra infrastruktur terpercaya yang membantu operasional sistem kami:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-[16px] text-muted-foreground">
                  <li><strong className="font-semibold text-foreground">Penyedia Gerbang Pembayaran:</strong> Pembayaran diproses oleh <strong className="font-semibold text-foreground">Midtrans</strong> yang memiliki lisensi resmi Bank Indonesia.</li>
                  <li><strong className="font-semibold text-foreground">Penyedia Infrastruktur Cloud & CDN:</strong> Untuk optimasi kecepatan penayangan media foto/video dan stabilitas jaringan server.</li>
                  <li><strong className="font-semibold text-foreground">Kepatuhan Hukum:</strong> Kami hanya akan memberikan informasi jika diwajibkan oleh proses hukum resmi yang sah berdasarkan undang-undang Republik Indonesia.</li>
                </ul>
              </div>
            </section>

            {/* Section 7 */}
            <section id="cookies" className="scroll-mt-28 space-y-4 border-t border-border/50 pt-8">
              <div className="flex items-center gap-3">
                <span className="font-heading text-[20px] sm:text-[24px] font-bold text-[#C8A96A] font-cormorant">07.</span>
                <h3 className="font-heading text-[20px] sm:text-[24px] font-bold text-[#1F1F1F] dark:text-zinc-100 font-poppins">
                  Teknologi Cookie
                </h3>
              </div>
              <div className="text-[16px] text-muted-foreground leading-relaxed font-light space-y-4 font-sans">
                <p>
                  IKARA menggunakan teknologi <em className="italic">cookie</em> dan penyimpanan lokal (<em className="italic">Local Storage</em>) untuk menjaga kontinuitas sesi masuk Anda pada dasbor dan menyimpan preferensi antarmuka pengguna.
                </p>
                <p>
                  Kami tidak menggunakan <em className="italic">cookie</em> penelusuran lintas situs (<em className="italic">cross-site tracking cookies</em>) untuk kepentingan pengiklanan invasif. Anda dapat mengatur peramban web Anda untuk menolak <em className="italic">cookie</em>, namun beberapa fitur dasbor mungkin tidak berfungsi secara optimal tanpa <em className="italic">cookie</em> sesi.
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section id="kontak" className="scroll-mt-28 space-y-4 border-t border-border/50 pt-8">
              <div className="flex items-center gap-3">
                <span className="font-heading text-[20px] sm:text-[24px] font-bold text-[#C8A96A] font-cormorant">08.</span>
                <h3 className="font-heading text-[20px] sm:text-[24px] font-bold text-[#1F1F1F] dark:text-zinc-100 font-poppins">
                  Kontak & Keluhan
                </h3>
              </div>
              <div className="text-[16px] text-muted-foreground leading-relaxed font-light space-y-4 font-sans">
                <p>
                  Jika Anda memiliki pertanyaan, saran, atau ingin mengajukan permohonan terkait perlindungan data pribadi dan privasi Anda di IKARA, silakan hubungi tim dukungan kami melalui saluran berikut:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-[16px] text-muted-foreground">
                  <li><strong className="font-semibold text-foreground">Layanan Pelanggan WhatsApp:</strong> Kontak CS resmi pada tombol WhatsApp di situs ini.</li>
                  <li><strong className="font-semibold text-foreground">Pusat Bantuan Dasbor:</strong> Tiket dukungan teknis pada panel dasbor pengguna IKARA.</li>
                </ul>
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
