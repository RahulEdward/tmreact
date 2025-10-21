import React from 'react';
import Button from '../components/Button';
import { 
  TrendingUpIcon, 
  ShieldIcon, 
  ZapIcon, 
  BrainIcon, 
  DatabaseIcon, 
  NetworkIcon,
  BarChartIcon,
  GlobeIcon,
  CheckIcon,
  ArrowRightIcon,
  UsersIcon
} from '../components/IconComponents';

const EnterpriseLanding: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a0a0a',
      color: '#ffffff',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      position: 'relative'
    }}>
      {/* Subtle grid background */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
        `,
        backgroundSize: '100px 100px',
        zIndex: 0
      }} />

      {/* Navigation */}
      <nav style={{
        position: 'relative',
        zIndex: 50,
        padding: '24px 0',
        backdropFilter: 'blur(20px)',
        backgroundColor: 'rgba(10, 10, 10, 0.95)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <TrendingUpIcon size={24} color="white" />
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '700', letterSpacing: '-0.02em' }}>
                SQUER ALGO
              </div>
              <div style={{ fontSize: '13px', color: '#888888', fontWeight: '500' }}>
                Algorithmic Trading Intelligence
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
            <a href="#platform" style={{ 
              color: '#cccccc', 
              textDecoration: 'none', 
              fontWeight: '500',
              fontSize: '15px',
              transition: 'color 0.2s ease'
            }}>Platform</a>
            <a href="#pricing" style={{ 
              color: '#cccccc', 
              textDecoration: 'none', 
              fontWeight: '500',
              fontSize: '15px'
            }}>Pricing</a>
            <a href="#platform" style={{ 
              color: '#cccccc', 
              textDecoration: 'none', 
              fontWeight: '500',
              fontSize: '15px'
            }}>Features</a>
            <Button to="/login" variant="outline" size="sm">Sign In</Button>
            <Button to="/register" variant="primary" size="sm">Request Demo</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        position: 'relative',
        zIndex: 10,
        padding: '120px 32px 100px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-block',
            padding: '8px 24px',
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
            border: '1px solid rgba(102, 126, 234, 0.2)',
            borderRadius: '6px',
            marginBottom: '40px',
            fontSize: '14px',
            fontWeight: '600',
            color: '#667eea'
          }}>
            Trusted by 500+ Financial Institutions
          </div>
          
          <h1 style={{
            fontSize: '72px',
            fontWeight: '800',
            marginBottom: '32px',
            lineHeight: '1.1',
            letterSpacing: '-0.03em',
            background: 'linear-gradient(135deg, #ffffff 0%, #cccccc 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Next-Generation<br />
            Algorithmic Trading
          </h1>
          
          <p style={{
            fontSize: '22px',
            color: '#999999',
            marginBottom: '48px',
            lineHeight: '1.6',
            fontWeight: '400'
          }}>
            Revolutionary AI-powered trading algorithms with quantum-speed execution, 
            institutional-grade infrastructure, and autonomous portfolio management for elite traders.
          </p>
          
          <div style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            marginBottom: '80px',
            flexWrap: 'wrap'
          }}>
            <Button to="/demo" variant="primary" size="lg">
              Schedule Demo
              <ArrowRightIcon size={20} />
            </Button>
            <Button variant="outline" size="lg">
              View Documentation
            </Button>
          </div>

          {/* Enterprise Stats */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '32px',
            maxWidth: '1000px',
            margin: '0 auto',
            padding: '48px 0',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            flexWrap: 'wrap'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', fontWeight: '700', marginBottom: '8px', color: '#667eea' }}>
                $2.5T+
              </div>
              <div style={{ color: '#888888', fontSize: '15px', fontWeight: '500' }}>
                Annual Volume Processed
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', fontWeight: '700', marginBottom: '8px', color: '#667eea' }}>
                0.08ms
              </div>
              <div style={{ color: '#888888', fontSize: '15px', fontWeight: '500' }}>
                Average Execution Latency
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', fontWeight: '700', marginBottom: '8px', color: '#667eea' }}>
                99.99%
              </div>
              <div style={{ color: '#888888', fontSize: '15px', fontWeight: '500' }}>
                System Uptime SLA
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', fontWeight: '700', marginBottom: '8px', color: '#667eea' }}>
                150+
              </div>
              <div style={{ color: '#888888', fontSize: '15px', fontWeight: '500' }}>
                Global Venues Connected
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Capabilities */}
      <section id="platform" style={{
        position: 'relative',
        zIndex: 10,
        padding: '120px 32px',
        backgroundColor: 'rgba(15, 15, 15, 0.8)'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h2 style={{
              fontSize: '48px',
              fontWeight: '700',
              marginBottom: '24px',
              letterSpacing: '-0.02em'
            }}>
              Built for Scale & Performance
            </h2>
            <p style={{ fontSize: '20px', color: '#999999', maxWidth: '600px', margin: '0 auto' }}>
              Enterprise-grade architecture designed for the most demanding trading environments
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px'
          }}>
            {/* Ultra-Low Latency */}
            <div style={{
              padding: '24px',
              backgroundColor: 'rgba(20, 20, 20, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '8px',
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px'
              }}>
                <ZapIcon size={28} color="#667eea" />
              </div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                marginBottom: '12px',
                color: '#ffffff'
              }}>
                Ultra-Low Latency Execution
              </h3>
              <p style={{
                color: '#999999',
                fontSize: '16px',
                lineHeight: '1.6',
                marginBottom: '24px'
              }}>
                Sub-millisecond order execution with FPGA-accelerated matching engines and 
                direct market access to global venues.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{
                  padding: '4px 12px',
                  backgroundColor: 'rgba(102, 126, 234, 0.1)',
                  color: '#667eea',
                  borderRadius: '4px',
                  fontSize: '13px',
                  fontWeight: '500'
                }}>FPGA Acceleration</span>
                <span style={{
                  padding: '4px 12px',
                  backgroundColor: 'rgba(102, 126, 234, 0.1)',
                  color: '#667eea',
                  borderRadius: '4px',
                  fontSize: '13px',
                  fontWeight: '500'
                }}>Direct Market Access</span>
              </div>
            </div>

            {/* Risk Management */}
            <div style={{
              padding: '40px',
              backgroundColor: 'rgba(20, 20, 20, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px'
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px'
              }}>
                <ShieldIcon size={28} color="#667eea" />
              </div>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '600',
                marginBottom: '16px'
              }}>
                Advanced Risk Management
              </h3>
              <p style={{
                color: '#999999',
                fontSize: '16px',
                lineHeight: '1.6',
                marginBottom: '24px'
              }}>
                Real-time portfolio risk monitoring with customizable limits, stress testing, 
                and automated position management.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{
                  padding: '4px 12px',
                  backgroundColor: 'rgba(102, 126, 234, 0.1)',
                  color: '#667eea',
                  borderRadius: '4px',
                  fontSize: '13px',
                  fontWeight: '500'
                }}>Real-time Monitoring</span>
                <span style={{
                  padding: '4px 12px',
                  backgroundColor: 'rgba(102, 126, 234, 0.1)',
                  color: '#667eea',
                  borderRadius: '4px',
                  fontSize: '13px',
                  fontWeight: '500'
                }}>Stress Testing</span>
              </div>
            </div>

            {/* AI Analytics */}
            <div style={{
              padding: '40px',
              backgroundColor: 'rgba(20, 20, 20, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px'
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px'
              }}>
                <BrainIcon size={28} color="#667eea" />
              </div>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '600',
                marginBottom: '16px'
              }}>
                Institutional AI Analytics
              </h3>
              <p style={{
                color: '#999999',
                fontSize: '16px',
                lineHeight: '1.6',
                marginBottom: '24px'
              }}>
                Machine learning models for market prediction, sentiment analysis, 
                and algorithmic trading strategy optimization.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{
                  padding: '4px 12px',
                  backgroundColor: 'rgba(102, 126, 234, 0.1)',
                  color: '#667eea',
                  borderRadius: '4px',
                  fontSize: '13px',
                  fontWeight: '500'
                }}>ML Prediction</span>
                <span style={{
                  padding: '4px 12px',
                  backgroundColor: 'rgba(102, 126, 234, 0.1)',
                  color: '#667eea',
                  borderRadius: '4px',
                  fontSize: '13px',
                  fontWeight: '500'
                }}>Sentiment Analysis</span>
              </div>
            </div>

            {/* Global Connectivity */}
            <div style={{
              padding: '40px',
              backgroundColor: 'rgba(20, 20, 20, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px'
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px'
              }}>
                <GlobeIcon size={28} color="#667eea" />
              </div>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '600',
                marginBottom: '16px'
              }}>
                Global Market Access
              </h3>
              <p style={{
                color: '#999999',
                fontSize: '16px',
                lineHeight: '1.6',
                marginBottom: '24px'
              }}>
                Connect to 150+ global venues across equities, derivatives, FX, 
                and digital assets with unified API access.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{
                  padding: '4px 12px',
                  backgroundColor: 'rgba(102, 126, 234, 0.1)',
                  color: '#667eea',
                  borderRadius: '4px',
                  fontSize: '13px',
                  fontWeight: '500'
                }}>Multi-Asset</span>
                <span style={{
                  padding: '4px 12px',
                  backgroundColor: 'rgba(102, 126, 234, 0.1)',
                  color: '#667eea',
                  borderRadius: '4px',
                  fontSize: '13px',
                  fontWeight: '500'
                }}>Unified API</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{
        position: 'relative',
        zIndex: 10,
        padding: '120px 32px'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h2 style={{
              fontSize: '48px',
              fontWeight: '700',
              marginBottom: '24px'
            }}>
              Pricing
            </h2>
            <p style={{ fontSize: '20px', color: '#999999' }}>
              Choose the perfect plan for your trading needs
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '32px'
          }}>
            <div style={{
              padding: '48px 32px',
              backgroundColor: 'rgba(15, 15, 15, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <h3 style={{
                fontSize: '28px',
                fontWeight: '600',
                marginBottom: '16px'
              }}>
                Institutional
              </h3>
              <div style={{
                fontSize: '48px',
                fontWeight: '700',
                marginBottom: '8px',
                color: '#667eea'
              }}>
                Custom
              </div>
              <p style={{
                color: '#999999',
                marginBottom: '32px',
                fontSize: '16px'
              }}>
                Enterprise-grade infrastructure with dedicated support
              </p>
              <div style={{ textAlign: 'left', marginBottom: '32px' }}>
                {[
                  'Dedicated infrastructure & co-location',
                  'Custom API development & integration',
                  'White-label platform deployment',
                  '24/7 dedicated support team',
                  'Regulatory compliance assistance',
                  'Custom risk management frameworks'
                ].map((feature, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '12px'
                  }}>
                    <CheckIcon size={16} color="#667eea" />
                    <span style={{ color: '#cccccc', fontSize: '15px' }}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
              <Button to="/contact" variant="primary" style={{ width: '100%' }}>
                Contact Sales
              </Button>
            </div>

            <div style={{
              padding: '48px 32px',
              backgroundColor: 'rgba(15, 15, 15, 0.8)',
              border: '2px solid #667eea',
              borderRadius: '12px',
              textAlign: 'center',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '-12px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#667eea',
                color: 'white',
                padding: '6px 20px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                Most Popular
              </div>
              <h3 style={{
                fontSize: '28px',
                fontWeight: '600',
                marginBottom: '16px'
              }}>
                Professional
              </h3>
              <div style={{
                fontSize: '48px',
                fontWeight: '700',
                marginBottom: '8px',
                color: '#667eea'
              }}>
                $2,500
              </div>
              <p style={{
                color: '#999999',
                marginBottom: '32px',
                fontSize: '16px'
              }}>
                per month • Advanced trading capabilities
              </p>
              <div style={{ textAlign: 'left', marginBottom: '32px' }}>
                {[
                  'Multi-venue connectivity (50+ exchanges)',
                  'Advanced order management system',
                  'Real-time risk monitoring & alerts',
                  'Institutional-grade APIs',
                  'Priority technical support',
                  'Compliance reporting tools'
                ].map((feature, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '12px'
                  }}>
                    <CheckIcon size={16} color="#667eea" />
                    <span style={{ color: '#cccccc', fontSize: '15px' }}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
              <Button to="/register" variant="primary" style={{ width: '100%' }}>
                Start Trial
              </Button>
            </div>

            <div style={{
              padding: '48px 32px',
              backgroundColor: 'rgba(15, 15, 15, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <h3 style={{
                fontSize: '28px',
                fontWeight: '600',
                marginBottom: '16px'
              }}>
                Standard
              </h3>
              <div style={{
                fontSize: '48px',
                fontWeight: '700',
                marginBottom: '8px',
                color: '#667eea'
              }}>
                $500
              </div>
              <p style={{
                color: '#999999',
                marginBottom: '32px',
                fontSize: '16px'
              }}>
                per month • Essential trading features
              </p>
              <div style={{ textAlign: 'left', marginBottom: '32px' }}>
                {[
                  'Connect up to 10 brokers',
                  'Basic order management',
                  'Standard market data feeds',
                  'Email & chat support',
                  'Basic reporting & analytics',
                  'Standard API access'
                ].map((feature, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '12px'
                  }}>
                    <CheckIcon size={16} color="#667eea" />
                    <span style={{ color: '#cccccc', fontSize: '15px' }}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
              <Button to="/register" variant="outline" style={{ width: '100%' }}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        position: 'relative',
        zIndex: 10,
        padding: '80px 32px 40px',
        backgroundColor: 'rgba(5, 5, 5, 0.95)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '48px',
            marginBottom: '48px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <TrendingUpIcon size={20} color="white" />
                </div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '20px' }}>SQUER ALGO</div>
                  <div style={{ fontSize: '12px', color: '#666666' }}>Algorithmic Trading Intelligence</div>
                </div>
              </div>
              <p style={{ color: '#888888', fontSize: '15px', lineHeight: '1.6' }}>
                The world's most advanced institutional trading platform, 
                trusted by leading financial institutions globally.
              </p>
            </div>
            
            <div>
              <h4 style={{ fontWeight: '600', marginBottom: '20px', fontSize: '16px' }}>Platform</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <a href="#platform" style={{ color: '#888888', textDecoration: 'none', fontSize: '15px' }}>Capabilities</a>
                <a href="/api" style={{ color: '#888888', textDecoration: 'none', fontSize: '15px' }}>API Documentation</a>
                <a href="/integrations" style={{ color: '#888888', textDecoration: 'none', fontSize: '15px' }}>Integrations</a>
                <a href="/security" style={{ color: '#888888', textDecoration: 'none', fontSize: '15px' }}>Security</a>
              </div>
            </div>
            
            <div>
              <h4 style={{ fontWeight: '600', marginBottom: '20px', fontSize: '16px' }}>Solutions</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <a href="/institutional" style={{ color: '#888888', textDecoration: 'none', fontSize: '15px' }}>Institutional</a>
                <a href="/hedge-funds" style={{ color: '#888888', textDecoration: 'none', fontSize: '15px' }}>Hedge Funds</a>
                <a href="/prop-trading" style={{ color: '#888888', textDecoration: 'none', fontSize: '15px' }}>Prop Trading</a>
                <a href="/market-makers" style={{ color: '#888888', textDecoration: 'none', fontSize: '15px' }}>Market Makers</a>
              </div>
            </div>
            
            <div>
              <h4 style={{ fontWeight: '600', marginBottom: '20px', fontSize: '16px' }}>Company</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <a href="/about" style={{ color: '#888888', textDecoration: 'none', fontSize: '15px' }}>About</a>
                <a href="/careers" style={{ color: '#888888', textDecoration: 'none', fontSize: '15px' }}>Careers</a>
                <a href="/contact" style={{ color: '#888888', textDecoration: 'none', fontSize: '15px' }}>Contact</a>
                <a href="/compliance" style={{ color: '#888888', textDecoration: 'none', fontSize: '15px' }}>Compliance</a>
              </div>
            </div>
          </div>
          
          <div style={{
            paddingTop: '32px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <div style={{ color: '#666666', fontSize: '14px' }}>
              © 2024 SQUER ALGO Inc. All rights reserved.
            </div>
            <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
              <span style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#667eea',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                <ShieldIcon size={16} />
                SOC 2 Type II Certified
              </span>
              <span style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#667eea',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                <DatabaseIcon size={16} />
                ISO 27001 Compliant
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EnterpriseLanding;
