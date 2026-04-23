import Link from "next/link";
import { SignupForm } from "@/features/auth/signup-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignupPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-md">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl">Create your Vector Trading account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <SignupForm />
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="underline underline-offset-4">
                Log in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}