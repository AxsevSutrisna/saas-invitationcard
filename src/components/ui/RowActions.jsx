import { Edit, Trash2 } from "lucide-react";
import { Button } from "./button";

/**
 * RowActions — pasangan tombol ikon Edit + Hapus untuk sel aksi tabel.
 * Menggantikan pola `<Button icon-sm ghost/><Button icon-sm destructive/>` yang
 * berulang di tabel admin. Tombol dirender hanya bila handler-nya diberikan.
 *
 * @param {object} props
 * @param {() => void} [props.onEdit]
 * @param {() => void} [props.onDelete]
 * @param {string} [props.editLabel]
 * @param {string} [props.deleteLabel]
 * @param {boolean} [props.disabled]
 */
export function RowActions({
  onEdit,
  onDelete,
  editLabel = "Edit",
  deleteLabel = "Hapus",
  disabled = false,
}) {
  return (
    <div className="flex justify-end gap-1.5">
      {onEdit && (
        <Button size="icon-sm" variant="ghost" onClick={onEdit} disabled={disabled} aria-label={editLabel}>
          <Edit aria-hidden="true" />
        </Button>
      )}
      {onDelete && (
        <Button size="icon-sm" variant="destructive" onClick={onDelete} disabled={disabled} aria-label={deleteLabel}>
          <Trash2 aria-hidden="true" />
        </Button>
      )}
    </div>
  );
}
