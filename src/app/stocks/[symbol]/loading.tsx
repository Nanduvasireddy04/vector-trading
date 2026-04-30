export default function StockLoading() {
  return (
    <main className="p-6">
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-32 rounded bg-muted" />
        <div className="h-6 w-48 rounded bg-muted" />
        <div className="h-10 w-40 rounded bg-muted" />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="h-[350px] rounded bg-muted md:col-span-2" />

          <div className="space-y-4">
            <div className="h-32 rounded bg-muted" />
            <div className="h-24 rounded bg-muted" />
            <div className="h-24 rounded bg-muted" />
          </div>
        </div>
      </div>
    </main>
  );
}