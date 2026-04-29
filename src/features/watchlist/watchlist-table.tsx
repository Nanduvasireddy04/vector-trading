"use client";

import { useEffect, useState, useTransition } from "react";
import { removeFromWatchlist } from "@/features/watchlist/actions";
import { Button } from "@/components/ui/button";
import { TradeForm } from "@/features/trading/trade-form";

type WatchlistItem = {
  id: string;
  asset_id: string;
  created_at: string;
  assets:
    | {
        symbol: string;
        display_symbol: string | null;
        description: string | null;
        type: string | null;
      }
    | {
        symbol: string;
        display_symbol: string | null;
        description: string | null;
        type: string | null;
      }[]
    | null;
};

type Quote = {
  symbol: string;
  currentPrice: number;
  change: number;
  percentChange: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
};

type WatchlistTableProps = {
  items: WatchlistItem[];
};

export function WatchlistTable({ items }: WatchlistTableProps) {
  const [quotes, setQuotes] = useState<Record<string, Quote>>({});
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function fetchQuotes() {
      const nextQuotes: Record<string, Quote> = {};

      for (const item of items) {
        const asset = Array.isArray(item.assets) ? item.assets[0] : item.assets;
        const symbol = asset?.symbol;

        if (!symbol) continue;

        try {
          const response = await fetch(`/api/market/quote?symbol=${symbol}`);
          const data = await response.json();

          if (response.ok) {
            nextQuotes[symbol] = data;
          }
        } catch {
          // ignore individual quote failures
        }
      }

      setQuotes(nextQuotes);
    }

    if (items.length > 0) {
      fetchQuotes();
    }
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border p-6 text-muted-foreground">
        No watchlist items yet. Search for a stock to add your first one.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((item) => {
        const asset = Array.isArray(item.assets) ? item.assets[0] : item.assets;
        const symbol = asset?.symbol ?? "";
        const quote = quotes[symbol];
        const isPositive = Number(quote?.change ?? 0) >= 0;

        return (
          <div key={item.id} className="rounded-2xl border p-5 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xl font-bold">
                  {asset?.display_symbol ?? asset?.symbol}
                </p>
                <p className="text-sm text-muted-foreground">
                  {asset?.description}
                </p>
                <p className="text-xs text-muted-foreground">{asset?.type}</p>
              </div>

              <Button
                variant="outline"
                disabled={isPending}
                onClick={() => {
                  startTransition(async () => {
                    await removeFromWatchlist(item.id);
                  });
                }}
              >
                Remove
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Current Price</p>
                <p className="text-2xl font-bold">
                  {quote ? `$${quote.currentPrice.toFixed(2)}` : "Loading..."}
                </p>
                {asset?.symbol ? (
                <TradeForm assetId={item.asset_id} symbol={asset.symbol} />
                ) : null}
              </div>

              <div>
                <p className="text-muted-foreground">Daily Change</p>
                <p className={isPositive ? "font-semibold" : "font-semibold"}>
                  {quote
                    ? `${isPositive ? "+" : ""}${quote.change.toFixed(2)} (${quote.percentChange.toFixed(2)}%)`
                    : "Loading..."}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground">Open</p>
                <p>{quote ? `$${quote.open.toFixed(2)}` : "Loading..."}</p>
              </div>

              <div>
                <p className="text-muted-foreground">Previous Close</p>
                <p>{quote ? `$${quote.previousClose.toFixed(2)}` : "Loading..."}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}