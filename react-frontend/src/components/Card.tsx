import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', hover = false, gradient = false }) => {
  const baseStyle = {
    backgroundColor: gradient ? 'transparent' : '#1e293b',
    background: gradient ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(6, 182, 212, 0.1))' : '#1e293b',
    border: '1px solid #334155',
    borderRadius: '12px',
    padding: '30px',
    transition: 'all 0.3s ease',
    position: 'relative' as const,
    overflow: 'hidden'
  };

  const hoverStyle = hover ? {
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
      borderColor: '#8b5cf6'
    }
  } : {};

  return (
    <div 
      style={baseStyle} 
      className={className}
      onMouseEnter={(e) => {
        if (hover) {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
          e.currentTarget.style.borderColor = '#8b5cf6';
        }
      }}
      onMouseLeave={(e) => {
        if (hover) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.borderColor = '#334155';
        }
      }}
    >
      {children}
    </div>
  );
};

export default Card;
