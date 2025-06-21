import type React from "react";
import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/cart-context";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import ScrollToTop from "@/components/scroll-to-top";
import LoadingProvider from "@/components/loading-provider";
import { WishlistProvider } from "@/contexts/wishlist-context";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cocúfum - Premium Lifestyle & Zomerproducten",
  description:
    "Ontdek onze luxe collectie van strandhanddoeken, lifestyle producten en zomer essentials. Kwaliteit en stijl voor jouw perfecte zomer.",
  keywords:
    "strandhanddoeken, zomerproducten, lifestyle, badhanddoeken, strand accessoires, premium kwaliteit",
  authors: [{ name: "Cocúfum" }],
  creator: "Cocúfum",
  publisher: "Cocúfum",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: "https://cocufum.com",
    title: "Cocúfum - Premium Lifestyle & Zomerproducten",
    description:
      "Ontdek onze luxe collectie van strandhanddoeken, lifestyle producten en zomer essentials.",
    siteName: "Cocúfum",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cocúfum - Premium Lifestyle & Zomerproducten",
    description:
      "Ontdek onze luxe collectie van strandhanddoeken, lifestyle producten en zomer essentials.",
    creator: "@cocufum",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f5f3" },
    { media: "(prefers-color-scheme: dark)", color: "#1c1917" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="nl"
      className={`${inter.variable} ${playfair.variable} ${cormorant.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased bg-stone-50 dark:bg-stone-950 transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
        >
          <LoadingProvider>
            <CartProvider>
              <WishlistProvider>
                {/* Main content */}
                {children}
                <ScrollToTop />
                <Toaster />
              </WishlistProvider>
            </CartProvider>
          </LoadingProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
