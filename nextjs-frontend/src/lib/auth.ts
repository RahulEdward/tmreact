// Authentication utilities
import { api } from "./api";

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export const auth = {
  // Get current user from API
  async getCurrentUser(): Promise<User | null> {
    try {
      const user = await api.getCurrentUser();
      return user;
    } catch (error) {
      return null;
    }
  },

  // Login user
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const response = await api.login(email, password);
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  },

  // Register user
  async register(
    name: string,
    email: string,
    password: string
  ): Promise<{ token: string; user: User }> {
    const response = await api.register(name, email, password);
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  },

  // Logout user
  async logout(): Promise<void> {
    try {
      await api.logout();
    } finally {
      this.removeToken();
    }
  },

  // Token management
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

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
