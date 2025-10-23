import { useAuth } from "@/contexts/AuthContext";
import { useNewAuth } from "@/contexts/NewAuthContext";

/**
 * Unified authentication hook that provides a consistent interface
 * regardless of which authentication system is being used
 */
export function useUnifiedAuth() {
  const legacyAuth = useAuth();
  const newAuth = useNewAuth();

  // Determine which auth system is active
  const isNewAuthActive = newAuth.isAuthenticated;
  const isLegacyAuthActive = legacyAuth.isAuthenticated && legacyAuth.authType === "legacy";

  // Provide unified interface
  const user = isNewAuthActive ? {
    id: newAuth.user?.id.toString() || "",
    name: newAuth.user?.username || "",
    email: newAuth.user?.email || "",
    createdAt: newAuth.user?.created_at || "",
  } : legacyAuth.user;

  const isAuthenticated = isNewAuthActive || isLegacyAuthActive;
  const isLoading = newAuth.isLoading || legacyAuth.isLoading;

  const login = async (email: string, password: string) => {
    // Always try new auth system first
    const result = await newAuth.login(email, password);
    if (!result.success) {
      // Fallback to legacy auth if new auth fails
      try {
        await legacyAuth.login(email, password);
        return { success: true, message: "Login successful" };
      } catch (error) {
        return result; // Return new auth error
      }
    }
    return result;
  };

  const register = async (username: string, email: string, password: string) => {
    // Use new auth system for registration
    return await newAuth.register(username, email, password);
  };

  const logout = async () => {
    if (isNewAuthActive) {
      return await newAuth.logout();
    } else if (isLegacyAuthActive) {
      await legacyAuth.logout();
      return { success: true, message: "Logged out successfully" };
    }
    return { success: true, message: "No active session" };
  };

  const refreshSession = async () => {
    if (isNewAuthActive) {
      await newAuth.refreshSession();
    } else if (isLegacyAuthActive) {
      await legacyAuth.refreshUser();
    }
  };

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    authType: isNewAuthActive ? "new" : isLegacyAuthActive ? "legacy" : "none",
    error: newAuth.error || null,

    // Actions
    login,
    register,
    logout,
    refreshSession,

    // Auth system specific data
    newAuth: isNewAuthActive ? {
      user: newAuth.user,
      session: newAuth.session,
      extendSession: newAuth.extendSession,
    } : null,

    legacyAuth: isLegacyAuthActive ? {
      user: legacyAuth.user,
      migrateToNewAuth: legacyAuth.migrateToNewAuth,
    } : null,

    // Utility methods
    clearError: newAuth.clearError,
    isNewAuth: isNewAuthActive,
    isLegacyAuth: isLegacyAuthActive,
  };
}

/**
 * Hook for components that need to handle authentication redirects
 */
export function useAuthGuard(redirectTo: string = "/new-login") {
  const { isAuthenticated, isLoading, authType } = useUnifiedAuth();

  const shouldRedirect = !isLoading && !isAuthenticated;
  const redirectUrl = authType === "legacy" ? "/login" : redirectTo;

  return {
    isAuthenticated,
    isLoading,
    shouldRedirect,
    redirectUrl,
    authType,
  };
}

/**
 * Hook for getting user information in a consistent format
 */
export function useUserInfo() {
  const { user, isAuthenticated, authType } = useUnifiedAuth();

  return {
    user,
    isAuthenticated,
    authType,
    displayName: user?.name || user?.email || "User",
    initials: user?.name ? user.name.split(" ").map(n => n[0]).join("").toUpperCase() : "U",
  };
}

/**
 * Hook for authentication actions with consistent error handling
 */
export function useAuthActions() {
  const { login, register, logout, clearError } = useUnifiedAuth();

  const handleLogin = async (email: string, password: string) => {
    try {
      const result = await login(email, password);
      return result;
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Login failed",
      };
    }
  };

  const handleRegister = async (username: string, email: string, password: string) => {
    try {
      const result = await register(username, email, password);
      return result;
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Registration failed",
      };
    }
  };

  const handleLogout = async () => {
    try {
      const result = await logout();
      return result;
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Logout failed",
      };
    }
  };

  return {
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    clearError,
  };
}