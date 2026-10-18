import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { findPackageById } from "@/features/subscription/repository";
import { serialize } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";
import { CheckoutClient } from "@/features/payment/components/CheckoutClient";

export const metadata = {
  title: "Checkout — IKARA",
  description: "Selesaikan pembayaran paket langganan IKARA.",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage({ searchParams }) {
  const sp = await searchParams;
  const session = await auth();
  if (!session?.user?.id) redirect(ROUTES.LOGIN);

  const packageId = sp?.package;
  const invitationId = sp?.invitation || null;
  const quantity = sp?.qty ? Math.max(1, parseInt(sp.qty) || 1) : 1;

  if (!packageId) redirect(ROUTES.SUBSCRIPTION);

  const pkg = await findPackageById(packageId);
  if (!pkg || pkg.price <= 0) redirect(ROUTES.SUBSCRIPTION);

  const isReseller = pkg.saleType === "RESELLER";
  const unit = isReseller ? pkg.wholesalePrice ?? pkg.price : pkg.price;
  const amount = isReseller ? unit * quantity : pkg.price;

  return (
    <CheckoutClient
      pkg={serialize(pkg)}
      invitationId={invitationId}
      quantity={quantity}
      amount={amount}
    />
  );
}
