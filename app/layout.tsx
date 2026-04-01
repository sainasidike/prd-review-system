import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PRD Review System",
  description: "AI-powered PRD review system using Claude API",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
