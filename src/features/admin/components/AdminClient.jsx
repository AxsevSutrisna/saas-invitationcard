"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FileUploader } from "@/components/shared/FileUploader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/Badge";
import { Surface } from "@/components/ui/Surface";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  Users as UsersIcon,
  CreditCard as CreditCardIcon,
  Palette,
  Quote,
  Music,
  HelpCircle,
  Settings,
  Plus,
  Trash2,
  Edit,
  DollarSign,
  Sparkles,
  Lock,
  Globe,
  Loader2,
  X,
  CheckCircle,
  Clock,
  AlertTriangle
} from "lucide-react";
import {
  updateUserRoleAction,
  upgradeUserSubscriptionAction,
  createThemeAction,
  updateThemeAction,
  deleteThemeAction,
  createQuoteTemplateAction,
  updateQuoteTemplateAction,
  deleteQuoteTemplateAction,
  createMusicTemplateAction,
  updateMusicTemplateAction,
  deleteMusicTemplateAction,
  createFaqAction,
  updateFaqAction,
  deleteFaqAction,
  updateSystemSettingAction
} from "@/features/admin/actions";
import { formatRupiah } from "@/lib/format";

const TAB_TITLES = {
  users: {
    title: "Manajemen Pengguna",
    description: "Kelola peran (role) pengguna platform dan upgrade paket langganan secara manual.",
  },
  transactions: {
    title: "Monitoring Transaksi Pembayaran",
    description: "Pantau riwayat transaksi pembayaran masuk dari Midtrans dan total pendapatan.",
  },
  themes: {
    title: "Manajemen Tema Desain",
    description: "Tambah, edit, dan hapus tema undangan pernikahan digital yang tersedia.",
  },
  quotes: {
    title: "Templat Ayat & Kutipan",
    description: "Kelola kumpulan preset ayat kitab suci dan kutipan cinta romantis.",
  },
  musics: {
    title: "Pustaka Lagu Latar",
    description: "Kelola daftar lagu latar pernikahan (.mp3) untuk musik latar undangan.",
  },
  faqs: {
    title: "Kelola FAQ Landing Page",
    description: "Atur daftar pertanyaan dan jawaban umum yang ditayangkan pada landing page.",
  },
  settings: {
    title: "Setelan WhatsApp Support",
    description: "Kelola nomor kontak WhatsApp bantuan pelanggan untuk tombol chat melayang di landing page.",
  },
};

const TAB_ICONS = {
  users: UsersIcon,
  transactions: CreditCardIcon,
  themes: Palette,
  quotes: Quote,
  musics: Music,
  faqs: HelpCircle,
  settings: Settings,
};

// Kelas field seragam (rule desain: rounded-xl + border-border + fokus emas).
const FIELD_CLASS =
  "w-full rounded-xl border border-border bg-transparent px-3 py-2 text-xs text-foreground outline-none transition-colors focus:border-gold-400 focus:ring-2 focus:ring-gold-400/30";

// Kelas header sel tabel seragam.
const TH_CLASS = "px-4 py-3 font-semibold";

export function AdminClient({
  initialUsers,
  initialTransactions,
  initialThemes,
  initialQuotes,
  initialMusics,
  initialFaqs,
  initialSettings,
  packages
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Tab aktif diturunkan langsung dari URL (?tab=) sebagai satu sumber kebenaran —
  // tanpa state lokal + efek sinkronisasi. Sidebar admin memakai pola yang sama.
  const activeTab = searchParams.get("tab") || "users";

  const handleTabChange = (tabId) => {
    router.push(`/dashboard/admin?tab=${tabId}`);
  };
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  // State List (Local copy untuk reaktif render)
  const [users, setUsers] = useState(initialUsers);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [themes, setThemes] = useState(initialThemes);
  const [quotes, setQuotes] = useState(initialQuotes);
  const [musics, setMusics] = useState(initialMusics);
  const [faqs, setFaqs] = useState(initialFaqs);
  const [settings, setSettings] = useState(initialSettings);

  // Modal Control States
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // "theme" | "quote" | "music" | "faq" | "upgrade_user"
  const [editItem, setEditItem] = useState(null); // Item yang sedang diedit (null jika tambah baru)

  // Pengaturan Nomor WA
  const waSetting = settings.find((s) => s.key === "CS_WHATSAPP_NUMBER")?.value || "6281234567890";
  const [waNumberInput, setWaNumberInput] = useState(waSetting);

  // Form inputs untuk CRUD
  const [themeInput, setThemeInput] = useState({ name: "", slug: "", description: "", thumbnailUrl: "", isPremium: false, isActive: true });
  const [quoteInput, setQuoteInput] = useState({ title: "", content: "", category: "Islami" });
  const [musicInput, setMusicInput] = useState({ title: "", url: "", isActive: true });
  const [faqInput, setFaqInput] = useState({ question: "", answer: "", sortOrder: "" });
  const [upgradeInput, setUpgradeInput] = useState({ userId: "", userName: "", packageId: "" });
  const [musicSourceTab, setMusicSourceTab] = useState("upload");
  const [themeThumbnailSourceTab, setThemeThumbnailSourceTab] = useState("upload");

  const triggerFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: "", message: "" }), 4000);
  };

  // Tutup Modal & Reset Form
  const closeModal = () => {
    setModalOpen(false);
    setEditItem(null);
    setThemeInput({ name: "", slug: "", description: "", thumbnailUrl: "", isPremium: false, isActive: true });
    setQuoteInput({ title: "", content: "", category: "Islami" });
    setMusicInput({ title: "", url: "", isActive: true });
    setFaqInput({ question: "", answer: "", sortOrder: "" });
    setUpgradeInput({ userId: "", userName: "", packageId: "" });
  };

  // Open modal dengan konfigurasi spesifik
  const openAddModal = (type) => {
    setModalType(type);
    setEditItem(null);
    if (type === "music") {
      setMusicSourceTab("upload");
    } else if (type === "theme") {
      setThemeThumbnailSourceTab("upload");
    }
    setModalOpen(true);
  };

  const openEditModal = (type, item) => {
    setModalType(type);
    setEditItem(item);
    if (type === "theme") {
      setThemeInput({
        name: item.name,
        slug: item.slug,
        description: item.description || "",
        thumbnailUrl: item.thumbnailUrl || "",
        isPremium: item.isPremium,
        isActive: item.isActive
      });
      const isUploaded = item.thumbnailUrl?.includes("/invitations/");
      setThemeThumbnailSourceTab(isUploaded ? "upload" : "url");
    } else if (type === "quote") {
      setQuoteInput({
        title: item.title,
        content: item.content,
        category: item.category
      });
    } else if (type === "music") {
      setMusicInput({
        title: item.title,
        url: item.url,
        isActive: item.isActive
      });
      const isUploaded = item.url?.includes("/invitations/");
      setMusicSourceTab(isUploaded ? "upload" : "url");
    } else if (type === "faq") {
      setFaqInput({
        question: item.question,
        answer: item.answer,
        sortOrder: item.sortOrder
      });
    }
    setModalOpen(true);
  };

  // ---------------------------------------------------------------------------
  // HANDLERS (SUBMIT CRUD ACTIONS)
  // ---------------------------------------------------------------------------

  // 1. Submit User Role Update
  const handleUserRoleChange = async (userId, newRole) => {
    setLoading(true);
    const res = await updateUserRoleAction(userId, newRole);
    setLoading(false);
    if (res.success) {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
      triggerFeedback("success", res.message);
    } else {
      triggerFeedback("error", res.error);
    }
  };

  // 2. Submit Manual Subscription Upgrade
  const handleUpgradeSubscription = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await upgradeUserSubscriptionAction(upgradeInput.userId, upgradeInput.packageId);
    setLoading(false);
    if (res.success) {
      // Ambil paket yang dipilih untuk reaktif render di tabel
      const selectedPkg = packages.find((p) => p.id === upgradeInput.packageId);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === upgradeInput.userId
            ? {
                ...u,
                subscriptions: [
                  {
                    status: "ACTIVE",
                    validUntil: new Date(Date.now() + selectedPkg.durationDays * 24 * 60 * 60 * 1000).toISOString(),
                    package: selectedPkg
                  }
                ]
              }
            : u
        )
      );
      triggerFeedback("success", res.message);
      closeModal();
    } else {
      triggerFeedback("error", res.error);
    }
  };

  // 3. Submit Theme Create / Update
  const handleThemeSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let res;
    if (editItem) {
      res = await updateThemeAction(editItem.id, themeInput);
    } else {
      res = await createThemeAction(themeInput);
    }
    setLoading(false);

    if (res.success) {
      // Refresh local list
      if (editItem) {
        setThemes((prev) => prev.map((t) => (t.id === editItem.id ? { ...t, ...themeInput } : t)));
      } else {
        // Trik reaktif: insert manual sementara menggunakan data riil dari database
        setThemes((prev) => [...prev, res.data]);
      }
      triggerFeedback("success", res.message);
      closeModal();
    } else {
      triggerFeedback("error", res.error);
    }
  };

  // 4. Delete Theme
  const handleThemeDelete = async (themeId) => {
    if (!confirm("Apakah Anda yakin ingin menghapus tema ini?")) return;
    setLoading(true);
    const res = await deleteThemeAction(themeId);
    setLoading(false);
    if (res.success) {
      setThemes((prev) => prev.filter((t) => t.id !== themeId));
      triggerFeedback("success", res.message);
    } else {
      triggerFeedback("error", res.error);
    }
  };

  // 5. Submit Quote Template Create / Update
  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let res;
    if (editItem) {
      res = await updateQuoteTemplateAction(editItem.id, quoteInput);
    } else {
      res = await createQuoteTemplateAction(quoteInput);
    }
    setLoading(false);

    if (res.success) {
      if (editItem) {
        setQuotes((prev) => prev.map((q) => (q.id === editItem.id ? { ...q, ...quoteInput } : q)));
      } else {
        setQuotes((prev) => [...prev, res.data]);
      }
      triggerFeedback("success", res.message);
      closeModal();
    } else {
      triggerFeedback("error", res.error);
    }
  };

  // 6. Delete Quote Template
  const handleQuoteDelete = async (quoteId) => {
    if (!confirm("Apakah Anda yakin ingin menghapus template ayat ini?")) return;
    setLoading(true);
    const res = await deleteQuoteTemplateAction(quoteId);
    setLoading(false);
    if (res.success) {
      setQuotes((prev) => prev.filter((q) => q.id !== quoteId));
      triggerFeedback("success", res.message);
    } else {
      triggerFeedback("error", res.error);
    }
  };

  // 7. Submit Music Template Create / Update
  const handleMusicSubmit = async (e) => {
    e.preventDefault();
    if (!musicInput.url) {
      triggerFeedback("error", "Silakan unggah berkas MP3 atau tempel tautan URL terlebih dahulu.");
      return;
    }
    setLoading(true);
    let res;
    if (editItem) {
      res = await updateMusicTemplateAction(editItem.id, musicInput);
    } else {
      res = await createMusicTemplateAction(musicInput);
    }
    setLoading(false);

    if (res.success) {
      if (editItem) {
        setMusics((prev) => prev.map((m) => (m.id === editItem.id ? { ...m, ...musicInput } : m)));
      } else {
        setMusics((prev) => [...prev, res.data]);
      }
      triggerFeedback("success", res.message);
      closeModal();
    } else {
      triggerFeedback("error", res.error);
    }
  };

  // 8. Delete Music Template
  const handleMusicDelete = async (musicId) => {
    if (!confirm("Apakah Anda yakin ingin menghapus lagu ini?")) return;
    setLoading(true);
    const res = await deleteMusicTemplateAction(musicId);
    setLoading(false);
    if (res.success) {
      setMusics((prev) => prev.filter((m) => m.id !== musicId));
      triggerFeedback("success", res.message);
    } else {
      triggerFeedback("error", res.error);
    }
  };

  // 9. Submit FAQ Create / Update
  const handleFaqSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let res;
    if (editItem) {
      res = await updateFaqAction(editItem.id, faqInput);
    } else {
      res = await createFaqAction(faqInput);
    }
    setLoading(false);

    if (res.success) {
      if (editItem) {
        setFaqs((prev) => prev.map((f) => (f.id === editItem.id ? { ...f, ...faqInput } : f)));
      } else {
        setFaqs((prev) => [...prev, res.data]);
      }
      triggerFeedback("success", res.message);
      closeModal();
    } else {
      triggerFeedback("error", res.error);
    }
  };

  // 10. Delete FAQ
  const handleFaqDelete = async (faqId) => {
    if (!confirm("Apakah Anda yakin ingin menghapus FAQ ini?")) return;
    setLoading(true);
    const res = await deleteFaqAction(faqId);
    setLoading(false);
    if (res.success) {
      setFaqs((prev) => prev.filter((f) => f.id !== faqId));
      triggerFeedback("success", res.message);
    } else {
      triggerFeedback("error", res.error);
    }
  };

  // 11. Submit WhatsApp Setting Update
  const handleWaSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await updateSystemSettingAction("CS_WHATSAPP_NUMBER", waNumberInput);
    setLoading(false);
    if (res.success) {
      triggerFeedback("success", res.message);
    } else {
      triggerFeedback("error", res.error);
    }
  };

  // Hitung Pendapatan Omzet Sukses
  const successTransactions = transactions.filter((t) => t.status === "SUCCESS");
  const totalRevenue = successTransactions.reduce((acc, curr) => acc + curr.amount, 0);

  const currentTitle = TAB_TITLES[activeTab]?.title || "Command Center Super Admin";
  const currentDesc = TAB_TITLES[activeTab]?.description || "Kelola data platform secara terpadu.";

  const HeaderIcon = TAB_ICONS[activeTab] || Lock;

  return (
    <div className="space-y-8">
      {/* 1. Header Admin Panel */}
      <PageHeader
        title={
          <span className="inline-flex items-center gap-2.5">
            <HeaderIcon className="h-7 w-7 text-gold-400" aria-hidden="true" />
            {currentTitle}
          </span>
        }
        description={currentDesc}
      />

      {/* 2. Banner Notifikasi Feedback */}
      {feedback.message && (
        <div
          role="status"
          aria-live="polite"
          className={`flex items-center gap-2 rounded-2xl border p-4 text-xs font-semibold shadow-sm transition-all ${
            feedback.type === "success"
              ? "border-emerald-500/20 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400"
              : "border-rose-500/20 bg-rose-50 text-rose-800 dark:bg-rose-950/20 dark:text-rose-400"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
          ) : (
            <AlertTriangle className="h-5 w-5 shrink-0" aria-hidden="true" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* 4. Tab Contents Panel */}
      <Surface as="section" padding="none" className="p-6 sm:p-8">

        {/* ==================================== TAB 1: USERS ==================================== */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <h2 className="font-heading text-lg font-bold text-foreground">Daftar Pengguna ({users.length})</h2>
            {users.length === 0 ? (
              <EmptyState
                icon={UsersIcon}
                title="Belum Ada Pengguna"
                description="Data pengguna platform akan tampil di sini setelah ada yang mendaftar."
              />
            ) : (
              <Surface padding="none" className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-muted/40 text-muted-foreground">
                      <th scope="col" className={TH_CLASS}>Nama & Email</th>
                      <th scope="col" className={TH_CLASS}>Peran (Role)</th>
                      <th scope="col" className={TH_CLASS}>Paket Aktif</th>
                      <th scope="col" className={`${TH_CLASS} text-right`}>Tindakan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {users.map((user) => {
                      const activeSub = user.subscriptions?.[0];
                      return (
                        <tr key={user.id} className="transition-colors hover:bg-gold-400/5">
                          <td className="px-4 py-3.5">
                            <div className="font-semibold text-foreground">{user.name || "Tanpa Nama"}</div>
                            <div className="text-[10px] font-light text-muted-foreground">{user.email}</div>
                          </td>
                          <td className="px-4 py-3.5">
                            <select
                              value={user.role}
                              onChange={(e) => handleUserRoleChange(user.id, e.target.value)}
                              disabled={loading || user.role === "SUPER_ADMIN"}
                              aria-label={`Ubah peran untuk ${user.name || user.email}`}
                              className="cursor-pointer rounded-lg border border-border bg-transparent px-1.5 py-0.5 font-semibold text-foreground outline-none transition-colors focus:border-gold-400 focus:ring-2 focus:ring-gold-400/30"
                            >
                              <option value="USER">USER</option>
                              <option value="ADMIN">ADMIN</option>
                              <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                            </select>
                          </td>
                          <td className="px-4 py-3.5">
                            {activeSub ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gold-400">
                                <Sparkles className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                                {activeSub.package.name} (s.d. {new Date(activeSub.validUntil).toLocaleDateString("id-ID")})
                              </span>
                            ) : (
                              <span className="font-light text-muted-foreground">Free Trial</span>
                            )}
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <div className="flex items-center justify-end">
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => {
                                  setUpgradeInput({ userId: user.id, userName: user.name || user.email, packageId: packages[0]?.id || "" });
                                  setModalType("upgrade_user");
                                  setModalOpen(true);
                                }}
                              >
                                Upgrade Manual
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </Surface>
            )}
          </div>
        )}

        {/* ==================================== TAB 2: TRANSACTIONS ==================================== */}
        {activeTab === "transactions" && (
          <div className="space-y-8">
            {/* Revenue Grid Overview */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div className="flex items-center gap-4 rounded-2xl border border-emerald-500/15 bg-emerald-50 p-6 dark:bg-emerald-950/10">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500 text-white">
                  <DollarSign className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Total Omzet Kotor
                  </span>
                  <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                    {formatRupiah(totalRevenue)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-blue-500/15 bg-blue-50 p-6 dark:bg-blue-950/10">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500 text-white">
                  <CheckCircle className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Transaksi Sukses
                  </span>
                  <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {successTransactions.length} Pembayaran
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-amber-500/15 bg-amber-50 p-6 dark:bg-amber-950/10">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500 text-white">
                  <Clock className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Transaksi Pending
                  </span>
                  <div className="text-xl font-bold text-amber-600 dark:text-amber-400">
                    {transactions.filter((t) => t.status === "PENDING").length} Transaksi
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="font-heading text-lg font-bold text-foreground">Daftar Transaksi ({transactions.length})</h2>
              {transactions.length === 0 ? (
                <EmptyState
                  icon={CreditCardIcon}
                  title="Belum Ada Transaksi"
                  description="Riwayat pembayaran dari Midtrans akan muncul di sini setelah ada transaksi masuk."
                />
              ) : (
                <Surface padding="none" className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-muted/40 text-muted-foreground">
                        <th scope="col" className={TH_CLASS}>Order ID</th>
                        <th scope="col" className={TH_CLASS}>Pengguna</th>
                        <th scope="col" className={TH_CLASS}>Item Paket</th>
                        <th scope="col" className={TH_CLASS}>Nominal</th>
                        <th scope="col" className={TH_CLASS}>Status</th>
                        <th scope="col" className={`${TH_CLASS} text-right`}>Tanggal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {transactions.map((t) => (
                        <tr key={t.id} className="transition-colors hover:bg-gold-400/5">
                          <td className="px-4 py-3.5 font-mono font-semibold text-foreground">{t.midtransOrderId}</td>
                          <td className="px-4 py-3.5">
                            <div className="font-semibold text-foreground">{t.user?.name || "User"}</div>
                            <div className="text-[10px] font-light text-muted-foreground">{t.user?.email}</div>
                          </td>
                          <td className="px-4 py-3.5 font-semibold text-gold-400">{t.package?.name}</td>
                          <td className="px-4 py-3.5">{formatRupiah(t.amount)}</td>
                          <td className="px-4 py-3.5">
                            <Badge
                              variant={
                                t.status === "SUCCESS"
                                  ? "success"
                                  : t.status === "FAILED"
                                  ? "danger"
                                  : "neutral"
                              }
                            >
                              {t.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3.5 text-right font-light text-muted-foreground">
                            {new Date(t.createdAt).toLocaleDateString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Surface>
              )}
            </div>
          </div>
        )}

        {/* ==================================== TAB 3: THEMES ==================================== */}
        {activeTab === "themes" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold text-foreground">Tema Undangan ({themes.length})</h2>
              <Button size="sm" onClick={() => openAddModal("theme")}>
                <Plus aria-hidden="true" /> Tambah Tema
              </Button>
            </div>

            {themes.length === 0 ? (
              <EmptyState
                icon={Palette}
                title="Belum Ada Tema"
                description="Tambahkan tema undangan pertama Anda untuk mulai menawarkannya ke pengguna."
              />
            ) : (
              <Surface padding="none" className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-muted/40 text-muted-foreground">
                      <th scope="col" className={TH_CLASS}>Nama Tema</th>
                      <th scope="col" className={TH_CLASS}>Slug URL</th>
                      <th scope="col" className={TH_CLASS}>Tipe Kategori</th>
                      <th scope="col" className={TH_CLASS}>Status</th>
                      <th scope="col" className={`${TH_CLASS} text-right`}>Tindakan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {themes.map((theme) => (
                      <tr key={theme.id} className="transition-colors hover:bg-gold-400/5">
                        <td className="px-4 py-3.5 font-semibold text-foreground">{theme.name}</td>
                        <td className="px-4 py-3.5 font-mono text-muted-foreground">{theme.slug}</td>
                        <td className="px-4 py-3.5">
                          <Badge variant={theme.isPremium ? "goldSoft" : "neutral"}>
                            {theme.isPremium ? "PREMIUM" : "FREE"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3.5">
                          <Badge variant={theme.isActive ? "success" : "neutral"}>
                            {theme.isActive ? "AKTIF" : "NON-AKTIF"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="outline"
                              size="icon-sm"
                              onClick={() => openEditModal("theme", theme)}
                              aria-label={`Edit tema ${theme.name}`}
                            >
                              <Edit aria-hidden="true" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon-sm"
                              onClick={() => handleThemeDelete(theme.id)}
                              aria-label={`Hapus tema ${theme.name}`}
                            >
                              <Trash2 aria-hidden="true" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Surface>
            )}
          </div>
        )}

        {/* ==================================== TAB 4: QUOTES ==================================== */}
        {activeTab === "quotes" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold text-foreground">Templat Ayat & Kutipan ({quotes.length})</h2>
              <Button size="sm" onClick={() => openAddModal("quote")}>
                <Plus aria-hidden="true" /> Tambah Kutipan
              </Button>
            </div>

            {quotes.length === 0 ? (
              <EmptyState
                icon={Quote}
                title="Belum Ada Kutipan"
                description="Tambahkan preset ayat atau kutipan cinta pertama untuk digunakan pengguna."
              />
            ) : (
              <Surface padding="none" className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-muted/40 text-muted-foreground">
                      <th scope="col" className={TH_CLASS}>Judul Ayat</th>
                      <th scope="col" className={TH_CLASS}>Kategori</th>
                      <th scope="col" className={TH_CLASS}>Teks Kutipan</th>
                      <th scope="col" className={`${TH_CLASS} text-right`}>Tindakan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {quotes.map((q) => (
                      <tr key={q.id} className="transition-colors hover:bg-gold-400/5">
                        <td className="min-w-37.5 px-4 py-3.5 font-semibold text-foreground">{q.title}</td>
                        <td className="px-4 py-3.5">
                          <Badge variant="neutral">{q.category}</Badge>
                        </td>
                        <td className="max-w-sm truncate px-4 py-3.5 font-light italic text-muted-foreground">
                          &ldquo;{q.content}&rdquo;
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="outline"
                              size="icon-sm"
                              onClick={() => openEditModal("quote", q)}
                              aria-label={`Edit kutipan ${q.title}`}
                            >
                              <Edit aria-hidden="true" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon-sm"
                              onClick={() => handleQuoteDelete(q.id)}
                              aria-label={`Hapus kutipan ${q.title}`}
                            >
                              <Trash2 aria-hidden="true" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Surface>
            )}
          </div>
        )}

        {/* ==================================== TAB 5: MUSICS ==================================== */}
        {activeTab === "musics" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold text-foreground">Pustaka Lagu Latar ({musics.length})</h2>
              <Button size="sm" onClick={() => openAddModal("music")}>
                <Plus aria-hidden="true" /> Tambah Lagu
              </Button>
            </div>

            {musics.length === 0 ? (
              <EmptyState
                icon={Music}
                title="Belum Ada Lagu"
                description="Unggah lagu latar pertama agar tersedia sebagai pilihan musik undangan."
              />
            ) : (
              <Surface padding="none" className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-muted/40 text-muted-foreground">
                      <th scope="col" className={TH_CLASS}>Judul Lagu</th>
                      <th scope="col" className={TH_CLASS}>URL File (.mp3)</th>
                      <th scope="col" className={TH_CLASS}>Status</th>
                      <th scope="col" className={`${TH_CLASS} text-right`}>Tindakan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {musics.map((m) => (
                      <tr key={m.id} className="transition-colors hover:bg-gold-400/5">
                        <td className="px-4 py-3.5 font-semibold text-foreground">{m.title}</td>
                        <td className="max-w-xs truncate px-4 py-3.5 font-mono text-muted-foreground">{m.url}</td>
                        <td className="px-4 py-3.5">
                          <Badge variant={m.isActive ? "success" : "neutral"}>
                            {m.isActive ? "AKTIF" : "NON-AKTIF"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="outline"
                              size="icon-sm"
                              onClick={() => openEditModal("music", m)}
                              aria-label={`Edit lagu ${m.title}`}
                            >
                              <Edit aria-hidden="true" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon-sm"
                              onClick={() => handleMusicDelete(m.id)}
                              aria-label={`Hapus lagu ${m.title}`}
                            >
                              <Trash2 aria-hidden="true" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Surface>
            )}
          </div>
        )}

        {/* ==================================== TAB 6: FAQS ==================================== */}
        {activeTab === "faqs" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold text-foreground">Kelola FAQ Landing Page ({faqs.length})</h2>
              <Button size="sm" onClick={() => openAddModal("faq")}>
                <Plus aria-hidden="true" /> Tambah FAQ
              </Button>
            </div>

            {faqs.length === 0 ? (
              <EmptyState
                icon={HelpCircle}
                title="Belum Ada FAQ"
                description="Tambahkan pertanyaan umum pertama yang akan ditampilkan di landing page."
              />
            ) : (
              <Surface padding="none" className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-muted/40 text-muted-foreground">
                      <th scope="col" className={`${TH_CLASS} w-12`}>No. Urut</th>
                      <th scope="col" className={TH_CLASS}>Pertanyaan</th>
                      <th scope="col" className={TH_CLASS}>Jawaban</th>
                      <th scope="col" className={`${TH_CLASS} text-right`}>Tindakan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {faqs.map((f) => (
                      <tr key={f.id} className="transition-colors hover:bg-gold-400/5">
                        <td className="px-4 py-3.5 font-mono font-bold text-muted-foreground">{f.sortOrder}</td>
                        <td className="max-w-xs truncate px-4 py-3.5 font-semibold text-foreground">{f.question}</td>
                        <td className="max-w-sm truncate px-4 py-3.5 font-light text-muted-foreground">{f.answer}</td>
                        <td className="px-4 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="outline"
                              size="icon-sm"
                              onClick={() => openEditModal("faq", f)}
                              aria-label={`Edit FAQ ${f.question}`}
                            >
                              <Edit aria-hidden="true" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon-sm"
                              onClick={() => handleFaqDelete(f.id)}
                              aria-label={`Hapus FAQ ${f.question}`}
                            >
                              <Trash2 aria-hidden="true" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Surface>
            )}
          </div>
        )}

        {/* ==================================== TAB 7: SETTINGS ==================================== */}
        {activeTab === "settings" && (
          <div className="w-full space-y-6">
            <div className="space-y-6 rounded-3xl border border-border/60 bg-muted/40 p-6">

              {/* WhatsApp Service Info Box */}
              <div className="flex items-start gap-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-800 dark:text-emerald-400">
                <Globe className="mt-1 h-8 w-8 shrink-0 text-emerald-500" aria-hidden="true" />
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2 font-bold">
                    WhatsApp Chat Button Active
                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" aria-hidden="true" />
                  </div>
                  <p className="font-light leading-relaxed">
                    Tombol chat melayang WhatsApp di landing page utama menggunakan nomor ini sebagai kontak layanan bantuan pelanggan (CS) langsung.
                  </p>
                </div>
              </div>

              {/* Form Input */}
              <form onSubmit={handleWaSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="wa-number" className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                    Nomor WhatsApp Penerima
                  </label>
                  <div className="relative">
                    <input
                      id="wa-number"
                      type="text"
                      value={waNumberInput}
                      onChange={(e) => setWaNumberInput(e.target.value.replace(/[^0-9+]/g, ""))}
                      placeholder="Contoh: 6282127322357"
                      className="w-full rounded-2xl border border-border bg-white py-3 pl-4 pr-12 text-sm font-semibold text-foreground outline-none transition-all focus:border-gold-400 focus:ring-2 focus:ring-gold-400/30 dark:bg-zinc-800"
                    />
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-md bg-gold-400/10 px-2 py-0.5 text-xs font-bold text-gold-400">
                      WA
                    </div>
                  </div>

                  {/* Warning Alerts */}
                  {(waNumberInput.startsWith("0") || waNumberInput.startsWith("+")) && (
                    <div className="flex items-center gap-1.5 rounded-xl border border-amber-500/20 bg-amber-50 p-3 text-[10px] font-medium leading-relaxed text-amber-800 dark:bg-amber-950/20 dark:text-amber-400">
                      <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" aria-hidden="true" />
                      <span>
                        Peringatan: Gunakan kode negara (contoh: <strong>62</strong>) di awal nomor tanpa tanda <strong>+</strong> atau <strong>0</strong> agar tombol chat WA melayang dapat berfungsi dengan baik.
                      </span>
                    </div>
                  )}

                  <span className="block text-[10px] font-light leading-relaxed text-muted-foreground">
                    Format aman: Hanya angka, diawali dengan kode negara (62). Contoh: <strong>6282127322357</strong>.
                  </span>
                </div>

                {/* Link Preview box */}
                {waNumberInput && !waNumberInput.startsWith("0") && !waNumberInput.startsWith("+") && (
                  <div className="space-y-1 rounded-xl border border-border/40 bg-muted/50 p-3.5 text-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Uji Tautan WA (Live Preview):
                    </span>
                    <a
                      href={`https://wa.me/${waNumberInput}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block break-all font-mono font-semibold text-gold-400 hover:underline"
                    >
                      https://wa.me/{waNumberInput}
                    </a>
                  </div>
                )}

                <Button type="submit" disabled={loading} size="lg" className="w-full">
                  {loading ? (
                    <Loader2 className="animate-spin" aria-hidden="true" />
                  ) : (
                    <Globe aria-hidden="true" />
                  )}
                  Simpan Setelan WhatsApp Support
                </Button>
              </form>
            </div>
          </div>
        )}

      </Surface>

      {/* ==================================== GLOBAL CRUD MODALS ==================================== */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="admin-modal-title"
        >
          <div className="relative w-full max-w-lg space-y-6 rounded-3xl border border-border/60 bg-card p-6 shadow-2xl sm:p-8">

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <h3 id="admin-modal-title" className="font-heading text-lg font-bold text-foreground">
                {modalType === "upgrade_user" && "Upgrade Paket Langganan Manual"}
                {modalType === "theme" && (editItem ? "Edit Tema Undangan" : "Tambah Tema Baru")}
                {modalType === "quote" && (editItem ? "Edit Templat Ayat/Kutipan" : "Tambah Templat Ayat/Kutipan")}
                {modalType === "music" && (editItem ? "Edit Lagu Latar" : "Tambah Lagu Latar")}
                {modalType === "faq" && (editItem ? "Edit FAQ" : "Tambah FAQ Baru")}
              </h3>
              <Button variant="ghost" size="icon-sm" onClick={closeModal} aria-label="Tutup dialog">
                <X aria-hidden="true" />
              </Button>
            </div>

            {/* Modal Form Body */}

            {/* 1. Form Upgrade Langganan Manual */}
            {modalType === "upgrade_user" && (
              <form onSubmit={handleUpgradeSubscription} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="upgrade-user" className="text-xs font-semibold text-muted-foreground">Nama / Email Pengguna</label>
                  <input
                    id="upgrade-user"
                    type="text"
                    value={upgradeInput.userName}
                    disabled
                    className="w-full cursor-not-allowed rounded-xl border border-border bg-muted/60 px-3 py-2 text-xs text-muted-foreground outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="upgrade-package" className="text-xs font-semibold text-foreground">Pilih Paket</label>
                  <select
                    id="upgrade-package"
                    value={upgradeInput.packageId}
                    onChange={(e) => setUpgradeInput({ ...upgradeInput, packageId: e.target.value })}
                    className={`${FIELD_CLASS} cursor-pointer`}
                  >
                    {packages.map((pkg) => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name} ({formatRupiah(pkg.price)} - {pkg.durationDays} Hari)
                      </option>
                    ))}
                  </select>
                </div>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading && <Loader2 className="animate-spin" aria-hidden="true" />}
                  Upgrade Paket Sekarang
                </Button>
              </form>
            )}

            {/* 2. Form Theme CRUD */}
            {modalType === "theme" && (
              <form onSubmit={handleThemeSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="theme-name" className="text-xs font-semibold text-foreground">Nama Tema</label>
                    <input
                      id="theme-name"
                      type="text"
                      required
                      value={themeInput.name}
                      onChange={(e) => setThemeInput({ ...themeInput, name: e.target.value })}
                      placeholder="Contoh: Classic Elegance"
                      className={FIELD_CLASS}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="theme-slug" className="text-xs font-semibold text-foreground">Slug URL (Unik)</label>
                    <input
                      id="theme-slug"
                      type="text"
                      required
                      value={themeInput.slug}
                      onChange={(e) => setThemeInput({ ...themeInput, slug: e.target.value })}
                      placeholder="Contoh: classic-elegance"
                      className={FIELD_CLASS}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="theme-description" className="text-xs font-semibold text-foreground">Deskripsi Singkat</label>
                  <input
                    id="theme-description"
                    type="text"
                    value={themeInput.description}
                    onChange={(e) => setThemeInput({ ...themeInput, description: e.target.value })}
                    placeholder="Contoh: Tema floral klasik berwarna cream lembut..."
                    className={FIELD_CLASS}
                  />
                </div>
                {/* Tab Switcher for Thumbnail Source Mode */}
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-foreground">Sumber Gambar Thumbnail</span>
                  <div role="tablist" aria-label="Sumber gambar thumbnail" className="flex gap-2 rounded-xl bg-muted/60 p-1">
                    <button
                      type="button"
                      role="tab"
                      aria-selected={themeThumbnailSourceTab === "upload"}
                      onClick={() => setThemeThumbnailSourceTab("upload")}
                      className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/60 ${
                        themeThumbnailSourceTab === "upload"
                          ? "bg-card text-gold-400 shadow-(--shadow-gold-sm)"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Unggah Gambar (R2/S3)
                    </button>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={themeThumbnailSourceTab === "url"}
                      onClick={() => setThemeThumbnailSourceTab("url")}
                      className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/60 ${
                        themeThumbnailSourceTab === "url"
                          ? "bg-card text-gold-400 shadow-(--shadow-gold-sm)"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Tautan URL Gambar
                    </button>
                  </div>
                </div>

                {/* Tab 1: Upload Image */}
                {themeThumbnailSourceTab === "upload" && (
                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-foreground">Unggah Berkas Gambar</span>
                    <FileUploader
                      value={themeInput.thumbnailUrl}
                      onChange={(url) => setThemeInput({ ...themeInput, thumbnailUrl: url })}
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      maxSize={5 * 1024 * 1024} // 5MB
                      label="Seret & lepas gambar di sini"
                      helperText="Format berkas JPG, PNG, WEBP, atau GIF (Maksimal 5MB)"
                    />
                    {themeInput.thumbnailUrl && (
                      <div className="flex flex-col gap-1.5 rounded-xl border border-border/60 bg-muted/40 p-2.5 text-xs">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground">Pratinjau Gambar:</span>
                        <div className="relative flex h-32 w-full items-center justify-center overflow-hidden rounded-xl border border-border bg-muted">
                          <img src={themeInput.thumbnailUrl} alt="Pratinjau thumbnail tema" className="max-h-full max-w-full object-contain" />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 2: URL Input */}
                {themeThumbnailSourceTab === "url" && (
                  <div className="space-y-1.5">
                    <label htmlFor="theme-thumbnail-url" className="text-xs font-semibold text-foreground">URL Gambar Thumbnail</label>
                    <input
                      id="theme-thumbnail-url"
                      type="text"
                      value={themeInput.thumbnailUrl}
                      onChange={(e) => setThemeInput({ ...themeInput, thumbnailUrl: e.target.value })}
                      placeholder="Contoh: https://example.com/thumbnail.jpg"
                      className={FIELD_CLASS}
                    />
                    {themeInput.thumbnailUrl && (
                      <div className="mt-2 flex flex-col gap-1.5 rounded-xl border border-border/60 bg-muted/40 p-2.5 text-xs">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground">Pratinjau Gambar:</span>
                        <div className="relative flex h-32 w-full items-center justify-center overflow-hidden rounded-xl border border-border bg-muted">
                          <img src={themeInput.thumbnailUrl} alt="Pratinjau thumbnail tema" className="max-h-full max-w-full object-contain" />
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <div className="flex items-center gap-6 pt-2">
                  <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-foreground">
                    <input
                      type="checkbox"
                      checked={themeInput.isPremium}
                      onChange={(e) => setThemeInput({ ...themeInput, isPremium: e.target.checked })}
                      className="accent-gold-400"
                    />
                    Tema Premium
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-foreground">
                    <input
                      type="checkbox"
                      checked={themeInput.isActive}
                      onChange={(e) => setThemeInput({ ...themeInput, isActive: e.target.checked })}
                      className="accent-gold-400"
                    />
                    Status Aktif
                  </label>
                </div>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading && <Loader2 className="animate-spin" aria-hidden="true" />}
                  {editItem ? "Perbarui Tema" : "Simpan Tema Baru"}
                </Button>
              </form>
            )}

            {/* 3. Form Quote Template CRUD */}
            {modalType === "quote" && (
              <form onSubmit={handleQuoteSubmit} className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 space-y-1.5">
                    <label htmlFor="quote-title" className="text-xs font-semibold text-foreground">Judul / Sumber Ayat</label>
                    <input
                      id="quote-title"
                      type="text"
                      required
                      value={quoteInput.title}
                      onChange={(e) => setQuoteInput({ ...quoteInput, title: e.target.value })}
                      placeholder="Contoh: QS. Ar-Rum Ayat 21"
                      className={FIELD_CLASS}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="quote-category" className="text-xs font-semibold text-foreground">Kategori</label>
                    <select
                      id="quote-category"
                      value={quoteInput.category}
                      onChange={(e) => setQuoteInput({ ...quoteInput, category: e.target.value })}
                      className={`${FIELD_CLASS} cursor-pointer`}
                    >
                      <option value="Islami">Islami</option>
                      <option value="Kristiani">Kristiani</option>
                      <option value="Modern">Modern</option>
                      <option value="Umum">Umum</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="quote-content" className="text-xs font-semibold text-foreground">Teks Kutipan Lengkap</label>
                  <textarea
                    id="quote-content"
                    required
                    rows={4}
                    value={quoteInput.content}
                    onChange={(e) => setQuoteInput({ ...quoteInput, content: e.target.value })}
                    placeholder="Masukkan isi kutipan lengkap di sini..."
                    className={`${FIELD_CLASS} resize-none`}
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading && <Loader2 className="animate-spin" aria-hidden="true" />}
                  {editItem ? "Perbarui Templat Ayat" : "Simpan Templat Ayat"}
                </Button>
              </form>
            )}

            {/* 4. Form Music Template CRUD */}
            {modalType === "music" && (
              <form onSubmit={handleMusicSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="music-title" className="text-xs font-semibold text-foreground">Judul Lagu & Penyanyi</label>
                  <input
                    id="music-title"
                    type="text"
                    required
                    value={musicInput.title}
                    onChange={(e) => setMusicInput({ ...musicInput, title: e.target.value })}
                    placeholder="Contoh: Judika - Sampai Akhir"
                    className={FIELD_CLASS}
                  />
                </div>

                {/* Tab Switcher for Source Mode */}
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-foreground">Sumber Berkas Musik</span>
                  <div role="tablist" aria-label="Sumber berkas musik" className="flex gap-2 rounded-xl bg-muted/60 p-1">
                    <button
                      type="button"
                      role="tab"
                      aria-selected={musicSourceTab === "upload"}
                      onClick={() => setMusicSourceTab("upload")}
                      className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/60 ${
                        musicSourceTab === "upload"
                          ? "bg-card text-gold-400 shadow-(--shadow-gold-sm)"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Unggah MP3 (R2/S3 Storage)
                    </button>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={musicSourceTab === "url"}
                      onClick={() => setMusicSourceTab("url")}
                      className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/60 ${
                        musicSourceTab === "url"
                          ? "bg-card text-gold-400 shadow-(--shadow-gold-sm)"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Tautan URL Eksternal
                    </button>
                  </div>
                </div>

                {/* Tab 1: Upload File MP3 */}
                {musicSourceTab === "upload" && (
                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-foreground">Unggah Berkas Audio (.mp3)</span>
                    <FileUploader
                      value={musicInput.url}
                      onChange={(url) => setMusicInput({ ...musicInput, url })}
                      accept="audio/mpeg,audio/mp3,audio/*"
                      maxSize={10 * 1024 * 1024} // 10MB
                      label="Seret & lepas berkas MP3 di sini"
                      helperText="Format berkas .mp3 (Maksimal 10MB)"
                    />
                    {musicInput.url && (
                      <div className="flex flex-col gap-1.5 rounded-xl border border-border/60 bg-muted/40 p-2.5 text-xs">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground">File Terunggah:</span>
                        <span className="block truncate break-all font-mono text-foreground">{musicInput.url}</span>
                        {/* Audio preview element */}
                        <audio src={musicInput.url} controls className="mt-1 h-8 w-full" />
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 2: URL Input */}
                {musicSourceTab === "url" && (
                  <div className="space-y-1.5">
                    <label htmlFor="music-url" className="text-xs font-semibold text-foreground">URL Berkas (.mp3)</label>
                    <input
                      id="music-url"
                      type="url"
                      required={musicSourceTab === "url"}
                      value={musicInput.url}
                      onChange={(e) => setMusicInput({ ...musicInput, url: e.target.value })}
                      placeholder="Contoh: https://example.com/song.mp3"
                      className={FIELD_CLASS}
                    />
                    {musicInput.url && (
                      <div className="mt-2 flex flex-col gap-1.5 rounded-xl border border-border/60 bg-muted/40 p-2.5 text-xs">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground">Tinjauan Musik:</span>
                        <audio src={musicInput.url} controls className="mt-1 h-8 w-full" />
                      </div>
                    )}
                  </div>
                )}
                <div className="flex items-center pt-2">
                  <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-foreground">
                    <input
                      type="checkbox"
                      checked={musicInput.isActive}
                      onChange={(e) => setMusicInput({ ...musicInput, isActive: e.target.checked })}
                      className="accent-gold-400"
                    />
                    Musik Aktif (Tampil di Pilihan User)
                  </label>
                </div>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading && <Loader2 className="animate-spin" aria-hidden="true" />}
                  {editItem ? "Perbarui Lagu Latar" : "Simpan Lagu Baru"}
                </Button>
              </form>
            )}

            {/* 5. Form FAQ CRUD */}
            {modalType === "faq" && (
              <form onSubmit={handleFaqSubmit} className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-3 space-y-1.5">
                    <label htmlFor="faq-question" className="text-xs font-semibold text-foreground">Pertanyaan (Question)</label>
                    <input
                      id="faq-question"
                      type="text"
                      required
                      value={faqInput.question}
                      onChange={(e) => setFaqInput({ ...faqInput, question: e.target.value })}
                      placeholder="Berapa lama proses pembuatan?"
                      className={FIELD_CLASS}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="faq-sort" className="text-xs font-semibold text-foreground">No. Urut Sort</label>
                    <input
                      id="faq-sort"
                      type="number"
                      min="0"
                      value={faqInput.sortOrder}
                      onChange={(e) => setFaqInput({ ...faqInput, sortOrder: e.target.value === "" ? "" : Math.max(0, parseInt(e.target.value)) })}
                      placeholder="Posisi terakhir"
                      className={FIELD_CLASS}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="faq-answer" className="text-xs font-semibold text-foreground">Jawaban (Answer)</label>
                  <textarea
                    id="faq-answer"
                    required
                    rows={4}
                    value={faqInput.answer}
                    onChange={(e) => setFaqInput({ ...faqInput, answer: e.target.value })}
                    placeholder="Tulis jawaban lengkap FAQ di sini..."
                    className={`${FIELD_CLASS} resize-none`}
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading && <Loader2 className="animate-spin" aria-hidden="true" />}
                  {editItem ? "Perbarui FAQ" : "Simpan FAQ Baru"}
                </Button>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
