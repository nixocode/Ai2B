import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ai2B — Custom AI Software for Real Businesses",
  description:
    "We build AI systems tailored to how your business actually works. No templates. No fluff. End-to-end delivery.",
  keywords: [
    "AI software",
    "custom AI",
    "business automation",
    "AI consultant",
    "Barcelona",
  ],
  openGraph: {
    title: "Ai2B",
    description: "Custom AI. Built for your business.",
    url: "https://ai2b.io",
    siteName: "Ai2B",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ai2B — Custom AI Software for Real Businesses",
    description: "Custom AI. Built for your business.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable}`}
    >
      <body>
        {children}
        <div className="grain-overlay" aria-hidden="true" />
      </body>
    </html>
  );
}
