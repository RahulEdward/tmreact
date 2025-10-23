"use client";

import { useState, useEffect } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { 
  Plus, 
  Settings, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  Trash2, 
  ExternalLink,
  Shield,
  TrendingUp,
  Clock,
  Wifi,
  WifiOff
} from "lucide-react";

interface BrokerConnection {
  id: number;
  broker_type: string;
  broker_name: string;
  broker_user_id: string;
  display_name: string;
  connected_at: string;
  last_sync_at: string | null;
  is_active: boolean;
  status: "connected" | "expired";
  features: string[];
}

interface SupportedBroker {
  name: string;
  display_name: string;
  description: string;
  status: "active" | "coming_soon";
  features: string[];
  required_credentials: string[];
  logo?: string;
  website?: string;
}

export default function BrokerManagement() {
  const [connections, setConnections] = useState<BrokerConnection[]>([]);
  const [supportedBrokers, setSupportedBrokers] = useState<Record<string, SupportedBroker>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showAddBroker, setShowAddBroker] = useState(true);  // Default to true to show Angel One form
  const [error, setError] = useState("");

  useEffect(() => {
    loadBrokerData();
  }, []);

  const loadBrokerData = async () => {
    try {
      setIsLoading(true);
      
      // Load supported brokers
      const supportedResponse = await fetch("http://localhost:5000/brokers/supported", {
        credentials: "include",
      });
      
      if (supportedResponse.ok) {
        const supportedData = await supportedResponse.json();
        setSupportedBrokers(supportedData.brokers || {});
      }

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

      // Load user connections
      const connectionsUrl = userId 
        ? `http://localhost:5000/brokers/user-connections?user_id=${userId}`
        : "http://localhost:5000/brokers/user-connections";
      
      const connectionsResponse = await fetch(connectionsUrl, {
        credentials: "include",
      });
      
      if (connectionsResponse.ok) {
        const connectionsData = await connectionsResponse.json();
        setConnections(connectionsData.brokers || []);
      } else if (connectionsResponse.status === 401) {
        setError("Please login to view broker connections");
      }
    } catch (error) {
      console.error("Error loading broker data:", error);
      setError("Failed to load broker information");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshConnection = async (connectionId: number) => {
    try {
      const response = await fetch(`http://localhost:5000/brokers/refresh/${connectionId}`, {
        method: "POST",
        credentials: "include",
      });

      const result = await response.json();
      
      if (result.status === "success") {
        // Reload connections to get updated status
        loadBrokerData();
      } else {
        setError(result.message || "Failed to refresh connection");
      }
    } catch (error) {
      setError("Failed to refresh broker connection");
    }
  };

  const handleDisconnectBroker = async (connectionId: number, brokerName: string) => {
    if (!confirm(`Are you sure you want to disconnect from ${brokerName}?`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/brokers/disconnect/${connectionId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await response.json();
      
      if (result.status === "success") {
        // Remove the connection from state
        setConnections(prev => prev.filter(conn => conn.id !== connectionId));
      } else {
        setError(result.message || "Failed to disconnect broker");
      }
    } catch (error) {
      setError("Failed to disconnect broker");
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <Wifi className="h-4 w-4 text-green-400" />;
      case "expired":
        return <WifiOff className="h-4 w-4 text-red-400" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "text-green-400";
      case "expired":
        return "text-red-400";
      default:
        return "text-yellow-400";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Broker Management</h2>
        </div>
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-6 w-6 animate-spin text-slate-400" />
          <span className="ml-2 text-slate-400">Loading broker information...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Broker Management</h2>
          <p className="text-slate-400">Connect and manage your trading broker accounts</p>
        </div>
        
        {connections.length === 0 && (
          <Button
            onClick={() => setShowAddBroker(true)}
            variant="gradient"
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Broker</span>
          </Button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-400 font-medium">Error</p>
            <p className="text-red-300 text-sm">{error}</p>
          </div>
          <button
            onClick={() => setError("")}
            className="ml-auto text-red-400 hover:text-red-300"
          >
            ×
          </button>
        </div>
      )}

      {/* Connected Brokers */}
      {connections.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Connected Brokers ({connections.length})</h3>
            <Button
              onClick={() => setShowAddBroker(true)}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Another</span>
            </Button>
          </div>

          <div className="grid gap-4">
            {connections.map((connection) => (
              <Card key={connection.id} className="border-slate-700 bg-slate-800/50">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="text-lg font-semibold text-white">{connection.broker_name}</h4>
                          {getStatusIcon(connection.status)}
                          <span className={`text-sm font-medium ${getStatusColor(connection.status)}`}>
                            {connection.status === "connected" ? "Connected" : "Expired"}
                          </span>
                        </div>
                        
                        <p className="text-slate-400 text-sm mb-2">
                          Client ID: {connection.broker_user_id}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-xs text-slate-500">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>Connected: {formatDate(connection.connected_at)}</span>
                          </div>
                          {connection.last_sync_at && (
                            <div className="flex items-center space-x-1">
                              <RefreshCw className="h-3 w-3" />
                              <span>Last sync: {formatDate(connection.last_sync_at)}</span>
                            </div>
                          )}
                        </div>

                        {/* Features */}
                        <div className="flex flex-wrap gap-1 mt-3">
                          {connection.features.map((feature) => (
                            <span
                              key={feature}
                              className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded-md"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {connection.status === "expired" && (
                        <Button
                          onClick={() => handleRefreshConnection(connection.id)}
                          variant="outline"
                          size="sm"
                          className="flex items-center space-x-1"
                        >
                          <RefreshCw className="h-3 w-3" />
                          <span>Refresh</span>
                        </Button>
                      )}
                      
                      <Button
                        onClick={() => handleDisconnectBroker(connection.id, connection.broker_name)}
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* No Brokers Connected */}
      {connections.length === 0 && !showAddBroker && (
        <Card className="border-slate-700 bg-slate-800/30">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Brokers Connected</h3>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              Connect your trading broker account to start trading. We currently support Angel One with more brokers coming soon.
            </p>
            <Button
              onClick={() => setShowAddBroker(true)}
              variant="gradient"
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Connect Your First Broker</span>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Add Broker Section */}
      {showAddBroker && (
        <Card className="border-slate-700 bg-slate-800/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Add Broker Connection</CardTitle>
              <Button
                onClick={() => setShowAddBroker(false)}
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-slate-300"
              >
                ×
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(supportedBrokers).map(([brokerType, broker]) => (
                <div
                  key={brokerType}
                  className="border border-slate-600 rounded-lg p-4 hover:border-slate-500 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="text-lg font-semibold text-white">{broker.display_name}</h4>
                          {broker.status === "active" && (
                            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                              Available
                            </span>
                          )}
                        </div>
                        
                        <p className="text-slate-400 text-sm mb-3">{broker.description}</p>
                        
                        <div className="flex flex-wrap gap-1">
                          {broker.features.map((feature) => (
                            <span
                              key={feature}
                              className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded-md"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {broker.website && (
                        <Button
                          onClick={() => window.open(broker.website, "_blank")}
                          variant="ghost"
                          size="sm"
                          className="text-slate-400 hover:text-slate-300"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                      
                      <Button
                        onClick={() => {
                          // Navigate to broker connection form
                          window.location.href = `/dashboard/brokers/connect/${brokerType}`;
                        }}
                        variant="gradient"
                        size="sm"
                        disabled={broker.status !== "active"}
                      >
                        {broker.status === "active" ? "Connect" : "Coming Soon"}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Section */}
      <Card className="border-slate-700 bg-slate-800/30">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-white font-medium mb-1">Secure Connection</h4>
              <p className="text-slate-400 text-sm">
                Your broker credentials are encrypted and stored securely. We never store your trading PIN or TOTP codes.
                All connections use industry-standard security protocols.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}