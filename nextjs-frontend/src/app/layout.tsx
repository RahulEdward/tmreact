import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "TradingView Bridge - Automated Trading Platform",
    template: "%s | TradingView Bridge",
  },
  description: "Automated trading platform connecting TradingView to multiple brokers. Execute trades automatically with real-time signals, multi-broker support, and advanced risk management.",
  keywords: [
    "TradingView",
    "automated trading",
    "trading bot",
    "algorithmic trading",
    "broker integration",
    "trading signals",
    "webhook trading",
    "strategy automation",
  ],
  authors: [{ name: "TradingView Bridge" }],
  creator: "TradingView Bridge",
  publisher: "TradingView Bridge",
  metadataBase: new URL("https://tradingview-bridge.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://tradingview-bridge.com",
    title: "TradingView Bridge - Automated Trading Platform",
    description: "Automated trading platform connecting TradingView to multiple brokers. Execute trades automatically with real-time signals.",
    siteName: "TradingView Bridge",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "TradingView Bridge Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TradingView Bridge - Automated Trading Platform",
    description: "Automated trading platform connecting TradingView to multiple brokers.",
    images: ["/og-image.jpg"],
    creator: "@tradingbridge",
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
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "TradingView Bridge",
              applicationCategory: "FinanceApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "AggregateOffer",
                priceCurrency: "USD",
                lowPrice: "29",
                highPrice: "79",
              },
              description: "Automated trading platform connecting TradingView to multiple brokers",
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                ratingCount: "250",
              },
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
