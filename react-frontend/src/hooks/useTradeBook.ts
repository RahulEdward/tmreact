import { useState, useEffect } from 'react';
import { TradeData } from '../types';
import FlaskApiService from '../services/flaskApi';

interface UseTradeBookReturn {
  trades: TradeData[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useTradeBook = (): UseTradeBookReturn => {
  const [trades, setTrades] = useState<TradeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTradeBook = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await FlaskApiService.getTradeBook();
      setTrades(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch trade book');
      console.error('Trade book fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTradeBook();
  }, []);

  return {
    trades,
    isLoading,
    error,
    refetch: fetchTradeBook,
  };
};