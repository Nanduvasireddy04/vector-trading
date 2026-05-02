
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const tradingNav = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/watchlist", label: "Watchlist" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/orders", label: "Orders" },
  { href: "/ledger", label: "Ledger" },
];

const dataNav = [
  { href: "/analytics", label: "Analytics" },
  { href: "/data-pipeline", label: "Data Pipeline" },
];

const quantNav = [{ href: "/backtests", label: "Backtests" }];

export function AppSidebar() {
  const pathname = usePathname();

  const renderLinks = (items: { href: string; label: string }[]) =>
    items.map((item) => {
      const isActive = pathname === item.href;

      return (
        <Link
          key={item.label}
          href={item.href}
          className={clsx(
            "rounded-lg px-3 py-2 text-sm transition-all",
            "hover:bg-accent hover:text-foreground",
            isActive
              ? "bg-accent text-foreground font-semibold"
              : "text-muted-foreground"
          )}
        >
          {item.label}
        </Link>
      );
    });

  return (
    <aside className="hidden w-64 border-r bg-background md:flex flex-col">
      <div className="p-4 text-lg font-semibold">Vector</div>

      <nav className="flex flex-col gap-1 px-3">
        <div className="px-2 text-xs font-semibold text-muted-foreground">
          TRADING
        </div>
        {renderLinks(tradingNav)}

        <div className="mt-4 px-2 text-xs font-semibold text-muted-foreground">
          DATA
        </div>
        {renderLinks(dataNav)}

        <div className="mt-4 px-2 text-xs font-semibold text-muted-foreground">
          QUANT
        </div>
        {renderLinks(quantNav)}
      </nav>
    </aside>
  );
}

// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import clsx from "clsx";

// const coreNav = [
//   { href: "/dashboard", label: "Dashboard" },
//   { href: "/watchlist", label: "Watchlist" },
//   { href: "/portfolio", label: "Portfolio" },
//   { href: "/orders", label: "Orders" },
// ];

// const dataNav = [
//   { href: "/market-data", label: "Market Data" },
//   { href: "/analytics", label: "Analytics" },
// ];

// const quantNav = [
//   { href: "/backtests", label: "Backtests" },
//   { href: "/ledger", label: "Ledger" },
// ];

// export function AppSidebar() {
//   const pathname = usePathname();

//   const renderLinks = (items: { href: string; label: string }[]) =>
//     items.map((item) => {
//       const isActive = pathname === item.href;

//       return (
//         <Link
//           key={item.label}
//           href={item.href}
//           className={clsx(
//             "rounded-lg px-3 py-2 text-sm transition-all",
//             "hover:bg-accent hover:text-foreground",
//             isActive
//               ? "bg-accent text-foreground font-semibold"
//               : "text-muted-foreground"
//           )}
//         >
//           {item.label}
//         </Link>
//       );
//     });

//   return (
//     <aside className="hidden w-64 border-r bg-background md:flex flex-col">
//       <div className="p-4 text-lg font-semibold">
//         Vector
//       </div>

//       <nav className="flex flex-col gap-1 px-3">
//         {/* CORE */}
//         {renderLinks(coreNav)}

//         {/* DATA */}
//         <div className="mt-4 px-2 text-xs font-semibold text-muted-foreground">
//           DATA
//         </div>
//         {renderLinks(dataNav)}

//         {/* QUANT */}
//         <div className="mt-4 px-2 text-xs font-semibold text-muted-foreground">
//           QUANT
//         </div>
//         {renderLinks(quantNav)}
//       </nav>
//     </aside>
//   );
// }


// // import Link from "next/link";

// // const coreNav = [
// //   { href: "/dashboard", label: "Dashboard" },
// //   { href: "/watchlist", label: "Watchlist" },
// //   { href: "/portfolio", label: "Portfolio" },
// //   { href: "/orders", label: "Orders" },
// // ];

// // const dataNav = [
// //   { href: "/market-data", label: "Market Data" },
// //   { href: "/analytics", label: "Analytics" },
// // ];

// // const quantNav = [
// //   { href: "/backtests", label: "Backtests" },
// //   { href: "/ledger", label: "Ledger" },
// // ];

// // export function AppSidebar() {
// //   return (
// //     <aside className="hidden w-64 border-r bg-background md:block">
// //       <nav className="flex flex-col gap-2 p-4">
        
// //         {/* CORE */}
// //         {coreNav.map((item) => (
// //           <Link
// //             key={item.label}
// //             href={item.href}
// //             className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
// //           >
// //             {item.label}
// //           </Link>
// //         ))}

// //         {/* DATA */}
// //         <div className="mt-4 text-xs font-semibold text-muted-foreground">
// //           DATA
// //         </div>

// //         {dataNav.map((item) => (
// //           <Link
// //             key={item.label}
// //             href={item.href}
// //             className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
// //           >
// //             {item.label}
// //           </Link>
// //         ))}

// //         {/* QUANT */}
// //         <div className="mt-4 text-xs font-semibold text-muted-foreground">
// //           QUANT
// //         </div>

// //         {quantNav.map((item) => (
// //           <Link
// //             key={item.label}
// //             href={item.href}
// //             className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
// //           >
// //             {item.label}
// //           </Link>
// //         ))}

// //       </nav>
// //     </aside>
// //   );
// // }

