import type { Metadata } from "next";
import { Hanken_Grotesk, Syne } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/providers/theme-provider";
import QueryProvider from "@/providers/query-provider";
import Header from "@/components/Header/Header";

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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  title: {
    default: "Dotfiles Market | Discover, Buy, and Sell Your Perfect Setup",
    template: "%s | Dotfiles Market",
  },
  description:
    "The ultimate marketplace to discover, share, buy, and sell curated dotfiles. Elevate your development environment and OS customization.",
  keywords: [
    "dotfiles",
    "configuration",
    "customization",
    "marketplace",
    "ricing",
    "Linux",
    "macOS",
    "Windows",
    "Neovim",
    "VSCode",
    "shell",
    "zsh",
    "bash",
    "terminal",
    "themes",
    "setups",
  ],
  authors: [{ name: "The Dotfiles Market Team", url: siteUrl }],
  creator: "Dotfiles Market",

  openGraph: {
    title: "Dotfiles Market | Discover, Buy, and Sell Your Perfect Setup",
    description:
      "The ultimate marketplace for curated OS and software configurations.",
    url: siteUrl,
    siteName: "Dotfiles Market",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Dotfiles Market - A marketplace for OS and software configuration files.",
      },
    ],
    locale: "en_US",
    type: "website",
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
        className={`${hankenGrotesk.variable} ${syne.variable} max-w-screen overflow-x-hidden antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <div id="ui-portal"></div>
            {children}
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
