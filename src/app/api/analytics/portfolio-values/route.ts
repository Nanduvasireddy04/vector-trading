import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = userData.user.id;

  const { data: snapshots, error } = await supabase
    .from("portfolio_snapshots")
    .select("account_value, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const grouped = new Map<string, { date: string; values: number[] }>();

  for (const row of snapshots ?? []) {
    const date = new Date(row.created_at).toISOString().slice(0, 10);

    if (!grouped.has(date)) {
      grouped.set(date, {
        date,
        values: [],
      });
    }

    grouped.get(date)?.values.push(Number(row.account_value));
  }

  const dailyRows = Array.from(grouped.values()).map((group) => {
    const closeValue = group.values[group.values.length - 1];

    return {
      user_id: userId,
      value_date: group.date,
      account_value: closeValue,
    };
  });

  if (dailyRows.length === 0) {
    return NextResponse.json({
      inserted: 0,
      message: "No snapshot data found.",
    });
  }

  const { error: upsertError } = await supabase
    .from("portfolio_daily_values")
    .upsert(dailyRows, {
      onConflict: "user_id,value_date",
    });

  if (upsertError) {
    return NextResponse.json(
      { error: upsertError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    inserted: dailyRows.length,
    rows: dailyRows,
  });
}