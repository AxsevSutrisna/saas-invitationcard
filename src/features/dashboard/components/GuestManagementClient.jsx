"use client";

import { useState, useEffect, useTransition } from "react";
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
import {
  createGuestAction,
  createGuestsBulkAction,
  updateGuestAction,
  deleteGuestAction
} from "@/server/actions/guest.actions";

export function GuestManagementClient({ invitations, selectedInvitation, initialGuests }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [baseUrl, setBaseUrl] = useState("https://ikara.id");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setBaseUrl(window.location.origin);
    }
  }, []);

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
    const cleanPhone = guest.whatsapp.replace(/[^0-9]/g, "");
    const phoneWithCountry = cleanPhone.startsWith("0") ? "62" + cleanPhone.slice(1) : cleanPhone;
    return `https://api.whatsapp.com/send?phone=${phoneWithCountry}&text=${encodeURIComponent(message)}`;
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

    const dateStr = new Date().toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

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
                <th style="width: 22%;">Nama Tamu</th>
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-heading text-3xl font-bold text-[#1F1F1F] dark:text-zinc-50 tracking-tight flex items-center gap-2">
            <Users className="w-8 h-8 text-[#C8A96A]" />
            <span>Manajemen Tamu & RSVP</span>
          </h1>
          <p className="text-sm text-muted-foreground font-light">
            Buat tautan undangan personal, pantau tamu yang membuka, dan kumpulkan konfirmasi kehadiran.
          </p>
        </div>

        {/* Select Active Invitation Dropdown */}
        {invitations.length > 1 && (
          <div className="flex items-center gap-2 bg-white dark:bg-[#1A1A1A] border border-border/60 rounded-xl px-3 py-1.5 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Undangan:</span>
            <select
              value={selectedInvitation.id}
              onChange={handleInvitationChange}
              className="text-xs font-semibold bg-transparent text-foreground border-none focus:outline-none cursor-pointer"
            >
              {invitations.map((inv) => (
                <option key={inv.id} value={inv.id} className="bg-white dark:bg-[#1A1A1A]">
                  {inv.title} ({inv.slug})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Grid 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Guests */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#1A1A1A] border border-border/60 shadow-sm flex flex-col justify-between space-y-3">
          <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Total Tamu</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-foreground">{stats.total}</span>
            <span className="text-xs text-muted-foreground">Orang</span>
          </div>
        </div>

        {/* Card 2: Invitation Opened */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#1A1A1A] border border-border/60 shadow-sm flex flex-col justify-between space-y-3">
          <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Telah Dibuka</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#C8A96A]">{stats.opened}</span>
            <span className="text-xs text-muted-foreground">
              ({stats.total > 0 ? Math.round((stats.opened / stats.total) * 100) : 0}%)
            </span>
          </div>
        </div>

        {/* Card 3: Confirmed Attending */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#1A1A1A] border border-border/60 shadow-sm flex flex-col justify-between space-y-3">
          <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Konfirmasi Hadir</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600 dark:text-emerald-500">{stats.attending}</span>
            <span className="text-xs text-muted-foreground">
              ({stats.total > 0 ? Math.round((stats.attending / stats.total) * 100) : 0}%)
            </span>
          </div>
        </div>

        {/* Card 4: RSVP Responded Rate */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#1A1A1A] border border-border/60 shadow-sm flex flex-col justify-between space-y-3">
          <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Belum Respon</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-500">{stats.noResponse}</span>
            <span className="text-xs text-muted-foreground">Tamu</span>
          </div>
        </div>
      </div>

      {/* Toolbar Controls Section */}
      <div className="p-4 rounded-3xl bg-white dark:bg-[#1A1A1A] border border-border/60 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-grow max-w-2xl">
          <div className="relative flex-grow">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Cari nama tamu atau nomor WhatsApp..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-border/60 bg-zinc-50 dark:bg-zinc-900 text-xs focus:ring-1 focus:ring-[#C8A96A] focus:outline-none"
            />
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="h-10 px-3 rounded-xl border border-border/60 bg-zinc-50 dark:bg-zinc-900 text-xs text-foreground focus:outline-none cursor-pointer"
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
          <Button
            onClick={handlePrintPDF}
            variant="outline"
            className="h-10 px-4 rounded-xl text-xs flex items-center gap-1.5 border-[#C8A96A]/40 text-[#C8A96A] hover:bg-[#C8A96A]/10 cursor-pointer font-semibold"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Daftar Hadir Tamu</span>
          </Button>

          <Button
            onClick={() => setShowBulkModal(true)}
            variant="outline"
            className="h-10 px-4 rounded-xl text-xs flex items-center gap-1.5 border-border/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah Massal</span>
          </Button>

          <Button
            onClick={() => {
              resetSingleForm();
              setShowSingleModal(true);
            }}
            className="h-10 px-4 rounded-xl text-xs flex items-center gap-1.5 bg-gradient-to-r from-[#C8A96A] to-[#b39150] hover:from-[#b39150] hover:to-[#9e7e40] text-white shadow-md shadow-[#C8A96A]/20 cursor-pointer font-semibold border-none"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Tamu</span>
          </Button>
        </div>
      </div>

      {/* Guest List Table */}
      <div className="rounded-3xl bg-white dark:bg-[#1A1A1A] border border-border/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-900 border-b border-border/40 text-[10px] uppercase font-bold text-muted-foreground">
                <th className="py-4 px-6">Nama Tamu</th>
                <th className="py-4 px-4">WhatsApp</th>
                <th className="py-4 px-4">Status Dibuka</th>
                <th className="py-4 px-4">Kehadiran</th>
                <th className="py-4 px-4">Doa & Ucapan</th>
                <th className="py-4 px-4">Tautan Undangan</th>
                <th className="py-4 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-xs">
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-muted-foreground font-light">
                    {search || filter !== "ALL"
                      ? "Tidak ditemukan tamu yang cocok dengan filter pencarian."
                      : "Belum ada tamu undangan. Silakan tambahkan tamu baru."}
                  </td>
                </tr>
              ) : (
                filteredGuests.map((guest) => {
                  const link = `${baseUrl}/${selectedInvitation.slug}?to=${encodeURIComponent(guest.name)}&code=${guest.uniqueCode}`;
                  
                  return (
                    <tr key={guest.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors">
                      {/* Name */}
                      <td className="py-4 px-6 font-bold text-foreground truncate max-w-[150px]">
                        {guest.name}
                      </td>

                      {/* WhatsApp */}
                      <td className="py-4 px-4 text-muted-foreground font-mono">
                        {guest.whatsapp || "-"}
                      </td>

                      {/* Is Opened */}
                      <td className="py-4 px-4">
                        {guest.isOpened ? (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                              <Eye className="w-2.5 h-2.5" />
                              <span>Dibuka</span>
                            </span>
                            {guest.openedAt && (
                              <span className="block text-[8px] text-muted-foreground font-light pl-1">
                                {new Date(guest.openedAt).toLocaleDateString("id-ID", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                            <Clock className="w-2.5 h-2.5" />
                            <span>Belum</span>
                          </span>
                        )}
                      </td>

                      {/* RSVP Attendance */}
                      <td className="py-4 px-4">
                        {guest.rsvp ? (
                          <div className="space-y-0.5">
                            {guest.rsvp.attendance === "YES" && (
                              <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                                HADIR
                              </span>
                            )}
                            {guest.rsvp.attendance === "NO" && (
                              <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300">
                                TIDAK
                              </span>
                            )}
                            {guest.rsvp.attendance === "MAYBE" && (
                              <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
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
                          <span className="text-[10px] font-medium text-zinc-400">Belum Respon</span>
                        )}
                      </td>

                      {/* Message Wishes */}
                      <td className="py-4 px-4 text-muted-foreground font-light italic max-w-[200px] truncate" title={guest.rsvp?.message || ""}>
                        {guest.rsvp?.message || "-"}
                      </td>

                      {/* Personalized Link */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 max-w-[240px]">
                          <input
                            type="text"
                            readOnly
                            value={link}
                            className="bg-zinc-50 dark:bg-zinc-900 border border-border/50 rounded-lg px-2 py-1 text-[9px] font-mono text-zinc-500 w-full focus:outline-none"
                          />
                          <button
                            onClick={() => handleCopyLink(guest)}
                            className="p-1.5 rounded-lg border border-border/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-foreground shrink-0 cursor-pointer"
                            title="Salin Tautan"
                          >
                            {copiedId === guest.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          
                          {guest.whatsapp && (
                            <a
                              href={getWaShareUrl(guest)}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 shrink-0 cursor-pointer flex items-center justify-center"
                              title="Kirim ke WhatsApp"
                            >
                              <Send className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Operations */}
                      <td className="py-4 px-6 text-right space-x-1 shrink-0">
                        <button
                          onClick={() => openEditModal(guest)}
                          className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-[#C8A96A] cursor-pointer"
                          title="Edit Tamu"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(guest.id)}
                          className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 text-zinc-500 hover:text-rose-600 cursor-pointer"
                          title="Hapus Tamu"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* modal A: Single Guest (Create / Edit) */}
      {showSingleModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1A1A1A] w-full max-w-md rounded-3xl border border-border/60 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border/40">
              <h3 className="font-heading text-base font-bold text-foreground flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#C8A96A]" />
                <span>{editingGuest ? "Edit Data Tamu" : "Tambah Tamu Baru"}</span>
              </h3>
              <button
                onClick={() => setShowSingleModal(false)}
                className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 text-muted-foreground flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSingleSubmit} className="space-y-4 text-left">
              {errorMsg && (
                <div className="p-3 text-xs bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-xl border border-rose-500/20 font-medium">
                  {errorMsg}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Nama Lengkap Tamu *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Bapak Ahmad Basuri & Istri"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-border/60 bg-zinc-50 dark:bg-zinc-900 text-xs focus:ring-1 focus:ring-[#C8A96A] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-muted-foreground flex justify-between">
                  <span>Nomor WhatsApp (Opsional)</span>
                  <span className="text-[8px] text-zinc-400 font-light font-sans lowercase">Dengan kode negara, misal: 081234xxx / 628123xxx</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 08123456789"
                  value={guestWhatsapp}
                  onChange={(e) => setGuestWhatsapp(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-border/60 bg-zinc-50 dark:bg-zinc-900 text-xs font-mono focus:ring-1 focus:ring-[#C8A96A] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  onClick={() => setShowSingleModal(false)}
                  variant="outline"
                  className="h-10 px-4 rounded-xl text-xs cursor-pointer"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="h-10 px-5 rounded-xl text-xs bg-gradient-to-r from-[#C8A96A] to-[#b39150] hover:from-[#b39150] hover:to-[#9e7e40] text-white font-semibold shadow-md shadow-[#C8A96A]/20 cursor-pointer border-none"
                >
                  {isPending ? "Menyimpan..." : editingGuest ? "Simpan Perubahan" : "Tambah Tamu"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* modal B: Bulk Guests (Textarea generator) */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1A1A1A] w-full max-w-lg rounded-3xl border border-border/60 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border/40">
              <h3 className="font-heading text-base font-bold text-foreground flex items-center gap-1.5">
                <UserPlus className="w-4 h-4 text-[#C8A96A]" />
                <span>Tambah Tamu secara Massal</span>
              </h3>
              <button
                onClick={() => setShowBulkModal(false)}
                className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 text-muted-foreground flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleBulkSubmit} className="space-y-4 text-left">
              {errorMsg && (
                <div className="p-3 text-xs bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-xl border border-rose-500/20 font-medium">
                  {errorMsg}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Daftar Nama Tamu (Satu Nama Per Baris)</label>
                <p className="text-[9px] text-muted-foreground font-light leading-relaxed">
                  Tuliskan satu nama per baris. Anda juga bisa menyertakan nomor WhatsApp dipisah tanda koma (koma).
                </p>
                <textarea
                  rows="10"
                  required
                  placeholder={`Contoh:\nAhmad Basuri\nDewi Sartika, 0812345678\nKeluarga Besar Hartono, 0819876543\nSiti Rahma`}
                  value={rawBulkNames}
                  onChange={(e) => setRawBulkNames(e.target.value)}
                  className="w-full p-3 rounded-xl border border-border/60 bg-zinc-50 dark:bg-zinc-900 text-xs focus:ring-1 focus:ring-[#C8A96A] focus:outline-none font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  onClick={() => setShowBulkModal(false)}
                  variant="outline"
                  className="h-10 px-4 rounded-xl text-xs cursor-pointer"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="h-10 px-5 rounded-xl text-xs bg-gradient-to-r from-[#C8A96A] to-[#b39150] hover:from-[#b39150] hover:to-[#9e7e40] text-white font-semibold shadow-md shadow-[#C8A96A]/20 cursor-pointer border-none"
                >
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
