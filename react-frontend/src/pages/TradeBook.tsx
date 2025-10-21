import React from 'react';
import { useTradeBook } from '../hooks/useTradeBook';
import TradeTable from '../components/TradeTable';

const TradeBook: React.FC = () => {
  const { trades, isLoading, error, refetch } = useTradeBook();

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

      {/* Trades Table */}
      <TradeTable trades={trades} isLoading={isLoading} error={error} />
    </div>
  );
};

export default TradeBook;