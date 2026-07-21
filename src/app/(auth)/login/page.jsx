import { LoginForm } from "@/features/auth";
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

/**
 * Login Page
 * Thin page — hanya layout dan routing, logika form ada di LoginForm.
 */
export default function LoginPage() {
  return (
    <Card className="w-full max-w-md shadow-2xl border-none">
      <CardHeader className="space-y-3 text-center">
        <div className="flex justify-center mb-2">
          <h1 className="text-3xl font-heading font-bold text-primary tracking-widest uppercase">
            IKARA
          </h1>
        </div>
        <CardTitle className="text-2xl font-semibold tracking-tight">
          Welcome back
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Please enter your details to sign in.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <LoginForm />
      </CardContent>

      <CardFooter className="flex flex-col space-y-4 border-t border-border/40 px-6 py-4 bg-muted/20">
        <div className="text-sm text-center text-muted-foreground w-full">
          Don&apos;t have an account?{" "}
          <Link
            href={ROUTES.REGISTER}
            className="text-primary hover:underline font-medium"
          >
            Sign up
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
