import "./globals.css";

export const metadata = {
  title: "Vector Trading",
  description: "Robinhood-style paper trading simulation platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}