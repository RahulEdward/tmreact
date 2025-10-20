import { useState, useEffect } from 'react';
import { OrderData, OrderStats } from '../types';
import FlaskApiService from '../services/flaskApi';

interface UseOrderBookReturn {
  orders: OrderData[];
  orderStats: OrderStats | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useOrderBook = (): UseOrderBookReturn => {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [orderStats, setOrderStats] = useState<OrderStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrderBook = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await FlaskApiService.getOrderBook();
      setOrders(data.orders);
      setOrderStats(data.stats);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch order book');
      console.error('Order book fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderBook();
  }, []);

  return {
    orders,
    orderStats,
    isLoading,
    error,
    refetch: fetchOrderBook,
  };
};