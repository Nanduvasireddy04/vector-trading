"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { placeMarketOrder } from "@/features/trading/actions";

type Props = {
  assetId: string;
  symbol: string;
};

export function TradePanel({ assetId, symbol }: Props) {
  const router = useRouter();

  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleTrade(side: "buy" | "sell") {
    setLoading(true);
    setMessage("");

    try {
      await placeMarketOrder({
        assetId,
        symbol,
        side,
        quantity,
      });

      setMessage(`${side.toUpperCase()} order placed for ${quantity} ${symbol}`);
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Order failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border p-4 space-y-4">
      <h2 className="text-lg font-semibold">Trade</h2>

      <div>
        <label className="text-sm">Quantity</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-full border rounded p-2 mt-1"
          min={1}
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => handleTrade("buy")}
          disabled={loading || quantity <= 0}
          className="flex-1 bg-green-600 text-white rounded p-2 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Buy"}
        </button>

        <button
          onClick={() => handleTrade("sell")}
          disabled={loading || quantity <= 0}
          className="flex-1 bg-red-600 text-white rounded p-2 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Sell"}
        </button>
      </div>

      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  );
}