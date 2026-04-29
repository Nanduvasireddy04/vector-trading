import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { WatchlistSearch } from "@/features/watchlist/watchlist-search";
import { WatchlistTable } from "@/features/watchlist/watchlist-table";

export default async function WatchlistPage() {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    redirect("/login");
  }

  const { data: items } = await supabase
    .from("watchlist_items")
    .select(
      `
      id,
      asset_id,
      created_at,
      assets (
        symbol,
        display_symbol,
        description,
        type
      )
    `
    )
    .eq("user_id", userData.user.id)
    .order("created_at", { ascending: false });

  return (
    <DashboardShell userEmail={userData.user.email ?? "User"}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Watchlist</h1>
          <p className="text-muted-foreground">
            Search and track stocks you want to monitor.
          </p>
        </div>

        <WatchlistSearch />

        <WatchlistTable items={items ?? []} />
      </div>
    </DashboardShell>
  );
}