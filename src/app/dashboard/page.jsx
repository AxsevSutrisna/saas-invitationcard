import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

/**
 * Dashboard Page (sementara/placeholder).
 * Akan dibangun secara penuh di Phase 3.
 */
export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="max-w-md w-full bg-card shadow-xl rounded-xl p-8 border border-border text-center space-y-6">
        <h1 className="text-3xl font-heading font-bold text-primary">
          Dashboard
        </h1>

        <div className="space-y-2 text-muted-foreground">
          <p>Selamat datang kembali!</p>
          <div className="p-4 bg-muted rounded-md text-left overflow-x-auto text-sm">
            <p>
              <strong>Name:</strong> {session.user?.name}
            </p>
            <p>
              <strong>Email:</strong> {session.user?.email}
            </p>
            <p>
              <strong>Role:</strong> {session.user?.role}
            </p>
          </div>
        </div>

        <form action="/api/auth/signout" method="POST">
          <Button variant="destructive" type="submit" className="w-full">
            Log Out
          </Button>
        </form>
      </div>
    </div>
  );
}
