import { DashboardShell } from "@/components/layout/dashboard-shell";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { runPipeline } from "@/features/pipeline/actions";

const pipelineSteps = [
  {
    name: "Market APIs",
    status: "Source",
    description: "Finnhub / Polygon market data source",
  },
  {
    name: "Kafka",
    status: "Streaming",
    description: "Real-time ingestion topic for market events",
  },
  {
    name: "AWS S3 Raw",
    status: "Raw Zone",
    description: "Stores unprocessed market data files",
  },
  {
    name: "Databricks Bronze",
    status: "Ingested",
    description: "Raw data loaded into Delta tables",
  },
  {
    name: "Databricks Silver",
    status: "Cleaned",
    description: "Validated and cleaned market data",
  },
  {
    name: "Databricks Gold",
    status: "Curated",
    description: "Analytics-ready portfolio metrics",
  },
  {
    name: "dbt Models",
    status: "Transform",
    description: "Business logic and analytics transformations",
  },
  {
    name: "Supabase/Postgres",
    status: "Serving",
    description: "Serves analytics data to the application",
  },
  {
    name: "Next.js Dashboard",
    status: "Frontend",
    description: "Displays analytics and pipeline health",
  },
];

function getStatusClass(status: string) {
  if (status === "success") {
    return "border-green-500/30 bg-green-500/10 text-green-700";
  }

  if (status === "failed") {
    return "border-red-500/30 bg-red-500/10 text-red-700";
  }

  if (status === "running") {
    return "border-yellow-500/30 bg-yellow-500/10 text-yellow-700";
  }

  return "border-muted bg-muted text-muted-foreground";
}

function formatDate(value: string | null) {
  if (!value) return "Pending";
  return new Date(value).toLocaleString();
}

export default async function DataPipelinePage() {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    redirect("/login");
  }

  const { data: pipelineRuns } = await supabase
    .from("pipeline_runs")
    .select("*")
    .eq("user_id", userData.user.id)
    .order("started_at", { ascending: false });

  const latestRun = pipelineRuns?.[0];

  return (
    <DashboardShell userEmail={userData.user.email ?? "User"}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Data Pipeline</h1>
          <p className="text-muted-foreground">
            End-to-end data engineering pipeline for ingesting, processing,
            transforming, and serving market analytics.
          </p>
        </div>

        <form action={runPipeline}>
        <button className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white">
            Run Pipeline
        </button>
        </form>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border p-5">
            <p className="text-sm text-muted-foreground">Records Ingested</p>
            <p className="mt-2 text-2xl font-bold">
              {latestRun?.records_ingested ?? 0}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {latestRun?.source_name ?? "Waiting for ingestion job"}
            </p>
          </div>

          <div className="rounded-2xl border p-5">
            <p className="text-sm text-muted-foreground">Pipeline Status</p>
            <p className="mt-2 text-2xl font-bold capitalize">
              {latestRun?.status ?? "Pending"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {latestRun?.pipeline_name ?? "No pipeline yet"}
            </p>
          </div>

          <div className="rounded-2xl border p-5">
            <p className="text-sm text-muted-foreground">Last Run</p>
            <p className="mt-2 text-2xl font-bold">
              {latestRun?.completed_at
                ? new Date(latestRun.completed_at).toLocaleDateString()
                : "Pending"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {latestRun?.completed_at
                ? new Date(latestRun.completed_at).toLocaleTimeString()
                : "No data"}
            </p>
          </div>

          <div className="rounded-2xl border p-5">
            <p className="text-sm text-muted-foreground">Failed Records</p>
            <p className="mt-2 text-2xl font-bold">
              {latestRun?.failed_records ?? 0}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Data validation results
            </p>
          </div>
        </div>

        <div className="rounded-2xl border p-6">
          <h2 className="text-xl font-semibold">Pipeline Run History</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Tracks each pipeline execution with status, source, record counts,
            failures, and timestamps.
          </p>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="py-3 pr-4">Pipeline</th>
                  <th className="py-3 pr-4">Source</th>
                  <th className="py-3 pr-4">Status</th>
                  <th className="py-3 pr-4">Records</th>
                  <th className="py-3 pr-4">Failed</th>
                  <th className="py-3 pr-4">Started</th>
                  <th className="py-3 pr-4">Completed</th>
                </tr>
              </thead>

              <tbody>
                {pipelineRuns && pipelineRuns.length > 0 ? (
                  pipelineRuns.map((run) => (
                    <tr key={run.id} className="border-b">
                      <td className="py-3 pr-4 font-medium">
                        {run.pipeline_name}
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground">
                        {run.source_name}
                      </td>
                      <td className="py-3 pr-4">
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-medium capitalize ${getStatusClass(
                            run.status
                          )}`}
                        >
                          {run.status}
                        </span>
                      </td>
                      <td className="py-3 pr-4">{run.records_ingested}</td>
                      <td className="py-3 pr-4">{run.failed_records}</td>
                      <td className="py-3 pr-4 text-muted-foreground">
                        {formatDate(run.started_at)}
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground">
                        {formatDate(run.completed_at)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-6 text-center text-muted-foreground"
                    >
                      No pipeline runs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border p-6">
          <h2 className="text-xl font-semibold">Architecture Flow</h2>

          <div className="mt-5 grid gap-3">
            {pipelineSteps.map((step, index) => (
              <div
                key={step.name}
                className="grid gap-4 rounded-xl border p-4 md:grid-cols-[40px_1fr_140px]"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold">
                  {index + 1}
                </div>

                <div>
                  <p className="font-semibold">{step.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>

                <div className="flex items-center md:justify-end">
                  <span className="rounded-full border px-3 py-1 text-xs text-muted-foreground">
                    {step.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border p-6">
            <h2 className="text-xl font-semibold">Storage Paths</h2>

            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4 border-b pb-2">
                <span>Raw</span>
                <span className="text-muted-foreground">s3://vector/raw</span>
              </div>

              <div className="flex justify-between gap-4 border-b pb-2">
                <span>Bronze</span>
                <span className="text-muted-foreground">
                  databricks.vector.bronze
                </span>
              </div>

              <div className="flex justify-between gap-4 border-b pb-2">
                <span>Silver</span>
                <span className="text-muted-foreground">
                  databricks.vector.silver
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span>Gold</span>
                <span className="text-muted-foreground">
                  databricks.vector.gold
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border p-6">
            <h2 className="text-xl font-semibold">Quality Checks</h2>

            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4 border-b pb-2">
                <span>Duplicate Check</span>
                <span className="text-muted-foreground">Pending</span>
              </div>

              <div className="flex justify-between gap-4 border-b pb-2">
                <span>Null Price Check</span>
                <span className="text-muted-foreground">Pending</span>
              </div>

              <div className="flex justify-between gap-4 border-b pb-2">
                <span>Schema Validation</span>
                <span className="text-muted-foreground">Pending</span>
              </div>

              <div className="flex justify-between gap-4">
                <span>Freshness Check</span>
                <span className="text-muted-foreground">Pending</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}


// import { DashboardShell } from "@/components/layout/dashboard-shell";
// import { redirect } from "next/navigation";
// import { createClient } from "@/lib/supabase/server";

// const pipelineSteps = [
//   {
//     name: "Market APIs",
//     status: "Source",
//     description: "Finnhub / Polygon market data source",
//   },
//   {
//     name: "Kafka",
//     status: "Streaming",
//     description: "Real-time ingestion topic for market events",
//   },
//   {
//     name: "AWS S3 Raw",
//     status: "Raw Zone",
//     description: "Stores unprocessed market data files",
//   },
//   {
//     name: "Databricks Bronze",
//     status: "Ingested",
//     description: "Raw data loaded into Delta tables",
//   },
//   {
//     name: "Databricks Silver",
//     status: "Cleaned",
//     description: "Validated and cleaned market data",
//   },
//   {
//     name: "Databricks Gold",
//     status: "Curated",
//     description: "Analytics-ready portfolio metrics",
//   },
//   {
//     name: "dbt Models",
//     status: "Transform",
//     description: "Business logic and analytics transformations",
//   },
//   {
//     name: "Supabase/Postgres",
//     status: "Serving",
//     description: "Serves analytics data to the application",
//   },
//   {
//     name: "Next.js Dashboard",
//     status: "Frontend",
//     description: "Displays analytics and pipeline health",
//   },
// ];

// export default async function DataPipelinePage() {
//   const supabase = await createClient();

//   const { data: userData } = await supabase.auth.getUser();

//   if (!userData.user) {
//     redirect("/login");
//   }

//   const { data: latestRun } = await supabase
//     .from("pipeline_runs")
//     .select("*")
//     .eq("user_id", userData.user.id)
//     .order("completed_at", { ascending: false })
//     .limit(1)
//     .maybeSingle();

//   return (
//     <DashboardShell userEmail={userData.user.email ?? "User"}>
//       <div className="space-y-6">
//         <div>
//           <h1 className="text-3xl font-bold">Data Pipeline</h1>
//           <p className="text-muted-foreground">
//             End-to-end data engineering pipeline for ingesting, processing,
//             transforming, and serving market analytics.
//           </p>
//         </div>

//         <div className="grid gap-4 md:grid-cols-4">
//           <div className="rounded-2xl border p-5">
//             <p className="text-sm text-muted-foreground">Records Ingested</p>
//             <p className="mt-2 text-2xl font-bold">
//               {latestRun?.records_ingested ?? 0}
//             </p>
//             <p className="mt-1 text-xs text-muted-foreground">
//               {latestRun?.source_name ?? "Waiting for ingestion job"}
//             </p>
//           </div>

//           <div className="rounded-2xl border p-5">
//             <p className="text-sm text-muted-foreground">Pipeline Status</p>
//             <p className="mt-2 text-2xl font-bold capitalize">
//               {latestRun?.status ?? "Pending"}
//             </p>
//             <p className="mt-1 text-xs text-muted-foreground">
//               {latestRun?.pipeline_name ?? "No pipeline yet"}
//             </p>
//           </div>

//           <div className="rounded-2xl border p-5">
//             <p className="text-sm text-muted-foreground">Last Run</p>
//             <p className="mt-2 text-2xl font-bold">
//               {latestRun?.completed_at
//                 ? new Date(latestRun.completed_at).toLocaleDateString()
//                 : "Pending"}
//             </p>
//             <p className="mt-1 text-xs text-muted-foreground">
//               {latestRun?.completed_at
//                 ? new Date(latestRun.completed_at).toLocaleTimeString()
//                 : "No data"}
//             </p>
//           </div>

//           <div className="rounded-2xl border p-5">
//             <p className="text-sm text-muted-foreground">Failed Records</p>
//             <p className="mt-2 text-2xl font-bold">
//               {latestRun?.failed_records ?? 0}
//             </p>
//             <p className="mt-1 text-xs text-muted-foreground">
//               Data validation results
//             </p>
//           </div>
//         </div>

//         <div className="rounded-2xl border p-6">
//           <h2 className="text-xl font-semibold">Architecture Flow</h2>

//           <div className="mt-5 grid gap-3">
//             {pipelineSteps.map((step, index) => (
//               <div
//                 key={step.name}
//                 className="grid gap-4 rounded-xl border p-4 md:grid-cols-[40px_1fr_140px]"
//               >
//                 <div className="flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold">
//                   {index + 1}
//                 </div>

//                 <div>
//                   <p className="font-semibold">{step.name}</p>
//                   <p className="text-sm text-muted-foreground">
//                     {step.description}
//                   </p>
//                 </div>

//                 <div className="flex items-center md:justify-end">
//                   <span className="rounded-full border px-3 py-1 text-xs text-muted-foreground">
//                     {step.status}
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="grid gap-4 md:grid-cols-2">
//           <div className="rounded-2xl border p-6">
//             <h2 className="text-xl font-semibold">Storage Paths</h2>

//             <div className="mt-4 space-y-3 text-sm">
//               <div className="flex justify-between gap-4 border-b pb-2">
//                 <span>Raw</span>
//                 <span className="text-muted-foreground">s3://vector/raw</span>
//               </div>

//               <div className="flex justify-between gap-4 border-b pb-2">
//                 <span>Bronze</span>
//                 <span className="text-muted-foreground">
//                   databricks.vector.bronze
//                 </span>
//               </div>

//               <div className="flex justify-between gap-4 border-b pb-2">
//                 <span>Silver</span>
//                 <span className="text-muted-foreground">
//                   databricks.vector.silver
//                 </span>
//               </div>

//               <div className="flex justify-between gap-4">
//                 <span>Gold</span>
//                 <span className="text-muted-foreground">
//                   databricks.vector.gold
//                 </span>
//               </div>
//             </div>
//           </div>

//           <div className="rounded-2xl border p-6">
//             <h2 className="text-xl font-semibold">Quality Checks</h2>

//             <div className="mt-4 space-y-3 text-sm">
//               <div className="flex justify-between gap-4 border-b pb-2">
//                 <span>Duplicate Check</span>
//                 <span className="text-muted-foreground">Pending</span>
//               </div>

//               <div className="flex justify-between gap-4 border-b pb-2">
//                 <span>Null Price Check</span>
//                 <span className="text-muted-foreground">Pending</span>
//               </div>

//               <div className="flex justify-between gap-4 border-b pb-2">
//                 <span>Schema Validation</span>
//                 <span className="text-muted-foreground">Pending</span>
//               </div>

//               <div className="flex justify-between gap-4">
//                 <span>Freshness Check</span>
//                 <span className="text-muted-foreground">Pending</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </DashboardShell>
//   );
// }

// // import { DashboardShell } from "@/components/layout/dashboard-shell";
// // import { redirect } from "next/navigation";
// // import { createClient } from "@/lib/supabase/server";


// // const pipelineSteps = [
// //   {
// //     name: "Market APIs",
// //     status: "Source",
// //     description: "Finnhub / Polygon market data source",
// //   },
// //   {
// //     name: "Kafka",
// //     status: "Streaming",
// //     description: "Real-time ingestion topic for market events",
// //   },
// //   {
// //     name: "AWS S3 Raw",
// //     status: "Raw Zone",
// //     description: "Stores unprocessed market data files",
// //   },
// //   {
// //     name: "Databricks Bronze",
// //     status: "Ingested",
// //     description: "Raw data loaded into Delta tables",
// //   },
// //   {
// //     name: "Databricks Silver",
// //     status: "Cleaned",
// //     description: "Validated and cleaned market data",
// //   },
// //   {
// //     name: "Databricks Gold",
// //     status: "Curated",
// //     description: "Analytics-ready portfolio metrics",
// //   },
// //   {
// //     name: "dbt Models",
// //     status: "Transform",
// //     description: "Business logic and analytics transformations",
// //   },
// //   {
// //     name: "Supabase/Postgres",
// //     status: "Serving",
// //     description: "Serves analytics data to the application",
// //   },
// //   {
// //     name: "Next.js Dashboard",
// //     status: "Frontend",
// //     description: "Displays analytics and pipeline health",
// //   },
// // ];

// // export default async function DataPipelinePage() {
// //   const supabase = await createClient();

// //   const { data: userData } = await supabase.auth.getUser();

// //   if (!userData.user) {
// //     redirect("/login");
// //   }

// //   const { data: latestRun } = await supabase
// //     .from("pipeline_runs")
// //     .select("*")
// //     .eq("user_id", userData.user.id)
// //     .order("completed_at", { ascending: false })
// //     .limit(1)
// //     .single();

// //   return (
// //     <DashboardShell userEmail={userData.user.email ?? "User"}>
// //       <div className="space-y-6">
// //         <div>
// //           <h1 className="text-3xl font-bold">Data Pipeline</h1>
// //           <p className="text-muted-foreground">
// //             End-to-end data engineering pipeline for ingesting, processing,
// //             transforming, and serving market analytics.
// //           </p>
// //         </div>

// //         <div className="grid gap-4 md:grid-cols-4">
// //         <div className="rounded-2xl border p-5">
// //             <p className="text-sm text-muted-foreground">Records Ingested</p>
// //             <p className="mt-2 text-2xl font-bold">
// //             {latestRun?.records_ingested ?? 0}
// //             </p>
// //             <p className="mt-1 text-xs text-muted-foreground">
// //             {latestRun?.source_name ?? "Waiting for ingestion job"}
// //             </p>
// //         </div>

// //         <div className="rounded-2xl border p-5">
// //             <p className="text-sm text-muted-foreground">Pipeline Status</p>
// //             <p className="mt-2 text-2xl font-bold">
// //             {latestRun?.status ?? "Pending"}
// //             </p>
// //             <p className="mt-1 text-xs text-muted-foreground">
// //             {latestRun?.pipeline_name ?? "No pipeline yet"}
// //             </p>
// //         </div>

// //         <div className="rounded-2xl border p-5">
// //             <p className="text-sm text-muted-foreground">Last Run</p>
// //             <p className="mt-2 text-2xl font-bold">
// //             {latestRun?.completed_at
// //                 ? new Date(latestRun.completed_at).toLocaleDateString()
// //                 : "Pending"}
// //             </p>
// //             <p className="mt-1 text-xs text-muted-foreground">
// //             {latestRun?.completed_at
// //                 ? new Date(latestRun.completed_at).toLocaleTimeString()
// //                 : "No data"}
// //             </p>
// //         </div>

// //         <div className="rounded-2xl border p-5">
// //             <p className="text-sm text-muted-foreground">Failed Records</p>
// //             <p className="mt-2 text-2xl font-bold">
// //             {latestRun?.failed_records ?? 0}
// //             </p>
// //             <p className="mt-1 text-xs text-muted-foreground">
// //             Data validation results
// //             </p>
// //         </div>
// //         </div>

// //         {/* <div className="grid gap-4 md:grid-cols-4">
// //           <div className="rounded-2xl border p-5">
// //             <p className="text-sm text-muted-foreground">Records Ingested</p>
// //             <p className="mt-2 text-2xl font-bold">0</p>
// //             <p className="mt-1 text-xs text-muted-foreground">
// //               Waiting for ingestion job
// //             </p>
// //           </div> */}

// //           <div className="rounded-2xl border p-5">
// //             <p className="text-sm text-muted-foreground">Kafka Topic</p>
// //             <p className="mt-2 text-2xl font-bold">Planned</p>
// //             <p className="mt-1 text-xs text-muted-foreground">
// //               market-prices topic
// //             </p>
// //           </div>

// //           <div className="rounded-2xl border p-5">
// //             <p className="text-sm text-muted-foreground">Data Freshness</p>
// //             <p className="mt-2 text-2xl font-bold">Pending</p>
// //             <p className="mt-1 text-xs text-muted-foreground">
// //               No latest batch yet
// //             </p>
// //           </div>

// //           <div className="rounded-2xl border p-5">
// //             <p className="text-sm text-muted-foreground">Failed Records</p>
// //             <p className="mt-2 text-2xl font-bold">0</p>
// //             <p className="mt-1 text-xs text-muted-foreground">
// //               Validation checks pending
// //             </p>
// //           </div>
// //         </div>

// //         <div className="rounded-2xl border p-6">
// //           <h2 className="text-xl font-semibold">Architecture Flow</h2>

// //           <div className="mt-5 grid gap-3">
// //             {pipelineSteps.map((step, index) => (
// //               <div
// //                 key={step.name}
// //                 className="grid gap-4 rounded-xl border p-4 md:grid-cols-[40px_1fr_140px]"
// //               >
// //                 <div className="flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold">
// //                   {index + 1}
// //                 </div>

// //                 <div>
// //                   <p className="font-semibold">{step.name}</p>
// //                   <p className="text-sm text-muted-foreground">
// //                     {step.description}
// //                   </p>
// //                 </div>

// //                 <div className="flex items-center md:justify-end">
// //                   <span className="rounded-full border px-3 py-1 text-xs text-muted-foreground">
// //                     {step.status}
// //                   </span>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         </div>

// //         <div className="grid gap-4 md:grid-cols-2">
// //           <div className="rounded-2xl border p-6">
// //             <h2 className="text-xl font-semibold">Storage Paths</h2>

// //             <div className="mt-4 space-y-3 text-sm">
// //               <div className="flex justify-between border-b pb-2">
// //                 <span>Raw</span>
// //                 <span className="text-muted-foreground">s3://vector/raw</span>
// //               </div>

// //               <div className="flex justify-between border-b pb-2">
// //                 <span>Bronze</span>
// //                 <span className="text-muted-foreground">
// //                   databricks.vector.bronze
// //                 </span>
// //               </div>

// //               <div className="flex justify-between border-b pb-2">
// //                 <span>Silver</span>
// //                 <span className="text-muted-foreground">
// //                   databricks.vector.silver
// //                 </span>
// //               </div>

// //               <div className="flex justify-between">
// //                 <span>Gold</span>
// //                 <span className="text-muted-foreground">
// //                   databricks.vector.gold
// //                 </span>
// //               </div>
// //             </div>
// //           </div>

// //           <div className="rounded-2xl border p-6">
// //             <h2 className="text-xl font-semibold">Quality Checks</h2>

// //             <div className="mt-4 space-y-3 text-sm">
// //               <div className="flex justify-between border-b pb-2">
// //                 <span>Duplicate Check</span>
// //                 <span className="text-muted-foreground">Pending</span>
// //               </div>

// //               <div className="flex justify-between border-b pb-2">
// //                 <span>Null Price Check</span>
// //                 <span className="text-muted-foreground">Pending</span>
// //               </div>

// //               <div className="flex justify-between border-b pb-2">
// //                 <span>Schema Validation</span>
// //                 <span className="text-muted-foreground">Pending</span>
// //               </div>

// //               <div className="flex justify-between">
// //                 <span>Freshness Check</span>
// //                 <span className="text-muted-foreground">Pending</span>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </DashboardShell>
// //   );
// // }



// // // export default function DataPipelinePage() {
// // //   return (
// // //     <main className="space-y-6 p-6">
// // //       <div>
// // //         <h1 className="text-2xl font-semibold">Data Pipeline</h1>
// // //         <p className="text-sm text-muted-foreground">
// // //           End-to-end data engineering pipeline for market data ingestion,
// // //           processing, transformation, and dashboard serving.
// // //         </p>
// // //       </div>

// // //       <section className="rounded-lg border bg-card p-6">
// // //         <h2 className="mb-4 text-lg font-semibold">Pipeline Architecture</h2>

// // //         <div className="grid gap-3 md:grid-cols-7">
// // //           {[
// // //             "Market APIs",
// // //             "Kafka",
// // //             "AWS S3 Raw",
// // //             "Databricks Bronze/Silver/Gold",
// // //             "dbt Models",
// // //             "Supabase/Postgres",
// // //             "Next.js Dashboards",
// // //           ].map((step) => (
// // //             <div
// // //               key={step}
// // //               className="rounded-lg border bg-background p-4 text-center text-sm font-medium"
// // //             >
// // //               {step}
// // //             </div>
// // //           ))}
// // //         </div>
// // //       </section>

// // //       <section className="grid gap-4 md:grid-cols-3">
// // //         <div className="rounded-lg border bg-card p-4">
// // //           <p className="text-sm text-muted-foreground">Records Ingested</p>
// // //           <p className="mt-2 text-2xl font-semibold">0</p>
// // //         </div>

// // //         <div className="rounded-lg border bg-card p-4">
// // //           <p className="text-sm text-muted-foreground">Kafka Topic Status</p>
// // //           <p className="mt-2 text-2xl font-semibold">Planned</p>
// // //         </div>

// // //         <div className="rounded-lg border bg-card p-4">
// // //           <p className="text-sm text-muted-foreground">Data Freshness</p>
// // //           <p className="mt-2 text-2xl font-semibold">Pending</p>
// // //         </div>
// // //       </section>

// // //       <section className="rounded-lg border bg-card p-6">
// // //         <h2 className="mb-4 text-lg font-semibold">Layer Status</h2>

// // //         <div className="space-y-3 text-sm">
// // //           <div className="flex justify-between border-b pb-2">
// // //             <span>Raw Layer</span>
// // //             <span className="text-muted-foreground">AWS S3 /raw planned</span>
// // //           </div>

// // //           <div className="flex justify-between border-b pb-2">
// // //             <span>Bronze Layer</span>
// // //             <span className="text-muted-foreground">Databricks planned</span>
// // //           </div>

// // //           <div className="flex justify-between border-b pb-2">
// // //             <span>Silver Layer</span>
// // //             <span className="text-muted-foreground">Cleaning planned</span>
// // //           </div>

// // //           <div className="flex justify-between border-b pb-2">
// // //             <span>Gold Layer</span>
// // //             <span className="text-muted-foreground">Analytics planned</span>
// // //           </div>

// // //           <div className="flex justify-between">
// // //             <span>Serving Layer</span>
// // //             <span className="text-muted-foreground">Supabase/Postgres planned</span>
// // //           </div>
// // //         </div>
// // //       </section>
// // //     </main>
// // //   );
// // // }