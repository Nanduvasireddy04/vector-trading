import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/layout/dashboard-shell";

const PAGE_SIZE = 10;

type OrdersPageProps = {
  searchParams?: Promise<{
    side?: string;
    symbol?: string;
    page?: string;
  }>;
};

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const params = await searchParams;

  const sideFilter = params?.side ?? "all";
  const symbolFilter = params?.symbol?.trim().toUpperCase() ?? "";
  const currentPage = Number(params?.page ?? 1);
  const safePage = Number.isNaN(currentPage) || currentPage < 1 ? 1 : currentPage;

  const from = (safePage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    redirect("/login");
  }

  let query = supabase
    .from("orders")
    .select(
      `
      id,
      side,
      order_type,
      quantity,
      estimated_price,
      status,
      created_at,
      assets (
        symbol,
        display_symbol,
        description
      )
    `,
      { count: "exact" }
    )
    .eq("user_id", userData.user.id)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (sideFilter !== "all") {
    query = query.eq("side", sideFilter);
  }

  if (symbolFilter) {
    query = query.eq("assets.symbol", symbolFilter);
  }

  const { data: orders, count } = await query;

  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));

  function buildPageUrl(page: number) {
    const query = new URLSearchParams();

    if (sideFilter !== "all") query.set("side", sideFilter);
    if (symbolFilter) query.set("symbol", symbolFilter);
    query.set("page", String(page));

    return `/orders?${query.toString()}`;
  }

  return (
    <DashboardShell userEmail={userData.user.email ?? "User"}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">
            Review, filter, and paginate your simulated trading activity.
          </p>
        </div>

        <form className="grid gap-4 rounded-2xl border p-4 md:grid-cols-4">
          <div>
            <label className="text-sm font-medium">Side</label>
            <select
              name="side"
              defaultValue={sideFilter}
              className="mt-2 w-full rounded-md border bg-background px-3 py-2"
            >
              <option value="all">All</option>
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Symbol</label>
            <input
              name="symbol"
              defaultValue={symbolFilter}
              placeholder="AAPL"
              className="mt-2 w-full rounded-md border bg-background px-3 py-2"
            />
          </div>

          <input type="hidden" name="page" value="1" />

          <div className="flex items-end gap-2">
            <button
              type="submit"
              className="rounded-md border px-4 py-2 font-medium"
            >
              Apply Filters
            </button>

            <Link
              href="/orders"
              className="rounded-md border px-4 py-2 font-medium"
            >
              Reset
            </Link>
          </div>
        </form>

        <div className="rounded-2xl border overflow-hidden">
          <div className="grid grid-cols-6 border-b px-4 py-3 text-sm font-medium text-muted-foreground">
            <span>Symbol</span>
            <span>Side</span>
            <span>Quantity</span>
            <span>Price</span>
            <span>Status</span>
            <span>Date</span>
          </div>

          {(orders ?? []).length === 0 ? (
            <div className="p-6 text-muted-foreground">
              No orders found for the selected filters.
            </div>
          ) : (
            orders?.map((order) => {
              const asset = Array.isArray(order.assets)
                ? order.assets[0]
                : order.assets;

              return (
                <div
                  key={order.id}
                  className="grid grid-cols-6 border-b px-4 py-4 text-sm last:border-b-0"
                >
                  <span className="font-semibold">
                    {asset?.display_symbol ?? asset?.symbol}
                  </span>

                  <span
                    className={
                      order.side === "buy"
                        ? "font-medium text-green-600 capitalize"
                        : "font-medium text-red-600 capitalize"
                    }
                  >
                    {order.side}
                  </span>

                  <span>{Number(order.quantity).toLocaleString()}</span>
                  <span>${Number(order.estimated_price).toFixed(2)}</span>
                  <span className="capitalize">{order.status}</span>
                  <span className="text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString()}
                  </span>
                </div>
              );
            })
          )}
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {safePage} of {totalPages} · {count ?? 0} orders
          </p>

          <div className="flex gap-2">
            {safePage > 1 ? (
              <Link
                href={buildPageUrl(safePage - 1)}
                className="rounded-md border px-4 py-2 text-sm font-medium"
              >
                Previous
              </Link>
            ) : (
              <button
                disabled
                className="rounded-md border px-4 py-2 text-sm font-medium opacity-50"
              >
                Previous
              </button>
            )}

            {safePage < totalPages ? (
              <Link
                href={buildPageUrl(safePage + 1)}
                className="rounded-md border px-4 py-2 text-sm font-medium"
              >
                Next
              </Link>
            ) : (
              <button
                disabled
                className="rounded-md border px-4 py-2 text-sm font-medium opacity-50"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

// import { redirect } from "next/navigation";
// import { createClient } from "@/lib/supabase/server";
// import { DashboardShell } from "@/components/layout/dashboard-shell";

// export default async function OrdersPage() {
//   const supabase = await createClient();

//   const { data: userData } = await supabase.auth.getUser();

//   if (!userData.user) {
//     redirect("/login");
//   }

//   const { data: orders } = await supabase
//     .from("orders")
//     .select(
//       `
//       id,
//       side,
//       order_type,
//       quantity,
//       estimated_price,
//       status,
//       created_at,
//       assets (
//         symbol,
//         display_symbol,
//         description
//       )
//     `
//     )
//     .eq("user_id", userData.user.id)
//     .order("created_at", { ascending: false });

//   return (
//     <DashboardShell userEmail={userData.user.email ?? "User"}>
//       <div className="space-y-6">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
//           <p className="text-muted-foreground">
//             Review your simulated trading activity.
//           </p>
//         </div>

//         <div className="rounded-2xl border overflow-hidden">
//           <div className="grid grid-cols-6 border-b px-4 py-3 text-sm font-medium text-muted-foreground">
//             <span>Symbol</span>
//             <span>Side</span>
//             <span>Quantity</span>
//             <span>Price</span>
//             <span>Status</span>
//             <span>Date</span>
//           </div>

//           {(orders ?? []).length === 0 ? (
//             <div className="p-6 text-muted-foreground">
//               No orders yet. Place your first buy or sell order from the watchlist.
//             </div>
//           ) : (
//             orders?.map((order) => {
//               const asset = Array.isArray(order.assets)
//                 ? order.assets[0]
//                 : order.assets;

//               return (
//                 <div
//                   key={order.id}
//                   className="grid grid-cols-6 border-b px-4 py-4 text-sm last:border-b-0"
//                 >
//                   <span className="font-semibold">
//                     {asset?.display_symbol ?? asset?.symbol}
//                   </span>
//                   <span className="capitalize">{order.side}</span>
//                   <span>{Number(order.quantity).toLocaleString()}</span>
//                   <span>${Number(order.estimated_price).toFixed(2)}</span>
//                   <span className="capitalize">{order.status}</span>
//                   <span className="text-muted-foreground">
//                     {new Date(order.created_at).toLocaleDateString()}
//                   </span>
//                 </div>
//               );
//             })
//           )}
//         </div>
//       </div>
//     </DashboardShell>
//   );
// }