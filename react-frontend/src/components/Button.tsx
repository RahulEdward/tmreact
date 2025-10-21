import React from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  to?: string;
  href?: string;
  onClick?: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  to, 
  href, 
  onClick,
  className = ''
}) => {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    gap: '8px'
  };

  const variants = {
    primary: {
      background: 'linear-gradient(45deg, #8b5cf6, #06b6d4)',
      color: 'white',
      boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)'
    },
    secondary: {
      backgroundColor: '#1e293b',
      color: 'white',
      border: '1px solid #334155'
    },
    outline: {
      backgroundColor: 'transparent',
      color: '#cbd5e1',
      border: '1px solid #334155'
    }
  };

  const sizes = {
    sm: { padding: '8px 16px', fontSize: '14px' },
    md: { padding: '12px 24px', fontSize: '16px' },
    lg: { padding: '16px 32px', fontSize: '18px' }
  };

  const buttonStyle = {
    ...baseStyles,
    ...variants[variant],
    ...sizes[size]
  };

  if (to) {
    return (
      <Link to={to} style={buttonStyle} className={className}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} style={buttonStyle} className={className}>
        {children}
      </a>
    );
  }

  return (
    <button style={buttonStyle} onClick={onClick} className={className}>
      {children}
    </button>
  );
};

export default Button;
