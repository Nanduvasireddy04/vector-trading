import Link from "next/link";

const coreNav = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/watchlist", label: "Watchlist" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/orders", label: "Orders" },
];

const dataNav = [
  { href: "/market-data", label: "Market Data" },
  { href: "/analytics", label: "Analytics" },
];

const quantNav = [
  { href: "/backtests", label: "Backtests" },
  { href: "/ledger", label: "Ledger" },
];

export function AppSidebar() {
  return (
    <aside className="hidden w-64 border-r bg-background md:block">
      <nav className="flex flex-col gap-2 p-4">
        
        {/* CORE */}
        {coreNav.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
          >
            {item.label}
          </Link>
        ))}

        {/* DATA */}
        <div className="mt-4 text-xs font-semibold text-muted-foreground">
          DATA
        </div>

        {dataNav.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
          >
            {item.label}
          </Link>
        ))}

        {/* QUANT */}
        <div className="mt-4 text-xs font-semibold text-muted-foreground">
          QUANT
        </div>

        {quantNav.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
          >
            {item.label}
          </Link>
        ))}

      </nav>
    </aside>
  );
}

// import Link from "next/link";

// const navItems = [
//   { href: "/dashboard", label: "Dashboard" },
//   { href: "/watchlist", label: "Watchlist" },
//   { href: "/portfolio", label: "Portfolio" },
//   { href: "/orders", label: "Orders" },
//   { href: "#", label: "Alerts" },
  
// ];

// export function AppSidebar() {
//   return (
//     <aside className="hidden w-64 border-r bg-background md:block">
//       <nav className="flex flex-col gap-2 p-4">
//         {navItems.map((item) => (
//           <Link
//             key={item.label}
//             href={item.href}
//             className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
//           >
//             {item.label}
//           </Link>
//         ))}
//       </nav>
//     </aside>
//   );
// }