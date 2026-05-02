"use server";

import { createClient } from "@/lib/supabase/server";

export async function runPipeline() {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) return;

  const pipelines = [
    {
      pipeline_name: "Market Data Ingestion",
      source_name: "Finnhub API",
    },
    {
      pipeline_name: "Portfolio Analytics",
      source_name: "Orders + Positions",
    },
    {
      pipeline_name: "Ledger Sync",
      source_name: "Trading Ledger",
    },
  ];

  const random = pipelines[Math.floor(Math.random() * pipelines.length)];

  const records = Math.floor(Math.random() * 1500) + 100;
  const failed = Math.floor(Math.random() * 20);

  const status =
    failed > 10 ? "failed" : failed > 0 ? "success" : "success";

  await supabase.from("pipeline_runs").insert({
    user_id: userData.user.id,
    pipeline_name: random.pipeline_name,
    source_name: random.source_name,
    records_ingested: records,
    failed_records: failed,
    status,
    completed_at: new Date().toISOString(),
  });
}