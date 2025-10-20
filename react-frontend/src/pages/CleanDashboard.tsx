import React from 'react';
import { useDashboard } from '../hooks/useDashboard';
import { useAuth } from '../contexts/AuthContext';
import MarginCard from '../components/MarginCard';

const CleanDashboard: React.FC = () => {
  const { marginData, isLoading, error, refetch } = useDashboard();
  const { user } = useAuth();

  if (isLoading) {
    return (
      <div style={{
        padding: '2rem',
        minHeight: '100vh',
        backgroundColor: '#0a0a0a'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            border: '2px solid #667eea',
            borderTop: '2px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <span style={{
            marginLeft: '1rem',
            color: '#ffffff',
            fontSize: '1.1rem'
          }}>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: '2rem',
        minHeight: '100vh',
        backgroundColor: '#0a0a0a'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '12px',
          color: '#ffffff'
        }}>
          <div style={{
            color: '#ef4444',
            marginBottom: '1rem',
            fontSize: '1.1rem'
          }}>
            Error loading dashboard: {error}
          </div>
          <button
            onClick={refetch}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              border: 'none',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      padding: '2rem',
      minHeight: '100vh',
      backgroundColor: '#0a0a0a',
      backgroundImage: `
        linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
      `,
      backgroundSize: '100px 100px'
    }}>
      {/* Welcome Message */}
      <div style={{
        marginBottom: '2rem',
        padding: '1.5rem',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        border: '1px solid rgba(102, 126, 234, 0.2)',
        borderRadius: '12px'
      }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: '700',
          color: '#ffffff',
          marginBottom: '0.5rem',
          letterSpacing: '-0.02em'
        }}>
          Welcome back, {user?.user_id || 'Trader'}!
        </h1>
        <p style={{
          fontSize: '1rem',
          color: '#888888',
          marginBottom: '0.5rem'
        }}>
          SQUER ALGO Dashboard • Real-time trading overview and portfolio management
        </p>
        <div style={{
          fontSize: '0.875rem',
          color: '#667eea',
          fontWeight: '500'
        }}>
          Last login: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <MarginCard
          title="Available Balance"
          value={marginData?.availablecash || '0.00'}
          color="#667eea"
          bgColor="rgba(102, 126, 234, 0.1)"
        />
        <MarginCard
          title="Collateral"
          value={marginData?.collateral || '0.00'}
          color="#10b981"
          bgColor="rgba(16, 185, 129, 0.1)"
        />
        <MarginCard
          title="Unrealized PNL"
          value={marginData?.m2munrealized || '0.00'}
          color="#f59e0b"
          bgColor="rgba(245, 158, 11, 0.1)"
        />
        <MarginCard
          title="Realized PNL"
          value={marginData?.m2mrealized || '0.00'}
          color="#ef4444"
          bgColor="rgba(239, 68, 68, 0.1)"
        />
      </div>

      {/* Footer Info */}
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        backgroundColor: 'rgba(20, 20, 20, 0.8)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{
          color: '#888888',
          fontSize: '0.875rem',
          marginBottom: '0.5rem'
        }}>
          Data refreshed automatically • Last updated: {new Date().toLocaleTimeString()}
        </div>
        <div style={{
          color: '#666666',
          fontSize: '0.75rem'
        }}>
          Powered by AngelOne API • Real-time trading data
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default CleanDashboard;
