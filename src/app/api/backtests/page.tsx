import { DashboardShell } from "@/components/layout/dashboard-shell";

export default function BacktestsPage() {
  return (
    <DashboardShell userEmail="User">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Backtests</h1>
          <p className="text-muted-foreground">
            Test trading strategies against historical market data.
          </p>
        </div>

        <div className="rounded-2xl border p-6">
          <h2 className="text-xl font-semibold">Strategy Runs</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Backtesting results will appear here after we connect strategy runs,
            returns, drawdown, and performance metrics.
          </p>
        </div>
      </div>
    </DashboardShell>
  );
}