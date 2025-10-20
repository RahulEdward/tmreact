import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import FlaskApiService from '../services/flaskApi';

interface ApiKeyData {
  api_key: string;
  login_username: string;
}

const ApiKey: React.FC = () => {
  const [apiKeyData, setApiKeyData] = useState<ApiKeyData | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const { } = useAuth();
  const { addNotification } = useNotification();

  const fetchApiKey = async () => {
    try {
      setIsLoading(true);
      const data = await FlaskApiService.getApiKey();
      setApiKeyData(data);
    } catch (error: any) {
      console.error('Error fetching API key:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to fetch API key',
        sound: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  const regenerateApiKey = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to regenerate your API key? This will invalidate your existing key.'
    );
    
    if (!confirmed) return;

    try {
      setIsRegenerating(true);
      const result = await FlaskApiService.regenerateApiKey();
      
      // Update the API key data with the new key
      if (apiKeyData) {
        setApiKeyData({
          ...apiKeyData,
          api_key: result.api_key
        });
      }
      
      addNotification({
        type: 'success',
        title: 'Success',
        message: result.message || 'API key regenerated successfully!',
        sound: true
      });
    } catch (error: any) {
      console.error('Error regenerating API key:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to regenerate API key',
        sound: true
      });
    } finally {
      setIsRegenerating(false);
    }
  };

  const copyToClipboard = async () => {
    if (!apiKeyData?.api_key) return;

    try {
      await navigator.clipboard.writeText(apiKeyData.api_key);
      addNotification({
        type: 'success',
        title: 'Copied!',
        message: 'The API key has been copied to your clipboard.',
        duration: 3000
      });
    } catch (error) {
      console.error('Could not copy text:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to copy API key to clipboard',
        sound: true
      });
    }
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  useEffect(() => {
    fetchApiKey();
  }, []);

  if (isLoading) {
    return (
      <div style={{
        padding: '2rem',
        minHeight: '100vh',
        background: 'transparent'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: '1.5rem',
            padding: '3rem',
            border: '1px solid rgba(148, 163, 184, 0.1)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem 0'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                border: '2px solid #3B82F6',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              <span style={{
                marginLeft: '1rem',
                color: '#d1d5db',
                fontSize: '1.1rem'
              }}>Loading API key...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      padding: '2rem',
      minHeight: '100vh',
      background: 'transparent'
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem'
            }}>
              🔑
            </div>
            <div>
              <h1 style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: '#F1F5F9',
                margin: 0
              }}>
                API Key Management
              </h1>
              <p style={{
                fontSize: '1rem',
                color: '#94A3B8',
                margin: 0
              }}>
                Secure access to your trading data
              </p>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(20px)',
          borderRadius: '1.5rem',
          padding: '2.5rem',
          border: '1px solid rgba(148, 163, 184, 0.1)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Top gradient line */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #F59E0B 0%, #D97706 100%)'
          }}></div>

          {/* Info Section */}
          <div style={{
            marginBottom: '2rem'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#F1F5F9',
              marginBottom: '0.5rem'
            }}>
              Your API Key
            </h3>
            <p style={{
              color: '#94A3B8',
              fontSize: '0.95rem',
              lineHeight: '1.6'
            }}>
              Use this key to authenticate your API requests. Keep it secure and don't share it publicly.
            </p>
          </div>

          {/* API Key Display */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '1rem',
            padding: '1.5rem',
            border: '1px solid rgba(148, 163, 184, 0.1)',
            marginBottom: '2rem'
          }}>
            {isVisible && apiKeyData?.api_key ? (
              <div style={{
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                color: '#E2E8F0',
                wordBreak: 'break-all',
                lineHeight: '1.5',
                padding: '1rem',
                background: 'rgba(59, 130, 246, 0.1)',
                borderRadius: '0.5rem',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                marginBottom: '1.5rem'
              }}>
                {apiKeyData.api_key}
              </div>
            ) : (
              <div style={{
                padding: '2rem',
                textAlign: 'center',
                color: '#6B7280',
                fontSize: '0.9rem'
              }}>
                {apiKeyData?.api_key ? '••••••••••••••••••••••••••••••••••••••••' : 'No API key available'}
              </div>
            )}

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={toggleVisibility}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  background: isVisible ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                  border: `1px solid ${isVisible ? 'rgba(239, 68, 68, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
                  borderRadius: '0.75rem',
                  color: isVisible ? '#EF4444' : '#3B82F6',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <span>{isVisible ? '🙈' : '👁️'}</span>
                {isVisible ? 'Hide API Key' : 'Show API Key'}
              </button>

              <button
                onClick={copyToClipboard}
                disabled={!apiKeyData?.api_key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  background: 'rgba(16, 185, 129, 0.2)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '0.75rem',
                  color: '#10B981',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  cursor: apiKeyData?.api_key ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease',
                  opacity: apiKeyData?.api_key ? 1 : 0.5
                }}
                onMouseEnter={(e) => {
                  if (apiKeyData?.api_key) {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.25)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <span>📋</span>
                Copy to Clipboard
              </button>
            </div>
          </div>

          {/* Regenerate Section */}
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            borderRadius: '1rem',
            padding: '1.5rem',
            border: '1px solid rgba(239, 68, 68, 0.2)'
          }}>
            <h4 style={{
              fontSize: '1.1rem',
              fontWeight: '600',
              color: '#EF4444',
              marginBottom: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span>⚠️</span>
              Danger Zone
            </h4>
            <p style={{
              color: '#F87171',
              fontSize: '0.9rem',
              marginBottom: '1rem',
              lineHeight: '1.5'
            }}>
              Regenerating your API key will invalidate the current key. Make sure to update all applications using this key.
            </p>
            <button
              onClick={regenerateApiKey}
              disabled={isRegenerating}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                background: isRegenerating ? 'rgba(107, 114, 128, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                border: `1px solid ${isRegenerating ? 'rgba(107, 114, 128, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                borderRadius: '0.75rem',
                color: isRegenerating ? '#6B7280' : '#EF4444',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: isRegenerating ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
              onMouseEnter={(e) => {
                if (!isRegenerating) {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.25)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <span>{isRegenerating ? '⏳' : '🔄'}</span>
              {isRegenerating ? 'Regenerating...' : 'Regenerate API Key'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKey;