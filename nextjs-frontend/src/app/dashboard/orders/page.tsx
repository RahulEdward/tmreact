"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui";
import { RefreshCw, X } from "lucide-react";

export default function OrdersPage() {
  const [orderbook, setOrderbook] = useState([]);
  const [tradebook, setTradebook] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("orderbook");
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      // Fetch orderbook
      const orderbookRes = await fetch("http://localhost:5000/orderbook", {
        credentials: "include",
      });
      if (orderbookRes.ok) {
        const orderbookData = await orderbookRes.json();
        setOrderbook(orderbookData.data || []);
      } else if (orderbookRes.status === 401) {
        setError("Please log in to view orders. Redirecting to login...");
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
        return;
      }

      // Fetch tradebook
      const tradebookRes = await fetch("http://localhost:5000/tradebook", {
        credentials: "include",
      });
      if (tradebookRes.ok) {
        const tradebookData = await tradebookRes.json();
        setTradebook(tradebookData.data || []);
      } else if (tradebookRes.status === 401) {
        setError("Please log in to view trades. Redirecting to login...");
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
        return;
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to connect to server. Please check if the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const cancelOrder = async (orderId: string) => {
    try {
      const response = await fetch("http://localhost:5000/api/v1/cancelorder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ orderid: orderId }),
      });

      if (response.ok) {
        // Refresh data after cancellation
        fetchData();
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "complete":
      case "executed":
        return "success";
      case "open":
      case "pending":
        return "warning";
      case "cancelled":
      case "rejected":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Orders & Trades</h1>
          <p className="text-slate-400">
            View and manage your orders and trade history
          </p>
        </div>
        <Button onClick={fetchData} disabled={loading} className="flex items-center space-x-2">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg">
          <p>{error}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-800 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab("orderbook")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "orderbook"
            ? "bg-violet-600 text-white"
            : "text-slate-400 hover:text-white"
            }`}
        >
          Order Book ({orderbook.length})
        </button>
        <button
          onClick={() => setActiveTab("tradebook")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "tradebook"
            ? "bg-violet-600 text-white"
            : "text-slate-400 hover:text-white"
            }`}
        >
          Trade Book ({tradebook.length})
        </button>
      </div>

      {/* Content */}
      <Card className="border-slate-800 bg-slate-900/50">
        <CardHeader>
          <CardTitle className="text-white">
            {activeTab === "orderbook" ? "Order Book" : "Trade Book"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center text-slate-400 py-8">Loading...</div>
          ) : (
            <div className="space-y-4">
              {activeTab === "orderbook" ? (
                orderbook.length > 0 ? (
                  orderbook.map((order: any) => (
                    <div
                      key={order.orderid}
                      className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`px-3 py-1 rounded text-xs font-medium ${order.transactiontype === "BUY"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-red-500/10 text-red-400"
                          }`}>
                          {order.transactiontype}
                        </div>
                        <div>
                          <p className="text-white font-medium">{order.tradingsymbol}</p>
                          <p className="text-sm text-slate-400">
                            {order.quantity} @ ₹{order.price}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <Badge variant={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                          <p className="text-xs text-slate-400 mt-1">
                            {order.ordertime}
                          </p>
                        </div>
                        {order.status?.toLowerCase() === "open" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => cancelOrder(order.orderid)}
                            className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-slate-400 py-8">No orders found</div>
                )
              ) : (
                tradebook.length > 0 ? (
                  tradebook.map((trade: any) => (
                    <div
                      key={trade.orderid}
                      className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`px-3 py-1 rounded text-xs font-medium ${trade.transactiontype === "BUY"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-red-500/10 text-red-400"
                          }`}>
                          {trade.transactiontype}
                        </div>
                        <div>
                          <p className="text-white font-medium">{trade.tradingsymbol}</p>
                          <p className="text-sm text-slate-400">
                            {trade.quantity} @ ₹{trade.price}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${parseFloat(trade.pnl) >= 0 ? "text-green-400" : "text-red-400"
                          }`}>
                          P&L: ₹{parseFloat(trade.pnl || 0).toFixed(2)}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          {trade.ordertime}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-slate-400 py-8">No trades found</div>
                )
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}