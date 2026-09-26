"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Gift, ChevronLeft, ChevronRight } from "lucide-react";
import { MapEmbed } from "@/features/theme/components/MapEmbed";
import { CountdownTimer } from "@/features/theme/components/CountdownTimer";
import { RsvpForm } from "@/features/rsvp/components/RsvpForm";
import { GuestWishes } from "@/features/rsvp/components/GuestWishes";
import { Reveal } from "@/features/theme/components/Reveal";
import { Divider } from "@/features/theme/components/Divider";
import { GeometricFrame } from "@/features/theme/components/frames";
import { BankCard } from "@/features/theme/components/BankCard";
import { MusicToggle } from "@/features/theme/components/MusicToggle";
import { useCarousel } from "@/features/theme/hooks/useCarousel";
import { useClipboard } from "@/features/theme/hooks/useClipboard";
import { formatEventDate } from "@/lib/format";
import { getThemeConfig } from "@/features/theme/theme-config";

// ─────────── Section Heading (bespoke — uppercase, kiri) ───────────
function SectionHeading({ title, subtitle, color = "#1E293B" }) {
  return (
    <Reveal direction="up">
      <div className="space-y-3">
        <Divider glyph="line" color={color} />
        <h2 className="text-3xl font-black tracking-tight uppercase" style={{ color }}>{title}</h2>
        {subtitle && <p className="text-xs text-gray-400 font-light max-w-xs leading-relaxed">{subtitle}</p>}
        <Divider glyph="line" color={color} />
      </div>
    </Reveal>
  );
}

// ════════════════════════════════════════════
export function ModernMinimalistTheme({ invitation, rsvps, guestName, onRsvpSuccess, guest, isMuted, setIsMuted }) {
  const cfg = getThemeConfig("modern-minimalist");
  const DARK = cfg.accent; // #0F172A

  const groom     = invitation?.groomNickname || "Pria";
  const bride     = invitation?.brideNickname  || "Wanita";
  const groomFull = invitation?.groomFullName  || "Nama Pria Lengkap";
  const brideFull = invitation?.brideFullName  || "Nama Wanita Lengkap";
  const galleries = invitation?.galleries      || [];
  const layout    = invitation?.galleryLayout  || "CAROUSEL";

  const { index: carouselIndex, setIndex: setIdx, next, prev } = useCarousel(
    galleries.length,
    layout === "CAROUSEL" ? 4500 : 0
  );
  const { copiedId, copy: handleCopy } = useClipboard();

  return (
    <main
      className="w-full text-[#1E293B] font-sans overflow-x-hidden min-h-screen relative pb-16 selection:bg-[#1E293B] selection:text-white @container"
      style={{ background: "linear-gradient(180deg, #FAFAF9 0%, #F4F4F2 60%, #FAFAF9 100%)" }}
    >
      {/* ── MUSIC TOGGLE ── */}
      {invitation?.isMusicEnabled && (
        <MusicToggle isMuted={isMuted} setIsMuted={setIsMuted} accent={DARK} bg="#FFFFFF" />
      )}

      {/* ════════ 1. HERO ════════ */}
      <section aria-label="Pembuka undangan" className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-8 pb-16 overflow-hidden">
        {/* BIG abstract typographic background */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          aria-hidden
        >
          <span
            className="font-black text-[18cqw] leading-none opacity-[0.03] uppercase"
            style={{ color: DARK, letterSpacing: "-0.04em" }}
          >
            LOVE
          </span>
        </div>

        {/* Outer & inner border frame lines */}
        <div className="absolute inset-4 border pointer-events-none rounded" style={{ borderColor: `${DARK}12` }} />
        <div className="absolute inset-8 border pointer-events-none rounded" style={{ borderColor: `${DARK}07` }} />

        <div className="relative z-10 space-y-6 max-w-xl">
          <Reveal direction="fade">
            <p className="text-[9px] tracking-[0.5em] font-extrabold uppercase" style={{ color: `${DARK}80` }}>
              ✦ JOIN US TO CELEBRATE ✦
            </p>
          </Reveal>

          <Reveal direction="up" delay={0.15}>
            <h1
              className="font-black leading-none uppercase tracking-tight"
              style={{ color: DARK, fontSize: "clamp(2rem,11cqw,4rem)" }}
            >
              {groom} <span className="font-thin italic lowercase tracking-widest opacity-40">&amp;</span> {bride}
            </h1>
          </Reveal>

          <Reveal direction="up" delay={0.25}>
            <Divider glyph="line" color={DARK} />
          </Reveal>

          {invitation?.openingText && (
            <Reveal direction="up" delay={0.3}>
              <p className="text-xs text-gray-400 font-light leading-relaxed max-w-sm mx-auto">{invitation.openingText}</p>
            </Reveal>
          )}

          {invitation?.events?.[0]?.date && (
            <Reveal direction="up" delay={0.35}>
              <CountdownTimer targetDate={invitation.events[0].date} accent={DARK} />
            </Reveal>
          )}

          {/* Cover photo — asymmetric tilted layout */}
          {invitation?.coverUrl && (
            <Reveal direction="zoom" delay={0.45}>
              <div className="relative w-52 h-52 mx-auto mt-4">
                <GeometricFrame color={DARK} size={208} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src={invitation.coverUrl}
                    alt={`Foto sampul ${groom} & ${bride}`}
                    className="w-24 h-24 object-cover shadow-2xl"
                    style={{ clipPath: "polygon(0 10%, 10% 0, 100% 0, 100% 90%, 90% 100%, 0 100%)" }}
                  />
                </div>
              </div>
            </Reveal>
          )}
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="text-[9px] tracking-[0.3em] opacity-30 font-bold uppercase" style={{ color: DARK }}>Scroll</div>
          <div className="w-px h-12 opacity-20" style={{ background: DARK }} />
        </motion.div>
      </section>

      {/* ════════ 2. QUOTES ════════ */}
      <section aria-label="Kutipan" className="py-20 px-6 max-w-2xl mx-auto text-center space-y-6">
        <Reveal direction="zoom">
          <div className="w-12 h-px mx-auto" style={{ background: DARK, opacity: 0.2 }} />
        </Reveal>
        <Reveal direction="up" delay={0.1}>
          <blockquote className="text-2xl font-thin italic leading-relaxed" style={{ color: DARK }}>
            &ldquo;{invitation?.quotes || "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri..."}&rdquo;
          </blockquote>
        </Reveal>
      </section>

      {/* ════════ 3. COUPLES ════════ */}
      <section aria-label="Mempelai" className="py-20 px-6" style={{ background: "#F4F4F2" }}>
        <div className="max-w-xl mx-auto space-y-12">
          <SectionHeading title="The Couple" subtitle="Dua jiwa yang disatukan dalam ikatan suci" color={DARK} />

          {/* Groom */}
          <Reveal direction="up">
            <div className="flex flex-col items-center gap-4 p-5 bg-white/60 border border-[#1E293B]/10 text-center">
              <div className="relative w-28 h-28 shrink-0">
                <GeometricFrame color={DARK} size={112} />
                <div className="absolute inset-0 flex items-center justify-center">
                  {invitation?.groomPhotoUrl ? (
                    <img src={invitation.groomPhotoUrl} alt={`Foto ${groomFull}`}
                      className="w-16 h-16 object-cover shadow-xl"
                      style={{ clipPath: "polygon(0 10%, 10% 0, 100% 0, 100% 90%, 90% 100%, 0 100%)" }} />
                  ) : (
                    <div className="w-16 h-16 flex items-center justify-center font-black text-2xl" style={{ color: DARK, opacity: 0.3 }}>
                      {groom[0]}
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] tracking-[0.3em] font-bold uppercase opacity-40" style={{ color: DARK }}>The Groom</p>
                <h3 className="text-xl font-black uppercase leading-tight" style={{ color: DARK }}>{groomFull}</h3>
                <p className="text-xs text-gray-400 font-light">
                  Putra dari {invitation?.groomFather || "—"} &amp; {invitation?.groomMother || "—"}
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal direction="zoom" delay={0.1}>
            <Divider glyph="line" color={DARK} />
          </Reveal>

          {/* Bride */}
          <Reveal direction="up">
            <div className="flex flex-col items-center gap-4 p-5 bg-white/60 border border-[#1E293B]/10 text-center">
              <div className="relative w-28 h-28 shrink-0">
                <GeometricFrame color={DARK} size={112} />
                <div className="absolute inset-0 flex items-center justify-center">
                  {invitation?.bridePhotoUrl ? (
                    <img src={invitation.bridePhotoUrl} alt={`Foto ${brideFull}`}
                      className="w-16 h-16 object-cover shadow-xl"
                      style={{ clipPath: "polygon(0 10%, 10% 0, 100% 0, 100% 90%, 90% 100%, 0 100%)" }} />
                  ) : (
                    <div className="w-16 h-16 flex items-center justify-center font-black text-2xl" style={{ color: DARK, opacity: 0.3 }}>
                      {bride[0]}
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] tracking-[0.3em] font-bold uppercase opacity-40" style={{ color: DARK }}>The Bride</p>
                <h3 className="text-xl font-black uppercase leading-tight" style={{ color: DARK }}>{brideFull}</h3>
                <p className="text-xs text-gray-400 font-light">
                  Putri dari {invitation?.brideFather || "—"} &amp; {invitation?.brideMother || "—"}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════ 4. EVENTS ════════ */}
      <section aria-label="Acara" className="py-20 px-6">
        <div className="max-w-xl mx-auto space-y-10">
          <SectionHeading title="Jadwal Acara" subtitle="Dengan segala kerendahan hati, kami mengundang Bapak/Ibu hadir" color={DARK} />
          <div className="space-y-6">
            {invitation?.events?.map((evt, i) => (
              <Reveal key={evt.id} direction="up" delay={i * 0.12}>
                <div className="rounded-2xl overflow-hidden border border-[#1E293B]/10">
                  {/* Header */}
                  <div className="px-6 py-4 text-white" style={{ background: DARK }}>
                    <p className="text-[9px] tracking-[0.3em] uppercase opacity-50">Acara</p>
                    <h3 className="text-xl font-black uppercase tracking-tight">{evt.name}</h3>
                  </div>
                  {/* Body */}
                  <div className="p-6 bg-white grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="text-[9px] tracking-[0.2em] font-bold uppercase text-gray-400 mb-1">Tanggal</p>
                      <p className="font-semibold text-gray-800 leading-snug">
                        {formatEventDate(evt.date)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] tracking-[0.2em] font-bold uppercase text-gray-400 mb-1">Waktu</p>
                      <p className="font-semibold text-gray-800">{evt.startTime} {evt.endTime ? `– ${evt.endTime}` : "WIB"}</p>
                    </div>
                    <div className="col-span-2 pt-3 border-t border-[#1E293B]/10">
                      <p className="text-[9px] tracking-[0.2em] font-bold uppercase text-gray-400 mb-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#1E293B]" /> Lokasi
                      </p>
                      <p className="font-bold text-gray-800">{evt.locationName}</p>
                      <p className="text-gray-500 font-light text-[11px] mt-0.5">{evt.address}</p>
                    </div>
                  </div>
                  {(evt.address || evt.mapUrl) && (
                    <div className="px-6 pb-6 bg-white space-y-3">
                      <MapEmbed locationName={evt.locationName} address={evt.address} accent={DARK} />
                      {evt.mapUrl && (
                        <a href={evt.mapUrl} target="_blank" rel="noreferrer"
                          className="w-full h-10 rounded-xl flex items-center justify-center gap-2 text-[11px] font-bold text-white cursor-pointer hover:opacity-90"
                          style={{ background: DARK }}>
                          <MapPin className="w-3.5 h-3.5" /> Buka Google Maps
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
        <section aria-label="Cerita Cinta" className="py-20 px-6" style={{ background: "#F4F4F2" }}>
          <div className="max-w-xl mx-auto space-y-10">
            <SectionHeading title="Our Story" color={DARK} />
            <div className="relative pl-8 border-l-2 space-y-10" style={{ borderColor: `${DARK}20` }}>
              {invitation.loveStories.map((story, i) => (
                <Reveal key={story.id} direction="left" delay={i * 0.1}>
                  <div className="relative">
                    <div className="absolute -left-[39px] top-2 w-5 h-5 rotate-45 border-2 border-white shadow-md" style={{ background: DARK }} />
                    <div className="bg-white rounded-xl p-5 border border-[#1E293B]/10 shadow-sm space-y-2">
                      <p className="text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: DARK, opacity: 0.5 }}>{story.date}</p>
                      <h4 className="text-lg font-black uppercase tracking-tight" style={{ color: DARK }}>{story.title}</h4>
                      <p className="text-xs text-gray-500 font-light leading-relaxed">{story.description}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════════ 6. GALLERY ════════ */}
      {galleries.length > 0 && (
        <section aria-label="Galeri" className="py-20 px-6">
          <div className="max-w-xl mx-auto space-y-8">
            <SectionHeading title="Our Gallery" color={DARK} />
            {layout === "CAROUSEL" ? (
              <Reveal direction="zoom">
                <div className="space-y-4">
                  <div className="relative aspect-[3/4] w-full overflow-hidden border-2" style={{ borderColor: `${DARK}20` }}>
                    <AnimatePresence mode="wait">
                      <motion.img key={carouselIndex} src={galleries[carouselIndex]?.mediaUrl} alt={galleries[carouselIndex]?.caption || `Galeri ${carouselIndex + 1}`}
                        className="w-full h-full object-cover absolute inset-0"
                        initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.4 }} />
                    </AnimatePresence>
                    {galleries.length > 1 && (
                      <>
                        <button type="button" onClick={prev} aria-label="Sebelumnya"
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white flex items-center justify-center cursor-pointer hover:opacity-80 shadow-md">
                          <ChevronLeft className="w-5 h-5" style={{ color: DARK }} aria-hidden="true" />
                        </button>
                        <button type="button" onClick={next} aria-label="Berikutnya"
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white flex items-center justify-center cursor-pointer hover:opacity-80 shadow-md">
                          <ChevronRight className="w-5 h-5" style={{ color: DARK }} aria-hidden="true" />
                        </button>
                      </>
                    )}
                    <div className="absolute bottom-4 left-4 bg-white text-[10px] font-bold px-2.5 py-1" style={{ color: DARK }}>
                      {carouselIndex + 1} / {galleries.length}
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    {galleries.map((_, i) => (
                      <button key={i} type="button" onClick={() => setIdx(i)} aria-label={`Galeri ${i + 1}`}
                        className={`h-0.5 transition-all duration-300 cursor-pointer ${carouselIndex === i ? "flex-1" : "w-6"}`}
                        style={{ background: carouselIndex === i ? DARK : `${DARK}30` }} />
                    ))}
                  </div>
                </div>
              </Reveal>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {galleries.map((gal, i) => (
                  <Reveal key={gal.id} direction="zoom" delay={i * 0.07}>
                    <div className="overflow-hidden border border-[#1E293B]/10">
                      <img src={gal.mediaUrl} alt={gal.caption || `Galeri ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 aspect-square" />
                    </div>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ════════ 7. GIFTS ════════ */}
      {invitation?.gifts?.length > 0 && (
        <section aria-label="Kado" className="py-20 px-6" style={{ background: "#F4F4F2" }}>
          <div className="max-w-xl mx-auto space-y-10">
            <SectionHeading title="Digital Gift" color={DARK} />
            <div className="space-y-6 max-w-sm mx-auto">
              {invitation.gifts.map((gft, i) => (
                <Reveal key={gft.id} direction="up" delay={i * 0.15}>
                  {gft.type === "PHYSICAL" ? (
                    <div className="p-6 bg-white border border-[#1E293B]/10 space-y-3 text-left">
                      <div className="flex items-center gap-2">
                        <Gift className="w-5 h-5" style={{ color: DARK }} />
                        <h3 className="font-black uppercase text-sm" style={{ color: DARK }}>Kirim Kado Fisik</h3>
                      </div>
                      <p className="font-bold text-gray-800">{invitation?.physicalGiftReceiver}</p>
                      <p className="text-xs text-gray-500 leading-relaxed">{invitation?.physicalGiftAddress}</p>
                    </div>
                  ) : (
                    <BankCard
                      gift={gft}
                      copiedId={copiedId}
                      onCopy={handleCopy}
                      gradient={cfg.bankCard.gradient}
                      overlay={cfg.bankCard.overlay}
                      chipClass={cfg.bankCard.chipClass}
                      accent={DARK}
                      providerFont={cfg.bankCard.providerFont}
                    />
                  )}
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════════ 8. RSVP ════════ */}
      <section aria-label="RSVP" className="py-20 px-6">
        <div className="max-w-xl mx-auto space-y-10">
          <SectionHeading title="RSVP & Ucapan" color={DARK} />
          <Reveal direction="up">
            <div className="p-6 bg-white border border-[#1E293B]/10 shadow-sm">
              <RsvpForm
                invitationId={invitation.id}
                defaultGuestName={guestName}
                onRsvpSuccess={onRsvpSuccess}
                guest={guest}
                accent={DARK}
                accentDark={cfg.accentDark}
                accentDarker={cfg.accentDarker}
              />
            </div>
          </Reveal>
          <Reveal direction="up" delay={0.1}>
            <div className="space-y-3">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400">Ucapan Tamu ({rsvps?.length || 0})</p>
              <GuestWishes rsvps={rsvps} accent={DARK} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════ 9. FOOTER ════════ */}
      <footer className="py-16 text-center space-y-6 border-t border-[#1E293B]/10">
        <Reveal direction="up">
          <div className="space-y-3">
            <Divider glyph="line" color={DARK} />
            <p className="text-[10px] text-gray-400 font-light tracking-wider uppercase">Merupakan kehormatan bagi kami</p>
            <p className="text-2xl font-thin italic" style={{ color: DARK }}>
              {groom} &amp; {bride}
            </p>
            <Divider glyph="line" color={DARK} />
          </div>
        </Reveal>
        <Reveal direction="up" delay={0.1}>
          <div className="text-[9px] text-gray-400 tracking-[0.3em] font-semibold uppercase flex items-center justify-center gap-2">
            <span>CREATED BY</span>
            <span className="font-black" style={{ color: DARK }}>IKARA</span>
          </div>
        </Reveal>
      </footer>
    </main>
  );
}
