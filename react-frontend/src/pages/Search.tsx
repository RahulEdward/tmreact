import React, { useState, useEffect, useRef } from 'react';
import { useNotification } from '../contexts/NotificationContext';
import api from '../services/api';

interface SearchResult {
  symbol: string;
  brsymbol: string;
  name: string;
  exchange: string;
  brexchange: string;
  token: string;
  expiry: string;
  strike: string;
  lotsize: string;
  instrumenttype: string;
  tick_size: string;
}

interface Suggestion {
  label: string;
  value: string;
  token: string;
  exchange: string;
}

const Search: React.FC = () => {
  const [symbol, setSymbol] = useState('');
  const [exchange, setExchange] = useState('NSE');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const { addNotification } = useNotification();
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const exchanges = [
    { value: 'NSE', label: 'NSE' },
    { value: 'NFO', label: 'NFO' },
    { value: 'BSE', label: 'BSE' },
    { value: 'BFO', label: 'BFO' },
    { value: 'CDS', label: 'CDS' },
    { value: 'MCX', label: 'MCX' },
    { value: 'NSE_INDEX', label: 'NSE_INDEX' },
    { value: 'BSE_INDEX', label: 'BSE_INDEX' },
  ];

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

  const performSearch = async (searchSymbol: string, searchExchange: string) => {
    if (!searchSymbol.trim()) {
      addNotification({
        type: 'warning',
        title: 'Warning',
        message: 'Please enter a symbol to search',
      });
      return;
    }

    try {
      setIsSearching(true);
      const response = await api.get('/search', {
        params: { symbol: searchSymbol, exchange: searchExchange }
      });

      if (response.status === 200) {
        // Mock search results for now since Flask returns HTML
        const mockResults: SearchResult[] = [
          {
            symbol: `${searchSymbol.toUpperCase()}-EQ`,
            brsymbol: searchSymbol.toUpperCase(),
            name: `${searchSymbol.toUpperCase()} Limited`,
            exchange: searchExchange,
            brexchange: searchExchange,
            token: '12345',
            expiry: '',
            strike: '',
            lotsize: '1',
            instrumenttype: 'EQ',
            tick_size: '0.05'
          }
        ];
        setResults(mockResults);
        
        addNotification({
          type: 'success',
          title: 'Search Complete',
          message: `Found ${mockResults.length} result(s) for ${searchSymbol}`,
        });
      }
    } catch (error: any) {
      console.error('Error performing search:', error);
      addNotification({
        type: 'error',
        title: 'Search Error',
        message: 'Failed to search symbols',
        sound: true
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    performSearch(symbol, exchange);
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setSymbol(suggestion.value);
    setShowSuggestions(false);
    performSearch(suggestion.value, suggestion.exchange);
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
    <div className="max-w-4xl mx-auto">
      {/* Search Form */}
      <div className="bg-dark/80 backdrop-blur-lg p-8 rounded-lg shadow-lg border border-gray-800 mb-8">
        <h1 className="text-xl font-bold mb-4 text-primary">Symbol Search</h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={symbol}
              onChange={handleInputChange}
              placeholder="Enter symbol"
              required
              className="w-full px-4 py-2 bg-gray-900 text-gray-300 border border-gray-700 rounded-md focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
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
          
          <select
            value={exchange}
            onChange={handleExchangeChange}
            required
            className="px-4 py-2 bg-gray-900 text-gray-300 border border-gray-700 rounded-md focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          >
            <option value="">Select Exchange</option>
            {exchanges.map(ex => (
              <option key={ex.value} value={ex.value}>{ex.label}</option>
            ))}
          </select>
          
          <button
            type="submit"
            disabled={isSearching}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-gray-200 font-bold py-2 px-4 rounded uppercase transition-colors"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      {/* Search Results */}
      {results.length > 0 && (
        <div className="bg-dark/80 backdrop-blur-lg rounded-lg shadow-lg border border-gray-800">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-primary">Search Results</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-300">
              <thead className="text-xs text-gray-200 uppercase bg-gray-800 border-b border-gray-700">
                <tr>
                  <th scope="col" className="py-3 px-6">Symbol</th>
                  <th scope="col" className="py-3 px-6">Name</th>
                  <th scope="col" className="py-3 px-6">Exchange</th>
                  <th scope="col" className="py-3 px-6">Token</th>
                  <th scope="col" className="py-3 px-6">Instrument Type</th>
                  <th scope="col" className="py-3 px-6">Lot Size</th>
                  <th scope="col" className="py-3 px-6">Tick Size</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => (
                  <tr key={index} className="bg-gray-900 border-b border-gray-800">
                    <td className="py-4 px-6 font-semibold">{result.symbol}</td>
                    <td className="py-4 px-6">{result.name}</td>
                    <td className="py-4 px-6">
                      <span className="bg-blue-900/30 text-blue-400 px-2 py-1 rounded text-xs font-semibold">
                        {result.exchange}
                      </span>
                    </td>
                    <td className="py-4 px-6">{result.token}</td>
                    <td className="py-4 px-6">{result.instrumenttype}</td>
                    <td className="py-4 px-6">{result.lotsize}</td>
                    <td className="py-4 px-6">{result.tick_size}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;