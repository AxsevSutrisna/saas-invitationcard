import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import {
  findActiveSubscriptionByUserId,
  findAllActivePackages,
} from "@/server/repositories/subscription.repository";
import { findTransactionsByUserId } from "@/server/repositories/transaction.repository";
import { SubscriptionClient } from "@/features/dashboard/components/SubscriptionClient";
import { ROUTES } from "@/constants/routes";

export default async function SubscriptionPage() {
  const session = await auth();

  // 1. Redirect Ke Halaman Login Jika Sesi Kosong
  if (!session || !session.user || !session.user.id) {
    redirect(ROUTES.LOGIN || "/login");
  }

  // 2. Fetch Data dari Database Neon (Server-Side)
  const activeSubscription = await findActiveSubscriptionByUserId(session.user.id);
  const packages = await findAllActivePackages();
  const transactions = await findTransactionsByUserId(session.user.id);

  // 3. Serialisasi Data untuk Mencegah Next.js SSR Serialization Warnings (karena properti Date)
  const serializedSubscription = activeSubscription
    ? JSON.parse(JSON.stringify(activeSubscription))
    : null;

  const serializedPackages = JSON.parse(JSON.stringify(packages));
  const serializedTransactions = JSON.parse(JSON.stringify(transactions));

  return (
    <SubscriptionClient
      activeSubscription={serializedSubscription}
      packages={serializedPackages}
      transactions={serializedTransactions}
    />
  );
}
