import { FC } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Mail, 
  Phone, 
  MapPin, 
  Twitter, 
  Linkedin, 
  Github,
  Facebook,
  Instagram,
  ArrowUp,
  Shield,
  Award,
  Globe
} from 'lucide-react';

const LandingFooter: FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerSections = [
    {
      title: "Platform",
      links: [
        { name: "Features", href: "#features" },
        { name: "Pricing", href: "#pricing" },
        { name: "API Documentation", href: "/docs" },
        { name: "Trading Tools", href: "/tools" },
        { name: "Mobile App", href: "/mobile" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Careers", href: "/careers" },
        { name: "Press Kit", href: "/press" },
        { name: "Blog", href: "/blog" },
        { name: "Investors", href: "/investors" }
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", href: "/help" },
        { name: "Contact Support", href: "/support" },
        { name: "Trading Academy", href: "/academy" },
        { name: "Community", href: "/community" },
        { name: "Status Page", href: "/status" }
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
        { name: "Cookie Policy", href: "/cookies" },
        { name: "Compliance", href: "/compliance" },
        { name: "Security", href: "/security" }
      ]
    }
  ];

  const socialLinks = [
    { icon: Twitter, href: "https://twitter.com/tradingmaven", label: "Twitter" },
    { icon: Linkedin, href: "https://linkedin.com/company/tradingmaven", label: "LinkedIn" },
    { icon: Github, href: "https://github.com/tradingmaven", label: "GitHub" },
    { icon: Facebook, href: "https://facebook.com/tradingmaven", label: "Facebook" },
    { icon: Instagram, href: "https://instagram.com/tradingmaven", label: "Instagram" }
  ];

  const certifications = [
    { icon: Shield, text: "SOC 2 Certified" },
    { icon: Award, text: "ISO 27001" },
    { icon: Globe, text: "GDPR Compliant" }
  ];

  return (
    <footer id="contact" className="relative bg-slate-900 border-t border-slate-800">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}></div>
      </div>

      <div className="relative z-10">
        {/* Main footer content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Company info */}
            <div className="lg:col-span-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                {/* Logo */}
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-xl">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    TradingMaven
                  </span>
                </div>

                <p className="text-slate-300 mb-6 leading-relaxed">
                  Empowering traders worldwide with cutting-edge AI technology, 
                  lightning-fast execution, and institutional-grade security. 
                  Join the future of trading today.
                </p>

                {/* Contact info */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3 text-slate-300">
                    <Mail className="w-5 h-5 text-purple-400" />
                    <span>support@tradingmaven.com</span>
                  </div>
                  <div className="flex items-center space-x-3 text-slate-300">
                    <Phone className="w-5 h-5 text-purple-400" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center space-x-3 text-slate-300">
                    <MapPin className="w-5 h-5 text-purple-400" />
                    <span>New York, NY 10001</span>
                  </div>
                </div>

                {/* Social links */}
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      whileHover={{ scale: 1.1 }}
                      viewport={{ once: true }}
                      className="w-10 h-10 bg-slate-800 hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-600 rounded-lg flex items-center justify-center transition-all duration-300"
                      aria-label={social.label}
                    >
                      <social.icon className="w-5 h-5 text-slate-300 hover:text-white" />
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Footer links */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {footerSections.map((section, sectionIndex) => (
                  <motion.div
                    key={section.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: sectionIndex * 0.1, duration: 0.6 }}
                    viewport={{ once: true }}
                  >
                    <h3 className="text-white font-semibold mb-4">{section.title}</h3>
                    <ul className="space-y-3">
                      {section.links.map((link, linkIndex) => (
                        <li key={link.name}>
                          <motion.a
                            href={link.href}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: (sectionIndex * 0.1) + (linkIndex * 0.05), duration: 0.3 }}
                            viewport={{ once: true }}
                            className="text-slate-400 hover:text-purple-400 transition-colors duration-200 text-sm"
                          >
                            {link.name}
                          </motion.a>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Newsletter signup */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mt-16 pt-8 border-t border-slate-800"
          >
            <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">
                Stay Updated with Market Insights
              </h3>
              <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
                Get the latest trading strategies, market analysis, and platform updates 
                delivered directly to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row max-w-md mx-auto space-y-3 sm:space-y-0 sm:space-x-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-colors duration-200"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg"
                >
                  Subscribe
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              {/* Copyright */}
              <div className="text-slate-400 text-sm">
                © 2024 TradingMaven. All rights reserved.
              </div>

              {/* Certifications */}
              <div className="flex items-center space-x-6">
                {certifications.map((cert, index) => (
                  <motion.div
                    key={cert.text}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-2 text-slate-400 text-xs"
                  >
                    <cert.icon className="w-4 h-4" />
                    <span>{cert.text}</span>
                  </motion.div>
                ))}
              </div>

              {/* Scroll to top */}
              <motion.button
                onClick={scrollToTop}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 bg-slate-800 hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-600 rounded-lg flex items-center justify-center transition-all duration-300"
                aria-label="Scroll to top"
              >
                <ArrowUp className="w-5 h-5 text-slate-300 hover:text-white" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
