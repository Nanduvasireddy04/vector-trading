import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AutoRefresh } from "@/components/AutoRefresh";

async function getQuote(symbol: string) {
  const apiKey = process.env.FINNHUB_API_KEY;

  if (!apiKey) {
    return null;
  }

  const url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(
    symbol
  )}&token=${apiKey}`;

  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();

  if (!data.c || data.c <= 0) {
    return null;
  }

  return {
    currentPrice: Number(data.c),
    change: Number(data.d ?? 0),
    percentChange: Number(data.dp ?? 0),
  };
}

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

  const enrichedPositions = await Promise.all(
    (positions ?? []).map(async (position) => {
      const asset = Array.isArray(position.assets)
        ? position.assets[0]
        : position.assets;

      const symbol = asset?.symbol ?? "";
      const quote = symbol ? await getQuote(symbol) : null;

      const quantity = Number(position.quantity);
      const averageCost = Number(position.average_cost);
      const currentPrice = quote?.currentPrice ?? averageCost;
      const costBasis = quantity * averageCost;
      const marketValue = quantity * currentPrice;
      const unrealizedPnL = marketValue - costBasis;
      const unrealizedPnLPercent =
        costBasis > 0 ? (unrealizedPnL / costBasis) * 100 : 0;

      return {
        id: position.id,
        symbol: asset?.display_symbol ?? asset?.symbol ?? "N/A",
        description: asset?.description ?? "",
        quantity,
        averageCost,
        currentPrice,
        costBasis,
        marketValue,
        unrealizedPnL,
        unrealizedPnLPercent,
        dayChangePercent: quote?.percentChange ?? 0,
      };
    })
  );

  const cashBalance = Number(profile?.cash_balance ?? 0);
  const holdingsValue = enrichedPositions.reduce(
    (sum, position) => sum + position.marketValue,
    0
  );
  const totalAccountValue = cashBalance + holdingsValue;
  const totalCostBasis = enrichedPositions.reduce(
    (sum, position) => sum + position.costBasis,
    0
  );
  const totalUnrealizedPnL = holdingsValue - totalCostBasis;

  return (
    
    <DashboardShell userEmail={userData.user.email ?? "User"}>
      <AutoRefresh intervalMs={15000} />
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Portfolio</h1>
          <p className="text-xs text-muted-foreground">
          Portfolio refreshes every 15 seconds
        </p>
          <p className="text-muted-foreground">
            Track simulated holdings, buying power, and unrealized performance.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border p-6">
            <h2 className="font-semibold">Account Value</h2>
            <p className="mt-2 text-3xl font-bold">
              ${totalAccountValue.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </p>
          </div>

          <div className="rounded-2xl border p-6">
            <h2 className="font-semibold">Cash Balance</h2>
            <p className="mt-2 text-3xl font-bold">
              ${cashBalance.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </p>
          </div>

          <div className="rounded-2xl border p-6">
            <h2 className="font-semibold">Holdings Value</h2>
            <p className="mt-2 text-3xl font-bold">
              ${holdingsValue.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </p>
          </div>

          <div className="rounded-2xl border p-6">
            <h2 className="font-semibold">Unrealized P&L</h2>
            <p className="mt-2 text-3xl font-bold">
              ${totalUnrealizedPnL.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border overflow-hidden">
          <div className="grid grid-cols-7 border-b px-4 py-3 text-sm font-medium text-muted-foreground">
            <span>Symbol</span>
            <span>Qty</span>
            <span>Avg Cost</span>
            <span>Current</span>
            <span>Cost Basis</span>
            <span>Market Value</span>
            <span>Unrealized P&L</span>
          </div>

          {enrichedPositions.length === 0 ? (
            <div className="p-6 text-muted-foreground">
              No positions yet. Buy from your watchlist to start paper trading.
            </div>
          ) : (
            enrichedPositions.map((position) => (
              <div
                key={position.id}
                className="grid grid-cols-7 border-b px-4 py-4 text-sm last:border-b-0"
              >
                <div>
                  <p className="font-semibold">{position.symbol}</p>
                  <p className="text-xs text-muted-foreground">
                    {position.description}
                  </p>
                </div>
                <span>{position.quantity.toLocaleString()}</span>
                <span>${position.averageCost.toFixed(2)}</span>
                <span>${position.currentPrice.toFixed(2)}</span>
                <span>
                  ${position.costBasis.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </span>
                <span>
                  ${position.marketValue.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </span>
                <span>
                  ${position.unrealizedPnL.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}{" "}
                  ({position.unrealizedPnLPercent.toFixed(2)}%)
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardShell>
  );
}