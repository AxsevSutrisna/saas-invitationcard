import { CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

// Bullet fitur yang ditandai "(Segera Hadir)" dirender berbeda (bukan centang)
// agar tidak terbaca sebagai fitur yang sudah termasuk.
const COMING_SOON_RE = /\(segera hadir\)/i;

/**
 * FeatureList — daftar fitur dengan ikon centang emerald. Menggantikan pola
 * `<li><CheckCircle/> teks</li>` yang di-copy di kartu paket/upgrade.
 * Fitur ber-label "(Segera Hadir)" tampil redup dengan ikon jam.
 *
 * @param {object} props
 * @param {string[]} props.items
 * @param {number} [props.max] batasi jumlah item yang dirender
 * @param {string} [props.className] kelas <ul>
 * @param {string} [props.itemClassName] kelas tiap <li>
 */
export function FeatureList({ items = [], max, className, itemClassName }) {
  const list = max ? items.slice(0, max) : items;
  return (
    <ul className={cn("space-y-3", className)}>
      {list.map((feat, i) => {
        const soon = COMING_SOON_RE.test(feat);
        return (
          <li
            key={i}
            className={cn(
              "flex items-start gap-2.5 text-xs",
              soon ? "text-muted-foreground/70" : "text-muted-foreground",
              itemClassName
            )}
          >
            {soon ? (
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/60" aria-hidden="true" />
            ) : (
              <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden="true" />
            )}
            <span>{feat}</span>
          </li>
        );
      })}
    </ul>
  );
}
