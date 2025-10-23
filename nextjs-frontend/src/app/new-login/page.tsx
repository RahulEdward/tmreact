"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { AlertCircle, Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginErrors {
  email?: string;
  password?: string;
  general?: string;
}

interface ApiResponse {
  status: "success" | "error";
  message: string;
  user?: {
    id: number;
    username: string;
    email: string;
    created_at: string;
  };
  session?: {
    expires_at: string;
    time_remaining: {
      hours: number;
      minutes: number;
    };
  };
  redirect?: string;
  error_code?: string;
}

export default function NewLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState("");
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  const checkExistingSession = useCallback(async () => {
    try {
      // Check localStorage first
      if (typeof window !== 'undefined') {
        const authUser = localStorage.getItem('auth_user');
        if (authUser) {
          console.log("User already authenticated (localStorage), redirecting to dashboard");
          router.push("/dashboard");
          return;
        }
      }
      
      // Fallback to session check
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/auth/new/session`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();
      
      if (data.authenticated) {
        // User is already logged in, redirect to dashboard
        console.log("User already authenticated (session), redirecting to dashboard");
        router.push("/dashboard");
        return;
      }
    } catch (error) {
      console.log("No existing session found");
    } finally {
      setIsCheckingSession(false);
    }
  }, [router]);

  // Check if user is already logged in
  useEffect(() => {
    checkExistingSession();
  }, [checkExistingSession]);

  const validateForm = (): boolean => {
    const newErrors: LoginErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email or username is required";
    } else if (formData.email.includes("@")) {
      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
    } else if (formData.email.length < 3) {
      // Username validation
      newErrors.email = "Username must be at least 3 characters";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      console.log("Attempting login to:", `${apiUrl}/auth/new/login`);
      
      const response = await fetch(`${apiUrl}/auth/new/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important for session cookies
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      const data: ApiResponse = await response.json();
      console.log("Login response:", data);

      if (data.status === "error") {
        // Handle specific error codes
        switch (data.error_code) {
          case "INVALID_CREDENTIALS":
            setApiError("Invalid email/username or password. Please check your credentials and try again.");
            break;
          case "ACCOUNT_DEACTIVATED":
            setApiError("Your account has been deactivated. Please contact support.");
            break;
          case "RATE_LIMITED":
            setApiError(data.message);
            break;
          case "VALIDATION_ERROR":
            setApiError("Please check your input and try again.");
            break;
          default:
            setApiError(data.message || "Login failed. Please try again.");
        }
        return;
      }

      if (data.status === "success") {
        // Login successful
        console.log("Login successful:", data.user);
        console.log("Redirecting to:", data.redirect || "/dashboard");
        
        // Store user data in localStorage as fallback for session cookies
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_user', JSON.stringify(data.user));
          localStorage.setItem('auth_session', JSON.stringify(data.session));
          localStorage.setItem('auth_token', (data.session as any)?.session_token || '');
          console.log("Stored auth data in localStorage");
        }
        
        // Show success message briefly before redirect
        setApiError("");
        
        // Redirect immediately
        const redirectUrl = data.redirect || "/dashboard";
        console.log("Executing redirect to:", redirectUrl);
        router.push(redirectUrl);
      }
    } catch (error) {
      console.error("Login error:", error);
      setApiError("Connection error. Please check your internet connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear errors when user starts typing
    if (errors[name as keyof LoginErrors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (apiError) {
      setApiError("");
    }
  };

  const handleTestLogin = async () => {
    setIsLoading(true);
    setApiError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/auth/test-login`, {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (data.status === "success") {
        console.log("Test login successful, redirecting to dashboard");
        router.push("/dashboard");
      } else {
        setApiError("Test login failed");
      }
    } catch (error) {
      setApiError("Test login connection error");
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading spinner while checking session
  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-slate-400">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Checking authentication...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/10 via-slate-950 to-cyan-900/10" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <Card className="relative z-10 w-full max-w-md border-slate-800 bg-slate-900/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <Link href="/" className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">TB</span>
            </div>
            <span className="text-xl font-bold text-white">TradingBridge</span>
          </Link>
          <CardTitle className="text-2xl text-white">Welcome back</CardTitle>
          <p className="text-slate-400">Sign in to your account to continue</p>
          
          {/* New Auth System Badge */}
          <div className="inline-flex items-center px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20 mt-2">
            <CheckCircle className="h-3 w-3 text-green-400 mr-1" />
            <span className="text-xs text-green-400 font-medium">New Authentication System</span>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* API Error Message */}
            {apiError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-md p-3 flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-400">{apiError}</p>
              </div>
            )}

            {/* Email/Username Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-300">
                Email or Username
              </label>
              <input
                id="email"
                name="email"
                type="text"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email or username"
                className={`w-full px-3 py-2 bg-slate-800 border rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors ${
                  errors.email ? "border-red-500" : "border-slate-700"
                }`}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-slate-300">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`w-full px-3 py-2 bg-slate-800 border rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors ${
                    errors.password ? "border-red-500" : "border-slate-700"
                  }`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-400">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              variant="gradient"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>

            {/* Development Test Login */}
            {process.env.NODE_ENV === "development" && (
              <Button
                type="button"
                onClick={handleTestLogin}
                className="w-full"
                variant="outline"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Testing...
                  </>
                ) : (
                  "Test Login (Dev Only)"
                )}
              </Button>
            )}

            {/* Links */}
            <div className="space-y-3 pt-4">
              {/* Sign Up Link */}
              <div className="text-center">
                <p className="text-slate-400 text-sm">
                  Don't have an account?{" "}
                  <Link href="/new-register" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
                    Sign up for free
                  </Link>
                </p>
              </div>

              {/* Legacy Login Link */}
              <div className="text-center border-t border-slate-800 pt-3">
                <p className="text-slate-500 text-xs mb-2">
                  Need to use broker credentials?
                </p>
                <Link 
                  href="/login" 
                  className="text-slate-400 hover:text-slate-300 text-sm font-medium transition-colors"
                >
                  Use Legacy Login
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}