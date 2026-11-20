import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter as InterFont } from "next/font/google";
import "./globals.css";

const inter = InterFont({
  variable: "--font-inter",
  subsets: ["latin"],
});

const goodly = localFont({
  src: [
    { path: "../../public/fonts/goodly-fonts-family/WOFF/Goodly-ExtraLight.woff", weight: "100", style: "normal" },
    { path: "../../public/fonts/goodly-fonts-family/WOFF/Goodly-Light.woff", weight: "200", style: "normal" },
    { path: "../../public/fonts/goodly-fonts-family/WOFF/Goodly-Regular.woff", weight: "400", style: "normal" },
    { path: "../../public/fonts/goodly-fonts-family/WOFF/Goodly-Medium.woff", weight: "500", style: "normal" },
    { path: "../../public/fonts/goodly-fonts-family/WOFF/Goodly-Semibold.woff", weight: "600", style: "normal" },
    { path: "../../public/fonts/goodly-fonts-family/WOFF/Goodly-Bold.woff", weight: "700", style: "normal" },
  ],
  variable: "--font-goodly",
  display: "swap",
});

// Used to build full links for link previews (og:image etc.).
// Set NEXT_PUBLIC_SITE_URL in Vercel; otherwise fall back to Vercel's production domain.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Hello Creatives",
  description: "Creative resources, stories, and inspiration from Hello Creatives.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${goodly.variable} antialiased`}
      >
        <div className="flex flex-col min-h-screen justify-between">
          {children}
        </div>
      </body>
    </html>
  );
}
