"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { AlertCircle, Eye, EyeOff, Loader2, CheckCircle, Info } from "lucide-react";
import { useAuthValidation } from "@/hooks/useAuthValidation";
import { newAuth } from "@/lib/new-auth";

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

interface RegisterErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  acceptTerms?: string;
  general?: string;
}

export default function NewRegisterPage() {
  const router = useRouter();
  const { errors, suggestions, isValidating, validateField, validateForm, clearFieldError, setError } = useAuthValidation();
  
  const [formData, setFormData] = useState<RegisterFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });
  
  const [localErrors, setLocalErrors] = useState<RegisterErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState("");
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState<{
    score: number;
    feedback: string[];
    color: string;
  }>({ score: 0, feedback: [], color: "text-slate-400" });

  // Check if user is already logged in
  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    try {
      const response = await fetch("http://localhost:5000/auth/new/session", {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();
      
      if (data.authenticated) {
        // User is already logged in, redirect to dashboard
        router.push("/dashboard");
        return;
      }
    } catch (error) {
      console.log("No existing session found");
    } finally {
      setIsCheckingSession(false);
    }
  };

  // Password strength calculation
  useEffect(() => {
    if (formData.password) {
      const strength = calculatePasswordStrength(formData.password);
      setPasswordStrength(strength);
    } else {
      setPasswordStrength({ score: 0, feedback: [], color: "text-slate-400" });
    }
  }, [formData.password]);

  const calculatePasswordStrength = (password: string) => {
    let score = 0;
    const feedback: string[] = [];
    
    if (password.length >= 8) score += 1;
    else feedback.push("At least 8 characters");
    
    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push("One uppercase letter");
    
    if (/[a-z]/.test(password)) score += 1;
    else feedback.push("One lowercase letter");
    
    if (/\d/.test(password)) score += 1;
    else feedback.push("One number");
    
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    else feedback.push("One special character (optional)");

    let color = "text-red-400";
    if (score >= 4) color = "text-green-400";
    else if (score >= 3) color = "text-yellow-400";
    else if (score >= 2) color = "text-orange-400";

    return { score, feedback, color };
  };

  const validateLocalForm = (): boolean => {
    const newErrors: RegisterErrors = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else if (formData.username.length > 50) {
      newErrors.username = "Username must be less than 50 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = "Username can only contain letters, numbers, and underscores";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (passwordStrength.score < 4) {
      newErrors.password = "Password does not meet security requirements";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Terms acceptance validation
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "You must accept the terms and conditions";
    }

    setLocalErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    // Local validation first
    if (!validateLocalForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Use the auth service to register
      const response = await newAuth.register(
        formData.username.trim(),
        formData.email.trim().toLowerCase(),
        formData.password
      );

      if (response.status === "error") {
        // Handle specific error codes
        switch (response.error_code) {
          case "USERNAME_EXISTS":
            setLocalErrors({ username: "Username already exists. Please choose a different username." });
            break;
          case "EMAIL_EXISTS":
            setLocalErrors({ email: "Email already exists. Please use a different email or login instead." });
            break;
          case "VALIDATION_ERROR":
            if (response.errors) {
              setLocalErrors(response.errors as RegisterErrors);
            } else {
              setApiError("Please check your input and try again.");
            }
            break;
          case "RATE_LIMITED":
            setApiError(response.message);
            break;
          default:
            setApiError(response.message || "Registration failed. Please try again.");
        }
        return;
      }

      if (response.status === "success") {
        // Registration successful
        console.log("Registration successful");
        
        // Show success message and redirect to login
        setApiError("");
        
        // Redirect to login page with success message
        router.push("/new-login?registered=true");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setApiError("Connection error. Please check your internet connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    
    setFormData((prev) => ({ ...prev, [name]: newValue }));
    
    // Clear errors when user starts typing
    if (localErrors[name as keyof RegisterErrors]) {
      setLocalErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (errors[name]) {
      clearFieldError(name);
    }
    if (apiError) {
      setApiError("");
    }
  };

  const handleFieldBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Only validate non-empty fields on blur
    if (value.trim() && (name === "username" || name === "email")) {
      const formDataForValidation = {
        username: formData.username,
        email: formData.email,
        password: formData.password
      };
      await validateField(name, value, formDataForValidation);
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
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-8">
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
          <CardTitle className="text-2xl text-white">Create your account</CardTitle>
          <p className="text-slate-400">Join TradingBridge and start trading today</p>
          
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

            {/* Username Field */}
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-slate-300">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                onBlur={handleFieldBlur}
                placeholder="Choose a unique username"
                className={`w-full px-3 py-2 bg-slate-800 border rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors ${
                  localErrors.username || errors.username ? "border-red-500" : "border-slate-700"
                }`}
                disabled={isLoading}
              />
              {(localErrors.username || errors.username) && (
                <p className="text-sm text-red-400">{localErrors.username || errors.username}</p>
              )}
              {suggestions.username && !localErrors.username && !errors.username && (
                <p className="text-sm text-blue-400 flex items-start space-x-1">
                  <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>{suggestions.username}</span>
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-300">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleFieldBlur}
                placeholder="Enter your email address"
                className={`w-full px-3 py-2 bg-slate-800 border rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors ${
                  localErrors.email || errors.email ? "border-red-500" : "border-slate-700"
                }`}
                disabled={isLoading}
              />
              {(localErrors.email || errors.email) && (
                <p className="text-sm text-red-400">{localErrors.email || errors.email}</p>
              )}
              {suggestions.email && !localErrors.email && !errors.email && (
                <p className="text-sm text-blue-400 flex items-start space-x-1">
                  <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>{suggestions.email}</span>
                </p>
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
                  placeholder="Create a strong password"
                  className={`w-full px-3 py-2 bg-slate-800 border rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors ${
                    localErrors.password || errors.password ? "border-red-500" : "border-slate-700"
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
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-slate-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          passwordStrength.score >= 4 ? "bg-green-500" :
                          passwordStrength.score >= 3 ? "bg-yellow-500" :
                          passwordStrength.score >= 2 ? "bg-orange-500" : "bg-red-500"
                        }`}
                        style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                      />
                    </div>
                    <span className={`text-xs font-medium ${passwordStrength.color}`}>
                      {passwordStrength.score >= 4 ? "Strong" :
                       passwordStrength.score >= 3 ? "Good" :
                       passwordStrength.score >= 2 ? "Fair" : "Weak"}
                    </span>
                  </div>
                  {passwordStrength.feedback.length > 0 && (
                    <p className="text-xs text-slate-400">
                      Missing: {passwordStrength.feedback.join(", ")}
                    </p>
                  )}
                </div>
              )}
              
              {(localErrors.password || errors.password) && (
                <p className="text-sm text-red-400">{localErrors.password || errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-300">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className={`w-full px-3 py-2 bg-slate-800 border rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors ${
                    localErrors.confirmPassword ? "border-red-500" : "border-slate-700"
                  }`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {localErrors.confirmPassword && (
                <p className="text-sm text-red-400">{localErrors.confirmPassword}</p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <input
                  id="acceptTerms"
                  name="acceptTerms"
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 text-violet-600 focus:ring-violet-500 border-slate-600 rounded bg-slate-800"
                  disabled={isLoading}
                />
                <label htmlFor="acceptTerms" className="text-sm text-slate-300">
                  I agree to the{" "}
                  <Link href="/terms" className="text-violet-400 hover:text-violet-300 transition-colors">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-violet-400 hover:text-violet-300 transition-colors">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {localErrors.acceptTerms && (
                <p className="text-sm text-red-400">{localErrors.acceptTerms}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              variant="gradient"
              disabled={isLoading || isValidating}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>

            {/* Links */}
            <div className="space-y-3 pt-4">
              {/* Sign In Link */}
              <div className="text-center">
                <p className="text-slate-400 text-sm">
                  Already have an account?{" "}
                  <Link href="/new-login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
                    Sign in here
                  </Link>
                </p>
              </div>

              {/* Legacy Registration Link */}
              <div className="text-center border-t border-slate-800 pt-3">
                <p className="text-slate-500 text-xs mb-2">
                  Need to register with broker credentials?
                </p>
                <Link 
                  href="/register" 
                  className="text-slate-400 hover:text-slate-300 text-sm font-medium transition-colors"
                >
                  Use Legacy Registration
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}