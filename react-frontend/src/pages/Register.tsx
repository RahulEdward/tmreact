import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface RegisterData {
  username: string;
  user_id: string;
  apikey: string;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterData>({
    username: '',
    user_id: '',
    apikey: ''
  });
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      // Create form data to match Flask's expected format
      const formDataToSend = new FormData();
      formDataToSend.append('username', formData.username);
      formDataToSend.append('user_id', formData.user_id);
      formDataToSend.append('apikey', formData.apikey);

      const response = await api.post('/auth/register', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        const data = response.data;
        
        // Check if we got a JSON response
        if (typeof data === 'object' && data.status) {
          if (data.status === 'success') {
            setSuccess(data.message || 'Registration successful! Please login.');
            setTimeout(() => {
              navigate('/login');
            }, 2000);
          } else {
            setError(data.message || 'Registration failed');
          }
        } else {
          // Fallback for HTML responses
          setSuccess('Registration successful! Please login.');
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        }
      }
    } catch (error: any) {
      setError(error.response?.data?.message || error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a0a0a',
      backgroundImage: `
        linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
      `,
      backgroundSize: '100px 100px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#ffffff',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      <div style={{
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        backdropFilter: 'blur(16px)',
        padding: '2rem',
        borderRadius: '0.5rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        border: '1px solid #374151',
        maxWidth: '400px',
        width: '100%',
        margin: '0 1rem'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: '80px',
            height: '80px',
            margin: '0 auto',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '1rem'
          }}>
            SA
          </div>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '700',
            marginBottom: '8px',
            color: '#ffffff'
          }}>
            SQUER ALGO
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#888888',
            marginBottom: '24px'
          }}>
            Algorithmic Trading Intelligence
          </p>
        </div>
        
        <h2 style={{
          fontSize: '1.875rem',
          fontWeight: 'bold',
          marginBottom: '1.5rem',
          textAlign: 'center',
          color: '#667eea'
        }}>
          Register for SQUER ALGO
        </h2>
        
        {error && (
          <div style={{
            marginBottom: '1rem',
            padding: '0.75rem',
            borderRadius: '0.375rem',
            backgroundColor: 'rgba(220, 38, 38, 0.2)',
            border: '1px solid #dc2626',
            color: '#f87171'
          }}>
            {error}
          </div>
        )}
        
        {success && (
          <div style={{
            marginBottom: '1rem',
            padding: '0.75rem',
            borderRadius: '0.375rem',
            backgroundColor: 'rgba(34, 197, 94, 0.2)',
            border: '1px solid #22c55e',
            color: '#4ade80'
          }}>
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label htmlFor="username" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', marginBottom: '0.5rem' }}>
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#111827',
                color: '#d1d5db',
                border: '1px solid #374151',
                borderRadius: '0.375rem',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#374151'}
            />
          </div>
          
          <div>
            <label htmlFor="user_id" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#d1d5db', marginBottom: '0.5rem' }}>
              Client ID
            </label>
            <input
              type="text"
              id="user_id"
              name="user_id"
              value={formData.user_id}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#111827',
                color: '#d1d5db',
                border: '1px solid #374151',
                borderRadius: '0.375rem',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#374151'}
            />
          </div>
          
          <div>
            <label htmlFor="apikey" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#d1d5db', marginBottom: '0.5rem' }}>
              API Key
            </label>
            <input
              type="password"
              id="apikey"
              name="apikey"
              value={formData.apikey}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#111827',
                color: '#d1d5db',
                border: '1px solid #374151',
                borderRadius: '0.375rem',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#374151'}
            />
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                background: isLoading ? '#1e40af' : 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                color: 'white',
                fontWeight: 'bold',
                padding: '0.75rem 1rem',
                borderRadius: '0.375rem',
                border: 'none',
                fontSize: '1rem',
                textTransform: 'uppercase',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                opacity: isLoading ? 0.7 : 1
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
            Already have an account?{' '}
            <a 
              href="/login" 
              style={{ 
                color: '#60a5fa',
                textDecoration: 'none',
                transition: 'color 0.15s'
              }}
              onMouseEnter={(e) => e.target.style.color = '#93c5fd'}
              onMouseLeave={(e) => e.target.style.color = '#60a5fa'}
            >
              Login here
            </a>
          </p>
        </div>
      </div>
      
      <footer style={{
        backgroundColor: 'rgba(17, 24, 39, 0.8)',
        backdropFilter: 'blur(16px)',
        color: '#d1d5db',
        textAlign: 'center',
        padding: '1rem 0',
        boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.1)',
        width: '100%',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        borderTop: '1px solid #374151'
      }}>
        <p>
          Copyright 2025 |{' '}
          <a 
            href="https://www.squeralgo.com"
            style={{
              color: '#60a5fa',
              textDecoration: 'none',
              transition: 'color 0.15s'
            }}
            onMouseEnter={(e) => e.target.style.color = '#93c5fd'}
            onMouseLeave={(e) => e.target.style.color = '#60a5fa'}
            target="_blank" 
            rel="noopener noreferrer"
          >
            www.squeralgo.com
          </a>
          {' '}| Algorithmic Trading Intelligence
        </p>
      </footer>
    </div>
  );
};

export default Register;