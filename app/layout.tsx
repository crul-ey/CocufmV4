import type React from "react";
import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/cart-context";
import { WishlistProvider } from "@/contexts/wishlist-context";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import ScrollToTop from "@/components/scroll-to-top";
import StructuredData from "@/components/seo/structured-data";
import CookieBanner from "@/components/cookie-banner";
import { FeedbackTrigger } from "@/components/feedback-trigger"; // <-- IMPORT

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

export const metadata: Metadata = {
  metadataBase: new URL("https://cocufum.com"),
  title: {
    default: "Cocúfum - Premium Lifestyle & Zomerproducten",
    template: "%s | Cocúfum",
  },
  description:
    "Ontdek onze luxe collectie van strandhanddoeken, lifestyle producten en zomer essentials. Premium kwaliteit en stijl voor jouw perfecte zomer.",
  keywords: [
    "strandhanddoeken",
    "zomerproducten",
    "lifestyle producten",
    "badhanddoeken",
    "strand accessoires",
    "premium kwaliteit",
    "zomer essentials",
    "beach towels",
    "summer collection",
    "cocufum",
  ],
  authors: [{ name: "Cocúfum", url: "https://cocufum.com" }],
  creator: "Cocúfum",
  publisher: "Cocúfum",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: "https://cocufum.com",
    title: "Cocúfum - Premium Lifestyle & Zomerproducten",
    description:
      "Ontdek onze luxe collectie van strandhanddoeken, lifestyle producten en zomer essentials. Premium kwaliteit voor jouw perfecte zomer.",
    siteName: "Cocúfum",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Cocúfum - Premium Lifestyle & Zomerproducten",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cocúfum - Premium Lifestyle & Zomerproducten",
    description:
      "Ontdek onze luxe collectie van strandhanddoeken, lifestyle producten en zomer essentials.",
    creator: "@cocufum",
    images: ["/og-image.jpg"],
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  alternates: {
    canonical: "https://cocufum.com",
  },
  category: "e-commerce",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
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
    <html lang="nl" suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* DNS prefetch for performance */}
        <link rel="dns-prefetch" href="//cdn.shopify.com" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />

        {/* Structured Data */}
        <StructuredData type="website" />
        <StructuredData type="organization" />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
        >
          <CartProvider>
            <WishlistProvider>
              {children}
              <CookieBanner />
              <ScrollToTop />
              <Toaster />
              <FeedbackTrigger /> {/* <-- HIER TOEVOEGEN */}
            </WishlistProvider>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
