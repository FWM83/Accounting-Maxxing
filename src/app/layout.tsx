import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Codex",
  description:
    "Codex is a SaaS ERP and accounting platform purpose-built for cannabis dispensaries in Colorado and Illinois."
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
