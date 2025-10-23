"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, User } from "@/lib/auth";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  authType: "new" | "legacy" | "none";
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  migrateToNewAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authType, setAuthType] = useState<"new" | "legacy" | "none">("none");
  const router = useRouter();

  const refreshUser = async () => {
    try {
      const authStatus = await auth.getAuthStatus();
      setUser(authStatus.user);
      setAuthType(authStatus.authType);
      setIsLoading(false);
    } catch (error) {
      setUser(null);
      setAuthType("none");
      auth.removeToken();
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      await refreshUser();
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await auth.login(email, password);
      setUser(response.user);
      
      // Refresh to get the correct auth type
      await refreshUser();
    } catch (error) {
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await auth.register(name, email, password);
      setUser(response.user);
      
      // Refresh to get the correct auth type
      await refreshUser();
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    await auth.logout();
    setUser(null);
    setAuthType("none");
    
    // Redirect based on auth type
    if (authType === "new") {
      router.push("/new-login");
    } else {
      router.push("/login");
    }
  };

  const migrateToNewAuth = async (): Promise<boolean> => {
    try {
      const result = await auth.migrateToNewAuth();
      if (result) {
        await refreshUser();
      }
      return result;
    } catch (error) {
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        authType,
        login,
        register,
        logout,
        refreshUser,
        migrateToNewAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Hook to check if user should be redirected to new auth system
export function useAuthRedirect() {
  const { authType, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect unauthenticated users to new login by default
      const currentPath = window.location.pathname;
      if (!currentPath.includes("/new-login") && !currentPath.includes("/new-register") && !currentPath.includes("/login") && !currentPath.includes("/register")) {
        router.push("/new-login");
      }
    }
  }, [isLoading, isAuthenticated, router]);

  return { authType, isAuthenticated, isLoading };
}

// Hook for legacy auth compatibility
export function useLegacyAuth() {
  const { user, isAuthenticated, authType } = useAuth();
  
  return {
    user,
    isAuthenticated: isAuthenticated && authType === "legacy",
    isLegacyAuth: authType === "legacy",
  };
}

// Hook for new auth system
export function useNewAuthCompat() {
  const { user, isAuthenticated, authType } = useAuth();
  
  return {
    user,
    isAuthenticated: isAuthenticated && authType === "new",
    isNewAuth: authType === "new",
  };
}
