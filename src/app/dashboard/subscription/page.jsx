import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import {
  findActiveSubscriptionByUserId,
  findAllActivePackages,
} from "@/features/subscription/repository";
import { findTransactionsByUserId } from "@/features/payment/repository";
import { SubscriptionClient } from "@/features/subscription/components/SubscriptionClient";
import { ROUTES } from "@/constants/routes";
import { serialize } from "@/lib/utils";

export default async function SubscriptionPage() {
  const session = await auth();

  // 1. Redirect Ke Halaman Login Jika Sesi Kosong
  if (!session || !session.user || !session.user.id) {
    redirect(ROUTES.LOGIN || "/login");
  }

  // 2. Fetch Data paralel dari Database (Server-Side)
  const [activeSubscription, packages, transactions] = await Promise.all([
    findActiveSubscriptionByUserId(session.user.id),
    findAllActivePackages(),
    findTransactionsByUserId(session.user.id),
  ]);

  // 3. Serialisasi Data untuk Mencegah Next.js SSR Serialization Warnings (karena properti Date)
  const serializedSubscription = activeSubscription ? serialize(activeSubscription) : null;
  const serializedPackages = serialize(packages);
  const serializedTransactions = serialize(transactions);

  return (
    <SubscriptionClient
      activeSubscription={serializedSubscription}
      packages={serializedPackages}
      transactions={serializedTransactions}
    />
  );
}
