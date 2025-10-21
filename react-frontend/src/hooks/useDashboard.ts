import { useState, useEffect } from 'react';
import { MarginData } from '../types';
import FlaskApiService from '../services/flaskApi';

interface UseDashboardReturn {
  marginData: MarginData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useDashboard = (): UseDashboardReturn => {
  const [marginData, setMarginData] = useState<MarginData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await FlaskApiService.getDashboardData();
      setMarginData(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch dashboard data');
      console.error('Dashboard data fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    marginData,
    isLoading,
    error,
    refetch: fetchDashboardData,
  };
};