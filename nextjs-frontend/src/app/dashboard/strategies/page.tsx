"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui";
import { Plus, Play, Pause, Trash2, Edit, TrendingUp, TrendingDown } from "lucide-react";

export default function StrategiesPage() {
  const [strategies] = useState([
    {
      id: "1",
      name: "Momentum Scalper",
      description: "Quick scalping strategy based on momentum indicators",
      broker: "Zerodha",
      status: "active",
      pnl: "+$1,234.56",
      trades: 45,
      winRate: 68.5,
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      name: "Mean Reversion",
      description: "Buy oversold, sell overbought using RSI and Bollinger Bands",
      broker: "Interactive Brokers",
      status: "active",
      pnl: "+$892.34",
      trades: 32,
      winRate: 72.3,
      createdAt: "2024-01-10",
    },
    {
      id: "3",
      name: "Breakout Trader",
      description: "Trade breakouts from consolidation patterns",
      broker: "Alpaca",
      status: "paused",
      pnl: "-$123.45",
      trades: 18,
      winRate: 55.6,
      createdAt: "2024-01-20",
    },
    {
      id: "4",
      name: "Trend Following",
      description: "Follow strong trends using moving average crossovers",
      broker: "Binance",
      status: "inactive",
      pnl: "+$456.78",
      trades: 28,
      winRate: 64.3,
      createdAt: "2024-01-05",
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "paused":
        return "warning";
      case "inactive":
        return "secondary";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Trading Strategies</h1>
          <p className="text-slate-400">
            Manage and monitor your automated trading strategies
          </p>
        </div>
        <Button variant="gradient" className="flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Create Strategy</span>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-slate-800 bg-slate-900/50">
          <CardContent className="p-6">
            <p className="text-sm text-slate-400 mb-1">Total Strategies</p>
            <p className="text-3xl font-bold text-white">{strategies.length}</p>
          </CardContent>
        </Card>
        <Card className="border-slate-800 bg-slate-900/50">
          <CardContent className="p-6">
            <p className="text-sm text-slate-400 mb-1">Active</p>
            <p className="text-3xl font-bold text-green-400">
              {strategies.filter((s) => s.status === "active").length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-slate-800 bg-slate-900/50">
          <CardContent className="p-6">
            <p className="text-sm text-slate-400 mb-1">Total Trades</p>
            <p className="text-3xl font-bold text-white">
              {strategies.reduce((sum, s) => sum + s.trades, 0)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-slate-800 bg-slate-900/50">
          <CardContent className="p-6">
            <p className="text-sm text-slate-400 mb-1">Total P&L</p>
            <p className="text-3xl font-bold text-green-400">
              $
              {strategies
                .reduce((sum, s) => {
                  const pnl = parseFloat(s.pnl.replace(/[$,+]/g, ""));
                  return sum + pnl;
                }, 0)
                .toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Strategies List */}
      <div className="grid grid-cols-1 gap-6">
        {strategies.map((strategy) => (
          <Card key={strategy.id} className="border-slate-800 bg-slate-900/50">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-white">
                      {strategy.name}
                    </h3>
                    <Badge variant={getStatusColor(strategy.status)}>
                      {strategy.status}
                    </Badge>
                  </div>
                  <p className="text-slate-400 mb-3">{strategy.description}</p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-slate-400">
                      Broker: <span className="text-white">{strategy.broker}</span>
                    </span>
                    <span className="text-slate-400">
                      Created: <span className="text-white">{strategy.createdAt}</span>
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {strategy.status === "active" ? (
                    <Button variant="outline" size="sm" className="border-slate-700">
                      <Pause className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" className="border-slate-700">
                      <Play className="h-4 w-4" />
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="border-slate-700">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Strategy Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800">
                <div>
                  <p className="text-sm text-slate-400 mb-1">P&L</p>
                  <div className="flex items-center space-x-2">
                    {strategy.pnl.startsWith("+") ? (
                      <TrendingUp className="h-4 w-4 text-green-400" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-400" />
                    )}
                    <p
                      className={`text-lg font-semibold ${
                        strategy.pnl.startsWith("+") ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {strategy.pnl}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">Total Trades</p>
                  <p className="text-lg font-semibold text-white">{strategy.trades}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">Win Rate</p>
                  <p className="text-lg font-semibold text-white">{strategy.winRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
