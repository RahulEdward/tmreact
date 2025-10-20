import React, { useState, useRef, useEffect } from 'react';
import { useNotification } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';
import FlaskApiService from '../services/flaskApi';
import api from '../services/api';

interface Suggestion {
  label: string;
  value: string;
  token: string;
  exchange: string;
}

interface TradingViewJSON {
  apikey: string;
  strategy: string;
  symbol: string;
  action: string;
  exchange: string;
  pricetype: string;
  product: string;
  quantity: string;
  position_size: string;
}

const TradingView: React.FC = () => {
  const [symbol, setSymbol] = useState('');
  const [product, setProduct] = useState('MIS');
  const [exchange, setExchange] = useState('NSE');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [generatedJSON, setGeneratedJSON] = useState<TradingViewJSON | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [userApiKey, setUserApiKey] = useState<string>('');
  const { addNotification } = useNotification();
  const { user } = useAuth();
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const exchanges = [
    { value: 'NSE', label: 'NSE' },
    { value: 'NFO', label: 'NFO' },
    { value: 'BSE', label: 'BSE' },
    { value: 'BFO', label: 'BFO' },
    { value: 'CDS', label: 'CDS' },
    { value: 'MCX', label: 'MCX' },
  ];

  const products = [
    { value: 'MIS', label: 'MIS' },
    { value: 'CNC', label: 'CNC' },
    { value: 'NRML', label: 'NRML' },
  ];

  // Correct webhook URL pointing to Flask backend
  const webhookUrl = `http://localhost:5000/api/v1/placesmartorder`;

  const fetchSuggestions = async (term: string, selectedExchange: string) => {
    if (term.length < 1) {
      setSuggestions([]);
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.get('/search/suggestions', {
        params: { term, exchange: selectedExchange }
      });

      if (response.status === 200) {
        // Mock suggestions for now since Flask returns HTML
        const mockSuggestions: Suggestion[] = [
          {
            label: `${term.toUpperCase()}-EQ - ${term.toUpperCase()} Limited`,
            value: `${term.toUpperCase()}-EQ`,
            token: '12345',
            exchange: selectedExchange
          }
        ];
        setSuggestions(mockSuggestions);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateJSON = async () => {
    if (!symbol || !product || !exchange) {
      addNotification({
        type: 'warning',
        title: 'Warning',
        message: 'Please fill all fields',
      });
      return;
    }

    try {
      setIsGenerating(true);
      const response = await api.post('/tradingview/', {
        symbol,
        product,
        exchange
      });

      if (response.status === 200) {
        // Mock JSON response for now since Flask returns HTML
        const mockJSON: TradingViewJSON = {
          apikey: 'tm-algo-api-key-12345',
          strategy: 'Tradingview',
          symbol: symbol,
          action: '{{strategy.order.action}}',
          exchange: exchange,
          pricetype: 'MARKET',
          product: product,
          quantity: '{{strategy.order.contracts}}',
          position_size: '{{strategy.position_size}}'
        };
        
        setGeneratedJSON(mockJSON);
        
        addNotification({
          type: 'success',
          title: 'JSON Generated',
          message: 'TradingView JSON has been generated successfully',
        });
      }
    } catch (error: any) {
      console.error('Error generating JSON:', error);
      addNotification({
        type: 'error',
        title: 'Generation Error',
        message: 'Failed to generate TradingView JSON',
        sound: true
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyJSON = async () => {
    if (!generatedJSON) return;

    try {
      const jsonString = JSON.stringify(generatedJSON, null, 2);
      await navigator.clipboard.writeText(jsonString);
      
      addNotification({
        type: 'success',
        title: 'Copied!',
        message: 'JSON copied to clipboard!',
        duration: 3000
      });
    } catch (error) {
      console.error('Failed to copy JSON:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to copy JSON to clipboard',
        sound: true
      });
    }
  };

  const copyWebhookUrl = async () => {
    try {
      await navigator.clipboard.writeText(webhookUrl);
      
      addNotification({
        type: 'success',
        title: 'Copied!',
        message: 'Webhook URL copied to clipboard!',
        duration: 3000
      });
    } catch (error) {
      console.error('Failed to copy webhook URL:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to copy webhook URL to clipboard',
        sound: true
      });
    }
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setSymbol(suggestion.value);
    setShowSuggestions(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSymbol(value);
    
    if (value.length >= 1) {
      fetchSuggestions(value, exchange);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleExchangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newExchange = e.target.value;
    setExchange(newExchange);
    
    if (symbol.length >= 1) {
      fetchSuggestions(symbol, newExchange);
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center text-primary">TradingView JSON Generator</h1>
      
      {/* Form */}
      <div className="max-w-md mx-auto mb-6 bg-dark/80 backdrop-blur-lg p-6 rounded-lg border border-gray-800">
        <div className="mb-4">
          <label htmlFor="symbol-input" className="block mb-2 text-gray-300">Symbol:</label>
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              id="symbol-input"
              value={symbol}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-700 rounded bg-gray-900 text-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
              placeholder="Enter symbol"
            />
            
            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div
                ref={suggestionsRef}
                className="absolute top-full left-0 right-0 bg-gray-900 border border-gray-700 rounded-md mt-1 max-h-60 overflow-y-auto z-50 shadow-lg"
              >
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-4 py-2 hover:bg-blue-600 cursor-pointer text-gray-300 hover:text-white border-b border-gray-700 last:border-b-0"
                  >
                    <div className="font-semibold">{suggestion.value}</div>
                    <div className="text-sm text-gray-400">{suggestion.label.split(' - ')[1]}</div>
                  </div>
                ))}
              </div>
            )}
            
            {isLoading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              </div>
            )}
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="product-select" className="block mb-2 text-gray-300">Product:</label>
          <select
            id="product-select"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            className="w-full p-2 border border-gray-700 rounded bg-gray-900 text-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
          >
            {products.map(prod => (
              <option key={prod.value} value={prod.value}>{prod.label}</option>
            ))}
          </select>
        </div>
        
        <div className="mb-4">
          <label htmlFor="exchange-select" className="block mb-2 text-gray-300">Exchange:</label>
          <select
            id="exchange-select"
            value={exchange}
            onChange={handleExchangeChange}
            className="w-full p-2 border border-gray-700 rounded bg-gray-900 text-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
          >
            {exchanges.map(ex => (
              <option key={ex.value} value={ex.value}>{ex.label}</option>
            ))}
          </select>
        </div>
        
        <button
          onClick={generateJSON}
          disabled={isGenerating}
          className="w-full bg-blue-600 text-gray-100 p-2 rounded hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed font-bold uppercase transition-colors"
        >
          {isGenerating ? 'Generating...' : 'Generate JSON'}
        </button>
      </div>
      
      {/* Generated JSON */}
      {generatedJSON && (
        <div className="max-w-2xl mx-auto mb-6 p-4 bg-gray-800 rounded border border-gray-700">
          <pre className="bg-gray-900 p-4 rounded overflow-x-auto text-gray-300 border border-gray-700 text-sm">
            {JSON.stringify(generatedJSON, null, 2)}
          </pre>
          <button
            onClick={copyJSON}
            className="mt-2 bg-green-600 text-gray-100 p-2 rounded hover:bg-green-700 font-bold transition-colors"
          >
            Copy JSON
          </button>
        </div>
      )}
      
      {/* Webhook URL */}
      <div className="max-w-2xl mx-auto p-4 bg-green-900/20 rounded border border-green-700">
        <h2 className="text-xl font-semibold mb-2 text-green-400">TradingView Webhook URL</h2>
        <div className="flex items-center">
          <code className="bg-gray-900 p-2 rounded flex-1 overflow-x-auto text-green-400 border border-green-800 text-sm">
            {webhookUrl}
          </code>
          <button
            onClick={copyWebhookUrl}
            className="ml-2 bg-green-600 text-gray-100 p-2 rounded hover:bg-green-700 font-bold transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TradingView;