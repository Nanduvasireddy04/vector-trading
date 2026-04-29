type Props = {
  symbol: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
};

export function PositionSummary({
  symbol,
  quantity,
  avgPrice,
  currentPrice,
}: Props) {
  const marketValue = quantity * currentPrice;
  const costBasis = quantity * avgPrice;
  const pnl = marketValue - costBasis;

  return (
    <div className="rounded-xl border p-4 space-y-2">
      <h2 className="text-lg font-semibold">Your Position</h2>

      {quantity <= 0 ? (
        <p className="text-muted-foreground">
          You do not own any shares of {symbol}.
        </p>
      ) : (
        <>
          <p>Shares: {quantity}</p>
          <p>Average Price: ${avgPrice.toFixed(2)}</p>
          <p>Market Value: ${marketValue.toFixed(2)}</p>
          <p>
            Unrealized P&L:{" "}
            <span className={pnl >= 0 ? "text-green-600" : "text-red-600"}>
              ${pnl.toFixed(2)}
            </span>
          </p>
        </>
      )}
    </div>
  );
}