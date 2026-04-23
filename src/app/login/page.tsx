import Link from "next/link";
import { LoginForm } from "@/features/auth/login-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-md">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl">Log in to Vector Trading</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <LoginForm />
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="underline underline-offset-4">
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}