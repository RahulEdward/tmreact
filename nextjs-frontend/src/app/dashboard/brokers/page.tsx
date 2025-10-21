"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui";
import { Plus, Check, X, Settings } from "lucide-react";

export default function BrokersPage() {
  const [brokers] = useState([
    {
      id: "zerodha",
      name: "Zerodha",
      logo: "🇮🇳",
      status: "connected",
      region: "India",
      description: "Leading Indian discount broker with comprehensive API support",
      features: ["Indian Markets", "Kite API", "Options Trading"],
      connectedAt: "2024-01-15",
      apiKey: "****-****-****-1234",
    },
    {
      id: "interactive-brokers",
      name: "Interactive Brokers",
      logo: "🌐",
      status: "connected",
      region: "Global",
      description: "Global broker with access to 150+ markets worldwide",
      features: ["Global Markets", "TWS API", "Multi-Asset"],
      connectedAt: "2024-01-10",
      apiKey: "****-****-****-5678",
    },
    {
      id: "alpaca",
      name: "Alpaca",
      logo: "🦙",
      status: "available",
      region: "US",
      description: "Commission-free trading with developer-friendly API",
      features: ["US Stocks", "Commission-Free", "API-First"],
      connectedAt: null,
      apiKey: null,
    },
    {
      id: "binance",
      name: "Binance",
      logo: "₿",
      status: "available",
      region: "Global",
      description: "World's largest cryptocurrency exchange platform",
      features: ["Crypto Trading", "Futures", "Spot Markets"],
      connectedAt: null,
      apiKey: null,
    },
    {
      id: "td-ameritrade",
      name: "TD Ameritrade",
      logo: "📊",
      status: "coming-soon",
      region: "US",
      description: "Full-service broker with advanced trading platform",
      features: ["US Markets", "thinkorswim", "Options"],
      connectedAt: null,
      apiKey: null,
    },
  ]);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "connected":
        return "success";
      case "available":
        return "info";
      case "coming-soon":
        return "warning";
      default:
        return "secondary";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "connected":
        return "Connected";
      case "available":
        return "Available";
      case "coming-soon":
        return "Coming Soon";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Broker Connections</h1>
          <p className="text-slate-400">
            Manage your broker integrations and API connections
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-slate-800 bg-slate-900/50">
          <CardContent className="p-6">
            <p className="text-sm text-slate-400 mb-1">Connected Brokers</p>
            <p className="text-3xl font-bold text-green-400">
              {brokers.filter((b) => b.status === "connected").length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-slate-800 bg-slate-900/50">
          <CardContent className="p-6">
            <p className="text-sm text-slate-400 mb-1">Available Brokers</p>
            <p className="text-3xl font-bold text-white">
              {brokers.filter((b) => b.status === "available").length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-slate-800 bg-slate-900/50">
          <CardContent className="p-6">
            <p className="text-sm text-slate-400 mb-1">Coming Soon</p>
            <p className="text-3xl font-bold text-amber-400">
              {brokers.filter((b) => b.status === "coming-soon").length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Brokers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {brokers.map((broker) => (
          <Card
            key={broker.id}
            className={`border-slate-800 bg-slate-900/50 ${
              broker.status === "connected" ? "border-green-500/20" : ""
            }`}
          >
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{broker.logo}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{broker.name}</h3>
                    <p className="text-sm text-slate-500">{broker.region}</p>
                  </div>
                </div>
                <Badge variant={getStatusVariant(broker.status)}>
                  {getStatusText(broker.status)}
                </Badge>
              </div>

              {/* Description */}
              <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                {broker.description}
              </p>

              {/* Features */}
              <div className="mb-4">
                <p className="text-xs font-medium text-slate-300 uppercase tracking-wide mb-2">
                  Key Features
                </p>
                <div className="flex flex-wrap gap-2">
                  {broker.features.map((feature, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-xs border-slate-700 text-slate-400"
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Connection Info */}
              {broker.status === "connected" && (
                <div className="mb-4 p-3 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-slate-400">API Key</p>
                    <p className="text-xs text-slate-300 font-mono">{broker.apiKey}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-400">Connected</p>
                    <p className="text-xs text-slate-300">{broker.connectedAt}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center space-x-2">
                {broker.status === "connected" ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-slate-700"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-red-500/20 text-red-400 hover:bg-red-500/10"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Disconnect
                    </Button>
                  </>
                ) : broker.status === "available" ? (
                  <Button variant="gradient" size="sm" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Connect Broker
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" className="w-full" disabled>
                    Coming Soon
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Request Integration */}
      <Card className="border-slate-800 bg-slate-900/50">
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-semibold text-white mb-2">
            Don't see your broker?
          </h3>
          <p className="text-slate-400 mb-4">
            We're constantly adding new integrations. Request a broker and we'll prioritize
            it.
          </p>
          <Button variant="outline" className="border-slate-700">
            Request Broker Integration
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
