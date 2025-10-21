"use client";

import { useState } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { AlertCircle, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    user_id: "",
    pin: "",
    totp: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState("");

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.user_id) {
      newErrors.user_id = "User ID is required";
    }

    if (!formData.pin) {
      newErrors.pin = "PIN is required";
    } else if (formData.pin.length < 4) {
      newErrors.pin = "PIN must be at least 4 characters";
    }

    if (!formData.totp) {
      newErrors.totp = "TOTP is required";
    } else if (formData.totp.length !== 6) {
      newErrors.totp = "TOTP must be 6 digits";
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
      // Create FormData for the backend
      const formDataToSend = new FormData();
      formDataToSend.append("user_id", formData.user_id);
      formDataToSend.append("pin", formData.pin);
      formDataToSend.append("totp", formData.totp);

      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        body: formDataToSend,
        credentials: "include", // Important for session cookies
      });

      const data = await response.json();

      if (data.status === "error") {
        throw new Error(data.message || "Login failed");
      }

      if (data.status === "success") {
        // Session is stored in cookies by backend
        // Redirect to dashboard
        router.push("/dashboard");
      }
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

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

            {/* User ID Field */}
            <div className="space-y-2">
              <label htmlFor="user_id" className="text-sm font-medium text-slate-300">
                User ID (Client Code)
              </label>
              <input
                id="user_id"
                name="user_id"
                type="text"
                value={formData.user_id}
                onChange={handleChange}
                placeholder="Enter your broker user ID"
                className={`w-full px-3 py-2 bg-slate-800 border rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent ${
                  errors.user_id ? "border-red-500" : "border-slate-700"
                }`}
              />
              {errors.user_id && (
                <p className="text-sm text-red-400">{errors.user_id}</p>
              )}
            </div>

            {/* PIN Field */}
            <div className="space-y-2">
              <label htmlFor="pin" className="text-sm font-medium text-slate-300">
                PIN
              </label>
              <div className="relative">
                <input
                  id="pin"
                  name="pin"
                  type={showPassword ? "text" : "password"}
                  value={formData.pin}
                  onChange={handleChange}
                  placeholder="Enter your PIN"
                  className={`w-full px-3 py-2 bg-slate-800 border rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent ${
                    errors.pin ? "border-red-500" : "border-slate-700"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.pin && (
                <p className="text-sm text-red-400">{errors.pin}</p>
              )}
            </div>

            {/* TOTP Field */}
            <div className="space-y-2">
              <label htmlFor="totp" className="text-sm font-medium text-slate-300">
                TOTP (6-digit code)
              </label>
              <input
                id="totp"
                name="totp"
                type="text"
                maxLength={6}
                value={formData.totp}
                onChange={handleChange}
                placeholder="Enter 6-digit TOTP"
                className={`w-full px-3 py-2 bg-slate-800 border rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent ${
                  errors.totp ? "border-red-500" : "border-slate-700"
                }`}
              />
              {errors.totp && (
                <p className="text-sm text-red-400">{errors.totp}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              variant="gradient"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            {/* Sign Up Link */}
            <div className="text-center pt-4">
              <p className="text-slate-400 text-sm">
                Don't have an account?{" "}
                <Link href="/register" className="text-violet-400 hover:text-violet-300 font-medium">
                  Sign up for free
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
