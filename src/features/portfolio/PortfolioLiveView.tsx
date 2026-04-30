"use client";

import { useEffect, useState } from "react";
import { PortfolioValueChart } from "@/features/portfolio/PortfolioValueChart";

type Position = {
  id: string;
  symbol: string;
  description: string;
  quantity: number;
  averageCost: number;
  currentPrice: number;
  marketValue: number;
  costBasis: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
};

type ChartPoint = {
  date: string;
  value: number;
};

type PortfolioData = {
  accountValue: number;
  cashBalance: number;
  holdingsValue: number;
  totalCostBasis: number;
  totalUnrealizedPnL: number;
  totalUnrealizedPnLPercent: number;
  positionCount: number;
  bestPerformer: Performer | null;
  worstPerformer: Performer | null;
  allocation: Allocation[];
  positions: Position[];
  chartData: ChartPoint[];
};

function format(n: number) {
  return n.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  });
}

export function PortfolioLiveView() {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  async function loadPortfolio() {
    const response = await fetch("/api/portfolio", {
      cache: "no-store",
    });

    if (!response.ok) {
      setIsLoading(false);
      return;
    }

    const result = await response.json();

    setData(result);
    setLastUpdated(new Date().toLocaleTimeString());
    setIsLoading(false);
  }

  useEffect(() => {
    loadPortfolio();

    const interval = setInterval(() => {
      loadPortfolio();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading portfolio...</p>;
  }

  if (!data) {
    return <p className="text-sm text-red-600">Unable to load portfolio.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground">
        Last updated: {lastUpdated}
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card title="Account Value" value={data.accountValue} />
        <Card title="Cash Balance" value={data.cashBalance} />
        <Card title="Holdings Value" value={data.holdingsValue} />

        <div className="rounded-2xl border p-6">
          <h2 className="font-semibold">Unrealized P&L</h2>
          <p
            className={`mt-2 text-3xl font-bold ${
              data.totalUnrealizedPnL >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            ${format(data.totalUnrealizedPnL)}
          </p>
          <p
            className={`mt-1 text-sm ${
              data.totalUnrealizedPnL >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {data.totalUnrealizedPnLPercent.toFixed(2)}%
          </p>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border p-6">
          <h2 className="font-semibold">Positions</h2>
          <p className="mt-2 text-3xl font-bold">{data.positionCount}</p>
        </div>

        <div className="rounded-2xl border p-6">
          <h2 className="font-semibold">Best Performer</h2>
          <p className="mt-2 text-2xl font-bold">
            {data.bestPerformer?.symbol ?? "-"}
          </p>
          <p className="text-sm text-green-600">
            {data.bestPerformer
              ? `${data.bestPerformer.unrealizedPnLPercent.toFixed(2)}%`
              : "No data"}
          </p>
        </div>

        <div className="rounded-2xl border p-6">
          <h2 className="font-semibold">Worst Performer</h2>
          <p className="mt-2 text-2xl font-bold">
            {data.worstPerformer?.symbol ?? "-"}
          </p>
          <p className="text-sm text-red-600">
            {data.worstPerformer
              ? `${data.worstPerformer.unrealizedPnLPercent.toFixed(2)}%`
              : "No data"}
          </p>
        </div>

        <div className="rounded-2xl border p-6">
          <h2 className="font-semibold">Largest Allocation</h2>
          <p className="mt-2 text-2xl font-bold">
            {data.allocation.length > 0
              ? data.allocation.reduce((max, current) =>
                  current.allocationPercent > max.allocationPercent
                    ? current
                    : max
                ).symbol
              : "-"}
          </p>
          <p className="text-sm text-muted-foreground">
            {data.allocation.length > 0
              ? `${data.allocation
                  .reduce((max, current) =>
                    current.allocationPercent > max.allocationPercent
                      ? current
                      : max
                  )
                  .allocationPercent.toFixed(2)}%`
              : "No data"}
          </p>
        </div>
      </div>

      <PortfolioValueChart data={data.chartData} />

      <div className="rounded-2xl border p-6">
        <h2 className="mb-4 text-xl font-semibold">Holdings</h2>

        {data.positions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No holdings yet.</p>
        ) : (
          <div className="space-y-4">
            {data.positions.map((p) => (
              <div
                key={p.id}
                className="grid gap-4 rounded-xl border p-4 md:grid-cols-8"
              >
                <Metric label="Symbol" value={p.symbol} subValue={p.description} />
                <Metric label="Qty" value={p.quantity} />
                <Metric label="Avg" value={`$${format(p.averageCost)}`} />
                <Metric label="Price" value={`$${format(p.currentPrice)}`} />
                <Metric label="Value" value={`$${format(p.marketValue)}`} />
                <Metric label="Cost" value={`$${format(p.costBasis)}`} />
                <Metric label="Allocation"
                    value={`${data.allocation.find((a) => a.symbol === p.symbol)
                    ?.allocationPercent.toFixed(2) ?? "0.00"}%`}/>

                <div>
                  <p className="text-sm text-muted-foreground">P&L</p>
                  <p
                    className={
                      p.unrealizedPnL >= 0 ? "text-green-600" : "text-red-600"
                    }
                  >
                    ${format(p.unrealizedPnL)} (
                    {p.unrealizedPnLPercent.toFixed(2)}%)
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Card({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-2xl border p-6">
      <h2 className="font-semibold">{title}</h2>
      <p className="mt-2 text-3xl font-bold">${format(value)}</p>
    </div>
  );
}

function Metric({
  label,
  value,
  subValue,
}: {
  label: string;
  value: string | number;
  subValue?: string;
}) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
      {subValue ? (
        <p className="text-xs text-muted-foreground">{subValue}</p>
      ) : null}
    </div>
  );
}

type Performer = {
  symbol: string;
  unrealizedPnLPercent: number;
  unrealizedPnL: number;
};

type Allocation = {
  symbol: string;
  allocationPercent: number;
};