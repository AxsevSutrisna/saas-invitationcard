import { Surface } from "./Surface";
import { cn } from "@/lib/utils";

const TH_CLASS = "px-4 py-3 font-semibold";

/**
 * AdminTableShell — kerangka tabel seragam (Surface + overflow-x + thead/tbody
 * styling + header sel). Baris isi tetap ditulis pemanggil sebagai children
 * (`<tr>...`). Menghapus boilerplate tabel yang berulang di panel admin.
 *
 * @param {object} props
 * @param {(string|{label:import("react").ReactNode,align?:"right"})[]} props.headers kolom
 * @param {string} [props.minWidth] util lebar minimum tabel (mis. "min-w-180")
 * @param {string} [props.bodyClassName] kelas <tbody> (default divide-y divide-border)
 * @param {import("react").ReactNode} [props.empty] tampilan bila kosong (ganti tabel)
 * @param {import("react").ReactNode} props.children isi <tbody>
 */
export function AdminTableShell({
  headers = [],
  minWidth = "",
  bodyClassName = "divide-y divide-border",
  empty,
  children,
}) {
  return (
    <Surface padding="none" className="overflow-x-auto">
      {empty ? (
        empty
      ) : (
        <table className={cn("w-full text-left text-xs", minWidth)}>
          <thead className="border-b border-border bg-muted/40 text-muted-foreground">
            <tr>
              {headers.map((h, i) => {
                const label = typeof h === "string" ? h : h.label;
                const align = typeof h === "object" && h.align === "right" ? " text-right" : "";
                return (
                  <th key={i} className={TH_CLASS + align}>
                    {label}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className={bodyClassName}>{children}</tbody>
        </table>
      )}
    </Surface>
  );
}
