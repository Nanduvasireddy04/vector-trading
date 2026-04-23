"use client";

import { useSearchParams } from "next/navigation";
import { login } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  return (
    <form action={login} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <Input id="email" name="email" type="email" placeholder="you@example.com" required />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <Input id="password" name="password" type="password" placeholder="Enter password" required />
      </div>

      {message ? (
        <p className="text-sm text-red-500">{message}</p>
      ) : null}

      <Button type="submit" className="w-full">
        Log In
      </Button>
    </form>
  );
}