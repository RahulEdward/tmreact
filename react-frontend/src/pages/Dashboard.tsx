import React from 'react';
import { useDashboard } from '../hooks/useDashboard';
import MarginCard from '../components/MarginCard';

const Dashboard: React.FC = () => {
  const { marginData, isLoading, error, refetch } = useDashboard();

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0F172A',
        backgroundImage: `
          radial-gradient(at 47% 33%, hsl(218, 41%, 13%) 0, transparent 59%), 
          radial-gradient(at 82% 65%, hsl(218, 39%, 11%) 0, transparent 55%)
        `,
        padding: '2rem',
        fontFamily: 'Inter, sans-serif'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#3B82F6',
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            SQUER ALGO Trading Dashboard
          </div>
          <div style={{
            backgroundColor: 'rgba(17, 24, 39, 0.8)',
            backdropFilter: 'blur(16px)',
            padding: '2rem',
            borderRadius: '1rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #374151'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem 0'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                border: '2px solid #3B82F6',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              <span style={{
                marginLeft: '1rem',
                color: '#d1d5db',
                fontSize: '1.1rem'
              }}>Loading dashboard data...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0F172A',
        backgroundImage: `
          radial-gradient(at 47% 33%, hsl(218, 41%, 13%) 0, transparent 59%), 
          radial-gradient(at 82% 65%, hsl(218, 39%, 11%) 0, transparent 55%)
        `,
        padding: '2rem',
        fontFamily: 'Inter, sans-serif'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#3B82F6',
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            SQUER ALGO Trading Dashboard
          </div>
          <div style={{
            backgroundColor: 'rgba(17, 24, 39, 0.8)',
            backdropFilter: 'blur(16px)',
            padding: '2rem',
            borderRadius: '1rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #374151'
          }}>
            <div style={{
              textAlign: 'center',
              padding: '2rem 0'
            }}>
              <div style={{
                color: '#f87171',
                marginBottom: '1rem',
                fontSize: '1.1rem'
              }}>
                Error loading dashboard data: {error}
              </div>
              <button
                onClick={refetch}
                style={{
                  background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)',
      backgroundAttachment: 'fixed',
      padding: '2rem 1rem',
      fontFamily: 'Inter, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite',
        zIndex: 0
      }}></div>
      <div style={{
        position: 'absolute',
        top: '60%',
        right: '10%',
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 8s ease-in-out infinite reverse',
        zIndex: 0
      }}></div>

      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Modern Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '3rem'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: 'white',
              boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)'
            }}>
              TM
            </div>
            <div>
              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: '800',
                background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 50%, #10B981 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                margin: 0,
                letterSpacing: '-0.02em'
              }}>
                TradingMaven
              </h1>
              <p style={{
                fontSize: '1.1rem',
                color: '#94A3B8',
                margin: 0,
                fontWeight: '500'
              }}>
                Professional Trading Dashboard
              </p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          <MarginCard
            title="Available Balance"
            value={marginData?.availablecash || '0.00'}
            color="#3B82F6"
            bgColor="rgba(59, 130, 246, 0.05)"
          />
          <MarginCard
            title="Collateral"
            value={marginData?.collateral || '0.00'}
            color="#10B981"
            bgColor="rgba(16, 185, 129, 0.05)"
          />
          <MarginCard
            title="Unrealized PNL"
            value={marginData?.m2munrealized || '0.00'}
            color="#F59E0B"
            bgColor="rgba(245, 158, 11, 0.05)"
          />
          <MarginCard
            title="Realized PNL"
            value={marginData?.m2mrealized || '0.00'}
            color="#EF4444"
            bgColor="rgba(239, 68, 68, 0.05)"
          />
        </div>

        {/* Additional Info Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          background: 'rgba(15, 23, 42, 0.5)',
          backdropFilter: 'blur(10px)',
          borderRadius: '1rem',
          border: '1px solid rgba(148, 163, 184, 0.1)'
        }}>
          <div style={{
            color: '#94A3B8',
            fontSize: '0.875rem',
            marginBottom: '0.5rem'
          }}>
            🔄 Data refreshed automatically • Last updated: {new Date().toLocaleTimeString()}
          </div>
          <div style={{
            color: '#64748B',
            fontSize: '0.75rem'
          }}>
            Powered by AngelOne API • Real-time trading data
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;