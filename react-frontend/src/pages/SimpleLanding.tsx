import React from 'react';
import Button from '../components/Button';
import StatCard from '../components/StatCard';
import FeatureCard from '../components/FeatureCard';

const SimpleLanding = () => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f172a',
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Navigation */}
      <nav style={{
        padding: '20px',
        borderBottom: '1px solid #334155',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(45deg, #8b5cf6, #06b6d4)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px'
          }}>📈</div>
          <span style={{ fontSize: '24px', fontWeight: 'bold' }}>TradingMaven</span>
        </div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <a href="#features" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Features</a>
          <a href="#pricing" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Pricing</a>
          <Button to="/login" variant="outline" size="sm">Login</Button>
          <Button to="/register" variant="primary" size="sm">Get Started</Button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        padding: '80px 20px',
        textAlign: 'center',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'inline-block',
          padding: '8px 16px',
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          borderRadius: '20px',
          marginBottom: '30px',
          fontSize: '14px'
        }}>
          🟢 AI-Powered Trading Platform
        </div>
        
        <h1 style={{
          fontSize: '60px',
          fontWeight: 'bold',
          marginBottom: '30px',
          lineHeight: '1.1'
        }}>
          Trade Smarter with<br />
          <span style={{
            background: 'linear-gradient(45deg, #8b5cf6, #06b6d4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>AI Technology</span>
        </h1>
        
        <p style={{
          fontSize: '20px',
          color: '#94a3b8',
          marginBottom: '40px',
          maxWidth: '600px',
          margin: '0 auto 40px'
        }}>
          Join 250,000+ traders using advanced AI algorithms for smarter decisions. 
          Lightning-fast execution, bank-grade security.
        </p>
        
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '60px', flexWrap: 'wrap' }}>
          <Button to="/register" variant="primary" size="lg">
            Start Trading Free →
          </Button>
          <Button variant="secondary" size="lg">
            Watch Demo
          </Button>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '30px',
          maxWidth: '900px',
          margin: '0 auto'
        }}>
          <StatCard 
            icon="👥" 
            value="250K+" 
            label="Active Traders" 
            color="#8b5cf6" 
          />
          <StatCard 
            icon="📊" 
            value="$15B+" 
            label="Daily Volume" 
            color="#06b6d4" 
          />
          <StatCard 
            icon="🛡️" 
            value="99.9%" 
            label="Uptime" 
            color="#10b981" 
          />
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{
        padding: '80px 20px',
        backgroundColor: 'rgba(30, 41, 59, 0.5)',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '20px' }}>
            Why Choose TradingMaven?
          </h2>
          <p style={{ fontSize: '20px', color: '#94a3b8' }}>
            Advanced technology meets intuitive design
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '40px'
        }}>
          <FeatureCard
            icon="🧠"
            title="AI-Powered Analytics"
            description="Advanced machine learning algorithms analyze market patterns in real-time with 97% accuracy."
            badges={[
              { text: '97% Accuracy', color: '#a78bfa' },
              { text: 'Real-time', color: '#67e8f9' }
            ]}
            gradient="linear-gradient(45deg, #8b5cf6, #ec4899)"
          />
          
          <FeatureCard
            icon="⚡"
            title="Lightning Execution"
            description="Ultra-low latency infrastructure ensures your orders execute in microseconds."
            badges={[
              { text: '0.1ms Latency', color: '#93c5fd' },
              { text: 'Global', color: '#67e8f9' }
            ]}
            gradient="linear-gradient(45deg, #3b82f6, #06b6d4)"
          />
          
          <FeatureCard
            icon="🔒"
            title="Bank-Grade Security"
            description="Military-grade encryption and multi-layer security protocols protect your assets 24/7."
            badges={[
              { text: '256-bit SSL', color: '#6ee7b7' },
              { text: 'SOC 2', color: '#86efac' }
            ]}
            gradient="linear-gradient(45deg, #10b981, #059669)"
          />
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '40px 20px',
        backgroundColor: '#1e293b',
        borderTop: '1px solid #334155',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          marginBottom: '20px'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            background: 'linear-gradient(45deg, #8b5cf6, #06b6d4)',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px'
          }}>📈</div>
          <span style={{ fontWeight: 'bold' }}>TradingMaven</span>
        </div>
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>
          © 2024 TradingMaven. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default SimpleLanding;
