"use client";

import { Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

export default function DashboardPage() {
  // Mock data - replace with real API calls
  const stats = [
    {
      title: "Total P&L",
      value: "$12,345.67",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
    },
    {
      title: "Active Strategies",
      value: "8",
      change: "+2",
      trend: "up",
      icon: TrendingUp,
    },
    {
      title: "Total Trades",
      value: "1,234",
      change: "+45",
      trend: "up",
      icon: Activity,
    },
    {
      title: "Win Rate",
      value: "68.5%",
      change: "-2.3%",
      trend: "down",
      icon: TrendingUp,
    },
  ];

  const recentTrades = [
    {
      id: "1",
      symbol: "AAPL",
      type: "BUY",
      quantity: 100,
      price: 175.23,
      status: "completed",
      timestamp: "2 minutes ago",
    },
    {
      id: "2",
      symbol: "TSLA",
      type: "SELL",
      quantity: 50,
      price: 242.15,
      status: "completed",
      timestamp: "15 minutes ago",
    },
    {
      id: "3",
      symbol: "MSFT",
      type: "BUY",
      quantity: 75,
      price: 378.92,
      status: "pending",
      timestamp: "1 hour ago",
    },
  ];

  const activeStrategies = [
    {
      id: "1",
      name: "Momentum Scalper",
      broker: "Zerodha",
      status: "active",
      pnl: "+$1,234.56",
      trades: 45,
    },
    {
      id: "2",
      name: "Mean Reversion",
      broker: "Interactive Brokers",
      status: "active",
      pnl: "+$892.34",
      trades: 32,
    },
    {
      id: "3",
      name: "Breakout Trader",
      broker: "Alpaca",
      status: "paused",
      pnl: "-$123.45",
      trades: 18,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-slate-400">
          Monitor your trading performance and active strategies
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-slate-800 bg-slate-900/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${
                  stat.trend === "up"
                    ? "from-green-500/10 to-emerald-500/10"
                    : "from-red-500/10 to-rose-500/10"
                }`}>
                  <stat.icon className={`h-5 w-5 ${
                    stat.trend === "up" ? "text-green-400" : "text-red-400"
                  }`} />
                </div>
                <div className={`flex items-center space-x-1 text-sm ${
                  stat.trend === "up" ? "text-green-400" : "text-red-400"
                }`}>
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                  <span>{stat.change}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Trades */}
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="text-white">Recent Trades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTrades.map((trade) => (
                <div
                  key={trade.id}
                  className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`px-3 py-1 rounded text-xs font-medium ${
                      trade.type === "BUY"
                        ? "bg-green-500/10 text-green-400"
                        : "bg-red-500/10 text-red-400"
                    }`}>
                      {trade.type}
                    </div>
                    <div>
                      <p className="text-white font-medium">{trade.symbol}</p>
                      <p className="text-sm text-slate-400">
                        {trade.quantity} @ ${trade.price}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={trade.status === "completed" ? "success" : "warning"}
                    >
                      {trade.status}
                    </Badge>
                    <p className="text-xs text-slate-400 mt-1">{trade.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Strategies */}
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="text-white">Active Strategies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeStrategies.map((strategy) => (
                <div
                  key={strategy.id}
                  className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg"
                >
                  <div>
                    <p className="text-white font-medium mb-1">{strategy.name}</p>
                    <p className="text-sm text-slate-400">{strategy.broker}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium mb-1 ${
                      strategy.pnl.startsWith("+") ? "text-green-400" : "text-red-400"
                    }`}>
                      {strategy.pnl}
                    </p>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={strategy.status === "active" ? "success" : "warning"}
                      >
                        {strategy.status}
                      </Badge>
                      <span className="text-xs text-slate-400">
                        {strategy.trades} trades
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-slate-800 bg-slate-900/50">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 bg-slate-800/50 hover:bg-slate-800 rounded-lg text-left transition-colors duration-200">
              <TrendingUp className="h-6 w-6 text-violet-400 mb-2" />
              <p className="text-white font-medium mb-1">Create Strategy</p>
              <p className="text-sm text-slate-400">Build a new trading strategy</p>
            </button>
            <button className="p-4 bg-slate-800/50 hover:bg-slate-800 rounded-lg text-left transition-colors duration-200">
              <Activity className="h-6 w-6 text-cyan-400 mb-2" />
              <p className="text-white font-medium mb-1">Connect Broker</p>
              <p className="text-sm text-slate-400">Add a new broker connection</p>
            </button>
            <button className="p-4 bg-slate-800/50 hover:bg-slate-800 rounded-lg text-left transition-colors duration-200">
              <DollarSign className="h-6 w-6 text-green-400 mb-2" />
              <p className="text-white font-medium mb-1">View Analytics</p>
              <p className="text-sm text-slate-400">Analyze your performance</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
