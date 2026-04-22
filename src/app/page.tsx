import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-10">
      <div className="mx-auto max-w-6xl space-y-12">
        <section className="flex flex-col items-center text-center space-y-5 pt-10">
          <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm text-muted-foreground">
            Paper Trading • Portfolio Analytics • Event-Driven Workflows
          </div>

          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
            Vector Trading
          </h1>

          <p className="max-w-2xl text-lg text-muted-foreground">
            A Robinhood-style paper trading simulation platform built for learning,
            resume impact, and interview-ready system design.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Button size="lg">Get Started</Button>
            <Button size="lg" variant="outline">
              View Roadmap
            </Button>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Paper Trading</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Simulated buy and sell orders, portfolio tracking, order history,
              and position management.
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Market Monitoring</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Watchlists, live quotes, alerts, recurring investments, and
              real-time market workflows.
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Engineering Depth</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Built with Next.js, Supabase, and a scalable architecture designed
              for analytics, observability, and future data engineering
              extensions.
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
// export default function Home() {
//   return (
//     <main className="flex min-h-screen flex-col items-center justify-between p-24">
//       <div className="text-center space-y-3">
//         <h1 className="text-4xl font-bold">Vector Trading</h1>
//         <p className="text-gray-500">
//           Robinhood-style paper trading simulation platform
//         </p>
//       </div>
//     </main>
//   );
// }