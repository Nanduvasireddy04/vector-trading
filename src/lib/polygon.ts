// src/lib/polygon.ts

const API_KEY = process.env.POLYGON_API_KEY;

export async function getPolygonCandles(symbol: string) {
  const to = new Date().toISOString().split("T")[0];

  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - 30);
  const from = fromDate.toISOString().split("T")[0];

  const res = await fetch(
    `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/${from}/${to}?adjusted=true&sort=asc&apiKey=${API_KEY}`,
    { cache: "no-store" }
  );

  const data = await res.json();

  return data;
}