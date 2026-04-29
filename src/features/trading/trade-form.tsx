"use client";

import { useState, useTransition } from "react";
import { placeMarketOrder } from "@/features/trading/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type TradeFormProps = {
  assetId: string;
  symbol: string;
};

export function TradeForm({ assetId, symbol }: TradeFormProps) {
  const [quantity, setQuantity] = useState("1");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function submitOrder(side: "buy" | "sell") {
    setMessage("");

    startTransition(async () => {
      try {
        await placeMarketOrder({
          assetId,
          symbol,
          side,
          quantity: Number(quantity),
        });

        setMessage(`${side.toUpperCase()} order filled for ${quantity} ${symbol}`);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Order failed");
      }
    });
  }

  return (
    <div className="rounded-xl border p-4 space-y-3">
      <div className="space-y-2">
        <label className="text-sm font-medium">Quantity</label>
        <Input
          type="number"
          min="1"
          step="1"
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button disabled={isPending} onClick={() => submitOrder("buy")}>
          Buy
        </Button>
        <Button
          disabled={isPending}
          variant="outline"
          onClick={() => submitOrder("sell")}
        >
          Sell
        </Button>
      </div>

      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
    </div>
  );
}