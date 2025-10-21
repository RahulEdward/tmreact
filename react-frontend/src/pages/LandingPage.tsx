import { FC } from 'react';
import { TrendingUp, Shield, Zap, Brain, BarChart3, Users, ArrowRight, CheckCircle, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage: FC = () => {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Navigation */}
      <nav className="relative z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">TradingMaven</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-slate-300 hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="text-slate-300 hover:text-white transition-colors">Pricing</a>
              <Link to="/login" className="text-slate-300 hover:text-white transition-colors">Login</Link>
              <Link to="/register" className="px-6 py-2 rounded-lg bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-semibold hover:opacity-90 transition-opacity">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-20 pb-32 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-8">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-sm text-violet-300">AI-Powered Trading Platform</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Trade Smarter with
            <br />
            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              AI Technology
            </span>
          </h1>
          
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            Join 250,000+ traders using advanced AI algorithms for smarter decisions. 
            Lightning-fast execution, bank-grade security.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link 
              to="/register"
              className="px-8 py-4 rounded-lg bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              Start Trading Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="px-8 py-4 rounded-lg bg-slate-800 text-white font-semibold hover:bg-slate-700 transition-colors">
              Watch Demo
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
              <div className="w-12 h-12 rounded-lg bg-violet-500/10 flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-violet-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">250K+</div>
              <div className="text-slate-400">Active Traders</div>
            </div>
            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">$15B+</div>
              <div className="text-slate-400">Daily Volume</div>
            </div>
            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
              <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-orange-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">99.9%</div>
              <div className="text-slate-400">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why Choose TradingMaven?
            </h2>
            <p className="text-xl text-slate-400">
              Advanced technology meets intuitive design
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-xl bg-slate-900 border border-slate-800 hover:border-violet-500/50 transition-colors">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center mb-6">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">AI-Powered Analytics</h3>
              <p className="text-slate-400 mb-6">
                Advanced machine learning algorithms analyze market patterns in real-time with 97% accuracy.
              </p>
              <div className="flex gap-2">
                <span className="px-3 py-1 rounded-full bg-violet-500/10 text-violet-300 text-sm">97% Accuracy</span>
                <span className="px-3 py-1 rounded-full bg-fuchsia-500/10 text-fuchsia-300 text-sm">Real-time</span>
              </div>
            </div>

            <div className="p-8 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition-colors">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Lightning Execution</h3>
              <p className="text-slate-400 mb-6">
                Ultra-low latency infrastructure ensures your orders execute in microseconds.
              </p>
              <div className="flex gap-2">
                <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 text-sm">0.1ms Latency</span>
                <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-sm">Global</span>
              </div>
            </div>

            <div className="p-8 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-colors">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Bank-Grade Security</h3>
              <p className="text-slate-400 mb-6">
                Military-grade encryption and multi-layer security protocols protect your assets 24/7.
              </p>
              <div className="flex gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-sm">256-bit SSL</span>
                <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-300 text-sm">SOC 2</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-slate-400">
              Choose the plan that fits your needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Starter */}
            <div className="p-8 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-center mb-8">
                <div className="text-3xl font-bold text-white mb-2">$39</div>
                <div className="text-slate-400">per month</div>
              </div>
              <h3 className="text-xl font-bold text-white mb-6">Starter</h3>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-slate-300">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  Real-time market data
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  Basic AI analytics
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  Mobile app access
                </li>
              </ul>
              <Link to="/register" className="block w-full py-3 rounded-lg bg-slate-800 text-white text-center font-semibold hover:bg-slate-700 transition-colors">
                Get Started
              </Link>
            </div>

            {/* Professional */}
            <div className="p-8 rounded-xl bg-slate-900 border-2 border-violet-500 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 text-white text-sm font-semibold">
                Most Popular
              </div>
              <div className="text-center mb-8">
                <div className="text-3xl font-bold text-white mb-2">$99</div>
                <div className="text-slate-400">per month</div>
              </div>
              <h3 className="text-xl font-bold text-white mb-6">Professional</h3>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-slate-300">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  Everything in Starter
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  Advanced AI predictions
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  Unlimited trades
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  Priority support
                </li>
              </ul>
              <Link to="/register" className="block w-full py-3 rounded-lg bg-gradient-to-r from-violet-500 to-cyan-500 text-white text-center font-semibold hover:opacity-90 transition-opacity">
                Get Started
              </Link>
            </div>

            {/* Enterprise */}
            <div className="p-8 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-center mb-8">
                <div className="text-3xl font-bold text-white mb-2">$249</div>
                <div className="text-slate-400">per month</div>
              </div>
              <h3 className="text-xl font-bold text-white mb-6">Enterprise</h3>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-slate-300">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  Everything in Professional
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  White-label solution
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  API access
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  Dedicated support
                </li>
              </ul>
              <Link to="/register" className="block w-full py-3 rounded-lg bg-slate-800 text-white text-center font-semibold hover:bg-slate-700 transition-colors">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-slate-900 border-t border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-violet-500 to-cyan-500 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-white">TradingMaven</span>
              </div>
              <p className="text-slate-400 text-sm">
                The future of trading technology
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Platform</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#features">Features</a></li>
                <li><a href="#pricing">Pricing</a></li>
                <li><a href="/api">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="/about">About</a></li>
                <li><a href="/careers">Careers</a></li>
                <li><a href="/blog">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="/help">Help Center</a></li>
                <li><a href="/contact">Contact</a></li>
                <li><a href="/status">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-slate-400 text-sm">
              © 2024 TradingMaven. All rights reserved.
            </div>
            <div className="flex gap-4 text-slate-400 text-sm">
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                SOC 2 Certified
              </span>
              <span className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                ISO 27001
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating CTA */}
      <Link
        to="/register"
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
      >
        <ArrowRight className="w-6 h-6 text-white" />
      </Link>
    </div>
  );
};

export default LandingPage;
