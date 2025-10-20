import React from 'react';
import Card from './Card';
import Button from './Button';

interface PricingCardProps {
  title: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  buttonText: string;
  buttonLink: string;
}

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  period,
  description,
  features,
  popular = false,
  buttonText,
  buttonLink
}) => {
  return (
    <div style={{ position: 'relative' }}>
      {popular && (
        <div style={{
          position: 'absolute',
          top: '-12px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'linear-gradient(45deg, #8b5cf6, #06b6d4)',
          color: 'white',
          padding: '6px 20px',
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: 'bold',
          zIndex: 10
        }}>
          Most Popular
        </div>
      )}
      
      <Card hover={true} gradient={popular}>
        <div style={{
          border: popular ? '2px solid #8b5cf6' : '1px solid #334155',
          borderRadius: '12px',
          padding: '32px',
          background: popular ? 'rgba(139, 92, 246, 0.05)' : 'transparent'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h3 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '8px'
            }}>
              {title}
            </h3>
            
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'center',
              gap: '4px',
              marginBottom: '8px'
            }}>
              <span style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: popular ? '#8b5cf6' : 'white'
              }}>
                {price}
              </span>
              <span style={{
                fontSize: '16px',
                color: '#94a3b8'
              }}>
                {period}
              </span>
            </div>
            
            <p style={{
              color: '#94a3b8',
              fontSize: '16px'
            }}>
              {description}
            </p>
          </div>
          
          <div style={{ marginBottom: '32px' }}>
            {features.map((feature, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '12px'
              }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #10b981, #059669)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px'
                }}>
                  ✓
                </div>
                <span style={{ color: '#e2e8f0', fontSize: '15px' }}>
                  {feature}
                </span>
              </div>
            ))}
          </div>
          
          <div style={{ width: '100%' }}>
            <Button 
              to={buttonLink} 
              variant={popular ? 'primary' : 'secondary'}
            >
              {buttonText}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PricingCard;
