"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui";
import { Copy, RefreshCw, Zap, AlertCircle, Search } from "lucide-react";
import { config } from "@/lib/config";

export default function TradingViewPage() {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [recentWebhooks, setRecentWebhooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchSymbol, setSearchSymbol] = useState("");
  const [selectedExchange, setSelectedExchange] = useState("NSE");
  const [selectedProduct, setSelectedProduct] = useState("MIS");
  const [selectedPriceType, setSelectedPriceType] = useState("MARKET");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState<any>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Get API key
      const apiKeyRes = await fetch("http://localhost:5000/apikey", {
        credentials: "include",
        headers: {
          "Accept": "application/json",
        },
      });
      if (apiKeyRes.ok) {
        const apiKeyData = await apiKeyRes.json();
        const key = apiKeyData.data?.api_key || "";
        setApiKey(key);
        // Generate webhook URL
        setWebhookUrl(`http://localhost:5000/tradingview`);
      }

      // Get recent webhook logs
      const logsRes = await fetch("http://localhost:5000/logs", {
        credentials: "include",
      });
      if (logsRes.ok) {
        const logsData = await logsRes.json();
        setRecentWebhooks(logsData.logs?.slice(0, 10) || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  // Autocomplete search function
  const searchSuggestions = async (query: string) => {
    if (!query || query.length < 1) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    try {
      console.log(`Fetching suggestions for: ${query}`);
      const response = await fetch(`${config.api.baseUrl}/search/suggestions?term=${query}&exchange=${selectedExchange}`, {
        credentials: "include",
        headers: {
          "Accept": "application/json",
        },
      });

      console.log('Suggestions response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Suggestions data:', data);
        setSuggestions(data || []);
        setShowDropdown(data && data.length > 0);
      } else if (response.status === 401) {
        setSearchError("Please log in to search symbols. Redirecting...");
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        console.error('Suggestions failed with status:', response.status);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSearchError("Failed to connect to server for suggestions.");
    }
  };

  // Enhanced local suggestions database
  const getLocalSuggestions = () => [
    // Banking Stocks
    { label: 'SBIN - State Bank of India', value: 'SBIN', token: '3045', exchange: 'NSE' },
    { label: 'HDFCBANK - HDFC Bank Ltd', value: 'HDFCBANK', token: '1333', exchange: 'NSE' },
    { label: 'ICICIBANK - ICICI Bank Ltd', value: 'ICICIBANK', token: '4963', exchange: 'NSE' },
    { label: 'AXISBANK - Axis Bank Ltd', value: 'AXISBANK', token: '5900', exchange: 'NSE' },
    { label: 'KOTAKBANK - Kotak Mahindra Bank Ltd', value: 'KOTAKBANK', token: '1922', exchange: 'NSE' },
    { label: 'INDUSINDBK - IndusInd Bank Ltd', value: 'INDUSINDBK', token: '1346', exchange: 'NSE' },

    // IT Stocks
    { label: 'TCS - Tata Consultancy Services Ltd', value: 'TCS', token: '11536', exchange: 'NSE' },
    { label: 'INFY - Infosys Ltd', value: 'INFY', token: '1594', exchange: 'NSE' },
    { label: 'WIPRO - Wipro Ltd', value: 'WIPRO', token: '3787', exchange: 'NSE' },
    { label: 'HCLTECH - HCL Technologies Ltd', value: 'HCLTECH', token: '7229', exchange: 'NSE' },
    { label: 'TECHM - Tech Mahindra Ltd', value: 'TECHM', token: '13538', exchange: 'NSE' },

    // Large Cap Stocks
    { label: 'RELIANCE - Reliance Industries Ltd', value: 'RELIANCE', token: '2885', exchange: 'NSE' },
    { label: 'BHARTIARTL - Bharti Airtel Ltd', value: 'BHARTIARTL', token: '10604', exchange: 'NSE' },
    { label: 'ITC - ITC Ltd', value: 'ITC', token: '1660', exchange: 'NSE' },
    { label: 'LT - Larsen & Toubro Ltd', value: 'LT', token: '11483', exchange: 'NSE' },
    { label: 'MARUTI - Maruti Suzuki India Ltd', value: 'MARUTI', token: '10999', exchange: 'NSE' },

    // Pharma Stocks
    { label: 'SUNPHARMA - Sun Pharmaceutical Industries Ltd', value: 'SUNPHARMA', token: '3351', exchange: 'NSE' },
    { label: 'DRREDDY - Dr Reddys Laboratories Ltd', value: 'DRREDDY', token: '881', exchange: 'NSE' },
    { label: 'CIPLA - Cipla Ltd', value: 'CIPLA', token: '694', exchange: 'NSE' },

    // Auto Stocks
    { label: 'TATAMOTORS - Tata Motors Ltd', value: 'TATAMOTORS', token: '3456', exchange: 'NSE' },
    { label: 'M&M - Mahindra & Mahindra Ltd', value: 'M&M', token: '2031', exchange: 'NSE' },
    { label: 'BAJAJ-AUTO - Bajaj Auto Ltd', value: 'BAJAJ-AUTO', token: '16669', exchange: 'NSE' },

    // FMCG Stocks
    { label: 'HINDUNILVR - Hindustan Unilever Ltd', value: 'HINDUNILVR', token: '1394', exchange: 'NSE' },
    { label: 'NESTLEIND - Nestle India Ltd', value: 'NESTLEIND', token: '17963', exchange: 'NSE' },
    { label: 'BRITANNIA - Britannia Industries Ltd', value: 'BRITANNIA', token: '547', exchange: 'NSE' },

    // Metals & Mining
    { label: 'TATASTEEL - Tata Steel Ltd', value: 'TATASTEEL', token: '3499', exchange: 'NSE' },
    { label: 'HINDALCO - Hindalco Industries Ltd', value: 'HINDALCO', token: '1363', exchange: 'NSE' },
    { label: 'JSWSTEEL - JSW Steel Ltd', value: 'JSWSTEEL', token: '11723', exchange: 'NSE' },

    // Energy Stocks
    { label: 'ONGC - Oil & Natural Gas Corporation Ltd', value: 'ONGC', token: '2475', exchange: 'NSE' },
    { label: 'BPCL - Bharat Petroleum Corporation Ltd', value: 'BPCL', token: '526', exchange: 'NSE' },
    { label: 'IOC - Indian Oil Corporation Ltd', value: 'IOC', token: '1624', exchange: 'NSE' },
  ];

  // Handle input change with debounce
  const handleSearchChange = (value: string) => {
    setSearchSymbol(value);
    setSearchError("");

    // Clear previous timeout
    if ((window as any).searchTimeout) {
      clearTimeout((window as any).searchTimeout);
    }

    // If no value, hide dropdown
    if (!value) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    // Show local suggestions immediately for better UX
    const localSuggestions = getLocalSuggestions();
    const filtered = localSuggestions.filter(s =>
      s.value.toLowerCase().includes(value.toLowerCase()) ||
      s.label.toLowerCase().includes(value.toLowerCase())
    );

    setSuggestions(filtered);
    setShowDropdown(filtered.length > 0);

    // Set new timeout for backend search (optional)
    (window as any).searchTimeout = setTimeout(() => {
      // Only try backend if we have fewer than 5 local results
      if (filtered.length < 5) {
        searchSuggestions(value);
      }
    }, 800);
  };

  // Select symbol from dropdown
  const selectSymbol = (suggestion: any) => {
    setSearchSymbol(suggestion.value);
    setShowDropdown(false);
    setSuggestions([]);

    // Auto-generate JSON for selected symbol
    const symbolData = {
      symbol: suggestion.value,
      name: suggestion.label.split(' - ')[1] || suggestion.value,
      exchange: suggestion.exchange,
      token: suggestion.token
    };

    generateTradingViewJson(symbolData);
  };

  const searchSymbols = async () => {
    if (!searchSymbol) return;

    setSearchLoading(true);
    setSearchError("");
    setSearchResults([]);

    try {
      console.log(`Searching for: ${searchSymbol} on ${selectedExchange}`);
      const response = await fetch(`http://localhost:5000/search?symbol=${searchSymbol}&exchange=${selectedExchange}`, {
        credentials: "include",
      });
      console.log('Search response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Search data received:', data);
        setSearchResults(data.results || []);
        if (!data.results || data.results.length === 0) {
          setSearchError("No symbols found. Try a different search term.");
        }
      } else if (response.status === 401) {
        setSearchError("Please log in to search symbols. Redirecting...");
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        console.error('Search failed with status:', response.status);
        const errorData = await response.json();
        console.error('Error data:', errorData);
        setSearchError("Search failed. Please try again.");
      }
    } catch (error) {
      console.error("Error searching symbols:", error);
      setSearchError("Failed to connect to server. Please check if the backend is running.");
    } finally {
      setSearchLoading(false);
    }
  };

  const generateTradingViewJson = async (symbol: any) => {
    try {
      console.log('Generating JSON for symbol:', symbol);

      const symbolName = symbol.symbol || symbol.value || searchSymbol;
      const symbolExchange = symbol.exchange || selectedExchange;

      // Create JSON template locally (works offline)
      const jsonTemplate: any = {
        "apikey": "your-api-key-here",
        "strategy": "TradingView",
        "symbol": symbolName.toUpperCase(),
        "action": "{{strategy.order.action}}",
        "exchange": symbolExchange,
        "pricetype": selectedPriceType,
        "product": selectedProduct,
        "quantity": "{{strategy.order.contracts}}",
        "position_size": "{{strategy.position_size}}"
      };

      // Add price field for limit orders
      if (selectedPriceType === 'LIMIT' || selectedPriceType === 'SL') {
        jsonTemplate.price = "{{strategy.order.price}}";
      }

      // Add trigger price for stop loss orders
      if (selectedPriceType === 'SL' || selectedPriceType === 'SL-M') {
        jsonTemplate.trigger_price = "{{strategy.order.price}}";
      }

      console.log('Generated JSON template:', jsonTemplate);

      setSelectedSymbol({
        ...symbol,
        symbol: symbolName,
        exchange: symbolExchange,
        jsonTemplate: jsonTemplate
      });

      // Show success message
      const jsonString = JSON.stringify(jsonTemplate, null, 2);
      alert("✅ TradingView JSON Generated Successfully!\n\n" +
        "Symbol: " + symbolName + "\n" +
        "Exchange: " + symbolExchange + "\n" +
        "Product: " + selectedProduct + "\n" +
        "Price Type: " + selectedPriceType + "\n\n" +
        "JSON has been generated and is ready to copy!");

      // Auto-copy to clipboard
      try {
        await navigator.clipboard.writeText(jsonString);
        console.log("JSON copied to clipboard automatically!");
      } catch (clipboardError) {
        console.log("Could not auto-copy to clipboard:", clipboardError);
      }

      // Try to get API key from backend (optional)
      try {
        const response = await fetch("http://localhost:5000/tradingview", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            symbol: symbolName,
            exchange: symbolExchange,
            product: selectedProduct,
            pricetype: selectedPriceType
          }),
        });

        if (response.ok) {
          const backendResult = await response.json();
          console.log('Backend enhanced JSON:', backendResult);

          // Update with backend result if available
          setSelectedSymbol({
            ...symbol,
            symbol: symbolName,
            exchange: symbolExchange,
            jsonTemplate: backendResult
          });
        }
      } catch (backendError) {
        console.log('Backend not available, using local JSON:', backendError);
        // Continue with local JSON - no error shown to user
      }

    } catch (error) {
      console.error("Error generating JSON:", error);
      alert("❌ Error generating JSON: " + error);
    }
  };

  const testWebhook = async () => {
    try {
      const testPayload = {
        symbol: "RELIANCE",
        exchange: selectedExchange,
        action: "BUY",
        quantity: 1,
        price: 2450.50,
        product: selectedProduct,
        test: true
      };

      const response = await fetch("http://localhost:5000/tradingview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(testPayload),
      });

      if (response.ok) {
        const result = await response.json();
        alert("Webhook test successful! Response: " + JSON.stringify(result, null, 2));
        // Refresh the webhook logs to show the test
        fetchData();
      } else {
        const error = await response.json();
        alert("Webhook test failed: " + (error.message || 'Unknown error'));
      }
    } catch (error) {
      console.error("Error testing webhook:", error);
      alert("Webhook test failed: " + error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">TradingView Bridge</h1>
          <p className="text-slate-400">
            Connect TradingView alerts to your trading account
          </p>
        </div>
        <Button onClick={fetchData} disabled={loading} className="flex items-center space-x-2">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </Button>
      </div>

      {/* TradingView JSON Generator */}
      <Card className="border-slate-800 bg-slate-900/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>TradingView JSON Generator</span>
          </CardTitle>
          <p className="text-slate-400 text-sm">
            Generate JSON configuration for TradingView webhook alerts
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Exchange, Product and Price Type Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Exchange
              </label>
              <select
                value={selectedExchange}
                onChange={(e) => setSelectedExchange(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white"
              >
                <option value="NSE">NSE - National Stock Exchange</option>
                <option value="BSE">BSE - Bombay Stock Exchange</option>
                <option value="MCX">MCX - Multi Commodity Exchange</option>
                <option value="CDS">CDS - Currency Derivatives</option>
                <option value="NSE_INDEX">NSE Index</option>
                <option value="BSE_INDEX">BSE Index</option>
                <option value="MCX_INDEX">MCX Index</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Product Type
              </label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white"
              >
                <option value="MIS">MIS - Margin Intraday Square-off</option>
                <option value="NRML">NRML - Normal (Carry Forward)</option>
                <option value="CNC">CNC - Cash and Carry (Delivery)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Price Type
              </label>
              <select
                value={selectedPriceType}
                onChange={(e) => setSelectedPriceType(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white"
              >
                <option value="MARKET">MARKET - Market Order</option>
                <option value="LIMIT">LIMIT - Limit Order</option>
                <option value="SL">SL - Stop Loss</option>
                <option value="SL-M">SL-M - Stop Loss Market</option>
              </select>
            </div>
          </div>

          {/* Symbol Search with Autocomplete */}
          <div className="space-y-2">
            <div className="relative">
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchSymbol}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Type symbol name (e.g., SBI, RELIANCE, TCS)"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-slate-400"
                    onKeyPress={(e) => e.key === 'Enter' && searchSymbols()}
                    onFocus={() => {
                      if (searchSymbol && suggestions.length > 0) {
                        setShowDropdown(true);
                      } else if (searchSymbol) {
                        handleSearchChange(searchSymbol);
                      }
                    }}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                  />

                  {/* Autocomplete Dropdown */}
                  {showDropdown && suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-slate-800 border border-slate-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {suggestions.map((suggestion: any, index) => (
                        <div
                          key={index}
                          className="px-3 py-2 hover:bg-slate-700 cursor-pointer text-white border-b border-slate-700 last:border-b-0"
                          onClick={() => selectSymbol(suggestion)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{suggestion.value}</p>
                              <p className="text-xs text-slate-400">{suggestion.label}</p>
                            </div>
                            <Badge variant="outline" className="text-xs">{suggestion.exchange}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Button onClick={searchSymbols} size="sm" disabled={searchLoading}>
                  <Search className={`h-4 w-4 ${searchLoading ? "animate-spin" : ""}`} />
                </Button>
              </div>
            </div>

            {/* Status and Quick Search Buttons */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {suggestions.length > 0 ? suggestions.length + " suggestions found" : 'Start typing to see suggestions (30+ stocks available)'}
                </span>
                <span className="text-xs text-green-400">
                  ✅ Offline Mode Active
                </span>
              </div>
              <div className="flex items-center space-x-2 flex-wrap">
                <span className="text-xs text-slate-400">Quick search:</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSearchSymbol("SBIN");
                    handleSearchChange("SBIN");
                  }}
                  className="text-xs border-slate-700"
                >
                  SBIN
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSearchSymbol("RELIANCE");
                    handleSearchChange("RELIANCE");
                  }}
                  className="text-xs border-slate-700"
                >
                  RELIANCE
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSearchSymbol("TCS");
                    handleSearchChange("TCS");
                  }}
                  className="text-xs border-slate-700"
                >
                  TCS
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSearchSymbol("INFY");
                    handleSearchChange("INFY");
                  }}
                  className="text-xs border-slate-700"
                >
                  INFY
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSearchSymbol("HDFCBANK");
                    handleSearchChange("HDFCBANK");
                  }}
                  className="text-xs border-slate-700"
                >
                  HDFC
                </Button>
              </div>
            </div>

            {/* Generate JSON Button */}
            <div className="flex items-center justify-center pt-4">
              <Button
                onClick={() => {
                  if (!searchSymbol) {
                    alert("Please enter a symbol first!");
                    return;
                  }
                  // Create symbol object for JSON generation
                  const symbolData = {
                    symbol: searchSymbol.toUpperCase(),
                    name: searchSymbol.toUpperCase(),
                    exchange: selectedExchange,
                    token: "12345" // Default token for manual entry
                  };
                  generateTradingViewJson(symbolData);
                }}
                className="bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600 text-white px-8 py-3 rounded-lg font-medium"
                disabled={!searchSymbol}
              >
                <Zap className="h-5 w-5 mr-2" />
                Generate JSON
              </Button>
            </div>
          </div>

          {/* Search Error */}
          {searchError && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg">
              <p>{searchError}</p>
            </div>
          )}

          {/* Search Loading */}
          {searchLoading && (
            <div className="text-center text-slate-400 py-4">
              <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
              <p>Searching symbols...</p>
            </div>
          )}

          {searchResults.length > 0 && (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              <p className="text-sm text-slate-400 mb-2">Found {searchResults.length} symbol(s). Click to generate JSON:</p>
              {searchResults.map((symbol: any, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors"
                  onClick={() => generateTradingViewJson(symbol)}
                >
                  <div>
                    <p className="text-white font-medium">{symbol.symbol}</p>
                    <p className="text-sm text-slate-400">{symbol.name} - {symbol.exchange}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{symbol.exchange}</Badge>
                    <span className="text-xs text-slate-500">Click to generate</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedSymbol && (
            <div className="bg-slate-800/50 p-4 rounded-lg border border-green-700/50">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-green-400 font-medium">✅ JSON Generated Successfully!</p>
                  <p className="text-sm text-slate-400">Symbol: {selectedSymbol.symbol} | Exchange: {selectedSymbol.exchange}</p>
                </div>
                <Badge variant="success" className="bg-green-900/50 text-green-300">
                  Ready to Use
                </Badge>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">
                    Alert Message (Copy this to TradingView Alert Message)
                  </label>
                  <pre className="text-xs text-green-400 font-mono bg-slate-900/50 p-3 rounded overflow-x-auto border border-slate-700">
                    {JSON.stringify(selectedSymbol.jsonTemplate, null, 2)}
                  </pre>
                  <div className="flex items-center space-x-2 mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        copyToClipboard(JSON.stringify(selectedSymbol.jsonTemplate, null, 2));
                        alert("✅ Alert Message copied to clipboard!\n\nPaste this in TradingView Alert → Message field");
                      }}
                      className="border-green-700 text-green-400 hover:bg-green-900/20"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Alert Message
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const instructions = "📋 TradingView Setup Instructions:\n\n" +
                          "1. Open TradingView and create/edit your strategy\n" +
                          "2. Click 'Add Alert' button\n" +
                          "3. In Alert Settings:\n" +
                          "   • Webhook URL: " + webhookUrl + "\n" +
                          "   • Message: " + JSON.stringify(selectedSymbol.jsonTemplate, null, 2) + "\n" +
                          "4. Save the alert\n\n" +
                          "Your trades will now be executed automatically! 🚀";
                        alert(instructions);
                      }}
                      className="border-slate-700"
                    >
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Setup Instructions
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Setup Instructions */}
      <Card className="border-slate-800 bg-slate-900/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <AlertCircle className="h-5 w-5" />
            <span>TradingView Setup Guide</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-white font-medium mb-3">📋 Step-by-Step Setup:</h4>
              <ol className="space-y-2 text-sm text-slate-400">
                <li className="flex items-start space-x-2">
                  <span className="bg-violet-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">1</span>
                  <span>Enter symbol name and select exchange/product type</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="bg-violet-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">2</span>
                  <span>Click "Generate JSON" button</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="bg-violet-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">3</span>
                  <span>Copy Webhook URL and Alert Message</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="bg-violet-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">4</span>
                  <span>Paste in TradingView Alert settings</span>
                </li>
              </ol>
            </div>
            <div>
              <h4 className="text-white font-medium mb-3">⚙️ Configuration Options:</h4>
              <div className="space-y-2 text-sm text-slate-400">
                <div><strong className="text-slate-300">Exchanges:</strong> NSE, BSE, MCX, CDS</div>
                <div><strong className="text-slate-300">Products:</strong> MIS (Intraday), NRML (Carry Forward), CNC (Delivery)</div>
                <div><strong className="text-slate-300">Price Types:</strong> MARKET, LIMIT, SL, SL-M</div>
                <div><strong className="text-slate-300">Auto-execution:</strong> Orders placed automatically via webhook</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exchange & Product Information */}
      <Card className="border-slate-800 bg-slate-900/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <AlertCircle className="h-5 w-5" />
            <span>Exchange & Product Type Guide</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="text-white font-medium mb-2">Exchanges:</h4>
              <ul className="space-y-1 text-slate-400">
                <li><strong className="text-slate-300">NSE:</strong> Equity, F&O, Currency</li>
                <li><strong className="text-slate-300">BSE:</strong> Equity, Currency</li>
                <li><strong className="text-slate-300">MCX:</strong> Commodity</li>
                <li><strong className="text-slate-300">CDS:</strong> Currency Derivatives</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-2">Product Types:</h4>
              <ul className="space-y-1 text-slate-400">
                <li><strong className="text-slate-300">MIS:</strong> Intraday (Auto square-off)</li>
                <li><strong className="text-slate-300">NRML:</strong> Carry Forward (F&O)</li>
                <li><strong className="text-slate-300">CNC:</strong> Delivery (Equity)</li>
              </ul>
            </div>
          </div>
          <div>
            <h4 className="text-white font-medium mb-2">Price Types:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-400">
              <div><strong className="text-slate-300">MARKET:</strong> Execute at best available price</div>
              <div><strong className="text-slate-300">LIMIT:</strong> Execute at specified price or better</div>
              <div><strong className="text-slate-300">SL:</strong> Stop Loss with limit price</div>
              <div><strong className="text-slate-300">SL-M:</strong> Stop Loss at market price</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Webhook Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Webhook Configuration</span>
            </CardTitle>
            <p className="text-slate-400 text-sm">
              Copy this URL to your TradingView alert settings
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">
                Webhook URL (Copy this to TradingView)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={webhookUrl}
                  readOnly
                  className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white text-sm font-mono"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    copyToClipboard(webhookUrl);
                    alert("✅ Webhook URL copied to clipboard!");
                  }}
                  className="border-slate-700"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Use this URL in TradingView Alert → Webhook URL field
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">
                API Key
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={apiKey}
                  readOnly
                  className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white text-sm font-mono"
                />
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

            <Button
              onClick={testWebhook}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              variant="gradient"
            >
              <Zap className="h-4 w-4 mr-2" />
              Test Webhook Connection
            </Button>
            <p className="text-xs text-slate-500 text-center mt-2">
              This will send a test signal to verify your webhook is working
            </p>
          </CardContent>
        </Card>

        {/* Setup Instructions */}
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="text-white">Setup Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-violet-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  1
                </div>
                <div>
                  <p className="text-white font-medium">Copy Webhook URL</p>
                  <p className="text-sm text-slate-400">
                    Copy the webhook URL from above
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-violet-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  2
                </div>
                <div>
                  <p className="text-white font-medium">Create TradingView Alert</p>
                  <p className="text-sm text-slate-400">
                    Go to TradingView and create a new alert
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-violet-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  3
                </div>
                <div>
                  <p className="text-white font-medium">Configure Webhook</p>
                  <p className="text-sm text-slate-400">
                    Paste the webhook URL in the alert settings
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-violet-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  4
                </div>
                <div>
                  <p className="text-white font-medium">Set Alert Message</p>
                  <p className="text-sm text-slate-400">
                    Use JSON format for the alert message
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 p-3 rounded-lg">
              <p className="text-xs text-slate-400 mb-2">Example Alert Message:</p>
              <pre className="text-xs text-green-400 font-mono">
                {`{
  "action": "BUY",
  "symbol": "RELIANCE",
  "quantity": "10",
  "price": "{{close}}"
}`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Webhooks */}
      <Card className="border-slate-800 bg-slate-900/50">
        <CardHeader>
          <CardTitle className="text-white">Recent Webhook Calls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              <div className="text-center text-slate-400">Loading webhook history...</div>
            ) : recentWebhooks.length > 0 ? (
              recentWebhooks.map((webhook: any, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`px-3 py-1 rounded text-xs font-medium ${webhook.status === "success"
                      ? "bg-green-500/10 text-green-400"
                      : "bg-red-500/10 text-red-400"
                      }`}>
                      {webhook.method || "POST"}
                    </div>
                    <div>
                      <p className="text-white font-medium">{webhook.symbol || "N/A"}</p>
                      <p className="text-sm text-slate-400">
                        {webhook.action || "Unknown"} - {webhook.quantity || "0"} qty
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={webhook.status === "success" ? "success" : "destructive"}>
                      {webhook.status || "Unknown"}
                    </Badge>
                    <p className="text-xs text-slate-400 mt-1">
                      {webhook.timestamp || "N/A"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-slate-400 py-8">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-slate-600" />
                <p>No webhook calls yet</p>
                <p className="text-sm">Set up TradingView alerts to see webhook activity</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}