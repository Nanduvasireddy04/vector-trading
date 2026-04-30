import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: prices, error: priceError } = await supabase
    .from("market_prices")
    .select("symbol, price, captured_at")
    .order("captured_at", { ascending: true });

  if (priceError) {
    return NextResponse.json({ error: priceError.message }, { status: 500 });
  }

  const grouped = new Map<string, { symbol: string; date: string; prices: number[] }>();

  for (const row of prices ?? []) {
    const date = new Date(row.captured_at).toISOString().slice(0, 10);
    const key = `${row.symbol}-${date}`;

    if (!grouped.has(key)) {
      grouped.set(key, {
        symbol: row.symbol,
        date,
        prices: [],
      });
    }

    grouped.get(key)?.prices.push(Number(row.price));
  }

  const dailyRows = Array.from(grouped.values())
    .filter((group) => group.prices.length >= 2)
    .map((group) => {
      const openPrice = group.prices[0];
      const closePrice = group.prices[group.prices.length - 1];

      return {
        symbol: group.symbol,
        price_date: group.date,
        open_price: openPrice,
        close_price: closePrice,
        daily_return:
          openPrice > 0 ? ((closePrice - openPrice) / openPrice) * 100 : 0,
      };
    });

  if (dailyRows.length === 0) {
    return NextResponse.json({
      inserted: 0,
      message:
        "Not enough market price data yet. Capture prices at least twice for the same symbol/date.",
    });
  }

  const { error: upsertError } = await supabase
    .from("daily_returns")
    .upsert(dailyRows, {
      onConflict: "symbol,price_date",
    });

  if (upsertError) {
    return NextResponse.json({ error: upsertError.message }, { status: 500 });
  }

  return NextResponse.json({
    inserted: dailyRows.length,
    rows: dailyRows,
  });
}