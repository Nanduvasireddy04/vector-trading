import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default async function PortfolioPage() {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("cash_balance,total_value")
    .eq("id", userData.user.id)
    .maybeSingle();

  const { data: positions } = await supabase
    .from("positions")
    .select(
      `
      id,
      quantity,
      average_cost,
      updated_at,
      assets (
        symbol,
        display_symbol,
        description
      )
    `
    )
    .eq("user_id", userData.user.id)
    .gt("quantity", 0)
    .order("updated_at", { ascending: false });

  return (
    <DashboardShell userEmail={userData.user.email ?? "User"}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Portfolio</h1>
          <p className="text-muted-foreground">
            Track your simulated holdings and buying power.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border p-6">
            <h2 className="font-semibold">Cash Balance</h2>
            <p className="mt-2 text-3xl font-bold">
              ${Number(profile?.cash_balance ?? 0).toLocaleString()}
            </p>
          </div>

          <div className="rounded-2xl border p-6">
            <h2 className="font-semibold">Total Value</h2>
            <p className="mt-2 text-3xl font-bold">
              ${Number(profile?.total_value ?? 0).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border overflow-hidden">
          <div className="grid grid-cols-4 border-b px-4 py-3 text-sm font-medium text-muted-foreground">
            <span>Symbol</span>
            <span>Quantity</span>
            <span>Avg Cost</span>
            <span>Cost Basis</span>
          </div>

          {(positions ?? []).length === 0 ? (
            <div className="p-6 text-muted-foreground">
              No positions yet. Buy from your watchlist to start paper trading.
            </div>
          ) : (
            positions?.map((position) => {
              const asset = Array.isArray(position.assets)
                ? position.assets[0]
                : position.assets;

              return (
                <div
                  key={position.id}
                  className="grid grid-cols-4 border-b px-4 py-4 last:border-b-0"
                >
                  <span className="font-semibold">
                    {asset?.display_symbol ?? asset?.symbol}
                  </span>
                  <span>{Number(position.quantity).toLocaleString()}</span>
                  <span>${Number(position.average_cost).toFixed(2)}</span>
                  <span>
                    $
                    {(
                      Number(position.quantity) *
                      Number(position.average_cost)
                    ).toLocaleString()}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </DashboardShell>
  );
}