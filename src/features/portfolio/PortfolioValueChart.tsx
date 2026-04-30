"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type PortfolioChartPoint = {
  date: string;
  value: number;
};

type PortfolioValueChartProps = {
  data: PortfolioChartPoint[];
};

export function PortfolioValueChart({ data }: PortfolioValueChartProps) {
  if (data.length === 0) {
    return (
      <div className="rounded-2xl border p-5">
        <h2 className="mb-2 text-lg font-semibold">Portfolio Value</h2>
        <p className="text-sm text-muted-foreground">
          No portfolio history yet. Buy or sell a stock to create your first
          snapshot.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border p-5">
      <h2 className="mb-4 text-lg font-semibold">Portfolio Value</h2>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="date" />
            <YAxis domain={["auto", "auto"]} />
            <Tooltip
              formatter={(value) => [
                `$${Number(value).toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}`,
                "Account Value",
              ]}
            />
            <Line
              type="monotone"
              dataKey="value"
              strokeWidth={2}
              dot
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}