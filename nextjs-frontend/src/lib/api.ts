// API client for backend integration
import { config } from "./config";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}

class ApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor() {
    this.baseUrl = config.api.baseUrl;
    this.timeout = config.api.timeout;
  }

  private getAuthToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("auth_token");
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = this.getAuthToken();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData
        );
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new ApiError("Request timeout", 408);
        }
        throw new ApiError(error.message, 0);
      }

      throw new ApiError("An unknown error occurred", 0);
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request<{ token: string; user: any }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async register(name: string, email: string, password: string) {
    return this.request<{ token: string; user: any }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
  }

  async logout() {
    return this.request("/auth/logout", {
      method: "POST",
    });
  }

  async getCurrentUser() {
    return this.request<any>("/auth/me");
  }

  // Broker endpoints
  async getBrokers() {
    return this.request<any[]>("/brokers");
  }

  async connectBroker(brokerId: string, credentials: any) {
    return this.request(`/brokers/${brokerId}/connect`, {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async disconnectBroker(brokerId: string) {
    return this.request(`/brokers/${brokerId}/disconnect`, {
      method: "POST",
    });
  }

  // Strategy endpoints
  async getStrategies() {
    return this.request<any[]>("/strategies");
  }

  async getStrategy(id: string) {
    return this.request<any>(`/strategies/${id}`);
  }

  async createStrategy(strategy: any) {
    return this.request<any>("/strategies", {
      method: "POST",
      body: JSON.stringify(strategy),
    });
  }

  async updateStrategy(id: string, strategy: any) {
    return this.request<any>(`/strategies/${id}`, {
      method: "PUT",
      body: JSON.stringify(strategy),
    });
  }

  async deleteStrategy(id: string) {
    return this.request(`/strategies/${id}`, {
      method: "DELETE",
    });
  }

  // Order endpoints
  async getOrders(params?: { status?: string; limit?: number }) {
    const queryString = params
      ? "?" + new URLSearchParams(params as any).toString()
      : "";
    return this.request<any[]>(`/orders${queryString}`);
  }

  async getOrder(id: string) {
    return this.request<any>(`/orders/${id}`);
  }

  // Webhook endpoints
  async getWebhooks() {
    return this.request<any[]>("/webhooks");
  }

  async createWebhook(webhook: any) {
    return this.request<any>("/webhooks", {
      method: "POST",
      body: JSON.stringify(webhook),
    });
  }

  async deleteWebhook(id: string) {
    return this.request(`/webhooks/${id}`, {
      method: "DELETE",
    });
  }

  // Analytics endpoints
  async getAnalytics(params?: { period?: string }) {
    const queryString = params
      ? "?" + new URLSearchParams(params as any).toString()
      : "";
    return this.request<any>(`/analytics${queryString}`);
  }
}

export const api = new ApiClient();
