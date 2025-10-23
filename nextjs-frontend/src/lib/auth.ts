// Legacy Authentication utilities (for backward compatibility)
import { api } from "./api";
import { newAuth, NewUser } from "./new-auth";

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

// Convert NewUser to legacy User format
function convertNewUserToLegacy(newUser: NewUser): User {
  return {
    id: newUser.id.toString(),
    name: newUser.username,
    email: newUser.email,
    createdAt: newUser.created_at,
  };
}

export const auth = {
  // Get current user from API (checks both new and legacy auth)
  async getCurrentUser(): Promise<User | null> {
    try {
      // First try new auth system
      const newUser = await newAuth.getCurrentUser();
      if (newUser) {
        return convertNewUserToLegacy(newUser);
      }

      // Fallback to legacy auth system
      const user = await api.getCurrentUser();
      return user;
    } catch (error) {
      return null;
    }
  },

  // Login user (tries new auth first, then legacy)
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    try {
      // Try new auth system first
      const newAuthResponse = await newAuth.login(email, password);
      if (newAuthResponse.status === "success" && newAuthResponse.user) {
        return {
          token: "new-auth-session", // Placeholder token for compatibility
          user: convertNewUserToLegacy(newAuthResponse.user),
        };
      }
    } catch (error) {
      console.log("New auth login failed, trying legacy auth");
    }

    // Fallback to legacy auth system
    const response = await api.login(email, password);
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  },

  // Register user (uses new auth system by default)
  async register(
    name: string,
    email: string,
    password: string
  ): Promise<{ token: string; user: User }> {
    try {
      // Use new auth system for registration
      const newAuthResponse = await newAuth.register(name, email, password);
      if (newAuthResponse.status === "success") {
        // Registration successful, but user needs to login
        throw new Error("Registration successful. Please login with your credentials.");
      } else {
        throw new Error(newAuthResponse.message || "Registration failed");
      }
    } catch (error) {
      // Fallback to legacy registration if needed
      const response = await api.register(name, email, password);
      if (response.token) {
        this.setToken(response.token);
      }
      return response;
    }
  },

  // Logout user (handles both new and legacy auth)
  async logout(): Promise<void> {
    try {
      // Try new auth logout
      await newAuth.logout();
    } catch (error) {
      console.log("New auth logout failed, trying legacy logout");
    }

    try {
      // Try legacy auth logout
      await api.logout();
    } catch (error) {
      console.log("Legacy auth logout failed");
    } finally {
      // Always clear local storage
      this.removeToken();
    }
  },

  // Check if user is authenticated (checks both systems)
  async isAuthenticated(): Promise<boolean> {
    try {
      // Check new auth system first
      const isNewAuthAuthenticated = await newAuth.isAuthenticated();
      if (isNewAuthAuthenticated) {
        return true;
      }

      // Check legacy auth system
      const token = this.getToken();
      if (token) {
        // Verify token is still valid
        const user = await api.getCurrentUser();
        return !!user;
      }

      return false;
    } catch (error) {
      return false;
    }
  },

  // Synchronous version for backward compatibility
  isAuthenticatedSync(): boolean {
    return !!this.getToken();
  },

  // Token management (legacy)
  setToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token);
    }
  },

  getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("auth_token");
    }
    return null;
  },

  removeToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
  },

  // New methods for unified auth management
  async getAuthStatus(): Promise<{
    isAuthenticated: boolean;
    authType: "new" | "legacy" | "none";
    user: User | null;
  }> {
    try {
      // Check new auth system
      const newUser = await newAuth.getCurrentUser();
      if (newUser) {
        return {
          isAuthenticated: true,
          authType: "new",
          user: convertNewUserToLegacy(newUser),
        };
      }

      // Check legacy auth system
      const legacyUser = await api.getCurrentUser();
      if (legacyUser) {
        return {
          isAuthenticated: true,
          authType: "legacy",
          user: legacyUser,
        };
      }

      return {
        isAuthenticated: false,
        authType: "none",
        user: null,
      };
    } catch (error) {
      return {
        isAuthenticated: false,
        authType: "none",
        user: null,
      };
    }
  },

  // Migrate from legacy to new auth (if needed)
  async migrateToNewAuth(): Promise<boolean> {
    try {
      const authStatus = await this.getAuthStatus();
      
      if (authStatus.authType === "legacy" && authStatus.user) {
        // User is authenticated with legacy system
        // They would need to register with the new system
        console.log("User needs to register with new auth system");
        return false;
      }

      return authStatus.authType === "new";
    } catch (error) {
      return false;
    }
  },
};
