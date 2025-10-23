"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { newAuth, NewUser, SessionInfo } from "@/lib/new-auth";

interface NewAuthContextType {
  // State
  user: NewUser | null;
  session: SessionInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (emailOrUsername: string, password: string) => Promise<{
    success: boolean;
    message: string;
    error_code?: string;
  }>;
  register: (username: string, email: string, password: string) => Promise<{
    success: boolean;
    message: string;
    error_code?: string;
    errors?: Record<string, string>;
  }>;
  logout: (logoutAll?: boolean) => Promise<{
    success: boolean;
    message: string;
  }>;
  refreshSession: () => Promise<void>;
  extendSession: (hours?: number) => Promise<{
    success: boolean;
    message: string;
  }>;
  clearError: () => void;
}

const NewAuthContext = createContext<NewAuthContextType | undefined>(undefined);

interface NewAuthProviderProps {
  children: ReactNode;
}

export function NewAuthProvider({ children }: NewAuthProviderProps) {
  const [user, setUser] = useState<NewUser | null>(null);
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check session on mount and set up periodic refresh
  useEffect(() => {
    checkSession();
    
    // Set up periodic session check (every 5 minutes)
    const interval = setInterval(checkSession, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const checkSession = async () => {
    try {
      const response = await newAuth.checkSession();
      
      if (response.authenticated && response.user) {
        setUser(response.user);
        setSession(response.session || null);
        setIsAuthenticated(true);
        setError(null);
      } else {
        setUser(null);
        setSession(null);
        setIsAuthenticated(false);
        if (response.message && response.message !== "No active session") {
          setError(response.message);
        }
      }
    } catch (err) {
      console.error("Session check failed:", err);
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      setError("Failed to check authentication status");
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (emailOrUsername: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await newAuth.login(emailOrUsername, password);
      
      if (response.status === "success" && response.user) {
        setUser(response.user);
        setSession(response.session || null);
        setIsAuthenticated(true);
        setError(null);
        
        return {
          success: true,
          message: response.message,
        };
      } else {
        const errorMessage = newAuth.getErrorMessage(response);
        setError(errorMessage);
        
        return {
          success: false,
          message: errorMessage,
          error_code: response.error_code,
        };
      }
    } catch (err) {
      const errorMessage = "Login failed due to connection error";
      setError(errorMessage);
      
      return {
        success: false,
        message: errorMessage,
        error_code: "CONNECTION_ERROR",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await newAuth.register(username, email, password);
      
      if (response.status === "success") {
        setError(null);
        
        return {
          success: true,
          message: response.message,
        };
      } else {
        const errorMessage = newAuth.getErrorMessage(response);
        setError(errorMessage);
        
        return {
          success: false,
          message: errorMessage,
          error_code: response.error_code,
          errors: response.errors,
        };
      }
    } catch (err) {
      const errorMessage = "Registration failed due to connection error";
      setError(errorMessage);
      
      return {
        success: false,
        message: errorMessage,
        error_code: "CONNECTION_ERROR",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (logoutAll: boolean = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await newAuth.logout(logoutAll);
      
      // Always clear local state regardless of API response
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      setError(null);
      
      return {
        success: response.status === "success",
        message: response.message,
      };
    } catch (err) {
      // Clear local state even if logout API fails
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      
      return {
        success: false,
        message: "Logout completed locally, but server logout may have failed",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSession = async () => {
    await checkSession();
  };

  const extendSession = async (hours?: number) => {
    try {
      const response = await newAuth.extendSession(hours);
      
      if (response.status === "success") {
        // Refresh session info to get updated expiration
        await checkSession();
        
        return {
          success: true,
          message: response.message,
        };
      } else {
        setError(response.message);
        
        return {
          success: false,
          message: response.message,
        };
      }
    } catch (err) {
      const errorMessage = "Failed to extend session";
      setError(errorMessage);
      
      return {
        success: false,
        message: errorMessage,
      };
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: NewAuthContextType = {
    // State
    user,
    session,
    isAuthenticated,
    isLoading,
    error,

    // Actions
    login,
    register,
    logout,
    refreshSession,
    extendSession,
    clearError,
  };

  return (
    <NewAuthContext.Provider value={value}>
      {children}
    </NewAuthContext.Provider>
  );
}

export function useNewAuth(): NewAuthContextType {
  const context = useContext(NewAuthContext);
  if (context === undefined) {
    throw new Error("useNewAuth must be used within a NewAuthProvider");
  }
  return context;
}

// Hook for checking authentication status
export function useAuthStatus() {
  const { isAuthenticated, isLoading, user } = useNewAuth();
  
  return {
    isAuthenticated,
    isLoading,
    user,
    isGuest: !isAuthenticated && !isLoading,
  };
}

// Hook for authentication actions
export function useAuthActions() {
  const { login, register, logout, refreshSession, extendSession, clearError } = useNewAuth();
  
  return {
    login,
    register,
    logout,
    refreshSession,
    extendSession,
    clearError,
  };
}