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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C8A96A]/10 border border-[#C8A96A]/20 text-[#9e7e40] dark:text-[#E2C785] text-[12px] font-bold uppercase tracking-widest font-poppins">
            <Scale className="w-4 h-4" />
            Dokumen Hukum
          </div>
          <h1 className="font-heading text-[36px] sm:text-[48px] font-bold tracking-tight text-[#1F1F1F] dark:text-zinc-50 font-cormorant leading-tight">
            Syarat & Ketentuan
          </h1>
          <p className="text-[16px] sm:text-[20px] text-muted-foreground max-w-xl mx-auto font-light leading-relaxed font-sans">
            Ketentuan penggunaan yang mengatur hubungan antara Anda sebagai pengguna dan platform IKARA.
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
          {/* Important Notice Box */}
          <div className="p-6 rounded-3xl bg-[#C8A96A]/5 dark:bg-[#C8A96A]/2 border border-[#C8A96A]/20 flex items-start gap-4">
            <div className="p-2 bg-[#C8A96A]/10 rounded-xl text-[#9e7e40] dark:text-[#E2C785] shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-[16px] font-semibold text-[#1F1F1F] dark:text-white font-poppins">Pemberitahuan Penting</h4>
              <p className="text-[12px] sm:text-[16px] text-muted-foreground leading-relaxed font-light font-sans">
                Dengan membuat akun atau menggunakan layanan IKARA, Anda menyatakan telah membaca, memahami, dan menyetujui seluruh isi Syarat & Ketentuan ini. Jika Anda tidak menyetujui salah satu poin di dalamnya, mohon untuk tidak melanjutkan penggunaan platform ini.
              </p>
            </div>
          </div>

          {/* Sections List */}
          <div className="space-y-10">
            
            {/* Section 1 */}
            <section id="penerimaan" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3">
                <span className="font-heading text-[20px] sm:text-[24px] font-bold text-[#C8A96A] font-cormorant">01.</span>
                <h3 className="font-heading text-[20px] sm:text-[24px] font-bold text-[#1F1F1F] dark:text-zinc-100 font-poppins">
                  Penerimaan Syarat
                </h3>
              </div>
              <div className="text-[16px] text-muted-foreground leading-relaxed font-light space-y-4 font-sans">
                <p>
                  Perjanjian ini mengatur akses dan penggunaan Anda terhadap platform <strong className="font-semibold text-foreground">IKARA</strong> ("Kami", "Platform"). Dengan mendaftar, mengakses, membuat undangan digital, atau memanfaatkan layanan kami dalam bentuk apa pun, Anda dianggap secara sadar, jujur, dan sukarela telah membaca, memahami, serta menyetujui untuk mengikatkan diri pada seluruh Syarat & Ketentuan ini.
                </p>
                <p>
                  Apabila Anda mendaftarkan akun atas nama pihak ketiga (seperti pasangan, keluarga, atau agen <em className="italic">wedding organizer</em>), Anda menjamin bahwa Anda memiliki wewenang hukum yang sah untuk mengikatkan pihak tersebut pada ketentuan ini. Jika Anda tidak menyetujui salah satu bagian dari ketentuan ini, Anda tidak diperkenankan untuk melanjutkan penggunaan platform IKARA.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section id="layanan" className="scroll-mt-28 space-y-4 border-t border-border/50 pt-8">
              <div className="flex items-center gap-3">
                <span className="font-heading text-[20px] sm:text-[24px] font-bold text-[#C8A96A] font-cormorant">02.</span>
                <h3 className="font-heading text-[20px] sm:text-[24px] font-bold text-[#1F1F1F] dark:text-zinc-100 font-poppins">
                  Deskripsi Layanan
                </h3>
              </div>
              <div className="text-[16px] text-muted-foreground leading-relaxed font-light space-y-4 font-sans">
                <p>
                  IKARA merupakan platform penyedia layanan pembuatan undangan pernikahan digital berbasis web interaktif yang mengedepankan estetika visual, kenyamanan pengguna, dan konsep <em className="italic">digital storytelling</em>. Layanan yang kami sediakan meliputi:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-[16px] text-muted-foreground">
                  <li>Pemilihan dan kustomisasi tema visual editorial premium (tipografi, skema warna, dan musik latar belakang).</li>
                  <li>Fitur penulisan kisah cinta (<em className="italic">Love Story Timeline</em>) dan narasi momen momen spesial mempelai.</li>
                  <li>Pengunggahan galeri foto dan video <em className="italic">pre-wedding</em> beresolusi tinggi.</li>
                  <li>Manajemen konfirmasi kehadiran tamu (RSVP), ucapan, serta doa restu digital.</li>
                  <li>Modul Amplop Digital & Hadiah Pernikahan (integrasi nomor rekening bank dan QRIS pembayaran).</li>
                  <li>Integrasi alamat lokasi acara dengan Google Maps, penghitung waktu (<em className="italic">countdown timer</em>), dan pembagian undangan via WhatsApp.</li>
                </ul>
                <p>
                  IKARA berhak untuk memperbarui, mengubah, menambah, atau membatasi fitur layanan dari waktu ke waktu demi menjaga keandalan performa server dan meningkatkan kualitas pengalaman pengguna.
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section id="akun" className="scroll-mt-28 space-y-4 border-t border-border/50 pt-8">
              <div className="flex items-center gap-3">
                <span className="font-heading text-[20px] sm:text-[24px] font-bold text-[#C8A96A] font-cormorant">03.</span>
                <h3 className="font-heading text-[20px] sm:text-[24px] font-bold text-[#1F1F1F] dark:text-zinc-100 font-poppins">
                  Keamanan Akun
                </h3>
              </div>
              <div className="text-[16px] text-muted-foreground leading-relaxed font-light space-y-4 font-sans">
                <p>
                  Saat mendaftar di IKARA, Anda diwajibkan untuk memberikan informasi alamat email yang valid dan membuat kata sandi yang aman. Anda bertanggung jawab penuh untuk menjaga kerahasiaan kredensial akun Anda dan bertanggung jawab penuh atas segala aktivitas yang terjadi di bawah akun terdaftar tersebut.
                </p>
                <p>
                  Anda setuju untuk segera memberitahukan tim dukungan IKARA jika mengetahui adanya penggunaan tanpa izin atas akun Anda atau bentuk pelanggaran keamanan lainnya. IKARA tidak bertanggung jawab atas kerugian atau kerusakan yang timbul akibat kelalaian Anda dalam menjaga kerahasiaan akun. Akun terdaftar bersifat pribadi dan tidak boleh diperjualbelikan atau dipindahtangankan kepada pihak lain tanpa persetujuan tertulis dari IKARA.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section id="pembayaran" className="scroll-mt-28 space-y-4 border-t border-border/50 pt-8">
              <div className="flex items-center gap-3">
                <span className="font-heading text-[20px] sm:text-[24px] font-bold text-[#C8A96A] font-cormorant">04.</span>
                <h3 className="font-heading text-[20px] sm:text-[24px] font-bold text-[#1F1F1F] dark:text-zinc-100 font-poppins">
                  Metode Pembayaran
                </h3>
              </div>
              <div className="text-[16px] text-muted-foreground leading-relaxed font-light space-y-4 font-sans">
                <p>
                  Layanan pengaktifan paket undangan digital di IKARA diproses melalui gerbang pembayaran (<em className="italic">payment gateway</em>) pihak ketiga yang aman dan terverifikasi (<strong className="font-semibold text-foreground">Midtrans</strong>). Dengan melakukan transaksi pembayaran di IKARA, Anda menyetujui ketentuan berikut:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-[16px] text-muted-foreground">
                  <li>Seluruh harga yang tertera dalam nominal Rupiah (IDR) merupakan harga final sesuai dengan paket yang dipilih.</li>
                  <li>Pembayaran yang telah berhasil diverifikasi oleh sistem bersifat <strong className="font-semibold text-foreground">final dan tidak dapat dikembalikan (<em className="italic">non-refundable</em>)</strong>, kecuali terjadi kelalaian teknis permanen pada server IKARA yang mengakibatkan undangan gagal dipublikasikan.</li>
                  <li>Layanan undangan akan aktif secara otomatis atau diproses setelah konfirmasi pembayaran diterima oleh sistem.</li>
                  <li>IKARA berhak mengubah tarif paket layanan sewaktu-waktu. Perubahan harga tidak akan memengaruhi transaksi yang telah diselesaikan sebelumnya.</li>
                </ul>
              </div>
            </section>

            {/* Section 5 */}
            <section id="konten" className="scroll-mt-28 space-y-4 border-t border-border/50 pt-8">
              <div className="flex items-center gap-3">
                <span className="font-heading text-[20px] sm:text-[24px] font-bold text-[#C8A96A] font-cormorant">05.</span>
                <h3 className="font-heading text-[20px] sm:text-[24px] font-bold text-[#1F1F1F] dark:text-zinc-100 font-poppins">
                  Kebijakan Konten
                </h3>
              </div>
              <div className="text-[16px] text-muted-foreground leading-relaxed font-light space-y-4 font-sans">
                <p>
                  Pengguna mempertahankan seluruh hak kepemilikan dan hak cipta atas materi pribadi (termasuk foto <em className="italic">pre-wedding</em>, teks cerita cinta, rekaman suara, serta detail acara) yang diunggah ke dalam platform IKARA.
                </p>
                <p>
                  Dengan mengunggah konten tersebut, Anda memberikan lisensi terbatas, non-eksklusif, bebas royalti, dan berlaku secara global kepada IKARA semata-mata untuk keperluan penyimpanan, pemrosesan teknis, penayangan pada domain/subdomain undangan Anda, serta pemeliharaan sistem. Anda menjamin bahwa Anda memiliki hak atau izin resmi atas semua materi yang Anda unggah ke IKARA.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section id="hak-cipta" className="scroll-mt-28 space-y-4 border-t border-border/50 pt-8">
              <div className="flex items-center gap-3">
                <span className="font-heading text-[20px] sm:text-[24px] font-bold text-[#C8A96A] font-cormorant">06.</span>
                <h3 className="font-heading text-[20px] sm:text-[24px] font-bold text-[#1F1F1F] dark:text-zinc-100 font-poppins">
                  Hak Kekayaan Intelektual
                </h3>
              </div>
              <div className="text-[16px] text-muted-foreground leading-relaxed font-light space-y-4 font-sans">
                <p>
                  Seluruh aset visual, desain tata letak (<em className="italic">layout</em>), kombinasi warna, tipografi editorial, grafis ornamen, logo, nama merek "IKARA", kode sumber (<em className="italic">source code</em>), dan arsitektur platform merupakan hak kekayaan intelektual milik <strong className="font-semibold text-foreground">IKARA</strong> yang dilindungi oleh Undang-Undang Hak Cipta Republik Indonesia dan hukum internasional.
                </p>
                <p>
                  Pengguna dilarang keras menduplikasi, menyalin, menjual kembali, mendistribusikan ulang, melakukan <em className="italic">reverse engineering</em>, atau memanfaatkan komponen tata letak visual IKARA untuk kepentingan komersial pihak lain tanpa izin tertulis secara resmi dari kami.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section id="larangan" className="scroll-mt-28 space-y-4 border-t border-border/50 pt-8">
              <div className="flex items-center gap-3">
                <span className="font-heading text-[20px] sm:text-[24px] font-bold text-[#C8A96A] font-cormorant">07.</span>
                <h3 className="font-heading text-[20px] sm:text-[24px] font-bold text-[#1F1F1F] dark:text-zinc-100 font-poppins">
                  Larangan & Penyalahgunaan
                </h3>
              </div>
              <div className="text-[16px] text-muted-foreground leading-relaxed font-light space-y-4 font-sans">
                <p>
                  Dalam menggunakan platform IKARA, Anda secara tegas dilarang untuk melakukan hal-hal berikut:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-[16px] text-muted-foreground">
                  <li>Mengunggah atau menampilkan konten yang memuat unsur pornografi, ketelanjangan, perjudian online, ujaran kebencian (SARA), kekerasan, atau fitnah.</li>
                  <li>Menggunakan fitur Amplop Digital / Rekening untuk tindakan penipuan, penggalangan dana ilegal, pencucian uang, atau pengelabuan (<em className="italic">phishing</em>).</li>
                  <li>Melakukan aktivitas pengiriman pesan <em className="italic">spam</em> berbasis bot atau mengunggah skrip jahat (<em className="italic">malware/virus</em>) yang berpotensi merusak infrastruktur IKARA.</li>
                  <li>Mengakses bagian sistem yang tidak terbuka untuk umum atau mencoba menembus celah keamanan jaringan IKARA.</li>
                </ul>
              </div>
            </section>

            {/* Section 8 */}
            <section id="penghentian" className="scroll-mt-28 space-y-4 border-t border-border/50 pt-8">
              <div className="flex items-center gap-3">
                <span className="font-heading text-[20px] sm:text-[24px] font-bold text-[#C8A96A] font-cormorant">08.</span>
                <h3 className="font-heading text-[20px] sm:text-[24px] font-bold text-[#1F1F1F] dark:text-zinc-100 font-poppins">
                  Penghentian Layanan
                </h3>
              </div>
              <div className="text-[16px] text-muted-foreground leading-relaxed font-light space-y-4 font-sans">
                <p>
                  IKARA berhak untuk membatasi, menangguhkan (<em className="italic">suspend</em>), atau menghapus secara permanen akses akun serta halaman undangan digital Anda secara sepihak dan tanpa pemberitahuan sebelumnya apabila terbukti terjadi pelanggaran terhadap poin-poin Syarat & Ketentuan ini.
                </p>
                <p>
                  Penangguhan atau penghapusan akun akibat pelanggaran hukum maupun penyalahgunaan platform tidak memberikan hak kepada pengguna untuk menuntut ganti rugi atau pengembalian dana (<em className="italic">refund</em>). Anda juga dapat memilih untuk menghapus akun dan seluruh data undangan Anda secara mandiri dengan menghubungi tim dukungan layanan pelanggan IKARA.
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
