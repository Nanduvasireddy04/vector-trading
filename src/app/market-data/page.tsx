import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default async function MarketDataPage() {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    redirect("/login");
  }

  const { data: prices } = await supabase
    .from("market_prices")
    .select("id, symbol, price, source, captured_at")
    .order("captured_at", { ascending: false })
    .limit(50);

  return (
    <DashboardShell userEmail={userData.user.email ?? "User"}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Market Data</h1>
          <p className="text-muted-foreground">
            View recently captured market prices from the ingestion pipeline.
          </p>
        </div>

        <div className="rounded-2xl border overflow-hidden">
          <div className="grid grid-cols-4 border-b px-4 py-3 text-sm font-medium text-muted-foreground">
            <span>Symbol</span>
            <span>Price</span>
            <span>Source</span>
            <span>Captured At</span>
          </div>

          {(prices ?? []).length === 0 ? (
            <div className="p-6 text-muted-foreground">
              No market data captured yet.
            </div>
          ) : (
            (prices ?? []).map((row) => (
              <div
                key={row.id}
                className="grid grid-cols-4 border-b px-4 py-4 text-sm last:border-b-0"
              >
                <span className="font-semibold">{row.symbol}</span>
                <span>${Number(row.price).toFixed(2)}</span>
                <span className="capitalize">{row.source}</span>
                <span className="text-muted-foreground">
                  {new Date(row.captured_at).toLocaleString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardShell>
  );
}