import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default async function AnalyticsPage() {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    redirect("/login");
  }

  const { data: returns } = await supabase
    .from("daily_returns")
    .select("id, symbol, price_date, open_price, close_price, daily_return")
    .order("price_date", { ascending: false })
    .order("symbol", { ascending: true })
    .limit(100);

  return (
    <DashboardShell userEmail={userData.user.email ?? "User"}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">
            View transformed market data and daily return metrics.
          </p>
        </div>

        <div className="rounded-2xl border overflow-hidden">
          <div className="grid grid-cols-5 border-b px-4 py-3 text-sm font-medium text-muted-foreground">
            <span>Symbol</span>
            <span>Date</span>
            <span>Open</span>
            <span>Close</span>
            <span>Daily Return</span>
          </div>

          {(returns ?? []).length === 0 ? (
            <div className="p-6 text-muted-foreground">
              No analytics data yet. Run the daily returns transform first.
            </div>
          ) : (
            (returns ?? []).map((row) => (
              <div
                key={row.id}
                className="grid grid-cols-5 border-b px-4 py-4 text-sm last:border-b-0"
              >
                <span className="font-semibold">{row.symbol}</span>
                <span>{row.price_date}</span>
                <span>${Number(row.open_price).toFixed(2)}</span>
                <span>${Number(row.close_price).toFixed(2)}</span>
                <span
                  className={
                    Number(row.daily_return) >= 0
                      ? "font-medium text-green-600"
                      : "font-medium text-red-600"
                  }
                >
                  {Number(row.daily_return).toFixed(2)}%
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardShell>
  );
}