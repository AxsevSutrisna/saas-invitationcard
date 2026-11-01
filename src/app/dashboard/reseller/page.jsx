import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { cannot } from "@/lib/ability";
import { serialize } from "@/lib/utils";
import { getInvitationsByUserId } from "@/features/invitation/repository";
import {
  findResellerCreditsByAgency,
  getCreditSummaryByAgency,
} from "@/features/reseller/repository";
import { findResellerPackages } from "@/features/subscription/repository";
import { ResellerClient } from "@/features/reseller/components/ResellerClient";

export const metadata = {
  title: "Reseller & Kredit — IKARA Dashboard",
  description: "Beli kredit lisensi grosir dan alokasikan ke undangan klien Anda.",
  robots: { index: false, follow: false },
};

export default async function ResellerPage() {
  const session = await auth();

  // Hanya AGENCY (dan SUPER_ADMIN) yang boleh membuka panel reseller.
  if (cannot(session?.user, "reseller:access")) {
    redirect("/dashboard");
  }

  const userId = session.user.id;
  const [credits, summary, resellerPackages, invitations] = await Promise.all([
    findResellerCreditsByAgency(userId),
    getCreditSummaryByAgency(userId),
    findResellerPackages(),
    getInvitationsByUserId(userId),
  ]);

  // Undangan yang belum punya entitlement aktif = kandidat alokasi.
  const invitationOptions = invitations.map((inv) => ({
    id: inv.id,
    title: inv.title,
    hasEntitlement: (inv.entitlements?.length || 0) > 0,
  }));

  return (
    <ResellerClient
      credits={serialize(credits)}
      summary={summary}
      resellerPackages={serialize(resellerPackages)}
      invitations={invitationOptions}
    />
  );
}
