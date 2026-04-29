import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/layout/dashboard-shell";

async function getQuote(symbol: string) {
  const apiKey = process.env.FINNHUB_API_KEY;

  if (!apiKey) return null;

  const response = await fetch(
    `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${apiKey}`,
    { cache: "no-store" }
  );

  if (!response.ok) return null;

  const data = await response.json();

  if (!data.c || data.c <= 0) return null;

  return Number(data.c);
}

export default async function DashboardPage() {
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
      assets (
        symbol,
        display_symbol
      )
    `
    )
    .eq("user_id", userData.user.id)
    .gt("quantity", 0);

  const { data: recentOrders } = await supabase
    .from("orders")
    .select(
      `
      id,
      side,
      quantity,
      estimated_price,
      status,
      created_at,
      assets (
        symbol,
        display_symbol
      )
    `
    )
    .eq("user_id", userData.user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const enrichedPositions = await Promise.all(
    (positions ?? []).map(async (position) => {
      const asset = Array.isArray(position.assets)
        ? position.assets[0]
        : position.assets;

      const symbol = asset?.symbol ?? "";
      const currentPrice = symbol ? await getQuote(symbol) : null;

      const quantity = Number(position.quantity);
      const averageCost = Number(position.average_cost);
      const price = currentPrice ?? averageCost;

      return {
        id: position.id,
        symbol: asset?.display_symbol ?? asset?.symbol ?? "N/A",
        quantity,
        marketValue: quantity * price,
        costBasis: quantity * averageCost,
      };
    })
  );

  const cashBalance = Number(profile?.cash_balance ?? 0);
  const holdingsValue = enrichedPositions.reduce(
    (sum, position) => sum + position.marketValue,
    0
  );
  const costBasis = enrichedPositions.reduce(
    (sum, position) => sum + position.costBasis,
    0
  );

  const accountValue = cashBalance + holdingsValue;
  const unrealizedPnL = holdingsValue - costBasis;
  const openPositions = enrichedPositions.length;

  return (
    <DashboardShell userEmail={userData.user.email ?? "User"}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your simulated trading account.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border p-6">
            <h2 className="font-semibold">Account Value</h2>
            <p className="mt-2 text-3xl font-bold">
              ${accountValue.toLocaleString(undefined, {
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
              ${unrealizedPnL.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </p>
            <p className="text-sm text-muted-foreground">
              {openPositions} open position{openPositions === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border p-6">
            <h2 className="font-semibold">Open Positions</h2>

            {enrichedPositions.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">
                No open positions yet.
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                {enrichedPositions.slice(0, 5).map((position) => (
                  <div
                    key={position.id}
                    className="flex items-center justify-between rounded-xl border p-3"
                  >
                    <div>
                      <p className="font-semibold">{position.symbol}</p>
                      <p className="text-sm text-muted-foreground">
                        {position.quantity} shares
                      </p>
                    </div>
                    <p className="font-medium">
                      ${position.marketValue.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border p-6">
            <h2 className="font-semibold">Recent Orders</h2>

            {(recentOrders ?? []).length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">
                No orders yet.
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                {recentOrders?.map((order) => {
                  const asset = Array.isArray(order.assets)
                    ? order.assets[0]
                    : order.assets;

                  return (
                    <div
                      key={order.id}
                      className="flex items-center justify-between rounded-xl border p-3"
                    >
                      <div>
                        <p className="font-semibold">
                          {asset?.display_symbol ?? asset?.symbol}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {order.side.toUpperCase()} {Number(order.quantity)} @ $
                          {Number(order.estimated_price).toFixed(2)}
                        </p>
                      </div>
                      <span className="text-sm capitalize text-muted-foreground">
                        {order.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}