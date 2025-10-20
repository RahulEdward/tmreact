import React from 'react';
import Card from './Card';

interface BrokerCardProps {
  name: string;
  logo: string;
  status: 'connected' | 'available' | 'coming-soon';
  features: string[];
}

const BrokerCard: React.FC<BrokerCardProps> = ({ name, logo, status, features }) => {
  const statusColors = {
    connected: { bg: '#10b981', text: 'Connected' },
    available: { bg: '#3b82f6', text: 'Available' },
    'coming-soon': { bg: '#6b7280', text: 'Coming Soon' }
  };

  return (
    <Card hover={true}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '80px',
          height: '80px',
          background: 'linear-gradient(45deg, #1e293b, #334155)',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '32px',
          margin: '0 auto 16px',
          border: '2px solid #334155'
        }}>
          {logo}
        </div>
        
        <h3 style={{
          fontSize: '20px',
          fontWeight: 'bold',
          color: 'white',
          marginBottom: '8px'
        }}>
          {name}
        </h3>
        
        <div style={{
          display: 'inline-block',
          padding: '4px 12px',
          backgroundColor: `${statusColors[status].bg}20`,
          color: statusColors[status].bg,
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: '600',
          marginBottom: '16px',
          border: `1px solid ${statusColors[status].bg}40`
        }}>
          {statusColors[status].text}
        </div>
        
        <div style={{ textAlign: 'left' }}>
          {features.map((feature, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '8px',
              fontSize: '14px',
              color: '#94a3b8'
            }}>
              <div style={{
                width: '6px',
                height: '6px',
                backgroundColor: statusColors[status].bg,
                borderRadius: '50%'
              }} />
              {feature}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default BrokerCard;
