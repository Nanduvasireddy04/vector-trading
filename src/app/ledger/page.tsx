import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default async function LedgerPage() {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    redirect("/login");
  }

  const { data: entries } = await supabase
    .from("cash_ledger")
    .select(
      `
      id,
      amount,
      transaction_type,
      created_at,
      order_id,
      orders (
        id,
        side,
        assets (
          symbol
        )
      )
    `
    )
    .eq("user_id", userData.user.id)
    .order("created_at", { ascending: false });

  return (
    <DashboardShell userEmail={userData.user.email ?? "User"}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Cash Ledger</h1>
          <p className="text-muted-foreground">
            Track all cash movements and transaction history.
          </p>
        </div>

        <div className="rounded-2xl border overflow-hidden">
          <div className="grid grid-cols-5 border-b px-4 py-3 text-sm font-medium text-muted-foreground">
            <span>Type</span>
            <span>Symbol</span>
            <span>Amount</span>
            <span>Order</span>
            <span>Date</span>
          </div>

          {!entries || entries.length === 0 ? (
            <div className="p-6 text-muted-foreground">
              No transactions yet.
            </div>
          ) : (
            (entries ?? []).map((entry) => {
              const order: any = Array.isArray(entry.orders)
                ? entry.orders[0]
                : entry.orders;

                const asset: any = Array.isArray(order?.assets)
                ? order.assets[0]
                : order?.assets;

                const symbol = asset?.symbol;

              return (
                <div
                  key={entry.id}
                  className="grid grid-cols-5 border-b px-4 py-4 text-sm last:border-b-0"
                >
                  <span className="capitalize">
                    {entry.transaction_type.replace("_", " ")}
                  </span>

                  <span className="font-semibold">{symbol ?? "-"}</span>

                  <span
                    className={
                      Number(entry.amount) >= 0
                        ? "text-green-600 font-medium"
                        : "text-red-600 font-medium"
                    }
                  >
                    ${Number(entry.amount).toLocaleString()}
                  </span>

                  <span className="text-muted-foreground">
                    {entry.order_id?.slice(0, 8)}
                  </span>

                  <span className="text-muted-foreground">
                    {new Date(entry.created_at).toLocaleString()}
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