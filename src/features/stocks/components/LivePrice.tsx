// "use client";

// import { useEffect, useState } from "react";

// type Props = {
//   symbol: string;
//   initialPrice: number;
// };

// export function LivePrice({ symbol, initialPrice }: Props) {
//   const [price, setPrice] = useState(initialPrice);
//   const [previousPrice, setPreviousPrice] = useState(initialPrice);

//   useEffect(() => {
//     const interval = setInterval(async () => {
//       const res = await fetch(`/api/price?symbol=${symbol}`);
//       const data = await res.json();

//       if (data?.price) {
//         setPreviousPrice(price);
//         setPrice(data.price);
//       }
//     }, 5000);

//     return () => clearInterval(interval);
//   }, [symbol, price]);

//   const isUp = price >= previousPrice;

//   return (
//     <div>
//       <div className={isUp ? "text-2xl font-semibold text-green-600" : "text-2xl font-semibold text-red-600"}>
//         ${price.toFixed(2)}
//       </div>
//       <p className="text-xs text-muted-foreground">Updates every 5 seconds</p>
//     </div>
//   );
// }

// "use client";

// import { useEffect, useState } from "react";

// type Props = {
//   symbol: string;
//   initialPrice: number;
// };

// export function LivePrice({ symbol, initialPrice }: Props) {
//   const [price, setPrice] = useState(initialPrice);
//   const [previousPrice, setPreviousPrice] = useState(initialPrice);

//   useEffect(() => {
//     const interval = setInterval(async () => {
//       const res = await fetch(`/api/price?symbol=${symbol}`);
//       const data = await res.json();

//       if (data?.price) {
//         setPreviousPrice(price);
//         setPrice(data.price);
//       }
//     }, 5000);

//     return () => clearInterval(interval);
//   }, [symbol, price]);

//   const change = price - previousPrice;
//   const percent = (change / previousPrice) * 100;

//   const isUp = change >= 0;

//   return (
//     <div className="space-y-1">
//       <div
//         className={`text-2xl font-semibold ${
//           isUp ? "text-green-600" : "text-red-600"
//         }`}
//       >
//         ${price.toFixed(2)}
//       </div>

//       <div
//         className={`text-sm ${
//           isUp ? "text-green-600" : "text-red-600"
//         }`}
//       >
//         {isUp ? "+" : ""}
//         {change.toFixed(2)} ({percent.toFixed(2)}%)
//       </div>

//       <p className="text-xs text-muted-foreground">
//         Updates every 5 seconds
//       </p>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";

type Props = {
  symbol: string;
  initialPrice: number;
};

export function LivePrice({ symbol, initialPrice }: Props) {
  const [price, setPrice] = useState(initialPrice);
  const [previousPrice, setPreviousPrice] = useState(initialPrice);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch(`/api/price?symbol=${symbol}`);
      const data = await res.json();

      if (data?.price) {
        setPreviousPrice((prev) => prev ?? data.price);
        setPrice(data.price);
        setLastUpdated(new Date());
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [symbol]); // 🔥 remove price dependency

  const change = price - previousPrice;
  const percent =
    previousPrice !== 0 ? (change / previousPrice) * 100 : 0;

  const isUp = change >= 0;

  return (
    <div className="space-y-1">
      <div
        className={`text-2xl font-semibold ${
          isUp ? "text-green-600" : "text-red-600"
        }`}
      >
        ${price.toFixed(2)}
      </div>

      <div
        className={`text-sm ${
          isUp ? "text-green-600" : "text-red-600"
        }`}
      >
        {isUp ? "+" : ""}
        {change.toFixed(2)} ({percent.toFixed(2)}%)
      </div>

      <p className="text-xs text-muted-foreground">
        Last updated:{" "}
        {lastUpdated ? lastUpdated.toLocaleTimeString() : "Loading..."}
      </p>
    </div>
  );
}