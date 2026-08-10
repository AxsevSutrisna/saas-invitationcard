import { RegisterForm } from "@/features/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export default function RegisterPage() {
  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md">
      <Card className="w-full shadow-2xl border-none">
        <CardHeader className="space-y-3 text-center">
          <div className="flex justify-center mb-2">
            <h1 className="text-3xl font-heading font-bold text-primary tracking-widest uppercase">
              IKARA
            </h1>
          </div>
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Create your account
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Welcome! Please fill in the details to get started.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <RegisterForm />
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 border-t border-border/40 px-6 py-4 bg-muted/20">
          <div className="text-sm text-center text-muted-foreground w-full">
            Already have an account?{" "}
            <Link
              href={ROUTES.LOGIN}
              className="text-primary hover:underline font-medium"
            >
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
      <p className="text-[12px] text-muted-foreground text-center px-4 leading-relaxed font-normal">
        Dengan mendaftar, Anda menyetujui{" "}
        <Link href="/terms" className="text-[#C8A96A] hover:underline font-semibold">
          Syarat & Ketentuan
        </Link>{" "}
        dan{" "}
        <Link href="/privacy" className="text-[#C8A96A] hover:underline font-semibold">
          Kebijakan Privasi
        </Link>{" "}
        kami.
      </p>
    </div>
  );
}
