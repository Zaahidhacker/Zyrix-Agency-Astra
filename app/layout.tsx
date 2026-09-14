import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
const bodyFont = localFont({
  src: "../node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2",
  variable: "--font-body",
  display: "swap",
  weight: "200 800",
});
const displayFont = localFont({
  src: "../node_modules/@fontsource/barlow-condensed/files/barlow-condensed-latin-600-normal.woff2",
  variable: "--font-display",
  display: "swap",
  weight: "600",
});
const monoFont = localFont({
  src: "../node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2",
  variable: "--font-mono",
  display: "swap",
  weight: "400",
  preload: false,
});
import "./globals.css";
import { Metrics } from "@/components/motion/Metrics";
import { siteUrl } from "@/lib/content";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "Zyrix | Websites at half the market price",
    template: "%s | Zyrix",
  },
  description:
    "Distinctive websites, e-commerce and web applications. Strategy, design and development, working as one.",
  openGraph: { type: "website", siteName: "Zyrix", locale: "en_LK" },
  twitter: { card: "summary_large_image" },
};
export const viewport: Viewport = {
  themeColor: "#101112",
  width: "device-width",
  initialScale: 1,
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${bodyFont.variable} ${displayFont.variable} ${monoFont.variable}`}
    >
      <body id="top">
        {children}
        <Metrics />
      </body>
    </html>
  );
}
