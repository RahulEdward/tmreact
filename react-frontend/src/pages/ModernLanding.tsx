import React from 'react';
import Button from '../components/Button';
import StatCard from '../components/StatCard';
import FeatureCard from '../components/FeatureCard';
import BrokerCard from '../components/BrokerCard';
import PricingCard from '../components/PricingCard';
import AnimatedBackground from '../components/AnimatedBackground';

const ModernLanding: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f172a',
      color: 'white',
      fontFamily: 'Inter, Arial, sans-serif',
      position: 'relative'
    }}>
      <AnimatedBackground />
      
      {/* Navigation */}
      <nav style={{
        position: 'relative',
        zIndex: 50,
        padding: '20px',
        backdropFilter: 'blur(20px)',
        backgroundColor: 'rgba(15, 23, 42, 0.8)',
        borderBottom: '1px solid rgba(51, 65, 85, 0.3)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(45deg, #8b5cf6, #06b6d4)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              boxShadow: '0 8px 25px rgba(139, 92, 246, 0.3)'
            }}>
              🌉
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>TradingMaven</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Trading Bridge Platform</div>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            <a href="#features" style={{ color: '#cbd5e1', textDecoration: 'none', fontWeight: '500' }}>Features</a>
            <a href="#brokers" style={{ color: '#cbd5e1', textDecoration: 'none', fontWeight: '500' }}>Brokers</a>
            <a href="#pricing" style={{ color: '#cbd5e1', textDecoration: 'none', fontWeight: '500' }}>Pricing</a>
            <Button to="/login" variant="outline" size="sm">Login</Button>
            <Button to="/register" variant="primary" size="sm">Start Free Trial</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        position: 'relative',
        zIndex: 10,
        padding: '100px 20px',
        textAlign: 'center',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'inline-block',
          padding: '8px 20px',
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          borderRadius: '25px',
          marginBottom: '32px',
          fontSize: '14px',
          fontWeight: '600'
        }}>
          🚀 Multi-Broker Trading Bridge • Connect Any Broker
        </div>
        
        <h1 style={{
          fontSize: '72px',
          fontWeight: 'bold',
          marginBottom: '32px',
          lineHeight: '1.1',
          background: 'linear-gradient(45deg, #ffffff, #8b5cf6, #06b6d4)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Universal Trading<br />
          <span style={{ color: '#8b5cf6' }}>Bridge Platform</span>
        </h1>
        
        <p style={{
          fontSize: '24px',
          color: '#94a3b8',
          marginBottom: '48px',
          maxWidth: '700px',
          margin: '0 auto 48px',
          lineHeight: '1.6'
        }}>
          Connect multiple brokers, execute trades across platforms, and manage your entire portfolio 
          from one powerful dashboard. Built for professional traders.
        </p>
        
        <div style={{
          display: 'flex',
          gap: '24px',
          justifyContent: 'center',
          marginBottom: '80px',
          flexWrap: 'wrap'
        }}>
          <Button to="/register" variant="primary" size="lg">
            Start 14-Day Free Trial →
          </Button>
          <Button variant="secondary" size="lg">
            Watch Demo
          </Button>
          <Button variant="outline" size="lg">
            View API Docs
          </Button>
        </div>

        {/* Enhanced Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '32px',
          maxWidth: '1000px',
          margin: '0 auto'
        }}>
          <StatCard icon="🏢" value="50+" label="Supported Brokers" color="#8b5cf6" />
          <StatCard icon="⚡" value="0.1ms" label="Execution Speed" color="#06b6d4" />
          <StatCard icon="💰" value="$50B+" label="Volume Processed" color="#10b981" />
          <StatCard icon="🌍" value="180+" label="Countries" color="#f59e0b" />
        </div>
      </section>

      {/* Broker Integration Section */}
      <section id="brokers" style={{
        position: 'relative',
        zIndex: 10,
        padding: '100px 20px',
        backgroundColor: 'rgba(30, 41, 59, 0.3)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h2 style={{
              fontSize: '56px',
              fontWeight: 'bold',
              marginBottom: '24px',
              background: 'linear-gradient(45deg, #ffffff, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Connect Any Broker
            </h2>
            <p style={{ fontSize: '20px', color: '#94a3b8', maxWidth: '600px', margin: '0 auto' }}>
              Seamlessly integrate with 50+ brokers worldwide. Trade stocks, forex, crypto, and derivatives 
              from a single platform.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '32px'
          }}>
            <BrokerCard
              name="Interactive Brokers"
              logo="🏦"
              status="connected"
              features={['Stocks & Options', 'Global Markets', 'Low Fees']}
            />
            <BrokerCard
              name="TD Ameritrade"
              logo="📈"
              status="connected"
              features={['US Markets', 'Options Trading', 'Research Tools']}
            />
            <BrokerCard
              name="Binance"
              logo="₿"
              status="available"
              features={['Crypto Trading', 'Futures', 'Spot Markets']}
            />
            <BrokerCard
              name="MetaTrader 5"
              logo="📊"
              status="available"
              features={['Forex Trading', 'CFDs', 'Expert Advisors']}
            />
            <BrokerCard
              name="Coinbase Pro"
              logo="🪙"
              status="coming-soon"
              features={['Crypto Exchange', 'Advanced Trading', 'API Access']}
            />
            <BrokerCard
              name="Robinhood"
              logo="🤖"
              status="coming-soon"
              features={['Commission-Free', 'Mobile First', 'Crypto Support']}
            />
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section id="features" style={{
        position: 'relative',
        zIndex: 10,
        padding: '100px 20px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h2 style={{
              fontSize: '56px',
              fontWeight: 'bold',
              marginBottom: '24px'
            }}>
              Professional Trading Tools
            </h2>
            <p style={{ fontSize: '20px', color: '#94a3b8' }}>
              Everything you need to trade like a pro
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
            gap: '40px'
          }}>
            <FeatureCard
              icon="🤖"
              title="AI-Powered Analytics"
              description="Advanced machine learning algorithms analyze market patterns, sentiment, and technical indicators to provide actionable insights."
              badges={[
                { text: '97% Accuracy', color: '#a78bfa' },
                { text: 'Real-time', color: '#67e8f9' },
                { text: 'Multi-Asset', color: '#6ee7b7' }
              ]}
              gradient="linear-gradient(45deg, #8b5cf6, #ec4899)"
            />
            
            <FeatureCard
              icon="⚡"
              title="Ultra-Fast Execution"
              description="Sub-millisecond order execution with smart routing across multiple venues for best price discovery and minimal slippage."
              badges={[
                { text: '0.1ms Latency', color: '#93c5fd' },
                { text: 'Smart Routing', color: '#67e8f9' },
                { text: 'Best Execution', color: '#86efac' }
              ]}
              gradient="linear-gradient(45deg, #3b82f6, #06b6d4)"
            />
            
            <FeatureCard
              icon="🛡️"
              title="Enterprise Security"
              description="Bank-grade security with multi-factor authentication, encrypted communications, and cold storage for digital assets."
              badges={[
                { text: '256-bit SSL', color: '#6ee7b7' },
                { text: 'SOC 2 Type II', color: '#86efac' },
                { text: 'Cold Storage', color: '#fbbf24' }
              ]}
              gradient="linear-gradient(45deg, #10b981, #059669)"
            />
            
            <FeatureCard
              icon="📊"
              title="Advanced Analytics"
              description="Comprehensive portfolio analytics, risk management tools, and performance attribution across all connected accounts."
              badges={[
                { text: 'Risk Analytics', color: '#f87171' },
                { text: 'Performance', color: '#fbbf24' },
                { text: 'Attribution', color: '#a78bfa' }
              ]}
              gradient="linear-gradient(45deg, #f59e0b, #d97706)"
            />
            
            <FeatureCard
              icon="🔗"
              title="API Integration"
              description="Robust REST and WebSocket APIs for algorithmic trading, custom integrations, and third-party application development."
              badges={[
                { text: 'REST API', color: '#67e8f9' },
                { text: 'WebSocket', color: '#93c5fd' },
                { text: 'SDKs', color: '#a78bfa' }
              ]}
              gradient="linear-gradient(45deg, #06b6d4, #0891b2)"
            />
            
            <FeatureCard
              icon="📱"
              title="Mobile Trading"
              description="Full-featured mobile apps for iOS and Android with offline capabilities and push notifications for market events."
              badges={[
                { text: 'iOS & Android', color: '#86efac' },
                { text: 'Offline Mode', color: '#fbbf24' },
                { text: 'Push Alerts', color: '#f87171' }
              ]}
              gradient="linear-gradient(45deg, #10b981, #06b6d4)"
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" style={{
        position: 'relative',
        zIndex: 10,
        padding: '100px 20px',
        backgroundColor: 'rgba(30, 41, 59, 0.3)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h2 style={{
              fontSize: '56px',
              fontWeight: 'bold',
              marginBottom: '24px'
            }}>
              Choose Your Plan
            </h2>
            <p style={{ fontSize: '20px', color: '#94a3b8' }}>
              Flexible pricing for traders of all sizes
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '32px',
            maxWidth: '1000px',
            margin: '0 auto'
          }}>
            <PricingCard
              title="Starter"
              price="$49"
              period="/month"
              description="Perfect for individual traders"
              features={[
                'Connect up to 3 brokers',
                'Real-time market data',
                'Basic analytics',
                'Mobile app access',
                'Email support'
              ]}
              buttonText="Start Free Trial"
              buttonLink="/register"
            />
            
            <PricingCard
              title="Professional"
              price="$149"
              period="/month"
              description="For serious traders and small teams"
              features={[
                'Connect unlimited brokers',
                'Advanced AI analytics',
                'Risk management tools',
                'API access',
                'Priority support',
                'Custom integrations'
              ]}
              popular={true}
              buttonText="Start Free Trial"
              buttonLink="/register"
            />
            
            <PricingCard
              title="Enterprise"
              price="Custom"
              period=""
              description="For institutions and large teams"
              features={[
                'Everything in Professional',
                'White-label solution',
                'Dedicated infrastructure',
                'Custom development',
                '24/7 phone support',
                'SLA guarantee'
              ]}
              buttonText="Contact Sales"
              buttonLink="/contact"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        position: 'relative',
        zIndex: 10,
        padding: '60px 20px 40px',
        backgroundColor: '#1e293b',
        borderTop: '1px solid #334155'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '40px',
            marginBottom: '40px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(45deg, #8b5cf6, #06b6d4)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px'
                }}>
                  🌉
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '18px' }}>TradingMaven</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Trading Bridge Platform</div>
                </div>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6' }}>
                The most advanced multi-broker trading platform for professional traders and institutions.
              </p>
            </div>
            
            <div>
              <h4 style={{ fontWeight: 'bold', marginBottom: '16px' }}>Platform</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <a href="#features" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px' }}>Features</a>
                <a href="#brokers" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px' }}>Supported Brokers</a>
                <a href="#pricing" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px' }}>Pricing</a>
                <a href="/api" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px' }}>API Documentation</a>
              </div>
            </div>
            
            <div>
              <h4 style={{ fontWeight: 'bold', marginBottom: '16px' }}>Company</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <a href="/about" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px' }}>About Us</a>
                <a href="/careers" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px' }}>Careers</a>
                <a href="/blog" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px' }}>Blog</a>
                <a href="/contact" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px' }}>Contact</a>
              </div>
            </div>
            
            <div>
              <h4 style={{ fontWeight: 'bold', marginBottom: '16px' }}>Support</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <a href="/help" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px' }}>Help Center</a>
                <a href="/status" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px' }}>System Status</a>
                <a href="/security" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px' }}>Security</a>
                <a href="/privacy" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px' }}>Privacy Policy</a>
              </div>
            </div>
          </div>
          
          <div style={{
            paddingTop: '32px',
            borderTop: '1px solid #334155',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div style={{ color: '#64748b', fontSize: '14px' }}>
              © 2024 TradingMaven. All rights reserved.
            </div>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
              <span style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#10b981',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                🛡️ SOC 2 Certified
              </span>
              <span style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#3b82f6',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                🏆 ISO 27001
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ModernLanding;
