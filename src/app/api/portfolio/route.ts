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

export async function GET() {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("cash_balance")
    .eq("id", userData.user.id)
    .maybeSingle();

  const { data: positions } = await supabase
    .from("positions")
    .select(
      `
      id,
      quantity,
      average_cost,
      assets (
        symbol,
        display_symbol,
        description
      )
    `
    )
    .eq("user_id", userData.user.id)
    .gt("quantity", 0);

  const portfolioPositions = await Promise.all(
    (positions ?? []).map(async (position) => {
      const asset = Array.isArray(position.assets)
        ? position.assets[0]
        : position.assets;

      const symbol = asset?.symbol ?? "";
      const currentPrice = symbol ? await getLivePrice(symbol) : 0;

      const quantity = Number(position.quantity);
      const averageCost = Number(position.average_cost);

      const marketValue = quantity * currentPrice;
      const costBasis = quantity * averageCost;
      const unrealizedPnL = marketValue - costBasis;
      const unrealizedPnLPercent =
        costBasis > 0 ? (unrealizedPnL / costBasis) * 100 : 0;

      return {
        id: position.id,
        symbol,
        description: asset?.description ?? "",
        quantity,
        averageCost,
        currentPrice,
        marketValue,
        costBasis,
        unrealizedPnL,
        unrealizedPnLPercent,
      };
    })
  );

  const cashBalance = Number(profile?.cash_balance ?? 0);

  const holdingsValue = portfolioPositions.reduce(
    (sum, p) => sum + p.marketValue,
    0
  );

  const totalCostBasis = portfolioPositions.reduce(
    (sum, p) => sum + p.costBasis,
    0
  );

  const accountValue = cashBalance + holdingsValue;
  const totalUnrealizedPnL = holdingsValue - totalCostBasis;

  const totalUnrealizedPnLPercent =
    totalCostBasis > 0 ? (totalUnrealizedPnL / totalCostBasis) * 100 : 0;

  const positionCount = portfolioPositions.length;

  const bestPerformer =
    portfolioPositions.length > 0
      ? portfolioPositions.reduce((best, current) =>
          current.unrealizedPnLPercent > best.unrealizedPnLPercent
            ? current
            : best
        )
      : null;

  const worstPerformer =
    portfolioPositions.length > 0
      ? portfolioPositions.reduce((worst, current) =>
          current.unrealizedPnLPercent < worst.unrealizedPnLPercent
            ? current
            : worst
        )
      : null;

  const allocation = portfolioPositions.map((position) => ({
    symbol: position.symbol,
    allocationPercent:
      holdingsValue > 0 ? (position.marketValue / holdingsValue) * 100 : 0,
  }));

  const { data: snapshots } = await supabase
    .from("portfolio_snapshots")
    .select("account_value, created_at")
    .eq("user_id", userData.user.id)
    .order("created_at", { ascending: true });

  const chartData =
    snapshots?.map((s) => ({
      date: new Date(s.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      value: Number(s.account_value),
    })) ?? [];

  return NextResponse.json({
  accountValue,
  cashBalance,
  holdingsValue,
  totalCostBasis,
  totalUnrealizedPnL,
  totalUnrealizedPnLPercent,
  positionCount,
  bestPerformer,
  worstPerformer,
  allocation,
  positions: portfolioPositions,
  chartData,
});
}