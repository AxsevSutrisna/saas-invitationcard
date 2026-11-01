import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

export default async function DashboardLayout({ children }) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Ambil data terbaru dari DB agar perubahan profil (nama/foto) langsung
  // tampil di header & sidebar setelah disimpan — sesi JWT bisa tertinggal.
  const dbUser = await db.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, image: true, role: true },
  });
  const user = { ...session.user, ...(dbUser ?? {}) };

  return (
    <div className="flex min-h-screen bg-background font-sans text-foreground selection:bg-gold-400/20 selection:text-gold-600">
      {/* Sidebar Navigation */}
      <Sidebar user={user} />

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col transition-all duration-300 lg:pl-64">
        <Header user={user} />
        <main className="mx-auto w-full max-w-6xl flex-1 p-6 sm:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
