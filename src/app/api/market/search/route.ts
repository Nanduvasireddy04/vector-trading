import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ result: [] });
  }

  const apiKey = process.env.FINNHUB_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing FINNHUB_API_KEY" },
      { status: 500 }
    );
  }

  const url = `https://finnhub.io/api/v1/search?q=${encodeURIComponent(
    query
  )}&token=${apiKey}`;

  const response = await fetch(url, {
    cache: "no-store",
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "Failed to fetch symbols" },
      { status: response.status }
    );
  }

  const data = await response.json();

  return NextResponse.json(data);
}