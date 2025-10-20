import React from 'react';

interface MarginCardProps {
  title: string;
  value: string;
  color: string;
  bgColor: string;
}

const MarginCard: React.FC<MarginCardProps> = ({ title, value, color, bgColor }) => {
  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.8)',
      backdropFilter: 'blur(20px)',
      borderRadius: '1.5rem',
      padding: '2rem',
      border: '1px solid rgba(148, 163, 184, 0.1)',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = `0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px ${color}20`;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
    }}>
      {/* Top gradient line */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: `linear-gradient(90deg, ${color} 0%, ${color}80 100%)`
      }}></div>
      
      {/* Content */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem'
      }}>
        <h3 style={{
          color: '#F1F5F9',
          fontSize: '0.875rem',
          fontWeight: '600',
          margin: 0,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          opacity: 0.8
        }}>
          {title}
        </h3>
        <div style={{
          width: '32px',
          height: '32px',
          background: `${color}20`,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.875rem'
        }}>
          {title.includes('Balance') ? '💰' : 
           title.includes('Collateral') ? '🏦' : 
           title.includes('Unrealized') ? '📈' : 
           title.includes('Realized') ? '💵' : '📊'}
        </div>
      </div>
      
      <div style={{
        fontSize: '2.25rem',
        fontWeight: '700',
        color: color,
        marginBottom: '0.5rem',
        fontFamily: 'monospace'
      }}>
        ₹{value}
      </div>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          background: color,
          borderRadius: '50%',
          opacity: 0.6
        }}></div>
        <span style={{
          color: '#94A3B8',
          fontSize: '0.75rem',
          fontWeight: '500'
        }}>
          Live data
        </span>
      </div>
    </div>
  );
};

export default MarginCard;