"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui";
import {
    Activity,
    RefreshCw,
    Zap,
    AlertCircle,
    Settings,
    TrendingUp,
    DollarSign,
    BarChart3,
    Wifi,
    WifiOff
} from "lucide-react";

export default function MT5Page() {
    const [connectionStatus, setConnectionStatus] = useState("disconnected");
    const [mt5Config, setMt5Config] = useState({
        server: "",
        login: "",
        password: "",
        path: "C:\\Program Files\\MetaTrader 5\\terminal64.exe"
    });
    const [accountInfo, setAccountInfo] = useState<any>(null);
    const [positions, setPositions] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        checkMT5Status();
    }, []);

    const checkMT5Status = async () => {
        try {
            const response = await fetch("http://localhost:5000/mt5/status", {
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.json();
                setConnectionStatus(data.status);
                if (data.account_info) {
                    setAccountInfo(data.account_info);
                }
            }
        } catch (error) {
            console.error("Error checking MT5 status:", error);
            setConnectionStatus("error");
        }
    };

    const connectMT5 = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await fetch("http://localhost:5000/mt5/connect", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(mt5Config),
            });

            const data = await response.json();

            if (response.ok) {
                setConnectionStatus("connected");
                setAccountInfo(data.account_info);
                alert("✅ MT5 Connected Successfully!");
                fetchMT5Data();
            } else {
                setError(data.message || "Failed to connect to MT5");
                alert("❌ MT5 Connection Failed: " + (data.message || "Unknown error"));
            }
        } catch (error) {
            console.error("Error connecting to MT5:", error);
            setError("Network error: Could not connect to server");
            alert("❌ Network Error: Could not connect to server");
        } finally {
            setLoading(false);
        }
    };

    const disconnectMT5 = async () => {
        try {
            const response = await fetch("http://localhost:5000/mt5/disconnect", {
                method: "POST",
                credentials: "include",
            });

            if (response.ok) {
                setConnectionStatus("disconnected");
                setAccountInfo(null);
                setPositions([]);
                setOrders([]);
                alert("✅ MT5 Disconnected Successfully!");
            }
        } catch (error) {
            console.error("Error disconnecting MT5:", error);
        }
    };

    const fetchMT5Data = async () => {
        if (connectionStatus !== "connected") return;

        try {
            // Fetch positions
            const positionsRes = await fetch("http://localhost:5000/mt5/positions", {
                credentials: "include",
            });
            if (positionsRes.ok) {
                const positionsData = await positionsRes.json();
                setPositions(positionsData.positions || []);
            }

            // Fetch orders
            const ordersRes = await fetch("http://localhost:5000/mt5/orders", {
                credentials: "include",
            });
            if (ordersRes.ok) {
                const ordersData = await ordersRes.json();
                setOrders(ordersData.orders || []);
            }
        } catch (error) {
            console.error("Error fetching MT5 data:", error);
        }
    };

    const placeOrder = async (symbol: string, orderType: string, volume: number) => {
        try {
            const response = await fetch("http://localhost:5000/mt5/order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    symbol,
                    order_type: orderType,
                    volume,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("✅ Order placed successfully!");
                fetchMT5Data(); // Refresh data
            } else {
                alert("❌ Order failed: " + (data.message || "Unknown error"));
            }
        } catch (error) {
            console.error("Error placing order:", error);
            alert("❌ Network error placing order");
        }
    };

    const getStatusColor = () => {
        switch (connectionStatus) {
            case "connected": return "text-green-400";
            case "connecting": return "text-yellow-400";
            case "disconnected": return "text-slate-400";
            case "error": return "text-red-400";
            default: return "text-slate-400";
        }
    };

    const getStatusIcon = () => {
        switch (connectionStatus) {
            case "connected": return <Wifi className="h-5 w-5 text-green-400" />;
            case "connecting": return <RefreshCw className="h-5 w-5 text-yellow-400 animate-spin" />;
            case "disconnected": return <WifiOff className="h-5 w-5 text-slate-400" />;
            case "error": return <AlertCircle className="h-5 w-5 text-red-400" />;
            default: return <WifiOff className="h-5 w-5 text-slate-400" />;
        }
    };

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">MetaTrader 5 Integration</h1>
                    <p className="text-slate-400">
                        Connect and manage your MT5 trading account
                    </p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        {getStatusIcon()}
                        <span className={`text-sm font-medium ${getStatusColor()}`}>
                            {connectionStatus.charAt(0).toUpperCase() + connectionStatus.slice(1)}
                        </span>
                    </div>
                    <Button onClick={checkMT5Status} size="sm" variant="outline">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Connection Configuration */}
            <Card className="border-slate-800 bg-slate-900/50">
                <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-2">
                        <Settings className="h-5 w-5" />
                        <span>MT5 Connection Settings</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Server
                            </label>
                            <input
                                type="text"
                                value={mt5Config.server}
                                onChange={(e) => setMt5Config({ ...mt5Config, server: e.target.value })}
                                placeholder="e.g., MetaQuotes-Demo"
                                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white"
                                disabled={connectionStatus === "connected"}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Login
                            </label>
                            <input
                                type="text"
                                value={mt5Config.login}
                                onChange={(e) => setMt5Config({ ...mt5Config, login: e.target.value })}
                                placeholder="Your MT5 login number"
                                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white"
                                disabled={connectionStatus === "connected"}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={mt5Config.password}
                                onChange={(e) => setMt5Config({ ...mt5Config, password: e.target.value })}
                                placeholder="Your MT5 password"
                                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white"
                                disabled={connectionStatus === "connected"}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                MT5 Path
                            </label>
                            <input
                                type="text"
                                value={mt5Config.path}
                                onChange={(e) => setMt5Config({ ...mt5Config, path: e.target.value })}
                                placeholder="Path to terminal64.exe"
                                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white"
                                disabled={connectionStatus === "connected"}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg">
                            <p>{error}</p>
                        </div>
                    )}

                    <div className="flex items-center space-x-4">
                        {connectionStatus === "connected" ? (
                            <Button
                                onClick={disconnectMT5}
                                variant="outline"
                                className="border-red-700 text-red-400 hover:bg-red-900/20"
                            >
                                <WifiOff className="h-4 w-4 mr-2" />
                                Disconnect
                            </Button>
                        ) : (
                            <Button
                                onClick={connectMT5}
                                disabled={loading || !mt5Config.server || !mt5Config.login || !mt5Config.password}
                                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                            >
                                {loading ? (
                                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                    <Wifi className="h-4 w-4 mr-2" />
                                )}
                                {loading ? "Connecting..." : "Connect to MT5"}
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Account Information */}
            {accountInfo && (
                <Card className="border-slate-800 bg-slate-900/50">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center space-x-2">
                            <DollarSign className="h-5 w-5" />
                            <span>Account Information</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-slate-800/50 p-4 rounded-lg">
                                <p className="text-sm text-slate-400">Account</p>
                                <p className="text-lg font-bold text-white">{accountInfo.login}</p>
                            </div>
                            <div className="bg-slate-800/50 p-4 rounded-lg">
                                <p className="text-sm text-slate-400">Balance</p>
                                <p className="text-lg font-bold text-green-400">${accountInfo.balance?.toFixed(2) || "0.00"}</p>
                            </div>
                            <div className="bg-slate-800/50 p-4 rounded-lg">
                                <p className="text-sm text-slate-400">Equity</p>
                                <p className="text-lg font-bold text-blue-400">${accountInfo.equity?.toFixed(2) || "0.00"}</p>
                            </div>
                            <div className="bg-slate-800/50 p-4 rounded-lg">
                                <p className="text-sm text-slate-400">Margin</p>
                                <p className="text-lg font-bold text-yellow-400">${accountInfo.margin?.toFixed(2) || "0.00"}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Positions and Orders */}
            {connectionStatus === "connected" && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {/* Positions */}
                    <Card className="border-slate-800 bg-slate-900/50">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center space-x-2">
                                <TrendingUp className="h-5 w-5" />
                                <span>Open Positions</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {positions.length > 0 ? (
                                    positions.map((position, index) => (
                                        <div key={index} className="bg-slate-800/50 p-3 rounded-lg">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-white font-medium">{position.symbol}</p>
                                                    <p className="text-sm text-slate-400">
                                                        {position.type} • Volume: {position.volume}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className={`font-medium ${position.profit >= 0 ? "text-green-400" : "text-red-400"
                                                        }`}>
                                                        ${position.profit?.toFixed(2) || "0.00"}
                                                    </p>
                                                    <p className="text-sm text-slate-400">
                                                        @ {position.price_open}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center text-slate-400 py-8">
                                        <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                        <p>No open positions</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Orders */}
                    <Card className="border-slate-800 bg-slate-900/50">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center space-x-2">
                                <BarChart3 className="h-5 w-5" />
                                <span>Pending Orders</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {orders.length > 0 ? (
                                    orders.map((order, index) => (
                                        <div key={index} className="bg-slate-800/50 p-3 rounded-lg">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-white font-medium">{order.symbol}</p>
                                                    <p className="text-sm text-slate-400">
                                                        {order.type} • Volume: {order.volume}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <Badge variant="outline">{order.state}</Badge>
                                                    <p className="text-sm text-slate-400 mt-1">
                                                        @ {order.price_open}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center text-slate-400 py-8">
                                        <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                        <p>No pending orders</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Quick Trading */}
            {connectionStatus === "connected" && (
                <Card className="border-slate-800 bg-slate-900/50">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center space-x-2">
                            <Zap className="h-5 w-5" />
                            <span>Quick Trading</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Button
                                onClick={() => placeOrder("EURUSD", "BUY", 0.01)}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                Buy EUR/USD 0.01
                            </Button>
                            <Button
                                onClick={() => placeOrder("EURUSD", "SELL", 0.01)}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                Sell EUR/USD 0.01
                            </Button>
                            <Button
                                onClick={fetchMT5Data}
                                variant="outline"
                                className="border-slate-700"
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Refresh Data
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}