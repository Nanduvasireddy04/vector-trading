"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type EquityPoint = {
  date: string;
  value: number;
};

export function EquityCurveChart({ data }: { data: EquityPoint[] }) {
  if (data.length === 0) {
    return (
      <div className="rounded-2xl border p-6">
        <h2 className="text-lg font-semibold">Equity Curve</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          No portfolio daily values yet.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border p-6">
      <h2 className="mb-4 text-lg font-semibold">Equity Curve</h2>

      <div className="h-[320px] w-full">
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