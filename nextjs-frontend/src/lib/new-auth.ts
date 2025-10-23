// New Authentication utilities for the updated auth system
import { config } from "./config";

export interface NewUser {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

export interface SessionInfo {
  expires_at: string;
  created_at: string;
  time_remaining: {
    hours: number;
    minutes: number;
    total_seconds: number;
  };
  session_id: string;
}

export interface LoginResponse {
  status: "success" | "error";
  message: string;
  user?: NewUser;
  session?: SessionInfo;
  redirect?: string;
  error_code?: string;
}

export interface SessionResponse {
  status: "success" | "error";
  authenticated: boolean;
  user?: NewUser;
  session?: SessionInfo;
  message?: string;
}

export interface RegisterResponse {
  status: "success" | "error";
  message: string;
  user_id?: number;
  redirect?: string;
  error_code?: string;
  errors?: Record<string, string>;
}

export interface LogoutResponse {
  status: "success" | "error";
  message: string;
  was_logged_in: boolean;
  sessions_cleared?: number;
  redirect?: string;
}

class NewAuthService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = config.api.baseUrl || "http://localhost:5000";
  }

  /**
   * Login with email/username and password
   */
  async login(emailOrUsername: string, password: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/new/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important for session cookies
        body: JSON.stringify({
          email: emailOrUsername,
          password: password,
        }),
      });

      const data: LoginResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Login error:", error);
      return {
        status: "error",
        message: "Connection error. Please try again.",
        error_code: "CONNECTION_ERROR",
      };
    }
  }

  /**
   * Register a new user
   */
  async register(username: string, email: string, password: string): Promise<RegisterResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/new/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
        }),
      });

      const data: RegisterResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Registration error:", error);
      return {
        status: "error",
        message: "Connection error. Please try again.",
        error_code: "CONNECTION_ERROR",
      };
    }
  }

  /**
   * Check current session status
   */
  async checkSession(): Promise<SessionResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/new/session`, {
        method: "GET",
        credentials: "include",
      });

      const data: SessionResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Session check error:", error);
      return {
        status: "error",
        authenticated: false,
        message: "Connection error",
      };
    }
  }

  /**
   * Logout user
   */
  async logout(logoutAll: boolean = false): Promise<LogoutResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/new/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          logout_all: logoutAll,
        }),
      });

      const data: LogoutResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Logout error:", error);
      return {
        status: "error",
        message: "Logout failed, but session may have been cleared",
        was_logged_in: true,
      };
    }
  }

  /**
   * Validate registration data before submission
   */
  async validateRegistration(username: string, email: string, password: string): Promise<{
    status: "success" | "error";
    valid: boolean;
    errors: Record<string, string>;
    suggestions: Record<string, string>;
    message: string;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/new/register/validate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
        }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Validation error:", error);
      return {
        status: "error",
        valid: false,
        errors: {},
        suggestions: {},
        message: "Connection error during validation",
      };
    }
  }

  /**
   * Validate login credentials without creating a session
   */
  async validateLogin(emailOrUsername: string, password: string): Promise<{
    status: "success" | "error";
    valid: boolean;
    user_exists: boolean;
    message: string;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/new/login/validate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailOrUsername,
          password: password,
        }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Login validation error:", error);
      return {
        status: "error",
        valid: false,
        user_exists: false,
        message: "Connection error during validation",
      };
    }
  }

  /**
   * Get detailed session information
   */
  async getSessionInfo(): Promise<{
    status: "success" | "error";
    session?: SessionInfo;
    user?: NewUser;
    message?: string;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/new/session/info`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Session info error:", error);
      return {
        status: "error",
        message: "Failed to get session information",
      };
    }
  }

  /**
   * Extend current session
   */
  async extendSession(hours?: number): Promise<{
    status: "success" | "error";
    message: string;
    expires_at?: string;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/new/session/extend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          hours: hours,
        }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Session extend error:", error);
      return {
        status: "error",
        message: "Failed to extend session",
      };
    }
  }

  /**
   * Check if user is currently authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const session = await this.checkSession();
    return session.authenticated;
  }

  /**
   * Get current user information
   */
  async getCurrentUser(): Promise<NewUser | null> {
    const session = await this.checkSession();
    return session.user || null;
  }

  /**
   * Utility method to handle API errors consistently
   */
  getErrorMessage(response: LoginResponse | RegisterResponse | LogoutResponse): string {
    if (response.status === "error") {
      const errorCode = 'error_code' in response ? response.error_code : undefined;
      switch (errorCode) {
        case "INVALID_CREDENTIALS":
          return "Invalid email/username or password. Please check your credentials.";
        case "ACCOUNT_DEACTIVATED":
          return "Your account has been deactivated. Please contact support.";
        case "RATE_LIMITED":
          return response.message || "Too many attempts. Please try again later.";
        case "VALIDATION_ERROR":
          return "Please check your input and try again.";
        case "USERNAME_EXISTS":
          return "Username already exists. Please choose a different username.";
        case "EMAIL_EXISTS":
          return "Email already exists. Please use a different email or login instead.";
        case "CONNECTION_ERROR":
          return "Connection error. Please check your internet connection.";
        default:
          return response.message || "An error occurred. Please try again.";
      }
    }
    return response.message || "";
  }
}

// Export singleton instance
export const newAuth = new NewAuthService();