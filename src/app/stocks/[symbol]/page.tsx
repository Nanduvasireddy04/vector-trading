// src/app/stocks/[symbol]/page.tsx

import { getQuote, getCompanyProfile } from "@/lib/finnhub";
import { getPolygonCandles } from "@/lib/polygon";
import { StockChart } from "@/features/stocks/components/StockChart";
import { TradePanel } from "@/features/stocks/components/TradePanel";
import { PositionSummary } from "@/features/stocks/components/PositionSummary";
import { createClient } from "@/lib/supabase/server";
import { RecentStockOrders } from "@/features/stocks/components/RecentStockOrders";

type Props = {
  params: Promise<{ symbol: string }>;
};

export default async function StockPage({ params }: Props) {
  const { symbol: rawSymbol } = await params;
  const symbol = rawSymbol.toUpperCase();

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [quote, company, candles] = await Promise.all([
    getQuote(symbol),
    getCompanyProfile(symbol),
    getPolygonCandles(symbol),
  ]);

  let { data: asset } = await supabase
  .from("assets")
  .select("id, symbol")
  .ilike("symbol", symbol)
  .maybeSingle();

if (!asset) {
  const { data: newAsset, error } = await supabase
    .from("assets")
    .insert({
      symbol,
    })
    .select("id, symbol")
    .single();

  if (error) {
    return <main className="p-6">Could not create asset: {error.message}</main>;
  }

  asset = newAsset;
}

  const { data: position } = await supabase
    .from("positions")
    .select("quantity, average_cost")
    .eq("user_id", user?.id)
    .eq("asset_id", asset.id)
    .maybeSingle();

  const { data: recentOrders } = await supabase
    .from("orders")
    .select("id, side, quantity, estimated_price, created_at")
    .eq("user_id", user?.id)
    .eq("asset_id", asset.id)
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <main className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{symbol}</h1>
        <p className="text-muted-foreground">
          {company.name  || "Company Name"}
        </p>
      </div>

      <div className="text-2xl font-semibold">
        ${quote.c?.toFixed(2) || "0.00"}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <StockChart candles={candles} />
        </div>

        <div className="space-y-6">
          <TradePanel assetId={asset.id} symbol={symbol} />

          <PositionSummary
            symbol={symbol}
            quantity={position?.quantity ?? 0}
            avgPrice={position?.average_cost ?? 0}
            currentPrice={quote.c}
          />

          <RecentStockOrders orders={recentOrders ?? []} />
        </div>
      </div>
    </main>
  );
}

// // src/app/stocks/[symbol]/page.tsx

// import { getQuote, getCompanyProfile } from "@/lib/finnhub";
// import { getPolygonCandles } from "@/lib/polygon";
// import { StockChart } from "@/features/stocks/components/StockChart";
// import { TradePanel } from "@/features/stocks/components/TradePanel";
// import { PositionSummary } from "@/features/stocks/components/PositionSummary";
// import { createClient } from "@/lib/supabase/server";
// import { RecentStockOrders } from "@/features/stocks/components/RecentStockOrders";

// type Props = {
//   params: Promise<{ symbol: string }>;
// };

// export default async function StockPage({ params }: Props) {
//   const { symbol: rawSymbol } = await params;
//   const symbol = rawSymbol.toUpperCase();

//   const supabase = await createClient();

// const {
//   data: { user },
// } = await supabase.auth.getUser();

// const { data: asset } = await supabase
//   .from("assets")
//   .select("id, symbol, name")
//   .eq("symbol", symbol)
//   .maybeSingle();

// const { data: position } = await supabase
//   .from("positions")
//   .select("quantity, average_price")
//   .eq("user_id", user?.id)
//   .eq("symbol", symbol)
//   .maybeSingle();

// const { data: recentOrders } = await supabase
//   .from("orders")
//   .select("id, side, quantity, price, created_at")
//   .eq("user_id", user?.id)
//   .eq("symbol", symbol)
//   .order("created_at", { ascending: false })
//   .limit(5);

//   const [quote, company, candles] = await Promise.all([
//     getQuote(symbol),
//     getCompanyProfile(symbol),
//     getPolygonCandles(symbol),
//   ]);

//   return (
//     <main className="p-6 space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold">{symbol}</h1>
//         <p className="text-muted-foreground">
//           {company.name || "Company Name"}
//         </p>
//       </div>

//       <div className="text-2xl font-semibold">
//         ${quote.c?.toFixed(2) || "0.00"}
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <div className="md:col-span-2">
//             <StockChart candles={candles} />
//         </div>

//         <TradePanel assetId={asset?.id ?? ""} symbol={symbol} />
//         <PositionSummary
//             symbol={symbol}
//             quantity={position?.quantity ?? 0}
//             avgPrice={position?.average_price ?? 0}
//             currentPrice={quote.c}
//         />
//         <RecentStockOrders orders={recentOrders ?? []} />
//         </div>
//     </main>
//   );
// }