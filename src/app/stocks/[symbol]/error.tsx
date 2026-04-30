"use client";

type Props = {
  error: Error;
  reset: () => void;
};

export default function StockError({ error, reset }: Props) {
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Something went wrong</h1>

      <p className="text-muted-foreground">
        We could not load this stock page.
      </p>

      <p className="text-sm text-red-600">{error.message}</p>

      <button
        onClick={reset}
        className="rounded border px-4 py-2 hover:bg-muted"
      >
        Try again
      </button>
    </main>
  );
}