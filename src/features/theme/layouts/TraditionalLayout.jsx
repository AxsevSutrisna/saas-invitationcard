"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Heart, Gift, ChevronLeft, ChevronRight } from "lucide-react";
import { CountdownTimer } from "@/features/theme/components/CountdownTimer";
import { RsvpForm } from "@/features/rsvp/components/RsvpForm";
import { GuestWishes } from "@/features/rsvp/components/GuestWishes";
import { Reveal } from "@/features/theme/components/Reveal";
import { Frame } from "@/features/theme/components/frames";
import { Divider } from "@/features/theme/components/Divider";
import { ParticleField } from "@/features/theme/components/ParticleField";
import { BankCard } from "@/features/theme/components/BankCard";
import { MusicToggle } from "@/features/theme/components/MusicToggle";
import { SectionHeading } from "@/features/theme/components/SectionHeading";
import { useCarousel } from "@/features/theme/hooks/useCarousel";
import { useClipboard } from "@/features/theme/hooks/useClipboard";
import { formatEventDate } from "@/lib/format";
import { getThemeConfig } from "@/features/theme/theme-config";

/**
 * TraditionalLayout — 9 seksi berbagi untuk tema 1-kolom
 * (classic-elegance, floral-blossom, floral-blue). Semua varian dikendalikan
 * lewat `config` (theme-config.js). Basis JSX diambil dari classic-elegance.
 */
export function TraditionalLayout({ config, invitation, rsvps, guestName, onRsvpSuccess, guest, isMuted, setIsMuted }) {
  const cfg = config || getThemeConfig("classic-elegance");
  const { accent } = cfg;
  const { hero, fonts, copy, layout: surfaces } = cfg;

  const groom     = invitation?.groomNickname || "Pria";
  const bride     = invitation?.brideNickname  || "Wanita";
  const groomFull = invitation?.groomFullName  || "Nama Pria Lengkap";
  const brideFull = invitation?.brideFullName  || "Nama Wanita Lengkap";
  const galleries = invitation?.galleries      || [];
  const galleryLayout = invitation?.galleryLayout || "CAROUSEL";

  const { index: carouselIndex, setIndex: setIdx, next, prev } = useCarousel(
    galleries.length,
    galleryLayout === "CAROUSEL" ? 4500 : 0
  );
  const { copiedId, copy: onCopy } = useClipboard();

  return (
    <main
      className="w-full font-sans overflow-x-hidden min-h-screen relative pb-16 selection:bg-[var(--accent)] selection:text-white @container"
      style={{ background: surfaces.pageBg, color: surfaces.text, "--accent": accent }}
    >
      {/* ── AMBIENT PARTICLES ── */}
      <ParticleField type={cfg.particle} accent={accent} />

      {/* ── MUSIC TOGGLE ── */}
      {invitation?.isMusicEnabled && (
        <MusicToggle isMuted={isMuted} setIsMuted={setIsMuted} accent={accent} bg="#FFFFFF" />
      )}

      {/* ════════ 1. HERO ════════ */}
      <section aria-label="Pembuka undangan" className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-8 pb-16 overflow-hidden">
        {/* Ornate border frame (classic) */}
        {hero.borderFrame && (
          <>
            <div className="absolute inset-4 border pointer-events-none rounded-2xl" style={{ borderColor: `${accent}25` }} />
            <div className="absolute inset-6 border pointer-events-none rounded-xl" style={{ borderColor: `${accent}15` }} />
            {[["top-4 left-4"], ["top-4 right-4 rotate-90"], ["bottom-4 left-4 -rotate-90"], ["bottom-4 right-4 rotate-180"]].map(([cls], i) => (
              <div key={i} className={`absolute ${cls} pointer-events-none`} aria-hidden>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path d="M2 2 L2 12 L6 12 L6 6 L12 6 L12 2 Z" fill={accent} opacity="0.5" />
                  <circle cx="2" cy="2" r="2" fill={accent} opacity="0.7" />
                </svg>
              </div>
            ))}
          </>
        )}

        {/* Background floral roses (blossom) */}
        {hero.bgDecor === "rose" && (
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            <svg className="absolute top-0 left-0 w-48 opacity-10" viewBox="0 0 200 200" fill={accent}>
              <circle cx="100" cy="100" r="80" />
              <circle cx="100" cy="30" r="25" />
              <circle cx="160" cy="75" r="20" />
              <circle cx="155" cy="150" r="22" />
              <circle cx="100" cy="185" r="20" />
              <circle cx="45" cy="155" r="22" />
              <circle cx="35" cy="78" r="20" />
            </svg>
            <svg className="absolute bottom-0 right-0 w-48 opacity-10 rotate-180" viewBox="0 0 200 200" fill={accent}>
              <circle cx="100" cy="100" r="80" />
              <circle cx="100" cy="30" r="25" />
            </svg>
          </div>
        )}

        {/* Background wave (blue) */}
        {hero.bgDecor === "wave" && (
          <svg className="absolute bottom-0 left-0 w-full h-32 pointer-events-none" viewBox="0 0 1440 128" preserveAspectRatio="none" aria-hidden>
            <path d="M0 64 C360 0, 720 128, 1080 64 S1360 0, 1440 64 L1440 128 L0 128 Z" fill={accent} opacity="0.05" />
          </svg>
        )}

        <div className="relative z-10 space-y-6 max-w-xl">
          <Reveal direction={hero.pretitleReveal}>
            <p className="text-[10px] tracking-[0.4em] font-bold uppercase" style={{ color: accent, opacity: hero.pretitleOpacity }}>
              {hero.pretitle}
            </p>
          </Reveal>

          <Reveal direction="zoom" delay={0.15}>
            <h1
              className={`${fonts.heading} font-extrabold leading-tight`}
              style={{ color: accent, fontSize: "clamp(2.2rem,11cqw,4.2rem)" }}
            >
              {groom}
              <span className="block font-greatvibes text-3xl sm:text-4xl py-1 opacity-70">&amp;</span>
              {bride}
            </h1>
          </Reveal>

          {hero.showDivider && (
            <Reveal direction="up" delay={0.2}>
              <Divider glyph={cfg.divider} color={accent} />
            </Reveal>
          )}

          {invitation?.openingText && (
            <Reveal direction="up" delay={0.25}>
              <p className="text-xs text-gray-500 font-light leading-relaxed max-w-sm mx-auto">{invitation.openingText}</p>
            </Reveal>
          )}

          {invitation?.events?.[0]?.date && (
            <Reveal direction="up" delay={0.3}>
              <CountdownTimer targetDate={invitation.events[0].date} accent={accent} />
            </Reveal>
          )}

          {/* Cover with Wreath */}
          {invitation?.coverUrl && (
            <Reveal direction="zoom" delay={0.4}>
              <div className="relative w-52 h-52 mx-auto mt-4">
                <Frame kind={cfg.frame} color={accent} size={208} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src={invitation.coverUrl}
                    alt={`Foto sampul ${groom} & ${bride}`}
                    className="w-[105px] h-[105px] rounded-full object-cover border-4 border-white shadow-xl"
                    style={{ boxShadow: `0 0 0 4px ${accent}30, 0 8px 30px ${accent}25` }}
                  />
                </div>
              </div>
            </Reveal>
          )}
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-0.5 h-10 rounded-full opacity-30" style={{ background: accent }} />
          <div className="text-[9px] tracking-[0.25em] opacity-40 font-semibold uppercase" style={{ color: accent }}>Scroll</div>
        </motion.div>
      </section>

      {/* ════════ 2. QUOTES ════════ */}
      <section aria-label="Kutipan" className="py-20 px-6 max-w-2xl mx-auto text-center space-y-6">
        <Reveal direction="zoom">
          <Heart className="w-10 h-10 mx-auto animate-pulse" style={{ color: accent, fill: `${accent}25` }} />
        </Reveal>
        <Reveal direction="up" delay={0.1}>
          <blockquote className={`${fonts.heading} text-2xl font-medium italic leading-relaxed`} style={{ color: accent }}>
            &ldquo;Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya...&rdquo;
          </blockquote>
        </Reveal>
        <Reveal direction="up" delay={0.2}>
          <p className="text-xs text-gray-400 font-light tracking-wider">{invitation?.quotes || "QS. Ar-Rum: 21"}</p>
        </Reveal>
      </section>

      {/* ════════ 3. COUPLES ════════ */}
      <section aria-label="Mempelai" className="py-20 px-6" style={{ background: surfaces.surfaceBg }}>
        <div className="max-w-xl mx-auto space-y-12">
          <SectionHeading title={copy.coupleTitle} subtitle={copy.coupleSubtitle} color={accent} glyph={cfg.divider} fontClass={fonts.heading} />

          {/* Groom */}
          <Reveal direction="up">
            <div className="flex flex-col items-center gap-4 p-5 rounded-3xl bg-white/80 backdrop-blur-sm border shadow-sm text-center" style={{ borderColor: `${accent}25` }}>
              <div className="relative w-28 h-28 shrink-0">
                <Frame kind={cfg.frame} color={accent} size={112} />
                <div className="absolute inset-0 flex items-center justify-center">
                  {invitation?.groomPhotoUrl ? (
                    <img src={invitation.groomPhotoUrl} alt={`Foto ${groomFull}`} className="w-[56px] h-[56px] rounded-full object-cover border-3 border-white shadow-lg" />
                  ) : (
                    <div className="w-[56px] h-[56px] rounded-full flex items-center justify-center border-3 border-white shadow-lg font-cormorant text-xl font-black" style={{ background: `${accent}15`, color: accent }}>
                      {groom[0]}
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] tracking-[0.25em] font-bold uppercase opacity-60" style={{ color: accent }}>The Groom</p>
                <h3 className={`${fonts.heading} text-xl font-bold leading-tight`} style={{ color: accent }}>{groomFull}</h3>
                <p className="text-[11px] text-gray-500 font-light leading-relaxed">
                  Putra dari Bapak {invitation?.groomFather || "—"} &amp; Ibu {invitation?.groomMother || "—"}
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal direction="zoom" delay={0.1}>
            <div className="flex items-center justify-center gap-4">
              <div className="h-px flex-1 opacity-20" style={{ background: accent }} />
              <span className="font-greatvibes text-4xl opacity-50" style={{ color: accent }}>&amp;</span>
              <div className="h-px flex-1 opacity-20" style={{ background: accent }} />
            </div>
          </Reveal>

          {/* Bride */}
          <Reveal direction="up">
            <div className="flex flex-col items-center gap-4 p-5 rounded-3xl bg-white/80 backdrop-blur-sm border shadow-sm text-center" style={{ borderColor: `${accent}25` }}>
              <div className="relative w-28 h-28 shrink-0">
                <Frame kind={cfg.frame} color={accent} size={112} />
                <div className="absolute inset-0 flex items-center justify-center">
                  {invitation?.bridePhotoUrl ? (
                    <img src={invitation.bridePhotoUrl} alt={`Foto ${brideFull}`} className="w-[56px] h-[56px] rounded-full object-cover border-3 border-white shadow-lg" />
                  ) : (
                    <div className="w-[56px] h-[56px] rounded-full flex items-center justify-center border-3 border-white shadow-lg font-cormorant text-xl font-black" style={{ background: `${accent}15`, color: accent }}>
                      {bride[0]}
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] tracking-[0.25em] font-bold uppercase opacity-60" style={{ color: accent }}>The Bride</p>
                <h3 className={`${fonts.heading} text-xl font-bold leading-tight`} style={{ color: accent }}>{brideFull}</h3>
                <p className="text-[11px] text-gray-500 font-light leading-relaxed">
                  Putri dari Bapak {invitation?.brideFather || "—"} &amp; Ibu {invitation?.brideMother || "—"}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════ 4. EVENTS ════════ */}
      <section aria-label="Acara" className="py-20 px-6">
        <div className="max-w-xl mx-auto space-y-10">
          <SectionHeading title={copy.eventsTitle} subtitle={copy.eventsSubtitle} color={accent} glyph={cfg.divider} fontClass={fonts.heading} />
          <div className="space-y-6">
            {invitation?.events?.map((evt, i) => (
              <Reveal key={evt.id} direction="up" delay={i * 0.12}>
                <div className="rounded-3xl bg-white border shadow-sm overflow-hidden" style={{ borderColor: `${accent}25` }}>
                  <div className="px-6 py-4 text-white text-center relative overflow-hidden" style={{ background: cfg.eventGradient }}>
                    {cfg.eventOverlay === "stripes" && (
                      <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(45deg,white,white_1px,transparent_0,transparent_12px)]" />
                    )}
                    {cfg.eventOverlay === "circle" && (
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-24 h-24 rounded-full border-2 border-white -translate-x-6 -translate-y-6" />
                      </div>
                    )}
                    {cfg.eventOverlay === "wave" && (
                      <svg className="absolute bottom-0 left-0 w-full h-6" viewBox="0 0 300 24" preserveAspectRatio="none" aria-hidden>
                        <path d="M0 0 C75 24, 150 0, 225 24 S300 0, 300 0" stroke="white" strokeWidth="1" opacity="0.15" fill="none" />
                      </svg>
                    )}
                    <p className="text-[10px] tracking-[0.3em] uppercase font-semibold opacity-80">Acara</p>
                    <h3 className={`${fonts.heading} text-2xl font-bold`}>{evt.name}</h3>
                  </div>
                  <div className="p-6 grid grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <p className="text-[9px] tracking-[0.2em] font-bold uppercase text-gray-400">Tanggal</p>
                      <p className="font-semibold text-gray-800 leading-snug">
                        {formatEventDate(evt.date)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] tracking-[0.2em] font-bold uppercase text-gray-400">Waktu</p>
                      <p className="font-semibold text-gray-800">{evt.startTime} {evt.endTime ? `– ${evt.endTime}` : "WIB"}</p>
                    </div>
                    <div className="col-span-2 space-y-1 pt-3 border-t" style={{ borderColor: `${accent}20` }}>
                      <p className="text-[9px] tracking-[0.2em] font-bold uppercase text-gray-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" style={{ color: accent }} /> Lokasi
                      </p>
                      <p className="font-bold text-gray-800">{evt.locationName}</p>
                      <p className="text-gray-500 font-light leading-relaxed">{evt.address}</p>
                    </div>
                  </div>
                  {evt.mapUrl && (
                    <div className="px-6 pb-6">
                      <a href={evt.mapUrl} target="_blank" rel="noreferrer"
                        className="w-full h-10 rounded-2xl flex items-center justify-center gap-2 text-[11px] font-bold text-white cursor-pointer hover:opacity-90"
                        style={{ background: cfg.eventGradient }}>
                        <MapPin className="w-3.5 h-3.5" />
                        Buka Google Maps
                      </a>
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
        <section aria-label="Cerita Cinta" className="py-20 px-6" style={{ background: surfaces.surfaceBg }}>
          <div className="max-w-xl mx-auto space-y-10">
            <SectionHeading title={copy.loveTitle} color={accent} glyph={cfg.divider} fontClass={fonts.heading} />
            <div className="relative pl-8 border-l-2 space-y-10" style={{ borderColor: `${accent}30` }}>
              {invitation.loveStories.map((story, i) => (
                <Reveal key={story.id} direction="left" delay={i * 0.1}>
                  <div className="relative">
                    <div className="absolute -left-[39px] top-2 w-5 h-5 rounded-full border-4 border-white shadow-md" style={{ background: accent }} />
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border shadow-sm space-y-2" style={{ borderColor: `${accent}20` }}>
                      <p className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: accent }}>{story.date}</p>
                      <h4 className={`${fonts.heading} text-xl font-bold text-gray-800`}>{story.title}</h4>
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
            <SectionHeading title={copy.galleryTitle} subtitle={copy.gallerySubtitle} color={accent} glyph={cfg.divider} fontClass={fonts.heading} />
            {galleryLayout === "CAROUSEL" ? (
              <Reveal direction="zoom">
                <div className="space-y-4">
                  <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden border shadow-xl" style={{ borderColor: `${accent}30` }}>
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={carouselIndex}
                        src={galleries[carouselIndex]?.mediaUrl}
                        alt={galleries[carouselIndex]?.caption || `Galeri ${carouselIndex + 1}`}
                        className="w-full h-full object-cover absolute inset-0"
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6 }}
                      />
                    </AnimatePresence>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                    {galleries.length > 1 && (
                      <>
                        <button type="button" onClick={prev} aria-label="Sebelumnya"
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-white shadow-md">
                          <ChevronLeft className="w-5 h-5" style={{ color: accent }} aria-hidden="true" />
                        </button>
                        <button type="button" onClick={next} aria-label="Berikutnya"
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-white shadow-md">
                          <ChevronRight className="w-5 h-5" style={{ color: accent }} aria-hidden="true" />
                        </button>
                      </>
                    )}
                    <div className="absolute bottom-4 right-4 bg-black/40 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
                      {carouselIndex + 1} / {galleries.length}
                    </div>
                  </div>
                  <div className="flex justify-center gap-1.5">
                    {galleries.map((_, i) => (
                      <button key={i} type="button" onClick={() => setIdx(i)} aria-label={`Galeri ${i + 1}`}
                        className={`rounded-full transition-all duration-300 cursor-pointer ${carouselIndex === i ? "w-6 h-2" : "w-2 h-2"}`}
                        style={{ background: carouselIndex === i ? accent : `${accent}40` }} />
                    ))}
                  </div>
                </div>
              </Reveal>
            ) : (
              <div className="columns-2 gap-3 space-y-3">
                {galleries.map((gal, i) => (
                  <Reveal key={gal.id} direction="zoom" delay={i * 0.07}>
                    <div className="break-inside-avoid rounded-2xl overflow-hidden shadow-sm border" style={{ borderColor: `${accent}20` }}>
                      <img src={gal.mediaUrl} alt={gal.caption || `Galeri ${i + 1}`} className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500" />
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
        <section aria-label="Kado" className="py-20 px-6" style={{ background: surfaces.surfaceBg }}>
          <div className="max-w-xl mx-auto space-y-10">
            <SectionHeading title={copy.giftsTitle} subtitle={copy.giftsSubtitle} color={accent} glyph={cfg.divider} fontClass={fonts.heading} />
            <div className="space-y-6 max-w-sm mx-auto">
              {invitation.gifts.map((gft, i) => (
                <Reveal key={gft.id} direction="up" delay={i * 0.15}>
                  {gft.type === "PHYSICAL" ? (
                    <div className="p-6 rounded-3xl bg-white border shadow-sm text-left space-y-3" style={{ borderColor: `${accent}25` }}>
                      <div className="flex items-center gap-2">
                        <Gift className="w-5 h-5" style={{ color: accent }} />
                        <h3 className="font-semibold text-gray-800">Kirim Kado Fisik</h3>
                      </div>
                      <p className="font-bold text-gray-800">{invitation?.physicalGiftReceiver}</p>
                      <p className="text-xs text-gray-500 leading-relaxed">{invitation?.physicalGiftAddress}</p>
                      {invitation?.physicalGiftPhone && <p className="text-xs text-gray-400">📞 {invitation.physicalGiftPhone}</p>}
                    </div>
                  ) : (
                    <BankCard
                      gift={gft}
                      copiedId={copiedId}
                      onCopy={onCopy}
                      gradient={cfg.bankCard.gradient}
                      overlay={cfg.bankCard.overlay}
                      chipClass={cfg.bankCard.chipClass}
                      accent={accent}
                      providerFont={cfg.bankCard.providerFont}
                      resolveGradient={cfg.bankCard.resolveGradient}
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
          <SectionHeading title={copy.rsvpTitle} subtitle={copy.rsvpSubtitle} color={accent} glyph={cfg.divider} fontClass={fonts.heading} />
          <Reveal direction="up">
            <div className="p-6 rounded-3xl bg-white border shadow-sm" style={{ borderColor: `${accent}25` }}>
              <RsvpForm
                invitationId={invitation.id}
                defaultGuestName={guestName}
                onRsvpSuccess={onRsvpSuccess}
                guest={guest}
                accent={accent}
                accentDark={cfg.accentDark}
                accentDarker={cfg.accentDarker}
              />
            </div>
          </Reveal>
          <Reveal direction="up" delay={0.1}>
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 pl-1">{copy.guestbookLabel} ({rsvps?.length || 0})</h3>
              <GuestWishes rsvps={rsvps} accent={accent} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════ 9. FOOTER ════════ */}
      <footer className="py-16 text-center space-y-6 border-t" style={{ borderColor: `${accent}20`, background: surfaces.footerBg }}>
        <Reveal direction="up"><Frame kind={cfg.frame} color={accent} size={80} /></Reveal>
        <Reveal direction="up" delay={0.1}>
          <div className="space-y-2">
            <p className="text-[10px] text-gray-400 font-light tracking-wider uppercase">Merupakan kehormatan bagi kami</p>
            <p className={`${fonts.heading} text-xl font-bold`} style={{ color: accent }}>Kami Yang Berbahagia,</p>
            <h4 className="font-greatvibes text-3xl" style={{ color: accent }}>{groom} &amp; {bride}</h4>
          </div>
        </Reveal>
        <Reveal direction="up" delay={0.2}>
          <div className="text-[9px] text-gray-400 tracking-[0.3em] font-semibold uppercase flex items-center justify-center gap-2">
            <span>CREATED WITH ♥ BY</span>
            <span className={`${fonts.heading} text-sm font-bold`} style={{ color: accent }}>IKARA</span>
          </div>
        </Reveal>
      </footer>
    </main>
  );
}
