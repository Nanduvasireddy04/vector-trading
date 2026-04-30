import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);

  const symbol = searchParams.get("symbol")?.toUpperCase() ?? "AAPL";
  const initialCash = Number(searchParams.get("cash") ?? 10000);

  const { data: rows, error } = await supabase
    .from("daily_returns")
    .select("symbol, price_date, open_price, close_price")
    .eq("symbol", symbol)
    .order("price_date", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!rows || rows.length === 0) {
    return NextResponse.json({
      error: `No daily return data found for ${symbol}. Run the daily returns transform first.`,
    });
  }

  const first = rows[0];
  const last = rows[rows.length - 1];

  const entryPrice = Number(first.open_price);
  const exitPrice = Number(last.close_price);

  if (entryPrice <= 0) {
    return NextResponse.json({ error: "Invalid entry price." }, { status: 400 });
  }

  const quantity = initialCash / entryPrice;
  const finalValue = quantity * exitPrice;
  const totalReturn = ((finalValue - initialCash) / initialCash) * 100;

  const { data: run, error: runError } = await supabase
    .from("strategy_runs")
    .insert({
      user_id: userData.user.id,
      strategy_name: "Buy and Hold",
      symbol,
      start_date: first.price_date,
      end_date: last.price_date,
      initial_cash: initialCash,
      final_value: finalValue,
      total_return: totalReturn,
    })
    .select("id")
    .single();

  if (runError) {
    return NextResponse.json({ error: runError.message }, { status: 500 });
  }

  const trades = [
    {
      strategy_run_id: run.id,
      trade_date: first.price_date,
      symbol,
      side: "buy",
      price: entryPrice,
      quantity,
    },
    {
      strategy_run_id: run.id,
      trade_date: last.price_date,
      symbol,
      side: "sell",
      price: exitPrice,
      quantity,
    },
  ];

  const { error: tradeError } = await supabase
    .from("strategy_trades")
    .insert(trades);

  if (tradeError) {
    return NextResponse.json({ error: tradeError.message }, { status: 500 });
  }

  return NextResponse.json({
    strategyRunId: run.id,
    strategy: "Buy and Hold",
    symbol,
    startDate: first.price_date,
    endDate: last.price_date,
    initialCash,
    entryPrice,
    exitPrice,
    quantity,
    finalValue,
    totalReturn,
  });
}