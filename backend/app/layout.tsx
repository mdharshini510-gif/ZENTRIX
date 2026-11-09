import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ZENTRIX",
  description: "Brand Preflight Engine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}