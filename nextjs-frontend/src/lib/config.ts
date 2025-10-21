// Configuration and environment variables

export const config = {
  // Site configuration
  site: {
    name: "TradingView Bridge",
    description: "Automated trading platform connecting TradingView to multiple brokers",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    ogImage: "/og-image.jpg",
  },
  
  // API configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
    timeout: 10000,
  },
  
  // Authentication configuration
  auth: {
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
    refreshThreshold: 5 * 60 * 1000, // 5 minutes
  },
  
  // Feature flags
  features: {
    enableAnalytics: process.env.NODE_ENV === "production",
    enableErrorReporting: process.env.NODE_ENV === "production",
    enableWebhooks: true,
  },
  
  // Social links
  links: {
    twitter: "https://twitter.com/tradingbridge",
    github: "https://github.com/tradingbridge",
    docs: "/docs",
    support: "/support",
    privacy: "/privacy",
    terms: "/terms",
  },
} as const;

export type Config = typeof config;