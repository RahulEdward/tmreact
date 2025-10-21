import React from 'react';
import Card from './Card';

interface StatCardProps {
  icon: string;
  value: string;
  label: string;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label, color = '#8b5cf6' }) => {
  return (
    <Card hover={true}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '60px',
          height: '60px',
          background: `linear-gradient(45deg, ${color}, #06b6d4)`,
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          margin: '0 auto 20px',
          boxShadow: `0 8px 25px ${color}40`
        }}>
          {icon}
        </div>
        <div style={{
          fontSize: '42px',
          fontWeight: 'bold',
          color: 'white',
          marginBottom: '8px',
          background: `linear-gradient(45deg, ${color}, #06b6d4)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          {value}
        </div>
        <div style={{ color: '#94a3b8', fontSize: '16px', fontWeight: '500' }}>
          {label}
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
