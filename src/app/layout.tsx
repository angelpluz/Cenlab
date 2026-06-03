import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Central Laboratory Boss Timer",
  description: "Ragnarok Online Central Laboratory dungeon run tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
