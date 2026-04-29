import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default async function OrdersPage() {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    redirect("/login");
  }

  const { data: orders } = await supabase
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
    `
    )
    .eq("user_id", userData.user.id)
    .order("created_at", { ascending: false });

  return (
    <DashboardShell userEmail={userData.user.email ?? "User"}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">
            Review your simulated trading activity.
          </p>
        </div>

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
              No orders yet. Place your first buy or sell order from the watchlist.
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
                  <span className="capitalize">{order.side}</span>
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
      </div>
    </DashboardShell>
  );
}