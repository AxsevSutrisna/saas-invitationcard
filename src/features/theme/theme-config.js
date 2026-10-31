/**
 * theme-config.js — SATU sumber kebenaran untuk kelima tema undangan.
 *
 * Dikonsumsi oleh:
 * - TraditionalLayout (classic-elegance, floral-blossom, floral-blue)
 * - designs/modern-minimalist & designs/nature-harmony (ambil accent/frame/particle)
 * - EnvelopeCover (cover)
 * - LivePhonePreview (preview)
 *
 * Catatan warna aksen: Tailwind tidak bisa mengompilasi class dinamis, jadi warna
 * hex di sini dipakai lewat `style` inline / CSS variable, bukan sebagai class.
 */

// ─── Chip specs untuk BankCard bersama ({ base, inner, cell }) ───
const CHIP_GOLD = {
  base: "bg-linear-to-br from-yellow-100 via-yellow-300 to-amber-200",
  inner: "border-amber-400/60",
  cell: "bg-amber-300/60",
};
const CHIP_AMBER = {
  base: "bg-linear-to-br from-yellow-300 via-amber-400 to-yellow-600 opacity-90",
  inner: "border-amber-600/60",
  cell: "bg-amber-500/60",
};
const CHIP_BLUE = {
  base: "bg-linear-to-br from-cyan-200 via-sky-300 to-blue-200",
  inner: "border-blue-400/50",
  cell: "bg-blue-200/60",
};
const CHIP_ZINC = {
  base: "bg-linear-to-br from-zinc-300 via-zinc-200 to-white",
  inner: "border-zinc-400/60",
  cell: "bg-zinc-300/60",
};

export const THEME_CONFIG = {
  "classic-elegance": {
    slug: "classic-elegance",
    name: "Classic Elegance",
    renderer: "traditional",
    accent: "#C8A96A",
    accentDark: "#b39150",
    accentDarker: "#9e7e40",
    fonts: { heading: "font-cormorant", name: "font-greatvibes" },
    frame: "gold-wreath",
    divider: "gold-star",
    particle: "gold",
    bankCard: {
      gradient: "linear-gradient(135deg, #C8A96A 0%, #8B6B30 40%, #5C4010 100%)",
      overlay: "stripes-circles",
      chipClass: CHIP_GOLD,
      providerFont: "cormorant",
    },
    hero: {
      pretitle: "✦ WALIMATUL 'URS ✦",
      pretitleReveal: "down",
      pretitleOpacity: 1,
      borderFrame: true,
      bgDecor: null,
      showDivider: true,
    },
    eventGradient: "linear-gradient(135deg, #C8A96A 0%, #7A5C1E 100%)",
    eventOverlay: "stripes",
    layout: {
      pageBg: "linear-gradient(180deg, #FEFCF8 0%, #FAF7F0 60%, #FEFCF8 100%)",
      surfaceBg: "linear-gradient(180deg, #FAF7F0 0%, #FEFCF8 100%)",
      text: "#1F1F1F",
      footerBg: "#C8A96A06",
    },
    copy: {
      coupleTitle: "Mempelai Pernikahan",
      coupleSubtitle: "Dengan rahmat Allah SWT, kami memperkenalkan diri",
      eventsTitle: "Jadwal Akad & Resepsi",
      eventsSubtitle: "Dengan segala kerendahan hati, kami mengundang Bapak/Ibu hadir",
      loveTitle: "Kisah Cinta Kami",
      galleryTitle: "Galeri Kebahagiaan",
      gallerySubtitle: "Setiap foto menyimpan kenangan yang tak terlupakan",
      giftsTitle: "Amplop Digital",
      giftsSubtitle: "Bagi yang berkenan memberikan tanda kasih untuk pengantin baru:",
      rsvpTitle: "Konfirmasi RSVP & Ucapan",
      rsvpSubtitle: "Berikan konfirmasi kehadiran dan doa restu terbaik:",
      guestbookLabel: "Buku Doa & Ucapan",
    },
    cover: {
      bg: "bg-[#F8F6F2]/90 dark:bg-zinc-950/90",
      textPrimary: "text-[#C8A96A]",
      textSecondary: "text-zinc-500 dark:text-zinc-400",
      fontName: "font-greatvibes text-3xl sm:text-4xl font-medium",
      cardBg: "bg-white/80 dark:bg-zinc-900/80 border-[#C8A96A]/20 shadow-xl",
      btnColor: "bg-[#C8A96A] text-white hover:bg-[#b39150] hover:shadow-[#C8A96A]/35",
      btnText: "text-[#C8A96A]",
      ornamentsColor: "#C8A96A",
      frameKind: "classic",
      particleType: "gold",
      layout: "fullbleed",
      guestCardShape: "rounded-2xl",
    },
    preview: {
      previewBg: "bg-[#F8F6F2] dark:bg-[#191919]",
      accentBg: "bg-[#C8A96A]/15 border-[#C8A96A]/30 text-[#C8A96A]",
      primaryBtn: "bg-[#C8A96A] text-white",
    },
  },

  "floral-blossom": {
    slug: "floral-blossom",
    name: "Floral Blossom",
    renderer: "traditional",
    // Tinta/script hijau sage + ornamen bunga pink/peach (terinspirasi undangan
    // floral: teks hijau lembut di atas blush/cream dengan mawar cat air).
    accent: "#5E7152",
    accentDark: "#495A40",
    accentDarker: "#374430",
    fonts: { heading: "font-playfair", name: "font-greatvibes" },
    frame: "floral",
    divider: "floral-sprig",
    particle: "petals",
    bankCard: {
      // Kartu bank bernuansa mawar agar aksen floral tetap hadir.
      gradient: "linear-gradient(135deg, #C98A94 0%, #9E5A66 50%, #6E3A44 100%)",
      overlay: "glass",
      chipClass: CHIP_AMBER,
      providerFont: null,
    },
    hero: {
      pretitle: "✦ THE WEDDING OF ✦",
      pretitleReveal: "down",
      pretitleOpacity: 1,
      borderFrame: false,
      bgDecor: "garden",
      showDivider: false,
    },
    eventGradient: "linear-gradient(135deg, #6E8560 0%, #45543B 100%)",
    eventOverlay: "circle",
    layout: {
      pageBg: "linear-gradient(180deg, #FDF2EE 0%, #FBF7F0 55%, #FDF2EE 100%)",
      surfaceBg: "linear-gradient(180deg, #FBF7F0 0%, #FDF2EE 100%)",
      text: "#3C352F",
      footerBg: "#5E715208",
    },
    copy: {
      coupleTitle: "Mempelai Pengantin",
      coupleSubtitle: "Dengan penuh rasa syukur, kami memperkenalkan diri",
      eventsTitle: "Jadwal Akad & Resepsi",
      eventsSubtitle: "Dengan segala kerendahan hati, kami mengundang Bapak/Ibu untuk hadir",
      loveTitle: "Perjalanan Cinta",
      galleryTitle: "Galeri Momen",
      gallerySubtitle: "Setiap foto menyimpan seribu cerita cinta",
      giftsTitle: "Amplop Digital",
      giftsSubtitle: "Bagi Anda yang berkenan memberikan tanda kasih untuk pengantin baru:",
      rsvpTitle: "RSVP & Buku Ucapan",
      rsvpSubtitle: "Berikan konfirmasi kehadiran Anda beserta doa terbaik:",
      guestbookLabel: "Doa & Restu Tamu",
    },
    cover: {
      // Sampul floral SELALU terang (blush + sage), tidak mengikuti dark mode
      // aplikasi, agar warnanya selaras dengan isi undangan yang juga selalu
      // terang. Warna muted dibuat hangat (taupe) agar menyatu dengan blush.
      bg: "bg-[#FDF2EE]/90",
      solid: "bg-[#FDF2EE]",
      textPrimary: "text-[#5E7152]",
      textSecondary: "text-[#8A7F74]",
      fontName: "font-greatvibes text-3xl sm:text-4xl font-medium",
      cardBg: "bg-white/85 border-[#5E7152]/20 shadow-xl",
      btnColor: "bg-[#5E7152] text-white hover:bg-[#495A40] hover:shadow-[#5E7152]/35",
      btnText: "text-[#5E7152]",
      ornamentsColor: "#5E7152",
      frameKind: "floral-blossom",
      cardName: "text-[#3C352F]",
      cardMuted: "text-[#8A7F74]",
      particleType: "petals",
      layout: "garden",
      guestCardShape: "rounded-2xl",
    },
    preview: {
      previewBg: "bg-[#FBF5EF]/80 dark:bg-[#1f1b16]",
      accentBg: "bg-[#5E7152]/12 border-[#5E7152]/30 text-[#5E7152] dark:bg-green-950/40 dark:text-green-300",
      primaryBtn: "bg-[#5E7152] text-white",
    },
  },

  "floral-blue": {
    slug: "floral-blue",
    name: "Floral Blue",
    renderer: "traditional",
    accent: "#1A365D",
    accentDark: "#122744",
    accentDarker: "#0d1a30",
    fonts: { heading: "font-baskerville", name: "font-greatvibes" },
    frame: "blue-leaf",
    divider: "wave",
    particle: "bubbles",
    bankCard: {
      gradient: "linear-gradient(135deg, #1A365D 0%, #2D5282 50%, #1A365D 100%)",
      overlay: "wave",
      chipClass: CHIP_BLUE,
      providerFont: "cormorant",
    },
    hero: {
      pretitle: "✦ THE WEDDING CELEBRATION OF ✦",
      pretitleReveal: "fade",
      pretitleOpacity: 0.7,
      borderFrame: false,
      bgDecor: "wave",
      showDivider: true,
    },
    eventGradient: "linear-gradient(135deg, #1A365D 0%, #2D5282 100%)",
    eventOverlay: "wave",
    layout: {
      pageBg: "linear-gradient(180deg, #EBF8FF 0%, #F0F4F8 60%, #EBF8FF 100%)",
      surfaceBg: "#E8F4FD80",
      text: "#0F1E36",
      footerBg: "#1A365D06",
    },
    copy: {
      coupleTitle: "Mempelai Pengantin",
      coupleSubtitle: "Dengan penuh rasa syukur kami memperkenalkan diri",
      eventsTitle: "Jadwal Akad & Resepsi",
      eventsSubtitle: "Dengan segala kerendahan hati, kami mengundang Bapak/Ibu untuk hadir",
      loveTitle: "Perjalanan Cinta",
      galleryTitle: "Galeri Momen",
      gallerySubtitle: "Abadikan setiap momen bersama",
      giftsTitle: "Amplop Digital",
      giftsSubtitle: "Bagi yang berkenan memberikan tanda kasih:",
      rsvpTitle: "RSVP & Buku Ucapan",
      rsvpSubtitle: "Konfirmasi kehadiran dan doa terbaik:",
      guestbookLabel: "Doa & Restu",
    },
    cover: {
      bg: "bg-[#E8F4FD]/90 dark:bg-[#0b1420]/90",
      solid: "bg-[#E8F4FD] dark:bg-[#0b1420]",
      textPrimary: "text-[#1A365D]",
      textSecondary: "text-zinc-500 dark:text-zinc-400",
      fontName: "font-greatvibes text-3xl sm:text-4xl font-medium",
      cardBg: "bg-white/80 dark:bg-zinc-900/80 border-[#1A365D]/20 shadow-xl",
      btnColor: "bg-[#1A365D] text-white hover:bg-[#122744] hover:shadow-[#1A365D]/35",
      btnText: "text-[#1A365D]",
      ornamentsColor: "#1A365D",
      frameKind: "floral-blue",
      cardName: "text-zinc-800",
      cardMuted: "text-zinc-500",
      particleType: "bubbles",
      layout: "framed",
      guestCardShape: "rounded-2xl",
    },
    preview: {
      previewBg: "bg-sky-50/70 dark:bg-[#121d28]",
      accentBg: "bg-sky-100 border-sky-300 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300",
      primaryBtn: "bg-sky-600 text-white",
    },
  },

  "modern-minimalist": {
    slug: "modern-minimalist",
    name: "Modern Minimalist",
    renderer: "modern",
    accent: "#0F172A",
    accentDark: "#1E293B",
    accentDarker: "#020617",
    fonts: { heading: "font-sans", name: "font-sans" },
    frame: "geometric",
    divider: "line",
    particle: null,
    bankCard: {
      gradient: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)",
      overlay: "grid-glow",
      chipClass: CHIP_ZINC,
      providerFont: null,
    },
    hero: {
      pretitle: "✦ JOIN US TO CELEBRATE ✦",
      pretitleReveal: "fade",
      pretitleOpacity: 1,
      borderFrame: true,
      bgDecor: null,
      showDivider: true,
    },
    eventGradient: "#0F172A",
    eventOverlay: null,
    layout: {
      pageBg: "linear-gradient(180deg, #FAFAF9 0%, #F4F4F2 60%, #FAFAF9 100%)",
      surfaceBg: "#F4F4F2",
      text: "#1E293B",
      footerBg: "transparent",
    },
    copy: {},
    cover: {
      bg: "bg-[#0F172A]/90 dark:bg-[#090d16]/95",
      solid: "bg-[#0F172A] dark:bg-[#090d16]",
      textPrimary: "text-zinc-100",
      textSecondary: "text-zinc-400",
      fontName: "font-sans font-black text-xl sm:text-2xl tracking-widest uppercase",
      cardBg: "bg-slate-900/90 dark:bg-zinc-900/90 border-slate-700/60 shadow-2xl",
      btnColor: "bg-zinc-100 text-slate-950 hover:bg-white hover:shadow-white/20",
      btnText: "text-zinc-200",
      ornamentsColor: "#FFFFFF",
      frameKind: "modern",
      cardName: "text-zinc-100",
      cardMuted: "text-zinc-400",
      particleType: "grid",
      layout: "framed",
      guestCardShape: "rounded-none",
    },
    preview: {
      previewBg: "bg-slate-50 dark:bg-[#111827]",
      accentBg: "bg-slate-200 border-slate-300 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
      primaryBtn: "bg-slate-800 text-white",
    },
  },

  "nature-harmony": {
    slug: "nature-harmony",
    name: "Nature Harmony",
    renderer: "nature",
    accent: "#4A6B3D",
    accentDark: "#2F4A28",
    accentDarker: "#1B2E16",
    fonts: { heading: "font-fraunces", name: "font-greatvibes" },
    frame: "blob",
    divider: "leaf",
    particle: "leaves",
    bankCard: {
      gradient: "linear-gradient(135deg, #4A6B3D 0%, #2F4A28 50%, #1B2E16 100%)",
      overlay: "glass",
      chipClass: CHIP_AMBER,
      providerFont: null,
    },
    hero: {
      pretitle: "✦ THE WEDDING CELEBRATION ✦",
      pretitleReveal: "down",
      pretitleOpacity: 1,
      borderFrame: false,
      bgDecor: null,
      showDivider: false,
    },
    eventGradient: "linear-gradient(135deg, #4A6B3D 0%, #2F4A28 100%)",
    eventOverlay: "circle",
    layout: {
      pageBg: "linear-gradient(180deg, #F7F5EE 0%, #FBFAF6 60%, #F7F5EE 100%)",
      surfaceBg: "linear-gradient(180deg, #FBFAF6 0%, #F7F5EE 100%)",
      text: "#2E3B27",
      footerBg: "#4A6B3D08",
    },
    copy: {},
    cover: {
      bg: "bg-[#F7F5EE]/90 dark:bg-[#171d14]/95",
      solid: "bg-[#F7F5EE] dark:bg-[#171d14]",
      textPrimary: "text-[#4A6B3D]",
      textSecondary: "text-zinc-500 dark:text-zinc-400",
      fontName: "font-greatvibes text-3xl sm:text-4xl font-medium",
      cardBg: "bg-white/85 dark:bg-zinc-900/80 border-[#4A6B3D]/20 shadow-xl",
      btnColor: "bg-[#4A6B3D] text-white hover:bg-[#3c5732] hover:shadow-[#4A6B3D]/35",
      btnText: "text-[#4A6B3D]",
      ornamentsColor: "#4A6B3D",
      frameKind: "blob",
      cardName: "text-zinc-800",
      cardMuted: "text-zinc-500",
      particleType: "leaves",
      layout: "framed",
      guestCardShape: "rounded-2xl",
    },
    preview: {
      previewBg: "bg-[#F7F5EE] dark:bg-[#171d14]",
      accentBg: "bg-green-100 border-green-300 text-green-700 dark:bg-green-950/40 dark:text-green-300",
      primaryBtn: "bg-[#4A6B3D] text-white",
    },
  },
};

/**
 * Ambil konfigurasi tema berdasarkan slug; fallback ke classic-elegance.
 */
export function getThemeConfig(slug) {
  return THEME_CONFIG[slug] || THEME_CONFIG["classic-elegance"];
}
