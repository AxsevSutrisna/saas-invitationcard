"use client";

import { useState, useSyncExternalStore, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Search,
  Plus,
  Copy,
  Check,
  Send,
  Trash2,
  Edit2,
  FileSpreadsheet,
  X,
  UserPlus,
  Eye,
  Calendar,
  Clock,
  Sparkles,
  Printer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { Surface } from "@/components/ui/Surface";
import {
  createGuestAction,
  createGuestsBulkAction,
  updateGuestAction,
  deleteGuestAction
} from "@/features/guest/actions";
import { buildWhatsAppUrl, formatEventDate, formatShortDateTime } from "@/lib/format";

export function GuestManagementClient({ invitations, selectedInvitation, initialGuests }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Origin dibaca via useSyncExternalStore: snapshot server = fallback (tidak ada
  // hydration mismatch), lalu otomatis memakai origin asli di klien setelah hydrate.
  const baseUrl = useSyncExternalStore(
    () => () => {},
    () => window.location.origin,
    () => "https://ikara.id"
  );

  // Search & Filter state
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL"); // ALL | OPENED | UNOPENED | YES | NO | MAYBE | NO_RESPONSE

  // Modal State
  const [showSingleModal, setShowSingleModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [editingGuest, setEditingGuest] = useState(null); // Guest object if editing

  // Form inputs state
  const [guestName, setGuestName] = useState("");
  const [guestWhatsapp, setGuestWhatsapp] = useState("");
  const [rawBulkNames, setRawBulkNames] = useState("");

  // Copy success indicator state
  const [copiedId, setCopiedId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Handle invitation change
  const handleInvitationChange = (e) => {
    const value = e.target.value;
    router.push(`/dashboard/guests?invitationId=${value}`);
  };

  // Reset Single Form
  const resetSingleForm = () => {
    setGuestName("");
    setGuestWhatsapp("");
    setEditingGuest(null);
    setErrorMsg("");
  };

  // Submit Single Guest (Create or Update)
  const handleSingleSubmit = async (e) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    setErrorMsg("");
    startTransition(async () => {
      let res;
      if (editingGuest) {
        res = await updateGuestAction(editingGuest.id, {
          name: guestName.trim(),
          whatsapp: guestWhatsapp.trim() || null,
        });
      } else {
        res = await createGuestAction({
          invitationId: selectedInvitation.id,
          name: guestName.trim(),
          whatsapp: guestWhatsapp.trim() || null,
        });
      }

      if (res.success) {
        setShowSingleModal(false);
        resetSingleForm();
        router.refresh();
      } else {
        setErrorMsg(res.error || "Terjadi kesalahan.");
      }
    });
  };

  // Submit Bulk Guests
  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    if (!rawBulkNames.trim()) return;

    setErrorMsg("");
    startTransition(async () => {
      const res = await createGuestsBulkAction({
        invitationId: selectedInvitation.id,
        rawNames: rawBulkNames,
      });

      if (res.success) {
        setShowBulkModal(false);
        setRawBulkNames("");
        router.refresh();
      } else {
        setErrorMsg(res.error || "Terjadi kesalahan.");
      }
    });
  };

  // Trigger Delete Guest
  const handleDelete = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus tamu ini? Seluruh data RSVP terkait juga akan dihapus.")) return;

    startTransition(async () => {
      const res = await deleteGuestAction(id);
      if (res.success) {
        router.refresh();
      } else {
        alert(res.error || "Gagal menghapus tamu.");
      }
    });
  };

  // Open Edit Modal
  const openEditModal = (guest) => {
    setEditingGuest(guest);
    setGuestName(guest.name);
    setGuestWhatsapp(guest.whatsapp || "");
    setShowSingleModal(true);
  };

  // Copy invitation link to clipboard
  const handleCopyLink = (guest) => {
    const link = `${baseUrl}/${selectedInvitation.slug}?to=${encodeURIComponent(guest.name)}&code=${guest.uniqueCode}`;
    navigator.clipboard.writeText(link);
    setCopiedId(guest.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Generate WA share URL
  const getWaShareUrl = (guest) => {
    const link = `${baseUrl}/${selectedInvitation.slug}?to=${encodeURIComponent(guest.name)}&code=${guest.uniqueCode}`;
    const message = `Halo ${guest.name}, tanpa mengurangi rasa hormat, kami mengundang Anda untuk hadir di hari bahagia kami. Berikut adalah tautan undangan digital kami:\n\n${link}`;
    return buildWhatsAppUrl(guest.whatsapp, message);
  };

  // Export daftar tamu sebagai file CSV (dibuka di Excel/Google Sheets)
  const handleExportCSV = () => {
    // Bungkus nilai yang mengandung koma/kutip/baris baru sesuai standar CSV
    const escapeCsv = (val) => {
      const s = String(val ?? "");
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const rsvpLabel = (g) => {
      if (!g.rsvp) return "Belum Konfirmasi";
      if (g.rsvp.attendance === "YES") return "Hadir";
      if (g.rsvp.attendance === "NO") return "Tidak Hadir";
      return "Ragu-ragu";
    };

    const header = [
      "No",
      "Nama",
      "WhatsApp",
      "Status Undangan",
      "Konfirmasi RSVP",
      "Jumlah Tamu",
      "Ucapan & Doa",
      "Link Personal",
    ];
    const rows = initialGuests.map((g, i) => [
      i + 1,
      g.name,
      g.whatsapp || "",
      g.isOpened ? "Sudah Dibuka" : "Belum Dibuka",
      rsvpLabel(g),
      g.rsvp?.pax ?? "",
      g.rsvp?.message || "",
      `${baseUrl}/${selectedInvitation.slug}?to=${encodeURIComponent(g.name)}&code=${g.uniqueCode}`,
    ]);

    const csv = [header, ...rows]
      .map((r) => r.map(escapeCsv).join(","))
      .join("\r\n");

    // Prefix BOM (﻿) agar Excel membaca UTF-8 dengan benar (nama & emoji)
    const blob = new Blob(["﻿" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `daftar-tamu-${selectedInvitation.slug || "undangan"}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Print and Generate PDF report of Guests list
  const handlePrintPDF = () => {
    // Calculate metrics for summary
    const totalGuests = initialGuests.length;
    const attendingCount = initialGuests.filter(g => g.rsvp?.attendance === "YES").length;
    const totalPaxAttending = initialGuests.reduce((acc, curr) => acc + (curr.rsvp?.attendance === "YES" ? curr.rsvp.pax : 0), 0);
    const noResponseCount = initialGuests.filter(g => !g.rsvp).length;

    const tableRows = initialGuests.map((g, index) => {
      let rsvpBadge = '<span class="badge badge-belum">Belum</span>';
      let paxText = "-";
      if (g.rsvp) {
        paxText = `${g.rsvp.pax} Orang`;
        if (g.rsvp.attendance === "YES") {
          rsvpBadge = '<span class="badge badge-hadir">Hadir</span>';
        } else if (g.rsvp.attendance === "NO") {
          rsvpBadge = '<span class="badge badge-tidak">Tidak</span>';
        } else {
          rsvpBadge = '<span class="badge badge-ragu">Ragu</span>';
        }
      }
      return `
        <tr>
          <td style="text-align: center;">${index + 1}</td>
          <td><strong>${g.name}</strong></td>
          <td>${g.whatsapp || "-"}</td>
          <td>${g.isOpened ? "Sudah Dibuka" : "Belum Dibuka"}</td>
          <td style="text-align: center; vertical-align: middle;">${rsvpBadge}</td>
          <td style="text-align: center;">${paxText}</td>
          <td>${g.rsvp?.message || "-"}</td>
        </tr>
      `;
    }).join("");

    const dateStr = formatEventDate(new Date());

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Daftar Hadir Tamu - ${selectedInvitation.title}</title>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
        <style>
          body {
            font-family: "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #1a1a1a;
            padding: 20px;
            font-size: 11px;
            line-height: 1.4;
            background-color: #fff;
          }
          .header {
            text-align: center;
            margin-bottom: 25px;
            border-bottom: 3px double #C8A96A;
            padding-bottom: 15px;
          }
          .header h1 {
            margin: 0;
            font-size: 20px;
            color: #1a1a1a;
          }
          .header p {
            margin: 5px 0 0 0;
            color: #666;
            font-size: 12px;
          }
          .meta-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
          }
          .meta-info div {
            flex: 1;
          }
          .stats-table {
            width: 100%;
            margin-bottom: 20px;
            border-collapse: collapse;
          }
          .stats-table td {
            padding: 6px 12px;
            border: 1px solid #e4e4e7;
            background-color: #fafafa;
          }
          .main-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }
          .main-table th {
            background-color: #F8F6F2;
            border: 1px solid #C8A96A;
            color: #1a1a1a;
            font-weight: bold;
            padding: 8px 10px;
            font-size: 10px;
            text-transform: uppercase;
          }
          .main-table td {
            border: 1px solid #e4e4e7;
            padding: 8px 10px;
            vertical-align: top;
          }
          .main-table tr:nth-child(even) {
            background-color: #fafafa;
          }
          .badge {
            display: inline-block;
            padding: 3px 10px;
            font-weight: 700;
            font-size: 9px;
            border-radius: 9999px;
            text-align: center;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            white-space: nowrap;
          }
          .badge-hadir {
            background-color: #DEF7EC;
            color: #03543F;
            border: 1px solid #84E1BC;
          }
          .badge-tidak {
            background-color: #FDF2F2;
            color: #DE3E3E;
            border: 1px solid #F8B4B4;
          }
          .badge-ragu {
            background-color: #FEF3C7;
            color: #92400E;
            border: 1px solid #FCD34D;
          }
          .badge-belum {
            background-color: #F3F4F6;
            color: #4B5563;
            border: 1px solid #D1D5DB;
          }
          .footer {
            margin-top: 30px;
            text-align: right;
            font-size: 10px;
            color: #888;
          }
        </style>
      </head>
      <body>
        <div id="pdf-content" style="padding: 10px; background-color: #fff;">
          <div class="header">
            <h1>DAFTAR TAMU & REKAP RSVP</h1>
            <p>${selectedInvitation.title}</p>
          </div>

          <div class="meta-info">
            <div>
              <strong>Penyelenggara:</strong> ${selectedInvitation.groomNickname} & ${selectedInvitation.brideNickname}<br/>
              <strong>URL Undangan:</strong> ikara.id/${selectedInvitation.slug}
            </div>
            <div style="text-align: right;">
              <strong>Tanggal Cetak:</strong> ${dateStr}
            </div>
          </div>

          <table class="stats-table">
            <tr>
              <td><strong>Total Undangan Tamu:</strong> ${totalGuests} Orang</td>
              <td><strong>Telah Konfirmasi Hadir:</strong> ${attendingCount} Tamu</td>
              <td><strong>Total Porsi/Pax Hadir:</strong> ${totalPaxAttending} Pax</td>
              <td><strong>Belum Memberikan Respon:</strong> ${noResponseCount} Tamu</td>
            </tr>
          </table>

          <table class="main-table">
            <thead>
              <tr>
                <th style="width: 4%;">No</th>
                <th style="width: 22%;">Tamu Undangan</th>
                <th style="width: 14%;">No WhatsApp</th>
                <th style="width: 14%;">Status Dibuka</th>
                <th style="width: 14%;">Konfirmasi</th>
                <th style="width: 10%;">Jumlah Pax</th>
                <th>Doa & Ucapan Restu</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>

          <div class="footer">
            Laporan ini dicetak secara otomatis melalui sistem IKARA
          </div>
        </div>

        <script>
          window.onload = function() {
            const element = document.getElementById('pdf-content');
            const opt = {
              margin:       10,
              filename:     'Daftar_Tamu_${selectedInvitation.slug}.pdf',
              image:        { type: 'jpeg', quality: 0.98 },
              html2canvas:  { scale: 2, useCORS: true },
              jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };
            window.html2pdf().set(opt).from(element).save().then(function() {
              setTimeout(function() { window.close(); }, 800);
            }).catch(function(err) {
              console.error(err);
              window.close();
            });
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // Filtering guests
  const filteredGuests = initialGuests.filter((g) => {
    const matchesSearch = g.name.toLowerCase().includes(search.toLowerCase()) || 
                          (g.whatsapp && g.whatsapp.includes(search));

    if (!matchesSearch) return false;

    switch (filter) {
      case "OPENED":
        return g.isOpened;
      case "UNOPENED":
        return !g.isOpened;
      case "YES":
        return g.rsvp?.attendance === "YES";
      case "NO":
        return g.rsvp?.attendance === "NO";
      case "MAYBE":
        return g.rsvp?.attendance === "MAYBE";
      case "NO_RESPONSE":
        return !g.rsvp;
      default:
        return true;
    }
  });

  // Calculate statistics
  const stats = {
    total: initialGuests.length,
    opened: initialGuests.filter(g => g.isOpened).length,
    attending: initialGuests.filter(g => g.rsvp?.attendance === "YES").length,
    declined: initialGuests.filter(g => g.rsvp?.attendance === "NO").length,
    tentative: initialGuests.filter(g => g.rsvp?.attendance === "MAYBE").length,
    noResponse: initialGuests.filter(g => !g.rsvp).length,
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header Block */}
      <PageHeader
        title={
          <span className="inline-flex items-center gap-2">
            <Users className="h-8 w-8 text-gold-400" aria-hidden="true" />
            <span>Manajemen Tamu &amp; RSVP</span>
          </span>
        }
        description="Buat tautan undangan personal, pantau tamu yang membuka, dan kumpulkan konfirmasi kehadiran."
        action={
          invitations.length > 1 ? (
            <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-card px-3 py-1.5 shadow-(--shadow-gold-sm)">
              <label htmlFor="active-invitation" className="text-[10px] uppercase font-bold text-muted-foreground">
                Undangan:
              </label>
              <select
                id="active-invitation"
                value={selectedInvitation.id}
                onChange={handleInvitationChange}
                className="cursor-pointer border-none bg-transparent text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/60 rounded-md"
              >
                {invitations.map((inv) => (
                  <option key={inv.id} value={inv.id} className="bg-card">
                    {inv.title} ({inv.slug})
                  </option>
                ))}
              </select>
            </div>
          ) : null
        }
      />

      {/* Grid 4 Stats Cards */}
      <section aria-label="Ringkasan statistik tamu" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Guests */}
        <Surface as="article" padding="none" className="flex flex-col justify-between space-y-3 p-5">
          <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Total Tamu</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-foreground">{stats.total}</span>
            <span className="text-xs text-muted-foreground">Orang</span>
          </div>
        </Surface>

        {/* Card 2: Invitation Opened */}
        <Surface as="article" padding="none" className="flex flex-col justify-between space-y-3 p-5">
          <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Telah Dibuka</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-gold-400">{stats.opened}</span>
            <span className="text-xs text-muted-foreground">
              ({stats.total > 0 ? Math.round((stats.opened / stats.total) * 100) : 0}%)
            </span>
          </div>
        </Surface>

        {/* Card 3: Confirmed Attending */}
        <Surface as="article" padding="none" className="flex flex-col justify-between space-y-3 p-5">
          <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Konfirmasi Hadir</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600 dark:text-emerald-500">{stats.attending}</span>
            <span className="text-xs text-muted-foreground">
              ({stats.total > 0 ? Math.round((stats.attending / stats.total) * 100) : 0}%)
            </span>
          </div>
        </Surface>

        {/* Card 4: RSVP Responded Rate */}
        <Surface as="article" padding="none" className="flex flex-col justify-between space-y-3 p-5">
          <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Belum Respon</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-500">{stats.noResponse}</span>
            <span className="text-xs text-muted-foreground">Tamu</span>
          </div>
        </Surface>
      </section>

      {/* Toolbar Controls Section */}
      <Surface as="section" padding="none" className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4">
        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-grow max-w-2xl">
          <div className="relative flex-grow">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <label htmlFor="guest-search" className="sr-only">Cari tamu undangan</label>
            <input
              id="guest-search"
              type="text"
              placeholder="Cari Tamu Undangan atau nomor WhatsApp..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-border/60 bg-background text-xs focus:outline-none focus:ring-2 focus:ring-gold-400/60"
            />
          </div>

          <label htmlFor="guest-filter" className="sr-only">Filter tamu</label>
          <select
            id="guest-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="h-10 px-3 rounded-xl border border-border/60 bg-background text-xs text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold-400/60"
          >
            <option value="ALL">Semua Tamu</option>
            <option value="OPENED">Sudah Dibuka</option>
            <option value="UNOPENED">Belum Dibuka</option>
            <option value="YES">Konfirmasi: Hadir</option>
            <option value="NO">Konfirmasi: Tidak Hadir</option>
            <option value="MAYBE">Konfirmasi: Ragu-ragu</option>
            <option value="NO_RESPONSE">Belum Konfirmasi</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <Button onClick={handlePrintPDF} variant="outline" size="sm">
            <Printer className="w-4 h-4" aria-hidden="true" />
            <span>Cetak Daftar Hadir Tamu</span>
          </Button>

          <Button
            onClick={handleExportCSV}
            variant="outline"
            size="sm"
            disabled={initialGuests.length === 0}
          >
            <FileSpreadsheet className="w-4 h-4" aria-hidden="true" />
            <span>Export CSV</span>
          </Button>

          <Button onClick={() => setShowBulkModal(true)} variant="outline" size="sm">
            <UserPlus className="w-4 h-4" aria-hidden="true" />
            <span>Tambah Massal</span>
          </Button>

          <Button
            onClick={() => {
              resetSingleForm();
              setShowSingleModal(true);
            }}
            size="sm"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>Tambah Tamu</span>
          </Button>
        </div>
      </Surface>

      {/* Guest List Table */}
      <Surface as="section" padding="none" aria-label="Daftar tamu undangan" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background border-b border-border/40 text-[10px] uppercase font-bold text-muted-foreground">
                <th scope="col" className="py-4 px-6">Tamu Undangan</th>
                <th scope="col" className="py-4 px-4">WhatsApp</th>
                <th scope="col" className="py-4 px-4">Status Dibuka</th>
                <th scope="col" className="py-4 px-4">Kehadiran</th>
                <th scope="col" className="py-4 px-4">Doa &amp; Ucapan</th>
                <th scope="col" className="py-4 px-4">Tautan Undangan</th>
                <th scope="col" className="py-4 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-xs">
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-6">
                    <EmptyState
                      icon={Users}
                      title={search || filter !== "ALL" ? "Tidak Ada Hasil" : "Belum Ada Tamu"}
                      description={
                        search || filter !== "ALL"
                          ? "Tidak ditemukan tamu yang cocok dengan filter pencarian."
                          : "Belum ada tamu undangan. Silakan tambahkan tamu baru."
                      }
                    />
                  </td>
                </tr>
              ) : (
                filteredGuests.map((guest) => {
                  const link = `${baseUrl}/${selectedInvitation.slug}?to=${encodeURIComponent(guest.name)}&code=${guest.uniqueCode}`;
                  
                  return (
                    <tr key={guest.id} className="hover:bg-gold-400/5 transition-colors">
                      {/* Name */}
                      <th scope="row" className="py-4 px-6 text-left font-bold text-foreground truncate max-w-37.5">
                        {guest.name}
                      </th>

                      {/* WhatsApp */}
                      <td className="py-4 px-4 text-muted-foreground font-mono">
                        {guest.whatsapp || "-"}
                      </td>

                      {/* Is Opened */}
                      <td className="py-4 px-4">
                        {guest.isOpened ? (
                          <div className="space-y-0.5">
                            <Badge variant="success">
                              <Eye className="w-2.5 h-2.5" aria-hidden="true" />
                              <span>Dibuka</span>
                            </Badge>
                            {guest.openedAt && (
                              <span className="block text-[8px] text-muted-foreground font-light pl-1">
                                {formatShortDateTime(guest.openedAt)}
                              </span>
                            )}
                          </div>
                        ) : (
                          <Badge variant="neutral">
                            <Clock className="w-2.5 h-2.5" aria-hidden="true" />
                            <span>Belum</span>
                          </Badge>
                        )}
                      </td>

                      {/* RSVP Attendance */}
                      <td className="py-4 px-4">
                        {guest.rsvp ? (
                          <div className="space-y-0.5">
                            {guest.rsvp.attendance === "YES" && (
                              <Badge variant="success">HADIR</Badge>
                            )}
                            {guest.rsvp.attendance === "NO" && (
                              <Badge variant="danger">TIDAK</Badge>
                            )}
                            {guest.rsvp.attendance === "MAYBE" && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-950/60 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide leading-none text-amber-700 dark:text-amber-300">
                                RAGU
                              </span>
                            )}
                            {guest.rsvp.pax > 1 && (
                              <span className="block text-[8px] text-muted-foreground font-light pl-1.5">
                                {guest.rsvp.pax} Orang
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-[10px] font-medium text-muted-foreground">Belum Respon</span>
                        )}
                      </td>

                      {/* Message Wishes */}
                      <td className="py-4 px-4 text-muted-foreground font-light italic max-w-50 truncate" title={guest.rsvp?.message || ""}>
                        {guest.rsvp?.message || "-"}
                      </td>

                      {/* Personalized Link */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 max-w-60">
                          <label htmlFor={`link-${guest.id}`} className="sr-only">Tautan undangan untuk {guest.name}</label>
                          <input
                            id={`link-${guest.id}`}
                            type="text"
                            readOnly
                            value={link}
                            className="bg-background border border-border/50 rounded-lg px-2 py-1 text-[9px] font-mono text-muted-foreground w-full focus:outline-none focus:ring-2 focus:ring-gold-400/60"
                          />
                          <button
                            onClick={() => handleCopyLink(guest)}
                            className="p-1.5 rounded-lg border border-border/60 text-muted-foreground hover:bg-gold-400/10 hover:text-gold-600 shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/60"
                            aria-label={`Salin tautan undangan untuk ${guest.name}`}
                          >
                            {copiedId === guest.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                            )}
                          </button>

                          {guest.whatsapp && (
                            <a
                              href={getWaShareUrl(guest)}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 shrink-0 cursor-pointer flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
                              aria-label={`Kirim undangan ke WhatsApp ${guest.name}`}
                            >
                              <Send className="w-3.5 h-3.5" aria-hidden="true" />
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Operations */}
                      <td className="py-4 px-6 text-right shrink-0">
                        <div className="inline-flex items-center gap-1">
                          <Button
                            onClick={() => openEditModal(guest)}
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Edit tamu ${guest.name}`}
                          >
                            <Edit2 className="size-3.5" aria-hidden="true" />
                          </Button>
                          <Button
                            onClick={() => handleDelete(guest.id)}
                            variant="destructive"
                            size="icon-sm"
                            aria-label={`Hapus tamu ${guest.name}`}
                          >
                            <Trash2 className="size-3.5" aria-hidden="true" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Surface>

      {/* modal A: Single Guest (Create / Edit) */}
      {showSingleModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="single-guest-title"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-card w-full max-w-md rounded-3xl border border-border/60 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border/40">
              <h2 id="single-guest-title" className="font-heading text-base font-bold text-foreground flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-gold-400" aria-hidden="true" />
                <span>{editingGuest ? "Edit Data Tamu" : "Tambah Tamu Baru"}</span>
              </h2>
              <button
                onClick={() => setShowSingleModal(false)}
                className="w-7 h-7 rounded-full bg-background text-muted-foreground flex items-center justify-center cursor-pointer hover:text-gold-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/60"
                aria-label="Tutup dialog"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleSingleSubmit} className="space-y-4 text-left">
              {errorMsg && (
                <div role="alert" className="p-3 text-xs bg-destructive/10 text-destructive rounded-xl border border-destructive/20 font-medium">
                  {errorMsg}
                </div>
              )}

              <div className="space-y-1">
                <label htmlFor="guest-name" className="text-[10px] uppercase font-bold text-muted-foreground">Nama Lengkap Tamu *</label>
                <input
                  id="guest-name"
                  type="text"
                  required
                  placeholder="Contoh: Bapak Ahmad Basuri & Istri"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-border/60 bg-background text-xs focus:outline-none focus:ring-2 focus:ring-gold-400/60"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="guest-whatsapp" className="text-[10px] uppercase font-bold text-muted-foreground flex justify-between">
                  <span>Nomor WhatsApp (Opsional)</span>
                  <span className="text-[8px] text-muted-foreground font-light font-sans lowercase">Dengan kode negara, misal: 081234xxx / 628123xxx</span>
                </label>
                <input
                  id="guest-whatsapp"
                  type="text"
                  placeholder="Contoh: 08123456789"
                  value={guestWhatsapp}
                  onChange={(e) => setGuestWhatsapp(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-border/60 bg-background text-xs font-mono focus:outline-none focus:ring-2 focus:ring-gold-400/60"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  onClick={() => setShowSingleModal(false)}
                  variant="outline"
                >
                  Batal
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Menyimpan..." : editingGuest ? "Simpan Perubahan" : "Tambah Tamu"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* modal B: Bulk Guests (Textarea generator) */}
      {showBulkModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="bulk-guest-title"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-card w-full max-w-lg rounded-3xl border border-border/60 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border/40">
              <h2 id="bulk-guest-title" className="font-heading text-base font-bold text-foreground flex items-center gap-1.5">
                <UserPlus className="w-4 h-4 text-gold-400" aria-hidden="true" />
                <span>Tambah Tamu secara Massal</span>
              </h2>
              <button
                onClick={() => setShowBulkModal(false)}
                className="w-7 h-7 rounded-full bg-background text-muted-foreground flex items-center justify-center cursor-pointer hover:text-gold-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/60"
                aria-label="Tutup dialog"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleBulkSubmit} className="space-y-4 text-left">
              {errorMsg && (
                <div role="alert" className="p-3 text-xs bg-destructive/10 text-destructive rounded-xl border border-destructive/20 font-medium">
                  {errorMsg}
                </div>
              )}

              <div className="space-y-1.5">
                <label htmlFor="bulk-names" className="text-[10px] uppercase font-bold text-muted-foreground">Daftar Tamu Undangan (Satu Nama Per Baris)</label>
                <p className="text-[9px] text-muted-foreground font-light leading-relaxed">
                  Tuliskan satu nama per baris. Anda juga bisa menyertakan nomor WhatsApp dipisah tanda koma (koma).
                </p>
                <textarea
                  id="bulk-names"
                  rows="10"
                  required
                  placeholder={`Contoh:\nAhmad Basuri\nDewi Sartika, 0812345678\nKeluarga Besar Hartono, 0819876543\nSiti Rahma`}
                  value={rawBulkNames}
                  onChange={(e) => setRawBulkNames(e.target.value)}
                  className="w-full p-3 rounded-xl border border-border/60 bg-background text-xs focus:outline-none focus:ring-2 focus:ring-gold-400/60 font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  onClick={() => setShowBulkModal(false)}
                  variant="outline"
                >
                  Batal
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Mengeksekusi..." : "Generate Daftar Tamu"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
