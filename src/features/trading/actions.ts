"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type PlaceMarketOrderInput = {
  assetId: string;
  symbol: string;
  side: "buy" | "sell";
  quantity: number;
};

async function getQuote(symbol: string) {
  const apiKey = process.env.FINNHUB_API_KEY;

  if (!apiKey) {
    throw new Error("Missing FINNHUB_API_KEY");
  }

  const url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(
    symbol
  )}&token=${apiKey}`;

  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    throw new Error("Failed to fetch quote");
  }

  const data = await response.json();

  if (!data.c || data.c <= 0) {
    throw new Error("Invalid market price");
  }

  return Number(data.c);
}

export async function placeMarketOrder(input: PlaceMarketOrderInput) {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    throw new Error("Unauthorized");
  }

  const userId = userData.user.id;
  const quantity = Number(input.quantity);

  if (!quantity || quantity <= 0) {
    throw new Error("Quantity must be greater than zero");
  }

  const price = await getQuote(input.symbol);
  const orderValue = price * quantity;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("cash_balance,total_value")
    .eq("id", userId)
    .maybeSingle();

  if (profileError || !profile) {
    throw new Error("Profile not found");
  }

  const { data: existingPosition } = await supabase
    .from("positions")
    .select("*")
    .eq("user_id", userId)
    .eq("asset_id", input.assetId)
    .maybeSingle();

  if (input.side === "buy") {
    if (Number(profile.cash_balance) < orderValue) {
      throw new Error("Insufficient cash balance");
    }

    const currentQuantity = Number(existingPosition?.quantity ?? 0);
    const currentAverageCost = Number(existingPosition?.average_cost ?? 0);

    const newQuantity = currentQuantity + quantity;
    const newAverageCost =
      (currentQuantity * currentAverageCost + quantity * price) / newQuantity;

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        asset_id: input.assetId,
        side: "buy",
        order_type: "market",
        quantity,
        estimated_price: price,
        status: "filled",
      })
      .select()
      .single();

    if (orderError) {
      throw new Error(orderError.message);
    }

    const { error: positionError } = await supabase.from("positions").upsert(
      {
        user_id: userId,
        asset_id: input.assetId,
        quantity: newQuantity,
        average_cost: newAverageCost,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,asset_id" }
    );

    if (positionError) {
      throw new Error(positionError.message);
    }

    const { error: profileUpdateError } = await supabase
      .from("profiles")
      .update({
        cash_balance: Number(profile.cash_balance) - orderValue,
      })
      .eq("id", userId);

    if (profileUpdateError) {
      throw new Error(profileUpdateError.message);
    }

    await supabase.from("cash_ledger").insert({
      user_id: userId,
      order_id: order.id,
      amount: -orderValue,
      transaction_type: "buy_order",
    });
  }

  if (input.side === "sell") {
    const currentQuantity = Number(existingPosition?.quantity ?? 0);

    if (currentQuantity < quantity) {
      throw new Error("Insufficient shares to sell");
    }

    const newQuantity = currentQuantity - quantity;

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        asset_id: input.assetId,
        side: "sell",
        order_type: "market",
        quantity,
        estimated_price: price,
        status: "filled",
      })
      .select()
      .single();

    if (orderError) {
      throw new Error(orderError.message);
    }

    if (newQuantity === 0) {
      await supabase
        .from("positions")
        .update({
          quantity: 0,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId)
        .eq("asset_id", input.assetId);
    } else {
      await supabase
        .from("positions")
        .update({
          quantity: newQuantity,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId)
        .eq("asset_id", input.assetId);
    }

    const { error: profileUpdateError } = await supabase
      .from("profiles")
      .update({
        cash_balance: Number(profile.cash_balance) + orderValue,
      })
      .eq("id", userId);

    if (profileUpdateError) {
      throw new Error(profileUpdateError.message);
    }

    await supabase.from("cash_ledger").insert({
      user_id: userId,
      order_id: order.id,
      amount: orderValue,
      transaction_type: "sell_order",
    });
  }

  revalidatePath("/watchlist");
  revalidatePath("/portfolio");
  revalidatePath("/dashboard");
}