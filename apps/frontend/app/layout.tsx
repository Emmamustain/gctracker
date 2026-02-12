import type { Metadata } from "next";
import { Hanken_Grotesk, Syne, Libre_Barcode_128 } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/providers/theme-provider";
import QueryProvider from "@/providers/query-provider";
import Header from "@/components/Header/Header";
import { Toaster } from "@/components/ui/sonner";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt/PWAInstallPrompt";

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const libreBarcode128 = Libre_Barcode_128({
  variable: "--font-libre-barcode-128",
  subsets: ["latin"],
  weight: ["400"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  title: {
    default: "GC Tracker | Effortless Gift Card Management",
    template: "%s | GC Tracker",
  },
  description:
    "The ultimate platform to track, manage, and organize your gift cards. Never lose value again with GC Tracker.",
  keywords: [
    "gift card",
    "tracker",
    "management",
    "balance",
    "GC Tracker",
    "giftcard",
    "wallet",
    "digital cards",
  ],
  authors: [{ name: "The GC Tracker Team", url: siteUrl }],
  creator: "GC Tracker",

  openGraph: {
    title: "GC Tracker | Effortless Gift Card Management",
    description:
      "The ultimate platform to track, manage, and organize your gift cards.",
    url: siteUrl,
    siteName: "GC Tracker",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "GC Tracker - Manage your gift cards in one place.",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "GC Tracker",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${hankenGrotesk.variable} ${syne.variable} ${libreBarcode128.variable} max-w-screen overflow-x-hidden antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <Toaster />
            <PWAInstallPrompt />
            <div id="ui-portal"></div>
            {children}
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
