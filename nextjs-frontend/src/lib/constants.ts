// Design tokens and constants for the TradingView Bridge application

export const SITE_CONFIG = {
  name: "TradingView Bridge",
  description: "Automated trading platform connecting TradingView to multiple brokers",
  url: "https://tradingview-bridge.com",
  ogImage: "/og-image.jpg",
  links: {
    twitter: "https://twitter.com/tradingbridge",
    github: "https://github.com/tradingbridge",
    docs: "/docs",
  },
};

export const NAVIGATION_ITEMS = [
  {
    title: "Features",
    href: "#features",
  },
  {
    title: "Brokers",
    href: "#brokers",
  },
  {
    title: "Pricing",
    href: "#pricing",
  },
];

export const STATS = [
  {
    id: "brokers",
    value: "15+",
    label: "Supported Brokers",
    icon: "building",
  },
  {
    id: "speed",
    value: "<100ms",
    label: "Execution Speed",
    icon: "zap",
  },
  {
    id: "uptime",
    value: "99.9%",
    label: "Uptime",
    icon: "shield",
  },
  {
    id: "strategies",
    value: "1000+",
    label: "Active Strategies",
    icon: "trending-up",
  },
];

export const FEATURES = [
  {
    id: "tradingview-integration",
    title: "TradingView Integration",
    description: "Seamless webhook integration with TradingView alerts for real-time trading signals",
    icon: "bar-chart-3",
    badges: ["Real-time", "Webhooks", "Alerts"],
    gradient: "from-violet-500 to-fuchsia-500",
  },
  {
    id: "multi-broker-support",
    title: "Multi-Broker Support",
    description: "Connect multiple brokers simultaneously with unified API management",
    icon: "building-2",
    badges: ["15+ Brokers", "Unified API", "Cross-Platform"],
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: "strategy-builder",
    title: "Strategy Builder",
    description: "Visual strategy builder with no-code interface and backtesting capabilities",
    icon: "brain",
    badges: ["No-Code", "Backtesting", "Templates"],
    gradient: "from-emerald-500 to-green-500",
  },
  {
    id: "real-time-execution",
    title: "Real-time Execution",
    description: "Lightning-fast order execution with smart routing and failover protection",
    icon: "zap",
    badges: ["<100ms", "Smart Routing", "Failover"],
    gradient: "from-orange-500 to-amber-500",
  },
  {
    id: "risk-management",
    title: "Risk Management",
    description: "Advanced risk controls with position sizing and automated stop-loss management",
    icon: "shield",
    badges: ["Stop Loss", "Position Sizing", "Alerts"],
    gradient: "from-red-500 to-pink-500",
  },
  {
    id: "portfolio-analytics",
    title: "Portfolio Analytics",
    description: "Comprehensive analytics and performance tracking with detailed reports",
    icon: "trending-up",
    badges: ["P&L Tracking", "Reports", "Insights"],
    gradient: "from-indigo-500 to-purple-500",
  },
];

export const BROKERS = [
  {
    id: "zerodha",
    name: "Zerodha",
    logo: "🇮🇳",
    status: "connected" as const,
    features: ["Indian Markets", "Kite API", "Options Trading"],
    region: "India",
    description: "Leading Indian discount broker with comprehensive API support",
  },
  {
    id: "interactive-brokers",
    name: "Interactive Brokers",
    logo: "🌐",
    status: "connected" as const,
    features: ["Global Markets", "TWS API", "Multi-Asset"],
    region: "Global",
    description: "Global broker with access to 150+ markets worldwide",
  },
  {
    id: "alpaca",
    name: "Alpaca",
    logo: "🦙",
    status: "available" as const,
    features: ["US Stocks", "Commission-Free", "API-First"],
    region: "US",
    description: "Commission-free trading with developer-friendly API",
  },
  {
    id: "binance",
    name: "Binance",
    logo: "₿",
    status: "available" as const,
    features: ["Crypto Trading", "Futures", "Spot Markets"],
    region: "Global",
    description: "World's largest cryptocurrency exchange platform",
  },
  {
    id: "td-ameritrade",
    name: "TD Ameritrade",
    logo: "📊",
    status: "coming-soon" as const,
    features: ["US Markets", "thinkorswim", "Options"],
    region: "US",
    description: "Full-service broker with advanced trading platform",
  },
  {
    id: "metatrader-5",
    name: "MetaTrader 5",
    logo: "📉",
    status: "coming-soon" as const,
    features: ["Forex", "CFDs", "Expert Advisors"],
    region: "Global",
    description: "Popular forex and CFD trading platform",
  },
];

export const PRICING_TIERS = [
  {
    id: "starter",
    name: "Starter",
    price: "$29",
    period: "month",
    description: "Perfect for individual traders getting started with automation",
    features: [
      "Connect up to 2 brokers",
      "100 trades per month",
      "Basic strategy builder",
      "Email support",
      "Community access",
      "Basic analytics",
    ],
    ctaText: "Start Free Trial",
    ctaLink: "/register",
    popular: false,
  },
  {
    id: "professional",
    name: "Professional",
    price: "$79",
    period: "month",
    description: "For active traders who need unlimited access and advanced features",
    features: [
      "Connect unlimited brokers",
      "Unlimited trades",
      "Advanced strategy builder",
      "Priority support",
      "Backtesting engine",
      "Custom webhooks",
      "Advanced analytics",
      "Risk management tools",
    ],
    ctaText: "Start Free Trial",
    ctaLink: "/register",
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For institutions and teams requiring custom solutions and dedicated support",
    features: [
      "Everything in Professional",
      "White-label solution",
      "Dedicated infrastructure",
      "Custom integrations",
      "24/7 phone support",
      "SLA guarantee",
      "Custom reporting",
      "Multi-user management",
    ],
    ctaText: "Contact Sales",
    ctaLink: "/contact",
    popular: false,
  },
];