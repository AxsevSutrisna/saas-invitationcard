/**
 * MapEmbed — peta Google Maps tersemat (iframe) untuk lokasi acara.
 *
 * Memakai endpoint embed publik `maps.google.com/maps?q=...&output=embed`
 * sehingga TIDAK memerlukan API key. Query dibangun dari nama tempat + alamat.
 * Border di-tint mengikuti warna aksen tema agar menyatu secara visual.
 *
 * @param {{ locationName?: string, address?: string, accent?: string, title?: string }} props
 */
export function MapEmbed({ locationName, address, accent = "#C8A96A", title }) {
  const query = [locationName, address].filter(Boolean).join(", ").trim();
  if (!query) return null;

  const src = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=16&output=embed`;

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl border shadow-sm"
      style={{ borderColor: `${accent}33`, aspectRatio: "16 / 10" }}
    >
      <iframe
        src={src}
        title={title || `Peta lokasi ${locationName || "acara"}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        className="absolute inset-0 h-full w-full border-0"
      />
    </div>
  );
}
