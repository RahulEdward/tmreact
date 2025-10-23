"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, Button } from "@/components/ui";
import { Copy, RefreshCw, Key, Eye, EyeOff } from "lucide-react";

export default function ApiKeysPage() {
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApiKey();
  }, []);

  const fetchApiKey = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/apikey", {
        credentials: "include",
        headers: {
          "Accept": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setApiKey(data.data?.api_key || "");
      }
    } catch (error) {
      console.error("Error fetching API key:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateNewApiKey = async () => {
    try {
      const response = await fetch("http://localhost:5000/apikey", {
        method: "POST",
        credentials: "include",
        headers: {
          "Accept": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setApiKey(data.data?.api_key || "");
        alert("New API key generated successfully!");
      }
    } catch (error) {
      console.error("Error generating API key:", error);
      alert("Error generating API key!");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const maskApiKey = (key: string) => {
    if (!key) return "";
    return key.substring(0, 8) + "..." + key.substring(key.length - 8);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">API Keys</h1>
          <p className="text-slate-400">
            Manage your API keys for external integrations
          </p>
        </div>
        <Button onClick={fetchApiKey} disabled={loading} className="flex items-center space-x-2">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </Button>
      </div>

      {/* API Key Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Key className="h-5 w-5" />
              <span>Your API Key</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">
                API Key
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={showApiKey ? apiKey : maskApiKey(apiKey)}
                  readOnly
                  className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white text-sm font-mono"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="border-slate-700"
                >
                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(apiKey)}
                  className="border-slate-700"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Button onClick={generateNewApiKey} className="w-full" variant="gradient">
                Generate New API Key
              </Button>
              <p className="text-xs text-slate-500 text-center">
                Warning: Generating a new key will invalidate the current one
              </p>
            </div>
          </CardContent>
        </Card>

        {/* API Usage Instructions */}
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="text-white">API Usage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <p className="text-white font-medium mb-2">Authentication</p>
                <p className="text-sm text-slate-400">
                  Include your API key in the request URL or headers
                </p>
              </div>

              <div className="bg-slate-800/50 p-3 rounded-lg">
                <p className="text-xs text-slate-400 mb-2">URL Parameter:</p>
                <pre className="text-xs text-green-400 font-mono">
                  ?apikey=YOUR_API_KEY
                </pre>
              </div>

              <div className="bg-slate-800/50 p-3 rounded-lg">
                <p className="text-xs text-slate-400 mb-2">Header:</p>
                <pre className="text-xs text-green-400 font-mono">
                  X-API-Key: YOUR_API_KEY
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* API Endpoints */}
      <Card className="border-slate-800 bg-slate-900/50">
        <CardHeader>
          <CardTitle className="text-white">Available API Endpoints</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs font-medium rounded">
                    POST
                  </span>
                  <span className="text-white font-mono text-sm">/api/v1/placeorder</span>
                </div>
                <p className="text-xs text-slate-400">Place a new order</p>
              </div>

              <div className="p-4 bg-slate-800/50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-2 py-1 bg-red-500/10 text-red-400 text-xs font-medium rounded">
                    POST
                  </span>
                  <span className="text-white font-mono text-sm">/api/v1/cancelorder</span>
                </div>
                <p className="text-xs text-slate-400">Cancel an existing order</p>
              </div>

              <div className="p-4 bg-slate-800/50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs font-medium rounded">
                    GET
                  </span>
                  <span className="text-white font-mono text-sm">/positions</span>
                </div>
                <p className="text-xs text-slate-400">Get current positions</p>
              </div>

              <div className="p-4 bg-slate-800/50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs font-medium rounded">
                    GET
                  </span>
                  <span className="text-white font-mono text-sm">/orderbook</span>
                </div>
                <p className="text-xs text-slate-400">Get order book</p>
              </div>

              <div className="p-4 bg-slate-800/50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs font-medium rounded">
                    POST
                  </span>
                  <span className="text-white font-mono text-sm">/tradingview</span>
                </div>
                <p className="text-xs text-slate-400">TradingView webhook endpoint</p>
              </div>

              <div className="p-4 bg-slate-800/50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs font-medium rounded">
                    GET
                  </span>
                  <span className="text-white font-mono text-sm">/holdings</span>
                </div>
                <p className="text-xs text-slate-400">Get holdings data</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}