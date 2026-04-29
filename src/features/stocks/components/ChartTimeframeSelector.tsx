"use client";

const timeframes = ["1W", "1M", "3M"];

export function ChartTimeframeSelector() {
  return (
    <div className="flex gap-2">
      {timeframes.map((timeframe) => (
        <button
          key={timeframe}
          className="rounded-full border px-3 py-1 text-sm hover:bg-muted"
        >
          {timeframe}
        </button>
      ))}
    </div>
  );
}