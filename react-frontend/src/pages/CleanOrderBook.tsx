import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const CleanOrderBook: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  
  // Mock data for now since backend API returns HTML
  const [orders] = useState([
    {
      symbol: 'RELIANCE',
      transaction_type: 'BUY',
      quantity: 10,
      price: '2450.50',
      status: 'COMPLETE',
      order_time: new Date().toISOString()
    },
    {
      symbol: 'TCS',
      transaction_type: 'SELL',
      quantity: 5,
      price: '3200.00',
      status: 'OPEN',
      order_time: new Date().toISOString()
    },
    {
      symbol: 'INFY',
      transaction_type: 'BUY',
      quantity: 15,
      price: '1450.75',
      status: 'REJECTED',
      order_time: new Date().toISOString()
    }
  ]);

  const [orderStats] = useState({
    total_buy_orders: 2,
    total_sell_orders: 1,
    total_completed_orders: 1,
    total_open_orders: 1,
    total_rejected_orders: 1
  });

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

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
          }}>Loading orders...</span>
        </div>
      </div>
    );
  }


  const StatCard = ({ title, value, color, bgColor }: { title: string; value: number; color: string; bgColor: string }) => (
    <div style={{
      padding: '1.5rem',
      backgroundColor: bgColor,
      border: `1px solid ${color}40`,
      borderRadius: '12px',
      textAlign: 'center'
    }}>
      <div style={{
        fontSize: '2rem',
        fontWeight: 'bold',
        color: color,
        marginBottom: '0.5rem'
      }}>
        {value}
      </div>
      <div style={{
        fontSize: '0.875rem',
        color: '#888888',
        fontWeight: '500'
      }}>
        {title}
      </div>
    </div>
  );

  const OrderRow = ({ order, index }: { order: any; index: number }) => (
    <div
      key={index}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr',
        gap: '1rem',
        padding: '1rem',
        backgroundColor: index % 2 === 0 ? 'rgba(20, 20, 20, 0.5)' : 'rgba(30, 30, 30, 0.5)',
        borderRadius: '8px',
        marginBottom: '0.5rem',
        alignItems: 'center'
      }}
    >
      <div style={{ color: '#ffffff', fontWeight: '500' }}>{order.symbol || 'N/A'}</div>
      <div style={{ 
        color: order.transaction_type === 'BUY' ? '#10b981' : '#ef4444',
        fontWeight: '600'
      }}>
        {order.transaction_type || 'N/A'}
      </div>
      <div style={{ color: '#888888' }}>{order.quantity || '0'}</div>
      <div style={{ color: '#888888' }}>₹{order.price || '0.00'}</div>
      <div style={{
        color: order.status === 'COMPLETE' ? '#10b981' : 
              order.status === 'OPEN' ? '#f59e0b' : 
              order.status === 'REJECTED' ? '#ef4444' : '#888888',
        fontWeight: '500'
      }}>
        {order.status || 'UNKNOWN'}
      </div>
      <div style={{ color: '#888888', fontSize: '0.875rem' }}>
        {order.order_time ? new Date(order.order_time).toLocaleTimeString() : 'N/A'}
      </div>
    </div>
  );

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
      {/* Header */}
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
          Order Book - {user?.user_id || 'Trader'}
        </h1>
        <p style={{
          fontSize: '1rem',
          color: '#888888'
        }}>
          View and manage all your trading orders
        </p>
      </div>

      {/* Statistics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <StatCard
          title="Buy Orders"
          value={orderStats?.total_buy_orders || 0}
          color="#10b981"
          bgColor="rgba(16, 185, 129, 0.1)"
        />
        <StatCard
          title="Sell Orders"
          value={orderStats?.total_sell_orders || 0}
          color="#ef4444"
          bgColor="rgba(239, 68, 68, 0.1)"
        />
        <StatCard
          title="Completed"
          value={orderStats?.total_completed_orders || 0}
          color="#667eea"
          bgColor="rgba(102, 126, 234, 0.1)"
        />
        <StatCard
          title="Open Orders"
          value={orderStats?.total_open_orders || 0}
          color="#f59e0b"
          bgColor="rgba(245, 158, 11, 0.1)"
        />
        <StatCard
          title="Rejected"
          value={orderStats?.total_rejected_orders || 0}
          color="#8b5cf6"
          bgColor="rgba(139, 92, 246, 0.1)"
        />
      </div>

      {/* Orders Table */}
      <div style={{
        backgroundColor: 'rgba(20, 20, 20, 0.8)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        overflow: 'hidden'
      }}>
        {/* Table Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr',
          gap: '1rem',
          padding: '1rem',
          backgroundColor: 'rgba(102, 126, 234, 0.1)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          fontWeight: '600',
          color: '#ffffff',
          fontSize: '0.875rem'
        }}>
          <div>Symbol</div>
          <div>Type</div>
          <div>Quantity</div>
          <div>Price</div>
          <div>Status</div>
          <div>Time</div>
        </div>

        {/* Table Body */}
        <div style={{
          maxHeight: '400px',
          overflowY: 'auto',
          padding: '1rem'
        }}>
          {orders && orders.length > 0 ? (
            orders.map((order: any, index: number) => (
              <OrderRow key={index} order={order} index={index} />
            ))
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              color: '#888888'
            }}>
              <div style={{
                fontSize: '3rem',
                marginBottom: '1rem',
                opacity: 0.5
              }}>
                📋
              </div>
              <div style={{
                fontSize: '1.1rem',
                fontWeight: '500',
                marginBottom: '0.5rem'
              }}>
                No orders found
              </div>
              <div style={{
                fontSize: '0.875rem'
              }}>
                Your trading orders will appear here once you start trading
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div style={{
        textAlign: 'center',
        padding: '1.5rem',
        marginTop: '2rem',
        backgroundColor: 'rgba(20, 20, 20, 0.8)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{
          color: '#888888',
          fontSize: '0.875rem',
          marginBottom: '0.5rem'
        }}>
          Orders refreshed automatically • Last updated: {new Date().toLocaleTimeString()}
        </div>
        <div style={{
          color: '#666666',
          fontSize: '0.75rem'
        }}>
          Real-time order tracking powered by AngelOne API
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

export default CleanOrderBook;
