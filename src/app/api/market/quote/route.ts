import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol");

  if (!symbol) {
    return NextResponse.json({ error: "Missing symbol" }, { status: 400 });
  }

  const apiKey = process.env.FINNHUB_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing FINNHUB_API_KEY" },
      { status: 500 }
    );
  }

  const url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(
    symbol
  )}&token=${apiKey}`;

  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    return NextResponse.json(
      { error: "Failed to fetch quote" },
      { status: response.status }
    );
  }

  const data = await response.json();

  return NextResponse.json({
    symbol,
    currentPrice: data.c,
    change: data.d,
    percentChange: data.dp,
    high: data.h,
    low: data.l,
    open: data.o,
    previousClose: data.pc,
  });
}