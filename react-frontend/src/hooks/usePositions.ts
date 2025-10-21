import { useState, useEffect } from 'react';
import { PositionData } from '../types';
import FlaskApiService from '../services/flaskApi';

interface UsePositionsReturn {
  positions: PositionData[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const usePositions = (): UsePositionsReturn => {
  const [positions, setPositions] = useState<PositionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPositions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await FlaskApiService.getPositions();
      setPositions(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch positions');
      console.error('Positions fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  return {
    positions,
    isLoading,
    error,
    refetch: fetchPositions,
  };
};