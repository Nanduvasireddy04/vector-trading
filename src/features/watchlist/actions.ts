"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type AddWatchlistInput = {
  symbol: string;
  displaySymbol?: string;
  description?: string;
  type?: string;
};

export async function addToWatchlist(input: AddWatchlistInput) {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    throw new Error("Unauthorized");
  }

  const symbol = input.symbol.toUpperCase();

  const { data: asset, error: assetError } = await supabase
    .from("assets")
    .upsert(
      {
        symbol,
        display_symbol: input.displaySymbol ?? symbol,
        description: input.description ?? "",
        type: input.type ?? "",
      },
      { onConflict: "symbol" }
    )
    .select()
    .single();

  if (assetError) {
    throw new Error(assetError.message);
  }

  const { error: watchlistError } = await supabase
    .from("watchlist_items")
    .insert({
      user_id: userData.user.id,
      asset_id: asset.id,
    });

  if (watchlistError && !watchlistError.message.includes("duplicate")) {
    throw new Error(watchlistError.message);
  }

  revalidatePath("/watchlist");
}

export async function removeFromWatchlist(itemId: string) {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("watchlist_items")
    .delete()
    .eq("id", itemId)
    .eq("user_id", userData.user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/watchlist");
}