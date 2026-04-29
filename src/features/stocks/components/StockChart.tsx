"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type PolygonData = {
  results?: {
    t: number; // timestamp in milliseconds
    c: number; // close price
  }[];
};

type StockChartProps = {
  candles: PolygonData;
};

export function StockChart({ candles }: StockChartProps) {
  if (!candles?.results || candles.results.length === 0) {
    return (
      <div className="flex h-[350px] items-center justify-center rounded-xl border">
        <p className="text-muted-foreground">No chart data available</p>
      </div>
    );
  }

  const data = candles.results.map((item) => ({
    date: new Date(item.t).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    price: item.c,
  }));

  return (
    <div className="h-[350px] min-h-[350px] w-full min-w-0 rounded-xl border p-4">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis domain={["auto", "auto"]} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="price"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}