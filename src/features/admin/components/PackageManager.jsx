"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/Badge";
import { Surface } from "@/components/ui/Surface";
import { Modal } from "@/components/ui/Modal";
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  Package as PackageIcon,
  SlidersHorizontal,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import {
  createPackageAction,
  updatePackageAction,
  deletePackageAction,
  createFeatureAction,
  updateFeatureAction,
  deleteFeatureAction,
} from "@/features/admin/actions";
import { formatRupiah } from "@/lib/format";

const FIELD_CLASS =
  "w-full rounded-xl border border-border bg-transparent px-3 py-2 text-xs text-foreground outline-none transition-colors focus:border-gold-400 focus:ring-2 focus:ring-gold-400/30";
const TH_CLASS = "px-4 py-3 font-semibold";
const MODAL_PANEL =
  "relative w-full max-w-2xl space-y-5 rounded-3xl border border-border/60 bg-card p-6 shadow-2xl sm:p-8 max-h-[90vh] overflow-y-auto";

const KIND_LABEL = { PLAN: "Paket", ADDON: "Add-on", BUNDLE: "Bundle" };
const SALE_LABEL = {
  ONE_TIME: "Sekali bayar",
  SUBSCRIPTION: "Langganan",
  RESELLER: "Reseller",
};

const EMPTY_PKG = {
  name: "",
  slug: "",
  description: "",
  kind: "PLAN",
  saleType: "ONE_TIME",
  price: 0,
  wholesalePrice: "",
  featuresText: "",
  maxInvitations: 1,
  durationDays: 180,
  sortOrder: 0,
  isHighlighted: false,
  isActive: true,
};

const EMPTY_FEATURE = {
  key: "",
  name: "",
  description: "",
  type: "BOOLEAN",
  unit: "",
  category: "",
  sortOrder: 0,
  isActive: true,
};

export function PackageManager({ packages = [], features = [] }) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  // --- Modal paket ---
  const [pkgModalOpen, setPkgModalOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState(null);
  const [pkgForm, setPkgForm] = useState(EMPTY_PKG);
  // Peta penugasan fitur: { [featureId]: { limitValue: string } } — key hadir = ditugaskan
  const [assignMap, setAssignMap] = useState({});
  // Peta isi bundle: { [itemId]: { quantity: number } } — key hadir = termasuk
  const [bundleMap, setBundleMap] = useState({});

  // --- Modal fitur ---
  const [featModalOpen, setFeatModalOpen] = useState(false);
  const [editingFeat, setEditingFeat] = useState(null);
  const [featForm, setFeatForm] = useState(EMPTY_FEATURE);

  const notify = (type, message) => {
    setFeedback({ type, message });
    if (type === "success") setTimeout(() => setFeedback({ type: "", message: "" }), 4000);
  };

  // ---------------------------------------------------------------------------
  // PAKET
  // ---------------------------------------------------------------------------
  const openCreatePkg = () => {
    setEditingPkg(null);
    setPkgForm(EMPTY_PKG);
    setAssignMap({});
    setBundleMap({});
    setPkgModalOpen(true);
  };

  const openEditPkg = (pkg) => {
    setEditingPkg(pkg);
    setPkgForm({
      name: pkg.name || "",
      slug: pkg.slug || "",
      description: pkg.description || "",
      kind: pkg.kind || "PLAN",
      saleType: pkg.saleType || "ONE_TIME",
      price: pkg.price ?? 0,
      wholesalePrice: pkg.wholesalePrice ?? "",
      featuresText: Array.isArray(pkg.features) ? pkg.features.join("\n") : "",
      maxInvitations: pkg.maxInvitations ?? 1,
      durationDays: pkg.durationDays ?? 180,
      sortOrder: pkg.sortOrder ?? 0,
      isHighlighted: !!pkg.isHighlighted,
      isActive: pkg.isActive ?? true,
    });
    const map = {};
    for (const pf of pkg.packageFeatures || []) {
      map[pf.featureId] = {
        limitValue: pf.limitValue == null ? "" : String(pf.limitValue),
      };
    }
    setAssignMap(map);

    const bmap = {};
    for (const bi of pkg.bundleItems || []) {
      bmap[bi.itemId] = { quantity: bi.quantity ?? 1 };
    }
    setBundleMap(bmap);

    setPkgModalOpen(true);
  };

  const toggleAssign = (featureId) => {
    setAssignMap((prev) => {
      const next = { ...prev };
      if (next[featureId]) delete next[featureId];
      else next[featureId] = { limitValue: "" };
      return next;
    });
  };

  const setAssignLimit = (featureId, value) => {
    setAssignMap((prev) => ({ ...prev, [featureId]: { limitValue: value } }));
  };

  const toggleBundleItem = (itemId) => {
    setBundleMap((prev) => {
      const next = { ...prev };
      if (next[itemId]) delete next[itemId];
      else next[itemId] = { quantity: 1 };
      return next;
    });
  };

  const setBundleQty = (itemId, value) => {
    setBundleMap((prev) => ({
      ...prev,
      [itemId]: { quantity: Math.max(1, parseInt(value) || 1) },
    }));
  };

  // Kandidat isi bundle: paket lain yang BUKAN bundle & bukan dirinya sendiri.
  const bundleCandidates = packages.filter(
    (p) => p.kind !== "BUNDLE" && p.id !== editingPkg?.id
  );

  const handlePkgSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback({ type: "", message: "" });

    const featureAssignments = Object.entries(assignMap).map(([featureId, v]) => ({
      featureId,
      enabled: true,
      limitValue: v.limitValue === "" ? null : v.limitValue,
    }));

    const bundleItems = Object.entries(bundleMap).map(([itemId, v]) => ({
      itemId,
      quantity: v.quantity ?? 1,
    }));

    const payload = {
      name: pkgForm.name,
      slug: pkgForm.slug,
      description: pkgForm.description,
      kind: pkgForm.kind,
      saleType: pkgForm.saleType,
      price: pkgForm.price,
      wholesalePrice: pkgForm.wholesalePrice,
      features: pkgForm.featuresText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      maxInvitations: pkgForm.maxInvitations,
      durationDays: pkgForm.durationDays,
      sortOrder: pkgForm.sortOrder,
      isHighlighted: pkgForm.isHighlighted,
      isActive: pkgForm.isActive,
      featureAssignments,
      bundleItems,
    };

    const res = editingPkg
      ? await updatePackageAction(editingPkg.id, payload)
      : await createPackageAction(payload);

    setLoading(false);
    if (res.success) {
      setPkgModalOpen(false);
      notify("success", res.message || "Paket tersimpan.");
      router.refresh();
    } else {
      notify("error", res.error || "Gagal menyimpan paket.");
    }
  };

  const handleDeletePkg = async (pkg) => {
    if (!confirm(`Hapus paket "${pkg.name}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    setLoading(true);
    const res = await deletePackageAction(pkg.id);
    setLoading(false);
    if (res.success) {
      notify("success", res.message || "Paket dihapus.");
      router.refresh();
    } else {
      notify("error", res.error || "Gagal menghapus paket.");
    }
  };

  // ---------------------------------------------------------------------------
  // FITUR
  // ---------------------------------------------------------------------------
  const openCreateFeat = () => {
    setEditingFeat(null);
    setFeatForm(EMPTY_FEATURE);
    setFeatModalOpen(true);
  };

  const openEditFeat = (feat) => {
    setEditingFeat(feat);
    setFeatForm({
      key: feat.key || "",
      name: feat.name || "",
      description: feat.description || "",
      type: feat.type || "BOOLEAN",
      unit: feat.unit || "",
      category: feat.category || "",
      sortOrder: feat.sortOrder ?? 0,
      isActive: feat.isActive ?? true,
    });
    setFeatModalOpen(true);
  };

  const handleFeatSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback({ type: "", message: "" });

    const res = editingFeat
      ? await updateFeatureAction(editingFeat.id, featForm)
      : await createFeatureAction(featForm);

    setLoading(false);
    if (res.success) {
      setFeatModalOpen(false);
      notify("success", res.message || "Fitur tersimpan.");
      router.refresh();
    } else {
      notify("error", res.error || "Gagal menyimpan fitur.");
    }
  };

  const handleDeleteFeat = async (feat) => {
    if (
      !confirm(
        `Hapus fitur "${feat.name}"? Penugasan fitur ini di semua paket akan ikut terhapus.`
      )
    )
      return;
    setLoading(true);
    const res = await deleteFeatureAction(feat.id);
    setLoading(false);
    if (res.success) {
      notify("success", res.message || "Fitur dihapus.");
      router.refresh();
    } else {
      notify("error", res.error || "Gagal menghapus fitur.");
    }
  };

  // ---------------------------------------------------------------------------
  return (
    <div className="space-y-8">
      {feedback.message && (
        <div
          className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-xs ${
            feedback.type === "success"
              ? "border-emerald-300/50 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
              : "border-rose-300/50 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
          ) : (
            <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* ====================== DAFTAR PAKET ====================== */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <PackageIcon className="h-4 w-4 text-gold-500" aria-hidden="true" />
            Paket &amp; Bundling
            <span className="text-xs font-normal text-muted-foreground">({packages.length})</span>
          </h3>
          <Button size="sm" onClick={openCreatePkg} disabled={loading}>
            <Plus aria-hidden="true" /> Paket Baru
          </Button>
        </div>

        <Surface padding="none" className="overflow-x-auto">
          {packages.length === 0 ? (
            <p className="px-4 py-8 text-center text-xs text-muted-foreground">
              Belum ada paket. Klik &ldquo;Paket Baru&rdquo; untuk menambah.
            </p>
          ) : (
            <table className="w-full min-w-180 text-left text-xs">
              <thead className="border-b border-border bg-muted/40 text-muted-foreground">
                <tr>
                  <th className={TH_CLASS}>Paket</th>
                  <th className={TH_CLASS}>Jenis</th>
                  <th className={TH_CLASS}>Harga</th>
                  <th className={TH_CLASS}>Masa Aktif</th>
                  <th className={TH_CLASS}>Fitur</th>
                  <th className={TH_CLASS}>Status</th>
                  <th className={`${TH_CLASS} text-right`}>Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {packages.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-foreground">
                        {pkg.name}
                        {pkg.isHighlighted && (
                          <Badge variant="goldSoft" className="ml-2">Populer</Badge>
                        )}
                      </div>
                      <div className="text-[11px] text-muted-foreground">/{pkg.slug}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div>{KIND_LABEL[pkg.kind] || pkg.kind}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {SALE_LABEL[pkg.saleType] || pkg.saleType}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground">{formatRupiah(pkg.price)}</div>
                      {pkg.wholesalePrice != null && (
                        <div className="text-[11px] text-muted-foreground">
                          grosir {formatRupiah(pkg.wholesalePrice)}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">{pkg.durationDays} hari</td>
                    <td className="px-4 py-3">
                      <span className="text-muted-foreground">
                        {pkg.packageFeatures?.length || 0} fitur
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={pkg.isActive ? "goldSoft" : "neutral"}>
                        {pkg.isActive ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1.5">
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          onClick={() => openEditPkg(pkg)}
                          aria-label={`Edit ${pkg.name}`}
                        >
                          <Edit aria-hidden="true" />
                        </Button>
                        <Button
                          size="icon-sm"
                          variant="destructive"
                          onClick={() => handleDeletePkg(pkg)}
                          aria-label={`Hapus ${pkg.name}`}
                        >
                          <Trash2 aria-hidden="true" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Surface>
      </div>

      {/* ====================== KATALOG FITUR ====================== */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <SlidersHorizontal className="h-4 w-4 text-gold-500" aria-hidden="true" />
            Katalog Fitur
            <span className="text-xs font-normal text-muted-foreground">({features.length})</span>
          </h3>
          <Button size="sm" variant="outline" onClick={openCreateFeat} disabled={loading}>
            <Plus aria-hidden="true" /> Fitur Baru
          </Button>
        </div>

        <Surface padding="none" className="overflow-x-auto">
          {features.length === 0 ? (
            <p className="px-4 py-8 text-center text-xs text-muted-foreground">
              Belum ada fitur. Tambahkan fitur lalu tugaskan ke paket.
            </p>
          ) : (
            <table className="w-full min-w-160 text-left text-xs">
              <thead className="border-b border-border bg-muted/40 text-muted-foreground">
                <tr>
                  <th className={TH_CLASS}>Fitur</th>
                  <th className={TH_CLASS}>Key</th>
                  <th className={TH_CLASS}>Tipe</th>
                  <th className={TH_CLASS}>Kategori</th>
                  <th className={TH_CLASS}>Status</th>
                  <th className={`${TH_CLASS} text-right`}>Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {features.map((feat) => (
                  <tr key={feat.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium text-foreground">{feat.name}</td>
                    <td className="px-4 py-3">
                      <code className="rounded bg-muted px-1.5 py-0.5 text-[11px]">{feat.key}</code>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={feat.type === "QUOTA" ? "goldSoft" : "neutral"}>
                        {feat.type === "QUOTA" ? `Kuota${feat.unit ? ` (${feat.unit})` : ""}` : "On/Off"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{feat.category || "—"}</td>
                    <td className="px-4 py-3">
                      <Badge variant={feat.isActive ? "goldSoft" : "neutral"}>
                        {feat.isActive ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1.5">
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          onClick={() => openEditFeat(feat)}
                          aria-label={`Edit ${feat.name}`}
                        >
                          <Edit aria-hidden="true" />
                        </Button>
                        <Button
                          size="icon-sm"
                          variant="destructive"
                          onClick={() => handleDeleteFeat(feat)}
                          aria-label={`Hapus ${feat.name}`}
                        >
                          <Trash2 aria-hidden="true" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Surface>
      </div>

      {/* ====================== MODAL PAKET ====================== */}
      <Modal
        open={pkgModalOpen}
        onClose={() => setPkgModalOpen(false)}
        labelledBy="pkg-modal-title"
        panelClassName={MODAL_PANEL}
        showClose
      >
        <h3 id="pkg-modal-title" className="text-base font-semibold text-foreground">
          {editingPkg ? "Edit Paket" : "Paket Baru"}
        </h3>
        <form onSubmit={handlePkgSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Nama Paket</label>
              <input
                type="text"
                required
                value={pkgForm.name}
                onChange={(e) => setPkgForm({ ...pkgForm, name: e.target.value })}
                placeholder="Contoh: Gold"
                className={FIELD_CLASS}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Slug (unik)</label>
              <input
                type="text"
                required
                value={pkgForm.slug}
                onChange={(e) => setPkgForm({ ...pkgForm, slug: e.target.value })}
                placeholder="gold"
                className={FIELD_CLASS}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Deskripsi singkat</label>
            <input
              type="text"
              value={pkgForm.description}
              onChange={(e) => setPkgForm({ ...pkgForm, description: e.target.value })}
              placeholder="Opsional — ditampilkan di kartu harga"
              className={FIELD_CLASS}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Jenis Produk</label>
              <select
                value={pkgForm.kind}
                onChange={(e) => setPkgForm({ ...pkgForm, kind: e.target.value })}
                className={`${FIELD_CLASS} cursor-pointer`}
              >
                <option value="PLAN">Paket (PLAN)</option>
                <option value="ADDON">Add-on</option>
                <option value="BUNDLE">Bundle</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Model Penjualan</label>
              <select
                value={pkgForm.saleType}
                onChange={(e) => setPkgForm({ ...pkgForm, saleType: e.target.value })}
                className={`${FIELD_CLASS} cursor-pointer`}
              >
                <option value="ONE_TIME">Sekali bayar (eceran)</option>
                <option value="SUBSCRIPTION">Langganan</option>
                <option value="RESELLER">Reseller</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Harga (Rp)</label>
              <input
                type="number"
                min="0"
                value={pkgForm.price}
                onChange={(e) => setPkgForm({ ...pkgForm, price: e.target.value })}
                className={FIELD_CLASS}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Harga Grosir (Rp) <span className="font-normal text-muted-foreground">— reseller</span>
              </label>
              <input
                type="number"
                min="0"
                value={pkgForm.wholesalePrice}
                onChange={(e) => setPkgForm({ ...pkgForm, wholesalePrice: e.target.value })}
                placeholder="Opsional"
                className={FIELD_CLASS}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Kuota Undangan</label>
              <input
                type="number"
                min="1"
                value={pkgForm.maxInvitations}
                onChange={(e) => setPkgForm({ ...pkgForm, maxInvitations: e.target.value })}
                className={FIELD_CLASS}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Masa Aktif (hari)</label>
              <input
                type="number"
                min="1"
                value={pkgForm.durationDays}
                onChange={(e) => setPkgForm({ ...pkgForm, durationDays: e.target.value })}
                className={FIELD_CLASS}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Urutan</label>
              <input
                type="number"
                value={pkgForm.sortOrder}
                onChange={(e) => setPkgForm({ ...pkgForm, sortOrder: e.target.value })}
                className={FIELD_CLASS}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Bullet Fitur (tampilan) <span className="font-normal text-muted-foreground">— satu per baris</span>
            </label>
            <textarea
              rows={4}
              value={pkgForm.featuresText}
              onChange={(e) => setPkgForm({ ...pkgForm, featuresText: e.target.value })}
              placeholder={"Tanpa Watermark\nSemua Tema Premium\nMasa Aktif 1 Tahun"}
              className={FIELD_CLASS}
            />
          </div>

          {/* Penugasan fitur (gating sebenarnya) */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground">
              Fitur Aktif <span className="font-normal text-muted-foreground">— menentukan gating & kuota nyata</span>
            </label>
            {features.length === 0 ? (
              <p className="rounded-xl border border-dashed border-border px-3 py-4 text-center text-[11px] text-muted-foreground">
                Belum ada fitur di katalog. Tambahkan fitur dulu di bawah.
              </p>
            ) : (
              <div className="grid max-h-56 grid-cols-1 gap-1.5 overflow-y-auto rounded-xl border border-border p-2 sm:grid-cols-2">
                {features.map((feat) => {
                  const assigned = !!assignMap[feat.id];
                  return (
                    <div
                      key={feat.id}
                      className={`flex items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-[11px] ${
                        assigned ? "bg-gold-400/10" : ""
                      }`}
                    >
                      <label className="flex min-w-0 cursor-pointer items-center gap-2">
                        <input
                          type="checkbox"
                          checked={assigned}
                          onChange={() => toggleAssign(feat.id)}
                          className="accent-gold-400"
                        />
                        <span className="truncate text-foreground">{feat.name}</span>
                      </label>
                      {assigned && feat.type === "QUOTA" && (
                        <input
                          type="number"
                          min="0"
                          value={assignMap[feat.id].limitValue}
                          onChange={(e) => setAssignLimit(feat.id, e.target.value)}
                          placeholder="∞"
                          title="Kosongkan untuk tak terbatas"
                          className="w-20 rounded-lg border border-border bg-transparent px-2 py-1 text-[11px] outline-none focus:border-gold-400"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Isi bundle (hanya untuk kind BUNDLE) */}
          {pkgForm.kind === "BUNDLE" && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">
                Isi Bundle{" "}
                <span className="font-normal text-muted-foreground">
                  — paket/add-on yang digabung (fiturnya otomatis tergabung)
                </span>
              </label>
              {bundleCandidates.length === 0 ? (
                <p className="rounded-xl border border-dashed border-border px-3 py-4 text-center text-[11px] text-muted-foreground">
                  Belum ada paket lain untuk dimasukkan ke bundle.
                </p>
              ) : (
                <div className="grid max-h-56 grid-cols-1 gap-1.5 overflow-y-auto rounded-xl border border-border p-2">
                  {bundleCandidates.map((cand) => {
                    const included = !!bundleMap[cand.id];
                    return (
                      <div
                        key={cand.id}
                        className={`flex items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-[11px] ${
                          included ? "bg-gold-400/10" : ""
                        }`}
                      >
                        <label className="flex min-w-0 cursor-pointer items-center gap-2">
                          <input
                            type="checkbox"
                            checked={included}
                            onChange={() => toggleBundleItem(cand.id)}
                            className="accent-gold-400"
                          />
                          <span className="truncate text-foreground">{cand.name}</span>
                          <span className="shrink-0 text-muted-foreground">
                            ({formatRupiah(cand.price)})
                          </span>
                        </label>
                        {included && (
                          <input
                            type="number"
                            min="1"
                            value={bundleMap[cand.id].quantity}
                            onChange={(e) => setBundleQty(cand.id, e.target.value)}
                            title="Jumlah"
                            className="w-16 rounded-lg border border-border bg-transparent px-2 py-1 text-[11px] outline-none focus:border-gold-400"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-6 pt-1">
            <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-foreground">
              <input
                type="checkbox"
                checked={pkgForm.isHighlighted}
                onChange={(e) => setPkgForm({ ...pkgForm, isHighlighted: e.target.checked })}
                className="accent-gold-400"
              />
              Tandai &ldquo;Populer&rdquo;
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-foreground">
              <input
                type="checkbox"
                checked={pkgForm.isActive}
                onChange={(e) => setPkgForm({ ...pkgForm, isActive: e.target.checked })}
                className="accent-gold-400"
              />
              Aktif
            </label>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading && <Loader2 className="animate-spin" aria-hidden="true" />}
            {editingPkg ? "Perbarui Paket" : "Simpan Paket"}
          </Button>
        </form>
      </Modal>

      {/* ====================== MODAL FITUR ====================== */}
      <Modal
        open={featModalOpen}
        onClose={() => setFeatModalOpen(false)}
        labelledBy="feat-modal-title"
        panelClassName="relative w-full max-w-lg space-y-5 rounded-3xl border border-border/60 bg-card p-6 shadow-2xl sm:p-8"
        showClose
      >
        <h3 id="feat-modal-title" className="text-base font-semibold text-foreground">
          {editingFeat ? "Edit Fitur" : "Fitur Baru"}
        </h3>
        <form onSubmit={handleFeatSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Key (unik)</label>
              <input
                type="text"
                required
                value={featForm.key}
                onChange={(e) => setFeatForm({ ...featForm, key: e.target.value })}
                placeholder="LIVE_STREAM"
                className={FIELD_CLASS}
              />
              <p className="text-[10px] text-muted-foreground">Otomatis HURUF_BESAR. Dipakai di kode.</p>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Nama Tampilan</label>
              <input
                type="text"
                required
                value={featForm.name}
                onChange={(e) => setFeatForm({ ...featForm, name: e.target.value })}
                placeholder="Live Streaming"
                className={FIELD_CLASS}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Deskripsi</label>
            <input
              type="text"
              value={featForm.description}
              onChange={(e) => setFeatForm({ ...featForm, description: e.target.value })}
              placeholder="Opsional"
              className={FIELD_CLASS}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Tipe</label>
              <select
                value={featForm.type}
                onChange={(e) => setFeatForm({ ...featForm, type: e.target.value })}
                className={`${FIELD_CLASS} cursor-pointer`}
              >
                <option value="BOOLEAN">On/Off</option>
                <option value="QUOTA">Kuota</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Satuan</label>
              <input
                type="text"
                value={featForm.unit}
                onChange={(e) => setFeatForm({ ...featForm, unit: e.target.value })}
                placeholder="tamu / foto"
                className={FIELD_CLASS}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Urutan</label>
              <input
                type="number"
                value={featForm.sortOrder}
                onChange={(e) => setFeatForm({ ...featForm, sortOrder: e.target.value })}
                className={FIELD_CLASS}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Kategori</label>
              <input
                type="text"
                value={featForm.category}
                onChange={(e) => setFeatForm({ ...featForm, category: e.target.value })}
                placeholder="Tamu / Media / Kuota"
                className={FIELD_CLASS}
              />
            </div>
            <div className="flex items-end">
              <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-foreground">
                <input
                  type="checkbox"
                  checked={featForm.isActive}
                  onChange={(e) => setFeatForm({ ...featForm, isActive: e.target.checked })}
                  className="accent-gold-400"
                />
                Aktif
              </label>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading && <Loader2 className="animate-spin" aria-hidden="true" />}
            {editingFeat ? "Perbarui Fitur" : "Simpan Fitur"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
