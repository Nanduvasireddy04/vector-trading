import { ReactNode } from "react";
import { AppNavbar } from "@/components/layout/app-navbar";
import { AppSidebar } from "@/components/layout/app-sidebar";

type DashboardShellProps = {
  userEmail: string;
  children: ReactNode;
};

export function DashboardShell({ userEmail, children }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-muted/40">
      <AppNavbar userEmail={userEmail} />

      <div className="flex">
        <AppSidebar />

        <main className="flex-1 p-6 md:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

// import { ReactNode } from "react";
// import { AppNavbar } from "@/components/layout/app-navbar";
// import { AppSidebar } from "@/components/layout/app-sidebar";

// type DashboardShellProps = {
//   userEmail: string;
//   children: ReactNode;
// };

// export function DashboardShell({ userEmail, children }: DashboardShellProps) {
//   return (
//     <div className="min-h-screen bg-background text-foreground">
//       <AppNavbar userEmail={userEmail} />
//       <div className="flex">
//         <AppSidebar />
//         <main className="flex-1 p-6">{children}</main>
//       </div>
//     </div>
//   );
// }