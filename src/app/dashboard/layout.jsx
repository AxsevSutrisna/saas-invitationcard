import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

export default async function DashboardLayout({ children }) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-background font-sans text-foreground selection:bg-gold-400/20 selection:text-gold-600">
      {/* Sidebar Navigation */}
      <Sidebar user={session.user} />

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col transition-all duration-300 lg:pl-64">
        <Header user={session.user} />
        <main className="mx-auto w-full max-w-6xl flex-1 p-6 sm:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
