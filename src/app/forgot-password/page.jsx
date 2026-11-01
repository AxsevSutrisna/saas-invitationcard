import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ForgotPasswordForm } from "@/features/auth";

export const metadata = {
  title: "Lupa Kata Sandi — IKARA",
  description: "Atur ulang kata sandi akun IKARA Anda.",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="space-y-2 text-center">
        <Link href="/" className="mx-auto">
          <h1 className="font-heading text-3xl font-bold uppercase tracking-widest text-primary transition-opacity hover:opacity-80">
            IKARA
          </h1>
        </Link>
        <CardTitle className="font-heading text-2xl font-semibold tracking-tight">
          Lupa Kata Sandi?
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Masukkan email Anda, kami akan mengirim tautan untuk mengatur ulang kata sandi.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ForgotPasswordForm />
      </CardContent>
    </Card>
  );
}
