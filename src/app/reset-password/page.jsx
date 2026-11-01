import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ResetPasswordForm } from "@/features/auth";

export const metadata = {
  title: "Atur Ulang Kata Sandi — IKARA",
  description: "Buat kata sandi baru untuk akun IKARA Anda.",
  robots: { index: false, follow: false },
};

export default async function ResetPasswordPage({ searchParams }) {
  const sp = await searchParams;
  const token = typeof sp?.token === "string" ? sp.token : "";

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="space-y-2 text-center">
        <Link href="/" className="mx-auto">
          <h1 className="font-heading text-3xl font-bold uppercase tracking-widest text-primary transition-opacity hover:opacity-80">
            IKARA
          </h1>
        </Link>
        <CardTitle className="font-heading text-2xl font-semibold tracking-tight">
          Buat Kata Sandi Baru
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Masukkan kata sandi baru untuk akun Anda.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResetPasswordForm token={token} />
      </CardContent>
    </Card>
  );
}
