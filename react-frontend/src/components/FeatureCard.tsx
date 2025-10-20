import React from 'react';
import Card from './Card';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  badges: Array<{ text: string; color: string }>;
  gradient?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  icon, 
  title, 
  description, 
  badges, 
  gradient = 'linear-gradient(45deg, #8b5cf6, #06b6d4)' 
}) => {
  return (
    <Card hover={true} gradient={true}>
      <div style={{
        width: '70px',
        height: '70px',
        background: gradient,
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '32px',
        marginBottom: '24px',
        boxShadow: '0 10px 30px rgba(139, 92, 246, 0.3)'
      }}>
        {icon}
      </div>
      
      <h3 style={{
        fontSize: '28px',
        fontWeight: 'bold',
        color: 'white',
        marginBottom: '16px',
        lineHeight: '1.2'
      }}>
        {title}
      </h3>
      
      <p style={{
        color: '#94a3b8',
        fontSize: '16px',
        lineHeight: '1.6',
        marginBottom: '24px'
      }}>
        {description}
      </p>
      
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {badges.map((badge, index) => (
          <span
            key={index}
            style={{
              padding: '6px 14px',
              backgroundColor: `${badge.color}20`,
              color: badge.color,
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: '600',
              border: `1px solid ${badge.color}40`
            }}
          >
            {badge.text}
          </span>
        ))}
      </div>
    </Card>
  );
};

export default FeatureCard;
