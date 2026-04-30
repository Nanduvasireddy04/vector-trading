"use server";

import { createClient } from "@/lib/supabase/server";

export async function createPortfolioSnapshot({
  accountValue,
  cashBalance,
  holdingsValue,
}: {
  accountValue: number;
  cashBalance: number;
  holdingsValue: number;
}) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("You must be logged in to save a portfolio snapshot.");
  }

  const { error } = await supabase.from("portfolio_snapshots").insert({
    user_id: user.id,
    account_value: accountValue,
    cash_balance: cashBalance,
    holdings_value: holdingsValue,
  });

  if (error) {
    throw new Error(error.message);
  }
}