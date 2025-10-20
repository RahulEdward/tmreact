import { useState, useEffect } from 'react';
import { HoldingData, PortfolioStats } from '../types';
import FlaskApiService from '../services/flaskApi';

interface UseHoldingsReturn {
  holdings: HoldingData[];
  portfolioStats: PortfolioStats | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useHoldings = (): UseHoldingsReturn => {
  const [holdings, setHoldings] = useState<HoldingData[]>([]);
  const [portfolioStats, setPortfolioStats] = useState<PortfolioStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHoldings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await FlaskApiService.getHoldings();
      setHoldings(data.holdings);
      setPortfolioStats(data.stats);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch holdings');
      console.error('Holdings fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHoldings();
  }, []);

  return {
    holdings,
    portfolioStats,
    isLoading,
    error,
    refetch: fetchHoldings,
  };
};