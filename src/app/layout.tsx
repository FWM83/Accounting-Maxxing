import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Accounting Maxxing ERP",
  description: "A NetSuite-class ERP prototype focused on accounting, reconciliation, and audit evidence."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
