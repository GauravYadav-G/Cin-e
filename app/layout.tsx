import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./portal.css";
export const metadata: Metadata = {
  title: "CINÉ — A different kind of cinema",
  description:
    "Extraordinary films. Singular voices. Explore a curated world of cinema, one filmmaker at a time.",
  icons: { icon: "/icon.svg" },
};
export const viewport: Viewport = {
  themeColor: "#080808",
  width: "device-width",
  initialScale: 1,
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
