"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Leaf, TreePine, Gift, ChevronLeft, ChevronRight } from "lucide-react";
import { MapEmbed } from "@/features/theme/components/MapEmbed";
import { CountdownTimer } from "@/features/theme/components/CountdownTimer";
import { RsvpForm } from "@/features/rsvp/components/RsvpForm";
import { GuestWishes } from "@/features/rsvp/components/GuestWishes";
import { Reveal } from "@/features/theme/components/Reveal";
import { Divider } from "@/features/theme/components/Divider";
import { BlobFrame } from "@/features/theme/components/frames";
import { BankCard } from "@/features/theme/components/BankCard";
import { MusicToggle } from "@/features/theme/components/MusicToggle";
import { ParticleField } from "@/features/theme/components/ParticleField";
import { useCarousel } from "@/features/theme/hooks/useCarousel";
import { useClipboard } from "@/features/theme/hooks/useClipboard";
import { formatEventDate } from "@/lib/format";
import { getThemeConfig } from "@/features/theme/theme-config";

// ─────────── Section Heading (bespoke — responsif, tengah) ───────────
function SectionHeading({ title, subtitle, color = "#4A6B3D" }) {
  return (
    <Reveal direction="zoomIn">
      <div className="text-center space-y-3">
        <Divider glyph="leaf" color={color} />
        <h2 className="font-heading text-3xl @[1024px]:text-4xl font-bold font-fraunces" style={{ color }}>
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs text-gray-500 font-light max-w-xs @[1024px]:max-w-sm mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}
        <Divider glyph="leaf" color={color} />
      </div>
    </Reveal>
  );
}

// ════════════════════════════════════════════
//              MAIN COMPONENT
// ════════════════════════════════════════════
export function NatureHarmonyTheme({ invitation, rsvps, guestName, onRsvpSuccess, guest, isMuted, setIsMuted }) {
  const cfg = getThemeConfig("nature-harmony");
  const FOREST = cfg.accent; // #4A6B3D
  const SAGE   = "#8FA980";
  const CREAM  = "#F7F5EE";

  // Depth premium ber-tint hutan (organik & hangat) + hover-lift lembut.
  const cardShadow = `0 2px 8px ${FOREST}0c, 0 24px 48px -14px ${FOREST}22`;
  const cardHover = "transition-all duration-500 hover:-translate-y-1";

  const groom     = invitation?.groomNickname || "Pria";
  const bride     = invitation?.brideNickname  || "Wanita";
  const groomFull = invitation?.groomFullName  || "Nama Pria Lengkap";
  const brideFull = invitation?.brideFullName  || "Nama Wanita Lengkap";
  const galleries = invitation?.galleries      || [];
  const layout    = invitation?.galleryLayout  || "CAROUSEL";

  const { index: carouselIndex, setIndex: setCarouselIndex, next, prev } = useCarousel(
    galleries.length,
    layout === "CAROUSEL" ? 4500 : 0
  );
  const { copiedId, copy: handleCopy } = useClipboard();

  return (
    <main
      className="w-full text-[#2E3B27] font-sans overflow-x-hidden min-h-screen relative pb-16 selection:bg-[#4A6B3D] selection:text-white @container"
      style={{ background: `linear-gradient(180deg, ${CREAM} 0%, #FBFAF6 60%, ${CREAM} 100%)` }}
    >
      {/* ── AMBIENT FALLING LEAVES (fullscreen) ── */}
      <ParticleField type="leaves" accent={FOREST} />

      {/* ── MUSIC TOGGLE BUTTON ── */}
      {invitation?.isMusicEnabled && (
        <MusicToggle
          isMuted={isMuted}
          setIsMuted={setIsMuted}
          accent={FOREST}
          bg="#FFFFFF"
          title={isMuted ? "Mainkan Musik" : "Senyap"}
        />
      )}

      {/* ════════ 1. HERO SECTION — asymmetric split (stacked on mobile, side-by-side on desktop) ════════ */}
      <section aria-label="Pembuka undangan" className="relative min-h-screen flex items-center overflow-hidden px-6 @[768px]:px-10 @[1024px]:px-16 pt-28 pb-20">
        {/* Slow ambient zoom-in/zoom-out backdrop shapes */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <motion.svg
            className="absolute top-0 left-0 w-56 @[1024px]:w-72 opacity-10"
            viewBox="0 0 200 200"
            fill={FOREST}
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          >
            <circle cx="100" cy="100" r="80" />
          </motion.svg>
          <motion.svg
            className="absolute bottom-0 right-0 w-56 @[1024px]:w-72 opacity-10"
            viewBox="0 0 200 200"
            fill={SAGE}
            animate={{ scale: [1.15, 1, 1.15] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          >
            <circle cx="100" cy="100" r="80" />
          </motion.svg>
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 @[1024px]:grid-cols-[1.15fr_0.85fr] gap-10 @[1024px]:gap-16 items-center">
          {/* Left: typography block — centered on mobile, left-aligned on desktop */}
          <div className="text-center @[1024px]:text-left space-y-6 order-2 @[1024px]:order-1">
            <Reveal direction="down">
              <p className="text-[10px] tracking-[0.4em] font-bold uppercase" style={{ color: FOREST }}>
                ✦ THE WEDDING CELEBRATION ✦
              </p>
            </Reveal>

            <Reveal direction="zoomIn" delay={0.15}>
              <h1
                className="font-heading font-extrabold leading-[0.95] font-fraunces"
                style={{ color: FOREST, fontSize: "clamp(2.2rem, 7cqw, 4.8rem)", textShadow: `0 4px 28px ${FOREST}2e` }}
              >
                {groom}
                <span className="block font-greatvibes text-4xl @[640px]:text-5xl @[1024px]:text-6xl py-2 @[1024px]:py-3 opacity-75">&amp;</span>
                {bride}
              </h1>
            </Reveal>

            {invitation?.openingText && (
              <Reveal direction="up" delay={0.25}>
                <p className="text-xs @[1024px]:text-sm text-gray-500 font-light leading-relaxed max-w-sm @[1024px]:max-w-md mx-auto @[1024px]:mx-0">
                  {invitation.openingText}
                </p>
              </Reveal>
            )}

            {invitation?.events?.[0]?.date && (
              <Reveal direction="up" delay={0.35}>
                <div className="py-2 flex justify-center @[1024px]:justify-start">
                  <CountdownTimer targetDate={invitation.events[0].date} accent={FOREST} />
                </div>
              </Reveal>
            )}
          </div>

          {/* Right: organic blob photo frame — bigger stage on desktop */}
          <div className="order-1 @[1024px]:order-2 flex justify-center @[1024px]:justify-end">
            <Reveal direction="zoomOut" delay={0.3}>
              <BlobFrame
                src={invitation?.coverUrl}
                alt={`Foto sampul ${groom} & ${bride}`}
                fallbackText={`${groom[0]}${bride[0]}`}
                color={FOREST}
                className="w-56 h-56 @[640px]:w-64 @[640px]:h-64 @[1024px]:w-[24rem] @[1024px]:h-[24rem]"
              />
            </Reveal>
          </div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-0.5 h-10 rounded-full opacity-30" style={{ background: FOREST }} />
          <div className="text-[9px] tracking-[0.25em] opacity-40 font-semibold uppercase" style={{ color: FOREST }}>Scroll</div>
        </motion.div>
      </section>

      {/* ════════ 2. QUOTES — editorial row (stacked mobile, side-by-side desktop) ════════ */}
      <section aria-label="Kutipan" className="py-24 @[768px]:py-28 px-6 @[768px]:px-10 @[1024px]:px-16">
        <div className="max-w-xl @[1024px]:max-w-4xl mx-auto">
          <div className="flex flex-col @[1024px]:flex-row items-center gap-6 @[1024px]:gap-10 text-center @[1024px]:text-left">
            <Reveal direction="zoomIn" className="shrink-0">
              <TreePine className="w-10 h-10 @[1024px]:w-14 @[1024px]:h-14" style={{ color: FOREST }} />
            </Reveal>
            <div className="space-y-4">
              <Reveal direction="up" delay={0.1}>
                <blockquote className="font-heading text-2xl @[1024px]:text-3xl font-medium font-fraunces italic leading-relaxed" style={{ color: FOREST }}>
                  &ldquo;Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya...&rdquo;
                </blockquote>
              </Reveal>
              <Reveal direction="up" delay={0.2}>
                <p className="text-xs text-gray-500 font-light tracking-wider">
                  {invitation?.quotes || "QS. Ar-Rum: 21"}
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ 3. COUPLES SECTION — open editorial layout, 3-col with divider on desktop ════════ */}
      <section aria-label="Mempelai" className="py-24 @[768px]:py-28 px-6 @[768px]:px-10 @[1024px]:px-16" style={{ background: "linear-gradient(180deg, #FBFAF6 0%, #F7F5EE 100%)" }}>
        <div className="max-w-xl @[1024px]:max-w-5xl mx-auto space-y-14">
          <SectionHeading title="Mempelai Pengantin" subtitle="Dengan penuh rasa syukur, kami memperkenalkan diri" color={FOREST} />

          <div className="grid grid-cols-1 @[1024px]:grid-cols-[1fr_auto_1fr] gap-10 @[1024px]:gap-10 items-center">
            {/* Groom */}
            <Reveal direction="zoomOut">
              <div className="flex flex-col items-center gap-4 text-center">
                <BlobFrame src={invitation?.groomPhotoUrl} alt={`Foto ${groomFull}`} fallbackText={groom[0]} color={FOREST} className="w-32 h-32 @[1024px]:w-40 @[1024px]:h-40" />
                <div className="space-y-1">
                  <p className="text-[10px] tracking-[0.25em] font-bold uppercase opacity-60" style={{ color: FOREST }}>The Groom</p>
                  <h3 className="font-fraunces text-xl @[1024px]:text-2xl font-bold leading-tight" style={{ color: FOREST }}>{groomFull}</h3>
                  <p className="text-[11px] text-gray-500 font-light leading-relaxed max-w-[220px]">
                    Putra dari Bapak {invitation?.groomFather || "—"} &amp; Ibu {invitation?.groomMother || "—"}
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Divider — horizontal on mobile, vertical on desktop */}
            <Reveal direction="zoomIn" delay={0.1}>
              <div className="flex @[1024px]:flex-col items-center justify-center gap-3 @[1024px]:gap-4">
                <div className="h-px w-14 @[1024px]:w-px @[1024px]:h-28 opacity-20" style={{ background: FOREST }} />
                <span className="font-greatvibes text-4xl @[1024px]:text-5xl opacity-50" style={{ color: FOREST }}>&amp;</span>
                <div className="h-px w-14 @[1024px]:w-px @[1024px]:h-28 opacity-20" style={{ background: FOREST }} />
              </div>
            </Reveal>

            {/* Bride */}
            <Reveal direction="zoomOut">
              <div className="flex flex-col items-center gap-4 text-center">
                <BlobFrame src={invitation?.bridePhotoUrl} alt={`Foto ${brideFull}`} fallbackText={bride[0]} color={FOREST} className="w-32 h-32 @[1024px]:w-40 @[1024px]:h-40" />
                <div className="space-y-1">
                  <p className="text-[10px] tracking-[0.25em] font-bold uppercase opacity-60" style={{ color: FOREST }}>The Bride</p>
                  <h3 className="font-fraunces text-xl @[1024px]:text-2xl font-bold leading-tight" style={{ color: FOREST }}>{brideFull}</h3>
                  <p className="text-[11px] text-gray-500 font-light leading-relaxed max-w-[220px]">
                    Putri dari Bapak {invitation?.brideFather || "—"} &amp; Ibu {invitation?.brideMother || "—"}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ════════ 4. EVENTS SECTION — grid 2 kolom di desktop ════════ */}
      <section aria-label="Acara" className="py-24 @[768px]:py-28 px-6 @[768px]:px-10 @[1024px]:px-16">
        <div className="max-w-xl @[1024px]:max-w-5xl mx-auto space-y-10">
          <SectionHeading title="Jadwal Akad & Resepsi" subtitle="Dengan segala kerendahan hati, kami mengundang Bapak/Ibu untuk hadir" color={FOREST} />

          <div className="grid grid-cols-1 @[1024px]:grid-cols-2 gap-6 @[1024px]:gap-8">
            {invitation?.events?.map((evt, i) => (
              <Reveal key={evt.id} direction={i % 2 === 0 ? "zoomIn" : "zoomOut"} delay={i * 0.12}>
                <div className={`rounded-3xl bg-white border overflow-hidden h-full ${cardHover}`} style={{ borderColor: `${FOREST}25`, boxShadow: cardShadow }}>
                  <div className="px-6 py-4 text-white text-center relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${FOREST} 0%, #2F4A28 100%)` }}>
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-0 right-0 w-24 h-24 rounded-full border-2 border-white -translate-x-6 -translate-y-6" />
                    </div>
                    <p className="text-[10px] tracking-[0.3em] uppercase font-semibold opacity-80">Acara</p>
                    <h3 className="font-fraunces text-2xl font-bold">{evt.name}</h3>
                  </div>

                  <div className="p-6 grid grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <p className="text-[9px] tracking-[0.2em] font-bold uppercase text-gray-500">Tanggal</p>
                      <p className="font-semibold text-gray-800 leading-snug">
                        {formatEventDate(evt.date)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] tracking-[0.2em] font-bold uppercase text-gray-500">Waktu</p>
                      <p className="font-semibold text-gray-800">{evt.startTime} {evt.endTime ? `– ${evt.endTime}` : "WIB"}</p>
                    </div>
                    <div className="col-span-2 space-y-1 pt-3 border-t" style={{ borderColor: `${FOREST}20` }}>
                      <p className="text-[9px] tracking-[0.2em] font-bold uppercase text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" style={{ color: FOREST }} /> Lokasi
                      </p>
                      <p className="font-bold text-gray-800">{evt.locationName}</p>
                      <p className="text-gray-500 font-light leading-relaxed">{evt.address}</p>
                    </div>
                  </div>

                  {(evt.address || evt.mapUrl) && (
                    <div className="px-6 pb-6 space-y-3">
                      <MapEmbed locationName={evt.locationName} address={evt.address} accent={FOREST} />
                      {evt.mapUrl && (
                        <a
                          href={evt.mapUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full h-10 rounded-2xl flex items-center justify-center gap-2 text-[11px] font-bold text-white transition-opacity hover:opacity-90 cursor-pointer"
                          style={{ background: `linear-gradient(135deg, ${FOREST} 0%, #2F4A28 100%)` }}
                        >
                          <MapPin className="w-3.5 h-3.5" />
                          Buka Google Maps
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ 5. LOVE STORY ════════ */}
      {invitation?.loveStories?.length > 0 && (
        <section aria-label="Cerita Cinta" className="py-24 @[768px]:py-28 px-6 @[768px]:px-10 @[1024px]:px-16" style={{ background: "linear-gradient(180deg, #FBFAF6 0%, #F7F5EE 100%)" }}>
          <div className="max-w-xl @[1024px]:max-w-2xl mx-auto space-y-10">
            <SectionHeading title="Perjalanan Cinta" color={FOREST} />

            <div className="relative pl-8 border-l-2 space-y-10" style={{ borderColor: `${FOREST}30` }}>
              {invitation.loveStories.map((story, i) => (
                <Reveal key={story.id} direction={i % 2 === 0 ? "left" : "up"} delay={i * 0.1}>
                  <div className="relative">
                    <div className="absolute -left-[39px] top-2 w-5 h-5 rounded-full border-4 border-white shadow-md" style={{ background: FOREST }} />
                    <div className="space-y-2 bg-white/70 backdrop-blur-sm rounded-2xl p-5 border" style={{ borderColor: `${FOREST}20`, boxShadow: cardShadow }}>
                      <p className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: FOREST }}>{story.date}</p>
                      <h4 className="font-fraunces text-xl font-bold text-gray-800">{story.title}</h4>
                      <p className="text-xs text-gray-500 font-light leading-relaxed">{story.description}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════════ 6. PHOTO GALLERY — masonry 3-kolom di desktop, carousel tetap fokus di HP ════════ */}
      {galleries.length > 0 && (
        <section aria-label="Galeri" className="py-24 @[768px]:py-28 px-6 @[768px]:px-10 @[1024px]:px-16">
          <div className="max-w-xl @[1024px]:max-w-4xl mx-auto space-y-8">
            <SectionHeading title="Galeri Momen" subtitle="Setiap foto menyimpan seribu cerita cinta" color={FOREST} />

            {layout === "CAROUSEL" ? (
              <Reveal direction="zoomIn">
                <div className="space-y-4 max-w-sm @[1024px]:max-w-md mx-auto">
                  <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden border shadow-xl" style={{ borderColor: `${FOREST}30` }}>
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={carouselIndex}
                        src={galleries[carouselIndex]?.mediaUrl}
                        alt={galleries[carouselIndex]?.caption || `Galeri ${carouselIndex + 1}`}
                        className="w-full h-full object-cover absolute inset-0"
                        initial={{ opacity: 0, scale: carouselIndex % 2 === 0 ? 1.15 : 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: carouselIndex % 2 === 0 ? 0.95 : 1.1 }}
                        transition={{ duration: 0.7, ease: "easeInOut" }}
                      />
                    </AnimatePresence>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                    {galleries.length > 1 && (
                      <>
                        <button type="button" onClick={prev} aria-label="Sebelumnya"
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-white transition-all shadow-md">
                          <ChevronLeft className="w-5 h-5" style={{ color: FOREST }} aria-hidden="true" />
                        </button>
                        <button type="button" onClick={next} aria-label="Berikutnya"
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-white transition-all shadow-md">
                          <ChevronRight className="w-5 h-5" style={{ color: FOREST }} aria-hidden="true" />
                        </button>
                      </>
                    )}

                    <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
                      {carouselIndex + 1} / {galleries.length}
                    </div>
                  </div>

                  <div className="flex justify-center gap-1.5">
                    {galleries.map((_, i) => (
                      <button key={i} type="button" onClick={() => setCarouselIndex(i)} aria-label={`Galeri ${i + 1}`}
                        className={`rounded-full transition-all duration-300 cursor-pointer ${carouselIndex === i ? "w-6 h-2" : "w-2 h-2"}`}
                        style={{ background: carouselIndex === i ? FOREST : `${FOREST}40` }}
                      />
                    ))}
                  </div>
                </div>
              </Reveal>
            ) : (
              <div className="columns-2 @[1024px]:columns-3 gap-3 space-y-3">
                {galleries.map((gal, i) => (
                  <Reveal key={gal.id} direction={i % 2 === 0 ? "zoomIn" : "zoomOut"} delay={i * 0.07}>
                    <div className="break-inside-avoid rounded-2xl overflow-hidden shadow-sm border" style={{ borderColor: `${FOREST}20` }}>
                      <img src={gal.mediaUrl} alt={gal.caption || `Galeri ${i + 1}`} className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ════════ 7. DIGITAL GIFTS — grid 2 kolom di desktop ════════ */}
      {invitation?.gifts?.length > 0 && (
        <section aria-label="Kado" className="py-24 @[768px]:py-28 px-6 @[768px]:px-10 @[1024px]:px-16" style={{ background: "linear-gradient(180deg, #FBFAF6 0%, #F7F5EE 100%)" }}>
          <div className="max-w-xl @[1024px]:max-w-4xl mx-auto space-y-10">
            <SectionHeading title="Amplop Digital" subtitle="Bagi Anda yang berkenan memberikan tanda kasih untuk pengantin baru:" color={FOREST} />

            <div className="grid grid-cols-1 @[1024px]:grid-cols-2 gap-6 max-w-sm @[1024px]:max-w-none mx-auto">
              {invitation.gifts.map((gft, i) => (
                <Reveal key={gft.id} direction="up" delay={i * 0.15}>
                  {gft.type === "PHYSICAL" ? (
                    <div className={`p-6 rounded-3xl bg-white border text-left space-y-3 h-full ${cardHover}`} style={{ borderColor: `${FOREST}25`, boxShadow: cardShadow }}>
                      <div className="flex items-center gap-2">
                        <Gift className="w-5 h-5" style={{ color: FOREST }} />
                        <h3 className="font-semibold text-gray-800">Kirim Kado Fisik</h3>
                      </div>
                      <p className="font-bold text-gray-800">{invitation?.physicalGiftReceiver}</p>
                      <p className="text-xs text-gray-500 leading-relaxed">{invitation?.physicalGiftAddress}</p>
                      {invitation?.physicalGiftPhone && (
                        <p className="text-xs text-gray-500">📞 {invitation.physicalGiftPhone}</p>
                      )}
                    </div>
                  ) : (
                    <BankCard
                      gift={gft}
                      copiedId={copiedId}
                      onCopy={handleCopy}
                      gradient={cfg.bankCard.gradient}
                      overlay={cfg.bankCard.overlay}
                      chipClass={cfg.bankCard.chipClass}
                      accent={FOREST}
                      providerFont={cfg.bankCard.providerFont}
                    />
                  )}
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════════ 8. RSVP & UCAPAN — 2 kolom di desktop (form kiri, ucapan kanan) ════════ */}
      <section aria-label="RSVP" className="py-24 @[768px]:py-28 px-6 @[768px]:px-10 @[1024px]:px-16">
        <div className="max-w-xl @[1024px]:max-w-5xl mx-auto space-y-10">
          <SectionHeading title="RSVP & Buku Ucapan" subtitle="Berikan konfirmasi kehadiran Anda beserta doa terbaik:" color={FOREST} />

          <div className="grid grid-cols-1 @[1024px]:grid-cols-2 gap-8 @[1024px]:gap-10 @[1024px]:items-start">
            <Reveal direction="up">
              <div className="p-6 rounded-3xl bg-white border" style={{ borderColor: `${FOREST}25`, boxShadow: cardShadow }}>
                <RsvpForm
                  invitationId={invitation.id}
                  defaultGuestName={guestName}
                  onRsvpSuccess={onRsvpSuccess}
                  guest={guest}
                  accent={FOREST}
                  accentDark={cfg.accentDark}
                  accentDarker={cfg.accentDarker}
                />
              </div>
            </Reveal>

            <Reveal direction="up" delay={0.1}>
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 pl-1">
                  Doa &amp; Restu Tamu ({rsvps?.length || 0})
                </h3>
                <GuestWishes rsvps={rsvps} accent={FOREST} />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ════════ 9. FOOTER ════════ */}
      <footer className="py-16 text-center space-y-6 border-t" style={{ borderColor: `${FOREST}20`, background: `${FOREST}08` }}>
        <Reveal direction="zoomIn">
          <Leaf className="w-10 h-10 mx-auto" style={{ color: FOREST, opacity: 0.6 }} />
        </Reveal>
        <Reveal direction="up" delay={0.1}>
          <div className="space-y-2">
            <p className="text-[10px] text-gray-500 font-light tracking-wider uppercase">Merupakan kehormatan bagi kami</p>
            <p className="font-fraunces text-xl font-bold" style={{ color: FOREST }}>Kami Yang Berbahagia,</p>
            <h4 className="font-greatvibes text-3xl" style={{ color: FOREST }}>{groom} &amp; {bride}</h4>
          </div>
        </Reveal>
        <Reveal direction="up" delay={0.2}>
          <div className="text-[9px] text-gray-500 tracking-[0.3em] font-semibold uppercase flex items-center justify-center gap-2">
            <span>CREATED WITH ♥ BY</span>
            <span className="font-fraunces text-sm font-bold" style={{ color: FOREST }}>IKARA</span>
          </div>
        </Reveal>
      </footer>
    </main>
  );
}
