"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  Loader2, 
  AlertCircle, 
  CheckCircle, 
  ExternalLink,
  Shield,
  TrendingUp,
  Info
} from "lucide-react";

interface AngelCredentials {
  client_id: string;
  pin: string;
  totp: string;
  api_key: string;
  display_name: string;
}

interface FormErrors {
  client_id?: string;
  pin?: string;
  totp?: string;
  api_key?: string;
  general?: string;
}

export default function ConnectAngelPage() {
  const router = useRouter();
  const [credentials, setCredentials] = useState<AngelCredentials>({
    client_id: "",
    pin: "",
    totp: "",
    api_key: "",
    display_name: "",
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showTotpModal, setShowTotpModal] = useState(false);
  const [totpCode, setTotpCode] = useState("");
  const [totpError, setTotpError] = useState("");

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Client ID validation
    if (!credentials.client_id.trim()) {
      newErrors.client_id = "Client ID is required";
    } else if (credentials.client_id.length < 6) {
      newErrors.client_id = "Client ID must be at least 6 characters";
    }

    // PIN validation
    if (!credentials.pin) {
      newErrors.pin = "Trading PIN is required";
    } else if (credentials.pin.length !== 4) {
      newErrors.pin = "Trading PIN must be 4 digits";
    } else if (!/^\d+$/.test(credentials.pin)) {
      newErrors.pin = "Trading PIN must contain only numbers";
    }

    // API Key validation
    if (!credentials.api_key.trim()) {
      newErrors.api_key = "API Key is required";
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

    // Show TOTP modal instead of submitting directly
    setShowTotpModal(true);
  };

  const handleTotpSubmit = async () => {
    setTotpError("");

    // Validate TOTP
    if (!totpCode) {
      setTotpError("TOTP code is required");
      return;
    } else if (totpCode.length !== 6) {
      setTotpError("TOTP code must be 6 digits");
      return;
    } else if (!/^\d+$/.test(totpCode)) {
      setTotpError("TOTP code must contain only numbers");
      return;
    }

    // Check if user is logged in
    if (typeof window !== 'undefined') {
      const authUser = localStorage.getItem('auth_user');
      if (!authUser) {
        setShowTotpModal(false);
        setTotpCode("");
        setApiError("Please login first to connect a broker");
        setTimeout(() => {
          window.location.href = "/new-login";
        }, 2000);
        return;
      }
    }

    setIsLoading(true);

    try {
      // Get user_id from localStorage
      let userId = null;
      if (typeof window !== 'undefined') {
        const authUser = localStorage.getItem('auth_user');
        if (authUser) {
          try {
            const user = JSON.parse(authUser);
            userId = user.id;
          } catch (e) {
            console.error("Error parsing auth_user:", e);
          }
        }
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/brokers/connect/angel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          user_id: userId,  // Send user_id from localStorage
          credentials: {
            client_id: credentials.client_id.trim(),
            pin: credentials.pin,
            totp: totpCode,  // Use totpCode from modal instead of credentials.totp
            api_key: credentials.api_key.trim(),
          },
          display_name: credentials.display_name.trim() || `Angel One - ${credentials.client_id}`,
        }),
      });

      const result = await response.json();

      if (result.status === "error") {
        setShowTotpModal(false);
        setTotpCode("");
        switch (result.error_code) {
          case "AUTH_REQUIRED":
            setApiError("Please login to connect a broker");
            break;
          case "MISSING_CREDENTIALS":
            setApiError("Please fill in all required fields");
            break;
          case "INVALID_TOTP":
            setTotpError("Invalid TOTP code. Please try again.");
            setShowTotpModal(true);
            break;
          default:
            setApiError(result.message || "Failed to connect to Angel One");
        }
        return;
      }

      if (result.status === "success") {
        // Connection successful, close modal and redirect
        setShowTotpModal(false);
        setTotpCode("");
        router.push("/dashboard/brokers?connected=true");
      }
    } catch (error) {
      console.error("Connection error:", error);
      setShowTotpModal(false);
      setTotpCode("");
      setApiError("Connection error. Please check your internet connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    
    // Clear errors when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (apiError) {
      setApiError("");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => router.back()}
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-slate-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div>
            <h1 className="text-2xl font-bold text-white">Connect Angel One</h1>
            <p className="text-slate-400">Enter your Angel One credentials to connect your trading account</p>
          </div>
        </div>

        {/* Angel One Info Card */}
        <Card className="border-slate-700 bg-gradient-to-r from-orange-500/10 to-red-500/10">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">Angel One</h3>
                <p className="text-slate-300 text-sm mb-3">
                  India's leading discount broker with comprehensive trading features including equity, 
                  derivatives, commodities, and currency trading.
                </p>
                
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={() => window.open("https://www.angelone.in/", "_blank")}
                    variant="ghost"
                    size="sm"
                    className="text-orange-400 hover:text-orange-300"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit Website
                  </Button>
                  
                  <Button
                    onClick={() => window.open("https://www.angelone.in/support", "_blank")}
                    variant="ghost"
                    size="sm"
                    className="text-orange-400 hover:text-orange-300"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Get Help
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Connection Form */}
        <Card className="border-slate-700 bg-slate-800/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-400" />
              <span>Secure Connection</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* API Error Message */}
              {apiError && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-md p-3 flex items-start space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-400">{apiError}</p>
                </div>
              )}

              {/* Client ID */}
              <div className="space-y-2">
                <label htmlFor="client_id" className="text-sm font-medium text-slate-300">
                  Client ID *
                </label>
                <input
                  id="client_id"
                  name="client_id"
                  type="text"
                  value={credentials.client_id}
                  onChange={handleChange}
                  placeholder="Enter your Angel One Client ID"
                  className={`w-full px-3 py-2 bg-slate-800 border rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
                    errors.client_id ? "border-red-500" : "border-slate-700"
                  }`}
                  disabled={isLoading}
                />
                {errors.client_id && (
                  <p className="text-sm text-red-400">{errors.client_id}</p>
                )}
              </div>

              {/* Trading PIN */}
              <div className="space-y-2">
                <label htmlFor="pin" className="text-sm font-medium text-slate-300">
                  Trading PIN *
                </label>
                <div className="relative">
                  <input
                    id="pin"
                    name="pin"
                    type={showPin ? "text" : "password"}
                    value={credentials.pin}
                    onChange={handleChange}
                    placeholder="Enter your 4-digit trading PIN"
                    maxLength={4}
                    className={`w-full px-3 py-2 bg-slate-800 border rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
                      errors.pin ? "border-red-500" : "border-slate-700"
                    }`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                    disabled={isLoading}
                  >
                    {showPin ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.pin && (
                  <p className="text-sm text-red-400">{errors.pin}</p>
                )}
              </div>

              {/* API Key */}
              <div className="space-y-2">
                <label htmlFor="api_key" className="text-sm font-medium text-slate-300">
                  API Key *
                </label>
                <div className="relative">
                  <input
                    id="api_key"
                    name="api_key"
                    type={showApiKey ? "text" : "password"}
                    value={credentials.api_key}
                    onChange={handleChange}
                    placeholder="Enter your Angel One API Key"
                    className={`w-full px-3 py-2 bg-slate-800 border rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
                      errors.api_key ? "border-red-500" : "border-slate-700"
                    }`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                    disabled={isLoading}
                  >
                    {showApiKey ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.api_key && (
                  <p className="text-sm text-red-400">{errors.api_key}</p>
                )}
                <p className="text-xs text-slate-500">
                  Get your API key from Angel One's developer portal
                </p>
              </div>

              {/* Display Name (Optional) */}
              <div className="space-y-2">
                <label htmlFor="display_name" className="text-sm font-medium text-slate-300">
                  Connection Name (Optional)
                </label>
                <input
                  id="display_name"
                  name="display_name"
                  type="text"
                  value={credentials.display_name}
                  onChange={handleChange}
                  placeholder="e.g., My Angel One Account"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  disabled={isLoading}
                />
                <p className="text-xs text-slate-500">
                  Give this connection a custom name for easy identification
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Connecting to Angel One...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Save Credentials
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Security Info */}
        <Card className="border-slate-700 bg-slate-800/30">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-white font-medium mb-2">Security Information</h4>
                <ul className="text-slate-400 text-sm space-y-1">
                  <li>• Your credentials are encrypted and stored securely</li>
                  <li>• We never store your trading PIN or TOTP codes</li>
                  <li>• All connections use industry-standard security protocols</li>
                  <li>• You can disconnect your broker at any time</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* TOTP Modal */}
        {showTotpModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <Card className="w-full max-w-md border-slate-700 bg-slate-900 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-400" />
                  <span>Enter TOTP Code</span>
                </CardTitle>
                <p className="text-slate-400 text-sm mt-2">
                  Enter the 6-digit code from your authenticator app to complete the connection
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {totpError && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-md p-3 flex items-start space-x-2">
                    <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-400">{totpError}</p>
                  </div>
                )}
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    TOTP Code
                  </label>
                  <input
                    type="text"
                    value={totpCode}
                    onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-md text-white text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    maxLength={6}
                    autoFocus
                    disabled={isLoading}
                  />
                  <p className="text-xs text-slate-500 text-center">
                    Code expires in 30-60 seconds
                  </p>
                </div>
                
                <div className="flex space-x-3 pt-2">
                  <Button
                    onClick={() => {
                      setShowTotpModal(false);
                      setTotpCode("");
                      setTotpError("");
                    }}
                    variant="outline"
                    className="flex-1"
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleTotpSubmit}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                    disabled={isLoading || totpCode.length !== 6}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Verify & Connect
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}