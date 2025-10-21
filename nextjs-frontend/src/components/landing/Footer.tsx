import Link from "next/link";
import { config } from "@/lib/config";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Platform",
      links: [
        { name: "Features", href: "#features" },
        { name: "Supported Brokers", href: "#brokers" },
        { name: "Pricing", href: "#pricing" },
        { name: "API Documentation", href: "/docs" },
        { name: "Status Page", href: "/status" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Blog", href: "/blog" },
        { name: "Careers", href: "/careers" },
        { name: "Contact", href: "/contact" },
        { name: "Press Kit", href: "/press" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", href: "/help" },
        { name: "Community Forum", href: "/community" },
        { name: "Video Tutorials", href: "/tutorials" },
        { name: "API Reference", href: "/api-reference" },
        { name: "System Status", href: "/status" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: config.links.privacy },
        { name: "Terms of Service", href: config.links.terms },
        { name: "Cookie Policy", href: "/cookies" },
        { name: "Security", href: "/security" },
        { name: "Compliance", href: "/compliance" },
      ],
    },
  ];

  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">TB</span>
              </div>
              <span className="text-xl font-bold text-white">TradingBridge</span>
            </div>
            <p className="text-slate-400 text-sm mb-4 leading-relaxed">
              Automate Your Trading Strategy
            </p>
            <p className="text-slate-500 text-xs leading-relaxed">
              Connect TradingView to multiple brokers for seamless automated trading 
              with our professional-grade platform.
            </p>
          </div>

          {/* Links Columns */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-white font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-slate-400 hover:text-white text-sm transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-slate-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-slate-500 text-sm">
              © {currentYear} TradingView Bridge. All rights reserved.
            </div>

            {/* Security Badges */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-slate-500 text-xs">
                <div className="w-4 h-4 bg-green-500/20 rounded border border-green-500/30 flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-500 rounded"></div>
                </div>
                <span>SOC 2 Compliant</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-500 text-xs">
                <div className="w-4 h-4 bg-blue-500/20 rounded border border-blue-500/30 flex items-center justify-center">
                  <div className="w-2 h-2 bg-blue-500 rounded"></div>
                </div>
                <span>ISO 27001</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-500 text-xs">
                <div className="w-4 h-4 bg-violet-500/20 rounded border border-violet-500/30 flex items-center justify-center">
                  <div className="w-2 h-2 bg-violet-500 rounded"></div>
                </div>
                <span>Enterprise Security</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}