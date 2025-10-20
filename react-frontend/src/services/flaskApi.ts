import api from './api';
import { 
  LoginCredentials, 
  AuthResponse, 
  MarginData, 
  OrderData, 
  TradeData, 
  PositionData, 
  HoldingData
} from '../types';

export class FlaskApiService {
  // Authentication methods
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Create form data to match Flask's expected format
      const formData = new FormData();
      formData.append('user_id', credentials.user_id);
      formData.append('pin', credentials.pin);
      formData.append('totp', credentials.totp);

      const response = await api.post('/auth/login', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Flask now returns JSON for API requests
      if (response.status === 200) {
        const data = response.data;
        
        // Check if we got a JSON response
        if (typeof data === 'object' && data.status) {
          return {
            status: data.status,
            message: data.message || (data.status === 'success' ? 'Login successful' : 'Login failed')
          };
        }
        
        return { status: 'error', message: 'Unexpected response format' };
      }
      
      return { status: 'error', message: 'Login failed' };
    } catch (error: any) {
      // Handle any other errors
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  static async logout(): Promise<void> {
    try {
      await api.get('/auth/logout');
    } catch (error: any) {
      // Logout might redirect, which is fine
      if (error.response?.status !== 302) {
        throw new Error(error.response?.data?.message || 'Logout failed');
      }
    }
  }

  // Session check method
  static async checkSession(): Promise<{ authenticated: boolean; user?: any }> {
    try {
      const response = await api.get('/auth/check-session');
      
      if (response.status === 200 && response.data.status === 'success') {
        return {
          authenticated: response.data.authenticated,
          user: response.data.authenticated ? {
            username: response.data.user,
            user_id: response.data.user_id,
            apikey: 'stored_in_session'
          } : undefined
        };
      }
      
      return { authenticated: false };
    } catch (error: any) {
      console.error('Session check error:', error);
      return { authenticated: false };
    }
  }

  // Dashboard data methods
  static async getDashboardData(): Promise<MarginData> {
    try {
      const response = await api.get('/dashboard', {
        headers: {
          'Accept': 'application/json'
        }
      });
      
      // Flask now returns JSON for API requests
      if (response.status === 200) {
        const data = response.data;
        
        // Check if we got a successful JSON response
        if (data.status === 'success' && data.data) {
          return {
            availablecash: data.data.availablecash || '0.00',
            collateral: data.data.collateral || '0.00',
            m2munrealized: data.data.m2munrealized || '0.00',
            m2mrealized: data.data.m2mrealized || '0.00',
            utiliseddebits: data.data.utiliseddebits || '0.00',
            net: data.data.net || '0.00'
          };
        } else if (data.status === 'error') {
          throw new Error(data.message || 'Failed to fetch dashboard data');
        }
      }
      
      throw new Error('Failed to fetch dashboard data');
    } catch (error: any) {
      if (error.response?.status === 401) {
        // Authentication required
        throw new Error('Authentication required');
      } else if (error.response?.status === 403) {
        // User not approved
        throw new Error('User not approved');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Failed to fetch dashboard data');
    }
  }

  // Method to get margin data via API (if available)
  static async getMarginData(): Promise<MarginData> {
    try {
      // Try to get margin data from a potential API endpoint
      // This would need to be implemented in Flask as a JSON API
      const response = await api.get('/api/v1/margin');
      return response.data;
    } catch (error: any) {
      // Fallback to dashboard method
      return this.getDashboardData();
    }
  }

  // Trading data methods
  static async getOrderBook(): Promise<{ orders: OrderData[], stats: any }> {
    try {
      const response = await api.get('/orderbook');
      
      // Flask returns HTML, so we need to parse or handle differently
      // For now, return mock data that matches the expected structure
      if (response.status === 200) {
        // Mock data structure matching Flask template
        return {
          orders: [],
          stats: {
            total_buy_orders: 0,
            total_sell_orders: 0,
            total_completed_orders: 0,
            total_open_orders: 0,
            total_rejected_orders: 0
          }
        };
      }
      
      throw new Error('Failed to fetch order book');
    } catch (error: any) {
      if (error.response?.status === 302) {
        throw new Error('Authentication required');
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch order book');
    }
  }

  static async getTradeBook(): Promise<TradeData[]> {
    try {
      const response = await api.get('/tradebook', {
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.status === 200) {
        const data = response.data;
        
        // Check if we got a successful JSON response
        if (data.status === 'success' && data.data) {
          return data.data;
        } else if (data.status === 'error') {
          throw new Error(data.message || 'Failed to fetch trade book');
        }
      }
      
      throw new Error('Failed to fetch trade book');
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Authentication required');
      } else if (error.response?.status === 302) {
        throw new Error('Authentication required');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Failed to fetch trade book');
    }
  }

  static async getPositions(): Promise<PositionData[]> {
    try {
      const response = await api.get('/positions', {
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.status === 200) {
        const data = response.data;
        
        // Check if we got a successful JSON response
        if (data.status === 'success' && data.data) {
          return data.data;
        } else if (data.status === 'error') {
          throw new Error(data.message || 'Failed to fetch positions');
        }
      }
      
      throw new Error('Failed to fetch positions');
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Authentication required');
      } else if (error.response?.status === 302) {
        throw new Error('Authentication required');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Failed to fetch positions');
    }
  }

  static async getHoldings(): Promise<{ holdings: HoldingData[], stats: any }> {
    try {
      const response = await api.get('/holdings', {
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.status === 200) {
        const data = response.data;
        
        // Check if we got a successful JSON response
        if (data.status === 'success' && data.data) {
          return {
            holdings: data.data.holdings || [],
            stats: data.data.stats || {
              totalholdingvalue: 0,
              totalinvvalue: 0,
              totalprofitandloss: 0,
              totalpnlpercentage: 0
            }
          };
        } else if (data.status === 'error') {
          throw new Error(data.message || 'Failed to fetch holdings');
        }
      }
      
      throw new Error('Failed to fetch holdings');
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Authentication required');
      } else if (error.response?.status === 302) {
        throw new Error('Authentication required');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Failed to fetch holdings');
    }
  }

  // API Key management methods
  static async getApiKey(): Promise<{ api_key: string; login_username: string }> {
    try {
      const response = await api.get('/apikey', {
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.status === 200) {
        const data = response.data;
        
        // Check if we got a successful JSON response
        if (data.status === 'success' && data.data) {
          return {
            api_key: data.data.api_key,
            login_username: data.data.login_username
          };
        } else if (data.status === 'error') {
          throw new Error(data.message || 'Failed to fetch API key');
        }
      }
      
      throw new Error('Failed to fetch API key');
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Authentication required');
      } else if (error.response?.status === 302) {
        throw new Error('Authentication required');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Failed to fetch API key');
    }
  }

  static async regenerateApiKey(): Promise<{ api_key: string; message: string }> {
    try {
      const response = await api.post('/apikey', {}, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 200) {
        const data = response.data;
        
        // Check if we got a successful JSON response
        if (data.status === 'success' && data.data) {
          return {
            api_key: data.data.api_key,
            message: data.message || 'API key regenerated successfully'
          };
        } else if (data.status === 'error') {
          throw new Error(data.message || 'Failed to regenerate API key');
        }
        
        // Handle legacy response format
        if (data.api_key) {
          return {
            api_key: data.api_key,
            message: data.message || 'API key regenerated successfully'
          };
        }
      }
      
      throw new Error('Failed to regenerate API key');
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Authentication required');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error(error.message || 'Failed to regenerate API key');
    }
  }
}

export default FlaskApiService;