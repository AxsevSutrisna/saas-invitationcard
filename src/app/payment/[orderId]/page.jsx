import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { findTransactionByOrderId } from "@/features/payment/repository";
import { serialize } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";
import { PaymentInstructions } from "@/features/payment/components/PaymentInstructions";

export const metadata = {
  title: "Pembayaran — IKARA",
  description: "Selesaikan instruksi pembayaran paket langganan IKARA.",
  robots: { index: false, follow: false },
};

export default async function PaymentOrderPage({ params }) {
  const { orderId } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect(ROUTES.LOGIN);

  const tx = await findTransactionByOrderId(orderId);
  if (!tx || tx.userId !== session.user.id) notFound();

  return <PaymentInstructions transaction={serialize(tx)} />;
}
