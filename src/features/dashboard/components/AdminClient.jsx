"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FileUploader } from "@/components/shared/FileUploader";
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
} from "@/server/actions/admin.actions";

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
  const queryTab = searchParams.get("tab") || "users";

  const [activeTab, setActiveTab] = useState(queryTab);

  useEffect(() => {
    if (queryTab) {
      setActiveTab(queryTab);
    }
  }, [queryTab]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
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

  // Format Mata Uang Rupiah
  const formatRupiah = (val) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(val);
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
      <div className="space-y-1">
        <h1 className="font-heading text-3xl font-bold text-[#1F1F1F] dark:text-zinc-50 tracking-tight flex items-center gap-2.5">
          <HeaderIcon className="w-7 h-7 text-[#C8A96A]" />
          {currentTitle}
        </h1>
        <p className="text-sm text-muted-foreground font-light">
          {currentDesc}
        </p>
      </div>

      {/* 2. Banner Notifikasi Feedback */}
      {feedback.message && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 shadow-sm border transition-all ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-500/20"
              : "bg-red-50 text-red-800 dark:bg-red-950/20 dark:text-red-400 border-red-500/20"
          }`}
        >
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{feedback.message}</span>
        </div>
      )}

      {/* 4. Tab Contents Panel */}
      <div className="bg-white dark:bg-[#1A1A1A] border border-border/60 rounded-3xl p-6 sm:p-8 shadow-sm">
        
        {/* ==================================== TAB 1: USERS ==================================== */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <h2 className="font-bold text-foreground text-lg">Daftar Pengguna ({users.length})</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border text-muted-foreground font-semibold">
                    <th className="pb-3 pr-4">Nama & Email</th>
                    <th className="pb-3 pr-4">Peran (Role)</th>
                    <th className="pb-3 pr-4">Paket Aktif</th>
                    <th className="pb-3 text-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {users.map((user) => {
                    const activeSub = user.subscriptions?.[0];
                    return (
                      <tr key={user.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40 transition-colors">
                        <td className="py-3.5 pr-4">
                          <div className="font-semibold text-foreground">{user.name || "Tanpa Nama"}</div>
                          <div className="text-[10px] text-muted-foreground font-light">{user.email}</div>
                        </td>
                        <td className="py-3.5 pr-4">
                          <select
                            value={user.role}
                            onChange={(e) => handleUserRoleChange(user.id, e.target.value)}
                            disabled={loading || user.email === "asepsutrisnasp@gmail.com"}
                            className="bg-transparent border border-border rounded px-1.5 py-0.5 outline-none font-semibold text-foreground cursor-pointer focus:border-[#C8A96A]"
                          >
                            <option value="USER">USER</option>
                            <option value="ADMIN">ADMIN</option>
                            <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                          </select>
                        </td>
                        <td className="py-3.5 pr-4">
                          {activeSub ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#C8A96A]">
                              <Sparkles className="w-3.5 h-3.5 fill-current" />
                              {activeSub.package.name} (s.d. {new Date(activeSub.validUntil).toLocaleDateString("id-ID")})
                            </span>
                          ) : (
                            <span className="text-muted-foreground font-light">Free Trial</span>
                          )}
                        </td>
                        <td className="py-3.5 text-right">
                          <button
                            onClick={() => {
                              setUpgradeInput({ userId: user.id, userName: user.name || user.email, packageId: packages[0]?.id || "" });
                              setModalType("upgrade_user");
                              setModalOpen(true);
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-[#C8A96A]/15 text-[#C8A96A] font-bold text-[10px] hover:bg-[#C8A96A]/25 transition-colors"
                          >
                            Upgrade Manual
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================================== TAB 2: TRANSACTIONS ==================================== */}
        {activeTab === "transactions" && (
          <div className="space-y-8">
            {/* Revenue Grid Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/10 border border-emerald-500/15 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                    Total Omzet Kotor
                  </span>
                  <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                    {formatRupiah(totalRevenue)}
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-blue-50 dark:bg-blue-950/10 border border-blue-500/15 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500 text-white flex items-center justify-center">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                    Transaksi Sukses
                  </span>
                  <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {successTransactions.length} Pembayaran
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/10 border border-amber-500/15 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                    Transaksi Pending
                  </span>
                  <div className="text-xl font-bold text-amber-600 dark:text-amber-400">
                    {transactions.filter((t) => t.status === "PENDING").length} Transaksi
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="font-bold text-foreground text-lg">Daftar Transaksi ({transactions.length})</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground font-semibold">
                      <th className="pb-3 pr-4">Order ID</th>
                      <th className="pb-3 pr-4">Pengguna</th>
                      <th className="pb-3 pr-4">Item Paket</th>
                      <th className="pb-3 pr-4">Nominal</th>
                      <th className="pb-3 pr-4">Status</th>
                      <th className="pb-3 text-right">Tanggal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {transactions.map((t) => (
                      <tr key={t.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40 transition-colors">
                        <td className="py-3.5 pr-4 font-semibold text-foreground font-mono">{t.midtransOrderId}</td>
                        <td className="py-3.5 pr-4">
                          <div className="font-semibold text-foreground">{t.user?.name || "User"}</div>
                          <div className="text-[10px] text-muted-foreground font-light">{t.user?.email}</div>
                        </td>
                        <td className="py-3.5 pr-4 font-semibold text-[#C8A96A]">{t.package?.name}</td>
                        <td className="py-3.5 pr-4">{formatRupiah(t.amount)}</td>
                        <td className="py-3.5 pr-4">
                          <span
                            className={`text-[8px] font-bold px-2 py-0.5 rounded-full ${
                              t.status === "SUCCESS"
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400"
                                : t.status === "FAILED"
                                ? "bg-red-100 text-red-800 dark:bg-red-950/20 dark:text-red-400"
                                : "bg-amber-100 text-amber-800 dark:bg-amber-950/20 dark:text-amber-400"
                            }`}
                          >
                            {t.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-right font-light text-muted-foreground">
                          {new Date(t.createdAt).toLocaleDateString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================================== TAB 3: THEMES ==================================== */}
        {activeTab === "themes" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-foreground text-lg">Tema Undangan ({themes.length})</h2>
              <button
                onClick={() => openAddModal("theme")}
                className="px-4 py-2 rounded-xl bg-[#C8A96A] hover:bg-[#b39150] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" /> Tambah Tema
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border text-muted-foreground font-semibold">
                    <th className="pb-3 pr-4">Nama Tema</th>
                    <th className="pb-3 pr-4">Slug URL</th>
                    <th className="pb-3 pr-4">Tipe Kategori</th>
                    <th className="pb-3 pr-4">Status</th>
                    <th className="pb-3 text-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {themes.map((theme) => (
                    <tr key={theme.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40 transition-colors">
                      <td className="py-3.5 pr-4 font-semibold text-foreground">{theme.name}</td>
                      <td className="py-3.5 pr-4 font-mono text-muted-foreground">{theme.slug}</td>
                      <td className="py-3.5 pr-4">
                        <span
                          className={`text-[8px] font-bold px-2 py-0.5 rounded-full ${
                            theme.isPremium
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-950/20 dark:text-amber-400"
                              : "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300"
                          }`}
                        >
                          {theme.isPremium ? "PREMIUM" : "FREE"}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4">
                        <span
                          className={`text-[8px] font-bold px-2 py-0.5 rounded-full ${
                            theme.isActive
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400"
                              : "bg-red-100 text-red-800 dark:bg-red-950/20 dark:text-red-400"
                          }`}
                        >
                          {theme.isActive ? "AKTIF" : "NON-AKTIF"}
                        </span>
                      </td>
                      <td className="py-3.5 text-right space-x-1">
                        <button
                          onClick={() => openEditModal("theme", theme)}
                          className="p-1.5 rounded-lg border border-border hover:border-[#C8A96A] text-muted-foreground hover:text-[#C8A96A] inline-flex items-center"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleThemeDelete(theme.id)}
                          className="p-1.5 rounded-lg border border-border hover:border-red-500 text-muted-foreground hover:text-red-500 inline-flex items-center"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================================== TAB 4: QUOTES ==================================== */}
        {activeTab === "quotes" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-foreground text-lg">Templat Ayat & Kutipan ({quotes.length})</h2>
              <button
                onClick={() => openAddModal("quote")}
                className="px-4 py-2 rounded-xl bg-[#C8A96A] hover:bg-[#b39150] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" /> Tambah Kutipan
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border text-muted-foreground font-semibold">
                    <th className="pb-3 pr-4">Judul Ayat</th>
                    <th className="pb-3 pr-4">Kategori</th>
                    <th className="pb-3 pr-4">Teks Kutipan</th>
                    <th className="pb-3 text-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {quotes.map((q) => (
                    <tr key={q.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40 transition-colors">
                      <td className="py-3.5 pr-4 font-semibold text-foreground min-w-[150px]">{q.title}</td>
                      <td className="py-3.5 pr-4">
                        <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-[10px] text-foreground font-semibold">
                          {q.category}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4 text-muted-foreground italic font-light max-w-sm truncate">
                        "{q.content}"
                      </td>
                      <td className="py-3.5 text-right space-x-1">
                        <button
                          onClick={() => openEditModal("quote", q)}
                          className="p-1.5 rounded-lg border border-border hover:border-[#C8A96A] text-muted-foreground hover:text-[#C8A96A] inline-flex items-center"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleQuoteDelete(q.id)}
                          className="p-1.5 rounded-lg border border-border hover:border-red-500 text-muted-foreground hover:text-red-500 inline-flex items-center"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================================== TAB 5: MUSICS ==================================== */}
        {activeTab === "musics" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-foreground text-lg">Pustaka Lagu Latar ({musics.length})</h2>
              <button
                onClick={() => openAddModal("music")}
                className="px-4 py-2 rounded-xl bg-[#C8A96A] hover:bg-[#b39150] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" /> Tambah Lagu
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border text-muted-foreground font-semibold">
                    <th className="pb-3 pr-4">Judul Lagu</th>
                    <th className="pb-3 pr-4">URL File (.mp3)</th>
                    <th className="pb-3 pr-4">Status</th>
                    <th className="pb-3 text-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {musics.map((m) => (
                    <tr key={m.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40 transition-colors">
                      <td className="py-3.5 pr-4 font-semibold text-foreground">{m.title}</td>
                      <td className="py-3.5 pr-4 font-mono text-muted-foreground max-w-xs truncate">{m.url}</td>
                      <td className="py-3.5 pr-4">
                        <span
                          className={`text-[8px] font-bold px-2 py-0.5 rounded-full ${
                            m.isActive
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400"
                              : "bg-red-100 text-red-800 dark:bg-red-950/20 dark:text-red-400"
                          }`}
                        >
                          {m.isActive ? "AKTIF" : "NON-AKTIF"}
                        </span>
                      </td>
                      <td className="py-3.5 text-right space-x-1">
                        <button
                          onClick={() => openEditModal("music", m)}
                          className="p-1.5 rounded-lg border border-border hover:border-[#C8A96A] text-muted-foreground hover:text-[#C8A96A] inline-flex items-center"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMusicDelete(m.id)}
                          className="p-1.5 rounded-lg border border-border hover:border-red-500 text-muted-foreground hover:text-red-500 inline-flex items-center"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================================== TAB 6: FAQS ==================================== */}
        {activeTab === "faqs" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-foreground text-lg">Kelola FAQ Landing Page ({faqs.length})</h2>
              <button
                onClick={() => openAddModal("faq")}
                className="px-4 py-2 rounded-xl bg-[#C8A96A] hover:bg-[#b39150] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" /> Tambah FAQ
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border text-muted-foreground font-semibold">
                    <th className="pb-3 pr-4 w-12">No. Urut</th>
                    <th className="pb-3 pr-4">Pertanyaan</th>
                    <th className="pb-3 pr-4">Jawaban</th>
                    <th className="pb-3 text-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {faqs.map((f) => (
                    <tr key={f.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40 transition-colors">
                      <td className="py-3.5 pr-4 font-mono font-bold text-muted-foreground">{f.sortOrder}</td>
                      <td className="py-3.5 pr-4 font-semibold text-foreground max-w-xs truncate">{f.question}</td>
                      <td className="py-3.5 pr-4 text-muted-foreground font-light max-w-sm truncate">{f.answer}</td>
                      <td className="py-3.5 text-right space-x-1">
                        <button
                          onClick={() => openEditModal("faq", f)}
                          className="p-1.5 rounded-lg border border-border hover:border-[#C8A96A] text-muted-foreground hover:text-[#C8A96A] inline-flex items-center"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleFaqDelete(f.id)}
                          className="p-1.5 rounded-lg border border-border hover:border-red-500 text-muted-foreground hover:text-red-500 inline-flex items-center"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================================== TAB 7: SETTINGS ==================================== */}
        {activeTab === "settings" && (
          <div className="w-full space-y-6">
            <div className="p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-900/40 border border-border/60 space-y-6">
              
              {/* WhatsApp Service Info Box */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-400">
                <Globe className="w-8 h-8 shrink-0 text-emerald-500 mt-1" />
                <div className="space-y-1 text-xs">
                  <div className="font-bold flex items-center gap-2">
                    WhatsApp Chat Button Active
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <p className="font-light leading-relaxed">
                    Tombol chat melayang WhatsApp di landing page utama menggunakan nomor ini sebagai kontak layanan bantuan pelanggan (CS) langsung.
                  </p>
                </div>
              </div>

              {/* Form Input */}
              <form onSubmit={handleWaSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    Nomor WhatsApp Penerima
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={waNumberInput}
                      onChange={(e) => setWaNumberInput(e.target.value.replace(/[^0-9+]/g, ""))}
                      placeholder="Contoh: 6282127322357"
                      className="w-full pl-4 pr-12 py-3 rounded-2xl border border-border bg-white dark:bg-zinc-800 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#C8A96A]/30 focus:border-[#C8A96A] transition-all"
                    />
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#C8A96A] bg-[#C8A96A]/10 px-2 py-0.5 rounded-md">
                      WA
                    </div>
                  </div>

                  {/* Warning Alerts */}
                  {(waNumberInput.startsWith("0") || waNumberInput.startsWith("+")) && (
                    <div className="p-3 rounded-xl bg-amber-50 text-amber-800 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-500/20 text-[10px] flex items-center gap-1.5 font-medium leading-relaxed">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500" />
                      <span>
                        Peringatan: Gunakan kode negara (contoh: <strong>62</strong>) di awal nomor tanpa tanda <strong>+</strong> atau <strong>0</strong> agar tombol chat WA melayang dapat berfungsi dengan baik.
                      </span>
                    </div>
                  )}

                  <span className="text-[10px] text-muted-foreground font-light block leading-relaxed">
                    Format aman: Hanya angka, diawali dengan kode negara (62). Contoh: <strong>6282127322357</strong>.
                  </span>
                </div>

                {/* Link Preview box */}
                {waNumberInput && !waNumberInput.startsWith("0") && !waNumberInput.startsWith("+") && (
                  <div className="p-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-border/40 space-y-1 text-xs">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      Uji Tautan WA (Live Preview):
                    </span>
                    <a
                      href={`https://wa.me/${waNumberInput}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#C8A96A] hover:underline font-mono block break-all font-semibold"
                    >
                      https://wa.me/{waNumberInput}
                    </a>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#C8A96A] to-[#b39150] hover:from-[#b39150] hover:to-[#9e7e40] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md hover:scale-[1.01] active:scale-98"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Globe className="w-4 h-4" />
                  )}
                  Simpan Setelan WhatsApp Support
                </button>
              </form>
            </div>
          </div>
        )}

      </div>

      {/* ==================================== GLOBAL CRUD MODALS ==================================== */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#1A1A1A] border border-border/60 shadow-2xl p-6 sm:p-8 space-y-6 relative">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-border/40 pb-4">
              <h3 className="font-heading text-lg font-bold text-foreground">
                {modalType === "upgrade_user" && "Upgrade Paket Langganan Manual"}
                {modalType === "theme" && (editItem ? "Edit Tema Undangan" : "Tambah Tema Baru")}
                {modalType === "quote" && (editItem ? "Edit Templat Ayat/Kutipan" : "Tambah Templat Ayat/Kutipan")}
                {modalType === "music" && (editItem ? "Edit Lagu Latar" : "Tambah Lagu Latar")}
                {modalType === "faq" && (editItem ? "Edit FAQ" : "Tambah FAQ Baru")}
              </h3>
              <button onClick={closeModal} className="p-1 rounded-lg text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            
            {/* 1. Form Upgrade Langganan Manual */}
            {modalType === "upgrade_user" && (
              <form onSubmit={handleUpgradeSubscription} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground font-semibold">Nama / Email Pengguna</label>
                  <input
                    type="text"
                    value={upgradeInput.userName}
                    disabled
                    className="w-full px-3 py-2 border border-border bg-zinc-50 dark:bg-zinc-900 rounded-xl text-xs text-muted-foreground cursor-not-allowed outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-foreground font-semibold">Pilih Paket</label>
                  <select
                    value={upgradeInput.packageId}
                    onChange={(e) => setUpgradeInput({ ...upgradeInput, packageId: e.target.value })}
                    className="w-full px-3 py-2 border border-border bg-transparent rounded-xl text-xs outline-none focus:border-[#C8A96A] cursor-pointer"
                  >
                    {packages.map((pkg) => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name} ({formatRupiah(pkg.price)} - {pkg.durationDays} Hari)
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-xl bg-[#C8A96A] text-white font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-[#b39150]"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Upgrade Paket Sekarang
                </button>
              </form>
            )}

            {/* 2. Form Theme CRUD */}
            {modalType === "theme" && (
              <form onSubmit={handleThemeSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-foreground font-semibold">Nama Tema</label>
                    <input
                      type="text"
                      required
                      value={themeInput.name}
                      onChange={(e) => setThemeInput({ ...themeInput, name: e.target.value })}
                      placeholder="Contoh: Classic Elegance"
                      className="w-full px-3 py-2 border border-border bg-transparent rounded-xl text-xs outline-none focus:border-[#C8A96A]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-foreground font-semibold">Slug URL (Unik)</label>
                    <input
                      type="text"
                      required
                      value={themeInput.slug}
                      onChange={(e) => setThemeInput({ ...themeInput, slug: e.target.value })}
                      placeholder="Contoh: classic-elegance"
                      className="w-full px-3 py-2 border border-border bg-transparent rounded-xl text-xs outline-none focus:border-[#C8A96A]"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-foreground font-semibold">Deskripsi Singkat</label>
                  <input
                    type="text"
                    value={themeInput.description}
                    onChange={(e) => setThemeInput({ ...themeInput, description: e.target.value })}
                    placeholder="Contoh: Tema floral klasik berwarna cream lembut..."
                    className="w-full px-3 py-2 border border-border bg-transparent rounded-xl text-xs outline-none focus:border-[#C8A96A]"
                  />
                </div>
                {/* Tab Switcher for Thumbnail Source Mode */}
                <div className="space-y-1.5">
                  <label className="text-xs text-foreground font-semibold">Sumber Gambar Thumbnail</label>
                  <div className="flex gap-2 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setThemeThumbnailSourceTab("upload")}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        themeThumbnailSourceTab === "upload"
                          ? "bg-white dark:bg-zinc-700 text-[#C8A96A] shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Unggah Gambar (R2/S3)
                    </button>
                    <button
                      type="button"
                      onClick={() => setThemeThumbnailSourceTab("url")}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        themeThumbnailSourceTab === "url"
                          ? "bg-white dark:bg-zinc-700 text-[#C8A96A] shadow-sm"
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
                    <label className="text-xs text-foreground font-semibold">Unggah Berkas Gambar</label>
                    <FileUploader
                      value={themeInput.thumbnailUrl}
                      onChange={(url) => setThemeInput({ ...themeInput, thumbnailUrl: url })}
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      maxSize={5 * 1024 * 1024} // 5MB
                      label="Seret & lepas gambar di sini"
                      helperText="Format berkas JPG, PNG, WEBP, atau GIF (Maksimal 5MB)"
                    />
                    {themeInput.thumbnailUrl && (
                      <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-border/60 text-xs flex flex-col gap-1.5">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">Pratinjau Gambar:</span>
                        <div className="relative w-full h-32 rounded-xl overflow-hidden border border-border bg-zinc-100 flex items-center justify-center">
                          <img src={themeInput.thumbnailUrl} alt="Thumbnail Preview" className="max-h-full max-w-full object-contain" />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 2: URL Input */}
                {themeThumbnailSourceTab === "url" && (
                  <div className="space-y-1.5">
                    <label className="text-xs text-foreground font-semibold">URL Gambar Thumbnail</label>
                    <input
                      type="text"
                      value={themeInput.thumbnailUrl}
                      onChange={(e) => setThemeInput({ ...themeInput, thumbnailUrl: e.target.value })}
                      placeholder="Contoh: https://example.com/thumbnail.jpg"
                      className="w-full px-3 py-2 border border-border bg-transparent rounded-xl text-xs outline-none focus:border-[#C8A96A]"
                    />
                    {themeInput.thumbnailUrl && (
                      <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-border/60 text-xs flex flex-col gap-1.5 mt-2">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">Pratinjau Gambar:</span>
                        <div className="relative w-full h-32 rounded-xl overflow-hidden border border-border bg-zinc-100 flex items-center justify-center">
                          <img src={themeInput.thumbnailUrl} alt="Thumbnail Preview" className="max-h-full max-w-full object-contain" />
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 text-xs font-semibold text-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={themeInput.isPremium}
                      onChange={(e) => setThemeInput({ ...themeInput, isPremium: e.target.checked })}
                      className="accent-[#C8A96A]"
                    />
                    Tema Premium
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={themeInput.isActive}
                      onChange={(e) => setThemeInput({ ...themeInput, isActive: e.target.checked })}
                      className="accent-[#C8A96A]"
                    />
                    Status Aktif
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-xl bg-[#C8A96A] text-white font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-[#b39150] pt-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editItem ? "Perbarui Tema" : "Simpan Tema Baru"}
                </button>
              </form>
            )}

            {/* 3. Form Quote Template CRUD */}
            {modalType === "quote" && (
              <form onSubmit={handleQuoteSubmit} className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-xs text-foreground font-semibold">Judul / Sumber Ayat</label>
                    <input
                      type="text"
                      required
                      value={quoteInput.title}
                      onChange={(e) => setQuoteInput({ ...quoteInput, title: e.target.value })}
                      placeholder="Contoh: QS. Ar-Rum Ayat 21"
                      className="w-full px-3 py-2 border border-border bg-transparent rounded-xl text-xs outline-none focus:border-[#C8A96A]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-foreground font-semibold">Kategori</label>
                    <select
                      value={quoteInput.category}
                      onChange={(e) => setQuoteInput({ ...quoteInput, category: e.target.value })}
                      className="w-full px-3 py-2 border border-border bg-transparent rounded-xl text-xs outline-none focus:border-[#C8A96A]"
                    >
                      <option value="Islami">Islami</option>
                      <option value="Kristiani">Kristiani</option>
                      <option value="Modern">Modern</option>
                      <option value="Umum">Umum</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-foreground font-semibold">Teks Kutipan Lengkap</label>
                  <textarea
                    required
                    rows={4}
                    value={quoteInput.content}
                    onChange={(e) => setQuoteInput({ ...quoteInput, content: e.target.value })}
                    placeholder="Masukkan isi kutipan lengkap di sini..."
                    className="w-full px-3 py-2 border border-border bg-transparent rounded-xl text-xs outline-none focus:border-[#C8A96A] resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-xl bg-[#C8A96A] text-white font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-[#b39150]"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editItem ? "Perbarui Templat Ayat" : "Simpan Templat Ayat"}
                </button>
              </form>
            )}

            {/* 4. Form Music Template CRUD */}
            {modalType === "music" && (
              <form onSubmit={handleMusicSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-foreground font-semibold">Judul Lagu & Penyanyi</label>
                  <input
                    type="text"
                    required
                    value={musicInput.title}
                    onChange={(e) => setMusicInput({ ...musicInput, title: e.target.value })}
                    placeholder="Contoh: Judika - Sampai Akhir"
                    className="w-full px-3 py-2 border border-border bg-transparent rounded-xl text-xs outline-none focus:border-[#C8A96A]"
                  />
                </div>

                {/* Tab Switcher for Source Mode */}
                <div className="space-y-1.5">
                  <label className="text-xs text-foreground font-semibold">Sumber Berkas Musik</label>
                  <div className="flex gap-2 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setMusicSourceTab("upload")}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        musicSourceTab === "upload"
                          ? "bg-white dark:bg-zinc-700 text-[#C8A96A] shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Unggah MP3 (R2/S3 Storage)
                    </button>
                    <button
                      type="button"
                      onClick={() => setMusicSourceTab("url")}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        musicSourceTab === "url"
                          ? "bg-white dark:bg-zinc-700 text-[#C8A96A] shadow-sm"
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
                    <label className="text-xs text-foreground font-semibold">Unggah Berkas Audio (.mp3)</label>
                    <FileUploader
                      value={musicInput.url}
                      onChange={(url) => setMusicInput({ ...musicInput, url })}
                      accept="audio/mpeg,audio/mp3,audio/*"
                      maxSize={10 * 1024 * 1024} // 10MB
                      label="Seret & lepas berkas MP3 di sini"
                      helperText="Format berkas .mp3 (Maksimal 10MB)"
                    />
                    {musicInput.url && (
                      <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-border/60 text-xs flex flex-col gap-1.5">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">File Terunggah:</span>
                        <span className="font-mono text-foreground break-all truncate block">{musicInput.url}</span>
                        {/* Audio preview element */}
                        <audio src={musicInput.url} controls className="w-full h-8 mt-1" />
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 2: URL Input */}
                {musicSourceTab === "url" && (
                  <div className="space-y-1.5">
                    <label className="text-xs text-foreground font-semibold">URL Berkas (.mp3)</label>
                    <input
                      type="url"
                      required={musicSourceTab === "url"}
                      value={musicInput.url}
                      onChange={(e) => setMusicInput({ ...musicInput, url: e.target.value })}
                      placeholder="Contoh: https://example.com/song.mp3"
                      className="w-full px-3 py-2 border border-border bg-transparent rounded-xl text-xs outline-none focus:border-[#C8A96A]"
                    />
                    {musicInput.url && (
                      <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-border/60 text-xs flex flex-col gap-1.5 mt-2">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">Tinjauan Musik:</span>
                        <audio src={musicInput.url} controls className="w-full h-8 mt-1" />
                      </div>
                    )}
                  </div>
                )}
                <div className="flex items-center pt-2">
                  <label className="flex items-center gap-2 text-xs font-semibold text-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={musicInput.isActive}
                      onChange={(e) => setMusicInput({ ...musicInput, isActive: e.target.checked })}
                      className="accent-[#C8A96A]"
                    />
                    Musik Aktif (Tampil di Pilihan User)
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-xl bg-[#C8A96A] text-white font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-[#b39150] pt-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editItem ? "Perbarui Lagu Latar" : "Simpan Lagu Baru"}
                </button>
              </form>
            )}

            {/* 5. Form FAQ CRUD */}
            {modalType === "faq" && (
              <form onSubmit={handleFaqSubmit} className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-3 space-y-1.5">
                    <label className="text-xs text-foreground font-semibold">Pertanyaan (Question)</label>
                    <input
                      type="text"
                      required
                      value={faqInput.question}
                      onChange={(e) => setFaqInput({ ...faqInput, question: e.target.value })}
                      placeholder="Berapa lama proses pembuatan?"
                      className="w-full px-3 py-2 border border-border bg-transparent rounded-xl text-xs outline-none focus:border-[#C8A96A]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-foreground font-semibold">No. Urut Sort</label>
                    <input
                      type="number"
                      min="0"
                      value={faqInput.sortOrder}
                      onChange={(e) => setFaqInput({ ...faqInput, sortOrder: e.target.value === "" ? "" : Math.max(0, parseInt(e.target.value)) })}
                      placeholder="Posisi terakhir"
                      className="w-full px-3 py-2 border border-border bg-transparent rounded-xl text-xs outline-none focus:border-[#C8A96A]"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-foreground font-semibold">Jawaban (Answer)</label>
                  <textarea
                    required
                    rows={4}
                    value={faqInput.answer}
                    onChange={(e) => setFaqInput({ ...faqInput, answer: e.target.value })}
                    placeholder="Tulis jawaban lengkap FAQ di sini..."
                    className="w-full px-3 py-2 border border-border bg-transparent rounded-xl text-xs outline-none focus:border-[#C8A96A] resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-xl bg-[#C8A96A] text-white font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-[#b39150]"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editItem ? "Perbarui FAQ" : "Simpan FAQ Baru"}
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
