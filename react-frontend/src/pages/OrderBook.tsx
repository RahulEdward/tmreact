import React from 'react';
import { useOrderBook } from '../hooks/useOrderBook';
import StatsCard from '../components/StatsCard';
import OrderTable from '../components/OrderTable';

const OrderBook: React.FC = () => {
  const { orders, orderStats, isLoading, error, refetch } = useOrderBook();

  return (
    <div>
      {/* Error Alert */}
      {error && (
        <div className="bg-red-900/30 border border-red-600 text-red-400 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline ml-2">{error}</span>
          <button
            onClick={refetch}
            className="ml-4 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatsCard
            title="Buy Orders"
            value={orderStats?.total_buy_orders || 0}
            colorClass="border-blue-500"
            bgClass="bg-blue-900/20"
          />
          <StatsCard
            title="Sell Orders"
            value={orderStats?.total_sell_orders || 0}
            colorClass="border-red-500"
            bgClass="bg-red-900/20"
          />
          <StatsCard
            title="Completed Orders"
            value={orderStats?.total_completed_orders || 0}
            colorClass="border-green-500"
            bgClass="bg-green-900/20"
          />
          <StatsCard
            title="Open Orders"
            value={orderStats?.total_open_orders || 0}
            colorClass="border-yellow-500"
            bgClass="bg-yellow-900/20"
          />
          <StatsCard
            title="Rejected Orders"
            value={orderStats?.total_rejected_orders || 0}
            colorClass="border-pink-500"
            bgClass="bg-pink-900/20"
          />
        </div>
      </div>

      {/* Orders Table */}
      <OrderTable orders={orders} isLoading={isLoading} error={error} />
    </div>
  );
};

export default OrderBook;