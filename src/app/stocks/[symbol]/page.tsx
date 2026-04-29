// src/app/stocks/[symbol]/page.tsx

import { getQuote, getCompanyProfile } from "@/lib/finnhub";
import { getPolygonCandles } from "@/lib/polygon";
import { StockChart } from "@/features/stocks/components/StockChart";
import { TradePanel } from "@/features/stocks/components/TradePanel";
import { PositionSummary } from "@/features/stocks/components/PositionSummary";
import { RecentStockOrders } from "@/features/stocks/components/RecentStockOrders";
import { createClient } from "@/lib/supabase/server";
import { LivePrice } from "@/features/stocks/components/LivePrice";

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

  // Fetch market data
  const [quote, company, candles] = await Promise.all([
    getQuote(symbol),
    getCompanyProfile(symbol),
    getPolygonCandles(symbol),
  ]);

  // 🔥 ONLY SELECT — NO INSERT
  const { data: asset } = await supabase
    .from("assets")
    .select("id, symbol")
    .ilike("symbol", symbol)
    .maybeSingle();

  // Safe defaults
  let position = null;
  let recentOrders: {
  id: string;
  side: string;
  quantity: number;
  estimated_price: number;
  created_at: string;
}[] = [];

  if (asset) {
    const { data: positionData } = await supabase
      .from("positions")
      .select("quantity, average_cost")
      .eq("user_id", user?.id)
      .eq("asset_id", asset.id)
      .maybeSingle();

    const { data: ordersData } = await supabase
      .from("orders")
      .select("id, side, quantity, estimated_price, created_at")
      .eq("user_id", user?.id)
      .eq("asset_id", asset.id)
      .order("created_at", { ascending: false })
      .limit(5);

    position = positionData;
    recentOrders = ordersData ?? [];
  }

  return (
    <main className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">{symbol}</h1>
        <p className="text-muted-foreground">
          {company.name || "Company Name"}
        </p>
      </div>

      {/* Live Price */}
      <LivePrice symbol={symbol} initialPrice={quote.c} />

      {/* Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="md:col-span-2">
          <StockChart candles={candles} />
        </div>

        {/* Right Panel */}
        <div className="space-y-6">
          {/* Trade Panel */}
          {asset ? (
            <TradePanel assetId={asset.id} symbol={symbol} />
          ) : (
            <div className="rounded-xl border p-4">
              <p className="text-muted-foreground">
                Add {symbol} to your watchlist before trading.
              </p>
            </div>
          )}

          {/* Position */}
          <PositionSummary
            symbol={symbol}
            quantity={position?.quantity ?? 0}
            avgPrice={position?.average_cost ?? 0}
            currentPrice={quote.c}
          />

          {/* Orders */}
          <RecentStockOrders orders={recentOrders} />
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