// src/lib/finnhub.ts

const API_KEY = process.env.FINNHUB_API_KEY;

export async function getQuote(symbol: string) {
  const res = await fetch(
    `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`,
    { cache: "no-store" }
  );

  return res.json();
}

export async function getCompanyProfile(symbol: string) {
  const res = await fetch(
    `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${API_KEY}`,
    { cache: "no-store" }
  );

  return res.json();
}

export async function getCandles(symbol: string) {
  const API_KEY = process.env.FINNHUB_API_KEY;

  const to = Math.floor(Date.now() / 1000);
  const from = to - 60 * 60 * 24 * 30; // last 30 days

  const res = await fetch(
    `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=D&from=${from}&to=${to}&token=${API_KEY}`,
    { cache: "no-store" }
  );

  return res.json();
}