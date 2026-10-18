import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * FeatureList — daftar fitur dengan ikon centang emerald. Menggantikan pola
 * `<li><CheckCircle/> teks</li>` yang di-copy di kartu paket/upgrade.
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
      {list.map((feat, i) => (
        <li
          key={i}
          className={cn("flex items-start gap-2.5 text-xs text-muted-foreground", itemClassName)}
        >
          <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden="true" />
          <span>{feat}</span>
        </li>
      ))}
    </ul>
  );
}
