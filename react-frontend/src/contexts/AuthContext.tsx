import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LoginCredentials, AuthResponse } from '../types';
import FlaskApiService from '../services/flaskApi';

interface User {
  username: string;
  user_id: string;
  apikey: string;
  is_admin?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      setIsLoading(true);
      const response = await FlaskApiService.login(credentials);
      
      if (response.status === 'success') {
        // Store user data after successful login
        const userData = {
          username: credentials.user_id, // Using user_id as username for now
          user_id: credentials.user_id,
          apikey: 'stored_in_session' // Actual apikey is in Flask session
        };
        setUser(userData);
        localStorage.setItem('auth_user', JSON.stringify(userData));
      }
      
      return response;
    } catch (error: any) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await FlaskApiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      // Clear any stored auth data
      localStorage.removeItem('auth_user');
    }
  };

  const checkAuthStatus = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Use the new session check endpoint
      const sessionResult = await FlaskApiService.checkSession();
      
      if (sessionResult.authenticated && sessionResult.user) {
        // Session is valid, set user data
        setUser(sessionResult.user);
        // Also store in localStorage for persistence
        localStorage.setItem('auth_user', JSON.stringify(sessionResult.user));
      } else {
        // Session not valid, clear user data
        setUser(null);
        localStorage.removeItem('auth_user');
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      // On error, check localStorage as fallback
      const storedUser = localStorage.getItem('auth_user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (parseError) {
          setUser(null);
          localStorage.removeItem('auth_user');
        }
      } else {
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check authentication status on app load
    checkAuthStatus();
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};