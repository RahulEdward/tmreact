import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface LogEntry {
  id: number;
  api_type: string;
  request_data: string;
  response_data: string;
  created_at: string;
}

const CleanLogs: React.FC = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Mock data since backend returns HTML
  const mockLogs: LogEntry[] = [
    {
      id: 1,
      api_type: 'placeorder',
      request_data: '{"symbol": "RELIANCE-EQ", "action": "BUY", "quantity": "10", "price": "2450.50"}',
      response_data: '{"status": "success", "orderid": "ORD001", "message": "Order placed successfully"}',
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      api_type: 'cancelorder',
      request_data: '{"orderid": "ORD001"}',
      response_data: '{"status": "success", "message": "Order cancelled successfully"}',
      created_at: new Date(Date.now() - 300000).toISOString()
    },
    {
      id: 3,
      api_type: 'modifyorder',
      request_data: '{"orderid": "ORD002", "quantity": "5", "price": "3200.00"}',
      response_data: '{"status": "success", "message": "Order modified successfully"}',
      created_at: new Date(Date.now() - 600000).toISOString()
    },
    {
      id: 4,
      api_type: 'squareoff',
      request_data: '{"symbol": "TCS-EQ", "quantity": "5"}',
      response_data: '{"status": "success", "pnl": "+1250.00", "message": "Position squared off"}',
      created_at: new Date(Date.now() - 900000).toISOString()
    }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLogs(mockLogs);
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.api_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.request_data.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.response_data.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || log.api_type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const formatJson = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return jsonString;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const refreshLogs = () => {
    setIsLoading(true);
    setTimeout(() => {
      setLogs([...mockLogs]);
      setIsLoading(false);
    }, 500);
  };

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
          }}>Loading logs...</span>
        </div>
      </div>
    );
  }

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
          API Logs - {user?.user_id || 'Trader'}
        </h1>
        <p style={{
          fontSize: '1rem',
          color: '#888888'
        }}>
          Monitor all API requests and responses in real-time
        </p>
      </div>

      {/* Filters and Search */}
      <div style={{
        marginBottom: '2rem',
        padding: '1.5rem',
        backgroundColor: 'rgba(20, 20, 20, 0.8)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto auto',
          gap: '1rem',
          alignItems: 'end'
        }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#888888',
              marginBottom: '0.5rem'
            }}>
              Search Logs
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by API type, request, or response..."
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: 'rgba(30, 30, 30, 0.8)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                fontSize: '0.875rem',
                outline: 'none'
              }}
            />
          </div>
          
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#888888',
              marginBottom: '0.5rem'
            }}>
              Filter by Type
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{
                padding: '0.75rem',
                backgroundColor: 'rgba(30, 30, 30, 0.8)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                fontSize: '0.875rem',
                outline: 'none',
                minWidth: '150px'
              }}
            >
              <option value="all">All Types</option>
              <option value="placeorder">Place Order</option>
              <option value="cancelorder">Cancel Order</option>
              <option value="modifyorder">Modify Order</option>
              <option value="squareoff">Square Off</option>
            </select>
          </div>
          
          <button
            onClick={refreshLogs}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              border: 'none',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Logs Table */}
      <div style={{
        backgroundColor: 'rgba(20, 20, 20, 0.8)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        overflow: 'hidden'
      }}>
        {/* Table Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '80px 120px 1fr 1fr 150px',
          gap: '1rem',
          padding: '1rem',
          backgroundColor: 'rgba(102, 126, 234, 0.1)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          fontWeight: '600',
          color: '#ffffff',
          fontSize: '0.875rem'
        }}>
          <div>No.</div>
          <div>API Type</div>
          <div>Request Data</div>
          <div>Response Data</div>
          <div>Timestamp</div>
        </div>

        {/* Table Body */}
        <div style={{
          maxHeight: '500px',
          overflowY: 'auto'
        }}>
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log, index) => (
              <div
                key={log.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '80px 120px 1fr 1fr 150px',
                  gap: '1rem',
                  padding: '1rem',
                  backgroundColor: index % 2 === 0 ? 'rgba(30, 30, 30, 0.5)' : 'rgba(40, 40, 40, 0.5)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                  alignItems: 'start'
                }}
              >
                <div style={{ color: '#888888', fontSize: '0.875rem' }}>
                  {index + 1}
                </div>
                <div>
                  <span style={{
                    backgroundColor: 'rgba(102, 126, 234, 0.2)',
                    color: '#667eea',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>
                    {log.api_type}
                  </span>
                </div>
                <div>
                  <pre style={{
                    fontSize: '0.75rem',
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    padding: '0.5rem',
                    borderRadius: '4px',
                    overflow: 'auto',
                    maxHeight: '100px',
                    color: '#cccccc',
                    margin: 0,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}>
                    {formatJson(log.request_data)}
                  </pre>
                </div>
                <div>
                  <pre style={{
                    fontSize: '0.75rem',
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    padding: '0.5rem',
                    borderRadius: '4px',
                    overflow: 'auto',
                    maxHeight: '100px',
                    color: '#cccccc',
                    margin: 0,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}>
                    {formatJson(log.response_data)}
                  </pre>
                </div>
                <div style={{
                  color: '#888888',
                  fontSize: '0.75rem'
                }}>
                  {formatTimestamp(log.created_at)}
                </div>
              </div>
            ))
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              color: '#888888'
            }}>
              <div style={{
                fontSize: '2rem',
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
                {searchTerm || filterType !== 'all' 
                  ? 'No logs found matching your search criteria' 
                  : 'No API logs available'
                }
              </div>
              <div style={{
                fontSize: '0.875rem'
              }}>
                API requests and responses will appear here
              </div>
            </div>
          )}
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

export default CleanLogs;
