import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

async function getLivePrice(symbol: string) {
  const apiKey = process.env.FINNHUB_API_KEY;

  if (!apiKey) return 0;

  const response = await fetch(
    `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(
      symbol
    )}&token=${apiKey}`,
    { cache: "no-store" }
  );

  if (!response.ok) return 0;

  const data = await response.json();
  return Number(data.c ?? 0);
}

async function captureMarketPrices() {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: assets } = await supabase
    .from("assets")
    .select("symbol")
    .order("symbol", { ascending: true });

  const uniqueSymbols = Array.from(
    new Set((assets ?? []).map((asset) => asset.symbol).filter(Boolean))
  );

  const rows = await Promise.all(
    uniqueSymbols.map(async (symbol) => {
      const price = await getLivePrice(symbol);

      return {
        symbol,
        price,
        source: "finnhub",
      };
    })
  );

  const validRows = rows.filter((row) => row.price > 0);

  if (validRows.length === 0) {
    return NextResponse.json({
      inserted: 0,
      message: "No valid prices captured.",
    });
  }

  const { error } = await supabase.from("market_prices").insert(validRows);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    inserted: validRows.length,
    symbols: validRows.map((row) => row.symbol),
  });
}

export async function POST() {
  return captureMarketPrices();
}

export async function GET() {
  return captureMarketPrices();
}