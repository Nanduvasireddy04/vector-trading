type Order = {
  id: string;
  side: string;
  quantity: number;
  estimated_price: number;
  created_at: string;
};

type Props = {
  orders: Order[];
};

export function RecentStockOrders({ orders }: Props) {
  return (
    <div className="rounded-xl border p-4 space-y-3">
      <h2 className="text-lg font-semibold">Recent Orders</h2>

      {orders.length === 0 ? (
        <p className="text-muted-foreground">No recent orders for this stock.</p>
      ) : (
        <div className="space-y-2">
          {orders.map((order) => (
            <div key={order.id} className="flex justify-between border-b pb-2">
              <div>
                <p className="font-medium">{order.side.toUpperCase()}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>

              <div className="text-right">
                <p>{order.quantity} shares</p>
                <p className="text-sm text-muted-foreground">
                  ${Number(order.estimated_price).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// // recentstockorders.tsx
// type Order = {
//   id: string;
//   side: string;
//   quantity: number;
//   price: number;
//   created_at: string;
// };

// type Props = {
//   orders: Order[];
// };

// export function RecentStockOrders({ orders }: Props) {
//   return (
//     <div className="rounded-xl border p-4 space-y-3">
//       <h2 className="text-lg font-semibold">Recent Orders</h2>

//       {orders.length === 0 ? (
//         <p className="text-muted-foreground">No recent orders for this stock.</p>
//       ) : (
//         <div className="space-y-2">
//           {orders.map((order) => (
//             <div key={order.id} className="flex justify-between border-b pb-2">
//               <div>
//                 <p className="font-medium">{order.side.toUpperCase()}</p>
//                 <p className="text-sm text-muted-foreground">
//                   {new Date(order.created_at).toLocaleDateString()}
//                 </p>
//               </div>

//               <div className="text-right">
//                 <p>{order.quantity} shares</p>
//                 <p className="text-sm text-muted-foreground">
//                   ${order.price.toFixed(2)}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }