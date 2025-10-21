import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import RealtimeUpdates from './RealtimeUpdates';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { logout } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/dashboard', icon: 'D', label: 'Dashboard' },
    { path: '/orderbook', icon: 'O', label: 'Order Book' },
    { path: '/tradebook', icon: 'T', label: 'Trade Book' },
    { path: '/positions', icon: 'P', label: 'Positions' },
    { path: '/holdings', icon: 'H', label: 'Holdings' },
    { path: '/tradingview', icon: 'V', label: 'TradingView' },
    { path: '/search', icon: 'S', label: 'Search' },
    { path: '/logs', icon: 'L', label: 'Logs' },
    { path: '/apikey', icon: 'K', label: 'API Key' }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000000',
      backgroundImage: `
        radial-gradient(at 20% 50%, rgba(16, 185, 129, 0.05) 0px, transparent 50%),
        radial-gradient(at 80% 20%, rgba(245, 158, 11, 0.05) 0px, transparent 50%),
        radial-gradient(at 40% 40%, rgba(34, 197, 94, 0.05) 0px, transparent 50%)
      `,
      color: '#ffffff',
      display: 'flex',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Real-time Updates */}
      <RealtimeUpdates />
      
      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? '280px' : '80px',
        background: 'linear-gradient(180deg, #0a0a0a 0%, #111111 50%, #0a0a0a 100%)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '4px 0 24px rgba(0, 0, 0, 0.5)',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'fixed',
        height: '100vh',
        zIndex: 40,
        overflow: 'hidden'
      }}>
        {/* Logo */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem',
            fontWeight: 'bold',
            color: 'white',
            flexShrink: 0
          }}>
            SA
          </div>
          {sidebarOpen && (
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '1.1rem',
                fontWeight: '600',
                color: '#F1F5F9'
              }}>
                SQUER ALGO
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#94A3B8'
              }}>
                Algorithmic Trading
              </div>
            </div>
          )}
          
          {/* Toggle Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              width: sidebarOpen ? '32px' : '32px',
              height: '32px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '0.5rem',
              color: '#10B981',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.875rem',
              fontWeight: '500',
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(16, 185, 129, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(16, 185, 129, 0.15)';
            }}
            title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <span style={{ fontWeight: 'bold' }}>{sidebarOpen ? '◀' : '▶'}</span>
          </button>
        </div>

        {/* Navigation */}
        <div style={{ padding: '1rem 0', flex: 1, overflowY: 'auto' }}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem 1.5rem',
                margin: '0.5rem 1rem',
                borderRadius: '0.75rem',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                background: isActiveRoute(item.path) ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                color: isActiveRoute(item.path) ? '#10B981' : '#E2E8F0',
                border: isActiveRoute(item.path) ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid transparent',
                fontSize: '0.95rem',
                fontWeight: '500'
              }}
              onMouseEnter={(e) => {
                if (!isActiveRoute(item.path)) {
                  e.currentTarget.style.background = 'rgba(148, 163, 184, 0.1)';
                  e.currentTarget.style.color = '#FFFFFF';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActiveRoute(item.path)) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#E2E8F0';
                  e.currentTarget.style.transform = 'translateX(0)';
                }
              }}
            >
              <span style={{ 
                fontSize: '1.2rem', 
                flexShrink: 0,
                fontWeight: 'bold',
                fontFamily: 'monospace',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '24px',
                height: '24px',
                borderRadius: '4px',
                background: isActiveRoute(item.path) ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                border: isActiveRoute(item.path) ? '1px solid rgba(16, 185, 129, 0.5)' : '1px solid transparent'
              }}>{item.icon}</span>
              {sidebarOpen && (
                <span style={{ fontSize: '0.95rem', fontWeight: '500' }}>
                  {item.label}
                </span>
              )}
            </Link>
          ))}
        </div>

        {/* Bottom Section */}
        <div style={{
          padding: '1rem',
          borderTop: '1px solid rgba(148, 163, 184, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              height: '48px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '0.75rem',
              color: '#EF4444',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: sidebarOpen ? 'flex-start' : 'center',
              gap: '0.75rem',
              fontSize: '0.95rem',
              fontWeight: '500',
              transition: 'all 0.2s ease',
              padding: sidebarOpen ? '0 1rem' : '0'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>X</span>
            {sidebarOpen && <span>Logout</span>}
          </button>

        </div>
      </div>
      
      {/* Main Content */}
      <div style={{
        flex: 1,
        marginLeft: sidebarOpen ? '280px' : '80px',
        transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        minHeight: '100vh',
        position: 'relative'
      }}>
        <div style={{
          padding: '2rem',
          background: 'transparent',
          transition: 'all 0.3s ease'
        }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;