import type { Metadata } from "next";
import localFont from "next/font/local";
import { Geist, Geist_Mono, Inter as InterFont } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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

export const metadata: Metadata = {
  title: "Hello Creatives",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${goodly.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
