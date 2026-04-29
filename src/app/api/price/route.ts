import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol");

  if (!symbol) {
    return NextResponse.json({ error: "Missing symbol" }, { status: 400 });
  }

  const apiKey = process.env.FINNHUB_API_KEY;

  const res = await fetch(
    `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`,
    { cache: "no-store" }
  );

  const data = await res.json();

  return NextResponse.json({
    symbol,
    price: data.c,
  });
}