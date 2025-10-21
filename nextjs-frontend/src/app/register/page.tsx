"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    user_id: "",
    apikey: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.user_id) {
      newErrors.user_id = "User ID (Client Code) is required";
    }

    if (!formData.apikey) {
      newErrors.apikey = "API Key is required";
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
      formDataToSend.append("username", formData.username);
      formDataToSend.append("user_id", formData.user_id);
      formDataToSend.append("apikey", formData.apikey);

      const response = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        body: formDataToSend,
        credentials: "include",
      });

      const data = await response.json();

      if (data.status === "error") {
        throw new Error(data.message || "Registration failed");
      }

      if (data.status === "success") {
        // Redirect to login page
        router.push("/login");
      }
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-12">
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
          <p className="text-slate-400">Register with your broker credentials</p>
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
                placeholder="Choose a username"
                className={`w-full px-3 py-2 bg-slate-800 border rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent ${
                  errors.username ? "border-red-500" : "border-slate-700"
                }`}
              />
              {errors.username && <p className="text-sm text-red-400">{errors.username}</p>}
            </div>

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
              {errors.user_id && <p className="text-sm text-red-400">{errors.user_id}</p>}
            </div>

            {/* API Key Field */}
            <div className="space-y-2">
              <label htmlFor="apikey" className="text-sm font-medium text-slate-300">
                API Key
              </label>
              <input
                id="apikey"
                name="apikey"
                type="text"
                value={formData.apikey}
                onChange={handleChange}
                placeholder="Enter your broker API key"
                className={`w-full px-3 py-2 bg-slate-800 border rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent ${
                  errors.apikey ? "border-red-500" : "border-slate-700"
                }`}
              />
              {errors.apikey && <p className="text-sm text-red-400">{errors.apikey}</p>}
              <p className="text-xs text-slate-500">
                Get your API key from your broker's developer portal
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              variant="gradient"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>

            {/* Sign In Link */}
            <div className="text-center pt-4">
              <p className="text-slate-400 text-sm">
                Already have an account?{" "}
                <Link href="/login" className="text-violet-400 hover:text-violet-300 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
