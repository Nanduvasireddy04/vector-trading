import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data:userData } = await supabase.auth.getUser();

  if (!userData.user) {
    redirect("/login");
  }

  const {data:profile, error} = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userData.user.id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching user profile:", error?.message);
  }

  let currentProfile = profile;

  if (!currentProfile) {
    const { data: insertedProfile, error: insertError } = await supabase
      .from("profiles")
      .insert({
        id: userData.user.id,
        email: userData.user.email,
      })
      .select()
      .maybeSingle();

    if (insertError) {
      console.error("Error creating missing profile:", insertError.message);
    }

    currentProfile = insertedProfile;
  }

  return (
    <DashboardShell userEmail={userData.user.email ?? "User"}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to Vector Trading. Your paper trading workspace starts here.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border p-6">
            <h2 className="font-semibold">Portfolio Value</h2>
            <p className="mt-2 text-2xl font-bold">$100,000.00</p>
            <p className="text-sm text-muted-foreground">Initial paper balance</p>
          </div>

          <div className="rounded-2xl border p-6">
            <h2 className="font-semibold">Open Orders</h2>
            <p className="mt-2 text-2xl font-bold">0</p>
            <p className="text-sm text-muted-foreground">No active orders yet</p>
          </div>

          <div className="rounded-2xl border p-6">
            <h2 className="font-semibold">Watchlist</h2>
            <p className="mt-2 text-2xl font-bold">0</p>
            <p className="text-sm text-muted-foreground">No assets added yet</p>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}