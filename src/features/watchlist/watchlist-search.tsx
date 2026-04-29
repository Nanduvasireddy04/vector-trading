"use client";

import { useState, useTransition } from "react";
import { addToWatchlist } from "@/features/watchlist/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SearchResult = {
  symbol: string;
  displaySymbol?: string;
  description?: string;
  type?: string;
};

export function WatchlistSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [message, setMessage] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleSearch() {
    if (!query.trim()) return;

    setIsSearching(true);
    setMessage("");

    try {
      const response = await fetch(`/api/market/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error ?? "Search failed");
        setResults([]);
        return;
      }

      setResults(data.result?.slice(0, 8) ?? []);
    } catch {
      setMessage("Something went wrong while searching.");
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }

  function handleAdd(result: SearchResult) {
    startTransition(async () => {
      try {
        await addToWatchlist({
          symbol: result.symbol,
          displaySymbol: result.displaySymbol,
          description: result.description,
          type: result.type,
        });

        setMessage(`${result.displaySymbol ?? result.symbol} added to watchlist.`);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Failed to add asset.");
      }
    });
  }

  return (
    <div className="rounded-2xl border p-6 space-y-4">
      <div className="flex gap-3">
        <Input
          placeholder="Search AAPL, Tesla, Nvidia..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleSearch();
            }
          }}
        />
        <Button onClick={handleSearch} disabled={isSearching}>
          {isSearching ? "Searching..." : "Search"}
        </Button>
      </div>

      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}

      <div className="space-y-2">
        {results.map((result) => (
          <div
            key={`${result.symbol}-${result.description}`}
            className="flex items-center justify-between rounded-xl border p-4"
          >
            <div>
              <p className="font-semibold">{result.displaySymbol ?? result.symbol}</p>
              <p className="text-sm text-muted-foreground">{result.description}</p>
              <p className="text-xs text-muted-foreground">{result.type}</p>
            </div>

            <Button
              variant="outline"
              onClick={() => handleAdd(result)}
              disabled={isPending}
            >
              Add
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}