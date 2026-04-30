import { logout } from "@/features/auth/actions";

type AppNavbarProps = {
  userEmail: string;
};

export function AppNavbar({ userEmail }: AppNavbarProps) {
  return (
    <header className="border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        
        {/* LEFT */}
        <div>
          <h1 className="text-lg font-semibold tracking-tight">
            Vector Trading
          </h1>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {userEmail}
          </span>

          <form action={logout}>
            <button
              type="submit"
              className="rounded-lg border px-3 py-2 text-sm transition hover:bg-accent"
            >
              Log out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}



// import { logout } from "@/features/auth/actions";

// type AppNavbarProps = {
//   userEmail: string;
// };

// export function AppNavbar({ userEmail }: AppNavbarProps) {
//   return (
//     <header className="border-b bg-background">
//       <div className="flex h-16 items-center justify-between px-6">
//         <div>
//           <p className="font-semibold">Vector Trading</p>
//           <p className="text-sm text-muted-foreground">Paper trading simulation platform</p>
//         </div>

//         <div className="flex items-center gap-4">
//           <span className="text-sm text-muted-foreground">{userEmail}</span>
//           <form action={logout}>
//             <button
//               type="submit"
//               className="rounded-md border px-3 py-2 text-sm hover:bg-accent"
//             >
//               Log out
//             </button>
//           </form>
//         </div>
//       </div>
//     </header>
//   );
// }