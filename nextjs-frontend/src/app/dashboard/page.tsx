"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { 
  CheckCircle, 
  AlertCircle, 
  Building2,
  Activity,
  Zap,
  Wallet,
  Shield,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui";

interface BrokerConnection {
  id: number;
  broker_name: string;
  status: "connected" | "expired";
  broker_user_id: string;
}

interface Funds {
  available_cash: number;
  used_margin: number;
  available_margin: number;
}

export default function DashboardPage() {
  const [brokerConnections, setBrokerConnections] = useState<BrokerConnection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showTotpModal, setShowTotpModal] = useState(false);
  const [totpCode, setTotpCode] = useState("");
  const [totpError, setTotpError] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "success" | "error">("idle");
  const [funds, setFunds] = useState<Funds | null>(null);
  const [loadingFunds, setLoadingFunds] = useState(false);

  useEffect(() => {
    loadBrokerConnections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadBrokerConnections = async () => {
    try {
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

      const connectionsUrl = userId 
        ? `http://localhost:5000/brokers/user-connections?user_id=${userId}`
        : "http://localhost:5000/brokers/user-connections";

      const response = await fetch(connectionsUrl, {
        credentials: "include",
      });
      
      if (response.ok) {
        const data = await response.json();
        setBrokerConnections(data.brokers || []);
        
        // Load funds if broker is connected
        if (data.brokers && data.brokers.length > 0) {
          loadFunds();
        }
      }
    } catch (error) {
      console.error("Error loading broker connections:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadFunds = async () => {
    setLoadingFunds(true);
    try {
      // Mock funds data - replace with actual API call
      setTimeout(() => {
        setFunds({
          available_cash: 50000,
          used_margin: 15000,
          available_margin: 35000
        });
        setLoadingFunds(false);
      }, 1000);
    } catch (error) {
      console.error("Error loading funds:", error);
      setLoadingFunds(false);
    }
  };

  const handleQuickConnect = () => {
    setShowTotpModal(true);
    setConnectionStatus("idle");
    setTotpError("");
  };

  const handleTotpSubmit = async () => {
    setTotpError("");

    if (!totpCode || totpCode.length !== 6) {
      setTotpError("Please enter a valid 6-digit TOTP code");
      return;
    }

    setIsConnecting(true);

    try {
      // Get stored credentials from localStorage or prompt user
      let userId = null;
      if (typeof window !== 'undefined') {
        const authUser = localStorage.getItem('auth_user');
        if (authUser) {
          const user = JSON.parse(authUser);
          userId = user.id;
        }
      }

      // For quick connect, we need stored credentials
      // This is a simplified version - you may want to store encrypted credentials
      const response = await fetch(`http://localhost:5000/brokers/connect/angel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          user_id: userId,
          credentials: {
            client_id: "LLVR1277", // Get from stored credentials
            pin: "2105", // Get from stored credentials
            totp: totpCode,
            api_key: "z6DaAedv", // Get from stored credentials
          },
          display_name: "Quick Connect",
        }),
      });

      const result = await response.json();

      if (result.status === "success") {
        setConnectionStatus("success");
        setShowTotpModal(false);
        setTotpCode("");
        loadBrokerConnections();
      } else {
        setConnectionStatus("error");
        setTotpError(result.message || "Connection failed");
      }
    } catch (error) {
      console.error("Connection error:", error);
      setConnectionStatus("error");
      setTotpError("Connection error. Please try again.");
    } finally {
      setIsConnecting(false);
    }
  };

  const connectedBrokers = brokerConnections.filter(b => b.status === "connected");
  const expiredBrokers = brokerConnections.filter(b => b.status === "expired");

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-slate-400">
          Welcome to your trading dashboard
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Broker Status Card */}
        <Card className="border-slate-700 bg-slate-800/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Broker Connections
            </CardTitle>
            <Building2 className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white mb-1">
              {isLoading ? "..." : brokerConnections.length}
            </div>
            <div className="flex items-center space-x-4 text-xs">
              {connectedBrokers.length > 0 && (
                <div className="flex items-center space-x-1 text-green-400">
                  <CheckCircle className="h-3 w-3" />
                  <span>{connectedBrokers.length} Connected</span>
                </div>
              )}
              {expiredBrokers.length > 0 && (
                <div className="flex items-center space-x-1 text-red-400">
                  <AlertCircle className="h-3 w-3" />
                  <span>{expiredBrokers.length} Expired</span>
                </div>
              )}
              {brokerConnections.length === 0 && !isLoading && (
                <span className="text-slate-500">No brokers connected</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Trading Activity Card */}
        <Card className="border-slate-700 bg-slate-800/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Trading Activity
            </CardTitle>
            <Activity className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white mb-1">0</div>
            <p className="text-xs text-slate-500">
              Orders today
            </p>
          </CardContent>
        </Card>

        {/* Funds Card */}
        <Card className="border-slate-700 bg-slate-800/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Available Funds
            </CardTitle>
            <Wallet className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            {loadingFunds ? (
              <div className="text-2xl font-bold text-white mb-1">...</div>
            ) : funds ? (
              <>
                <div className="text-2xl font-bold text-green-400 mb-1">
                  ₹{funds.available_cash.toLocaleString()}
                </div>
                <p className="text-xs text-slate-500">
                  Margin: ₹{funds.available_margin.toLocaleString()}
                </p>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold text-slate-500 mb-1">--</div>
                <p className="text-xs text-slate-500">Connect broker to view</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Connect Broker */}
      <Card className="border-slate-700 bg-slate-800/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span>Quick Connect Broker</span>
            {connectionStatus === "success" && (
              <CheckCircle className="h-5 w-5 text-green-400" />
            )}
            {connectionStatus === "error" && (
              <AlertCircle className="h-5 w-5 text-red-400" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm mb-2">
                Connect your broker with TOTP authentication
              </p>
              {connectedBrokers.length > 0 && (
                <p className="text-green-400 text-xs">
                  ✓ {connectedBrokers[0].broker_name} connected
                </p>
              )}
            </div>
            <Button
              onClick={handleQuickConnect}
              className={`${
                connectionStatus === "success"
                  ? "bg-green-600 hover:bg-green-700"
                  : connectionStatus === "error"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              }`}
            >
              {connectionStatus === "success" ? (
                "Connected"
              ) : connectionStatus === "error" ? (
                "Retry"
              ) : (
                "Connect Broker"
              )}
            </Button>
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
                Enter the 6-digit code from your authenticator app
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
                  disabled={isConnecting}
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
                  disabled={isConnecting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleTotpSubmit}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                  disabled={isConnecting || totpCode.length !== 6}
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Connect
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/dashboard/orders">
          <Card className="border-slate-700 bg-slate-800/30 hover:bg-slate-800/50 transition-colors cursor-pointer">
            <CardContent className="p-6 text-center">
              <Activity className="h-8 w-8 text-violet-400 mx-auto mb-3" />
              <h3 className="text-white font-medium mb-1">View Orders</h3>
              <p className="text-slate-400 text-sm">Check your trading orders</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/tradingview">
          <Card className="border-slate-700 bg-slate-800/30 hover:bg-slate-800/50 transition-colors cursor-pointer">
            <CardContent className="p-6 text-center">
              <Zap className="h-8 w-8 text-cyan-400 mx-auto mb-3" />
              <h3 className="text-white font-medium mb-1">TradingView</h3>
              <p className="text-slate-400 text-sm">Analyze charts and markets</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
