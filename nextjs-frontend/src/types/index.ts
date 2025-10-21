// Main type definitions for the TradingView Bridge application

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  badges: string[];
  gradient: string;
}

export interface Broker {
  id: string;
  name: string;
  logo: string;
  status: 'connected' | 'available' | 'coming-soon';
  features: string[];
  region?: string;
  description: string;
}

export interface PricingTier {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  ctaText: string;
  ctaLink: string;
}

export interface Stat {
  id: string;
  value: string;
  label: string;
  icon: string;
}

export interface NavigationItem {
  title: string;
  href: string;
}

export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    twitter: string;
    github: string;
    docs: string;
  };
}