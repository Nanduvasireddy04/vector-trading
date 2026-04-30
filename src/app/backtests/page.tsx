import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default async function BacktestsPage() {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    redirect("/login");
  }

  const { data: runs } = await supabase
    .from("strategy_runs")
    .select(
      "id, strategy_name, symbol, start_date, end_date, initial_cash, final_value, total_return, created_at"
    )
    .eq("user_id", userData.user.id)
    .order("created_at", { ascending: false });

  return (
    <DashboardShell userEmail={userData.user.email ?? "User"}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Backtests</h1>
          <p className="text-muted-foreground">
            View saved strategy simulations and performance results.
          </p>
        </div>

        <div className="rounded-2xl border overflow-hidden">
          <div className="grid grid-cols-7 border-b px-4 py-3 text-sm font-medium text-muted-foreground">
            <span>Strategy</span>
            <span>Symbol</span>
            <span>Period</span>
            <span>Initial Cash</span>
            <span>Final Value</span>
            <span>Return</span>
            <span>Created</span>
          </div>

          {(runs ?? []).length === 0 ? (
            <div className="p-6 text-muted-foreground">
              No backtests yet. Run one from the API first.
            </div>
          ) : (
            (runs ?? []).map((run) => (
              <div
                key={run.id}
                className="grid grid-cols-7 border-b px-4 py-4 text-sm last:border-b-0"
              >
                <span className="font-semibold">{run.strategy_name}</span>
                <span>{run.symbol}</span>
                <span>
                  {run.start_date} → {run.end_date}
                </span>
                <span>${Number(run.initial_cash).toFixed(2)}</span>
                <span>${Number(run.final_value).toFixed(2)}</span>
                <span
                  className={
                    Number(run.total_return) >= 0
                      ? "font-medium text-green-600"
                      : "font-medium text-red-600"
                  }
                >
                  {Number(run.total_return).toFixed(2)}%
                </span>
                <span className="text-muted-foreground">
                  {new Date(run.created_at).toLocaleString()}
                </span>
              </div>
            ))
          )}
        </div>

        <div className="rounded-2xl border p-6">
          <h2 className="text-xl font-semibold">Run Sample Backtests</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            These links run buy-and-hold simulations using available daily return
            data.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/api/backtests/buy-and-hold?symbol=AAPL&cash=10000"
              className="rounded-md border px-4 py-2 text-sm font-medium"
            >
              Run AAPL
            </Link>

            <Link
              href="/api/backtests/buy-and-hold?symbol=NVDA&cash=10000"
              className="rounded-md border px-4 py-2 text-sm font-medium"
            >
              Run NVDA
            </Link>

            <Link
              href="/api/backtests/buy-and-hold?symbol=TSLA&cash=10000"
              className="rounded-md border px-4 py-2 text-sm font-medium"
            >
              Run TSLA
            </Link>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}