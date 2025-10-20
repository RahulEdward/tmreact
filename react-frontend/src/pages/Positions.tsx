import React from 'react';
import { usePositions } from '../hooks/usePositions';

const Positions: React.FC = () => {
  const { positions, isLoading, error, refetch } = usePositions();

  if (isLoading) {
    return (
      <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
        <div className="bg-gray-900 p-8 text-center">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="ml-3 text-gray-300">Loading positions...</span>
          </div>
        </div>
      </div>
    );
  }

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

      {/* Positions Table */}
      <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-xs text-gray-200 uppercase bg-gray-800 border-b border-gray-700">
            <tr>
              <th scope="col" className="py-3 px-6">Trading Symbol</th>
              <th scope="col" className="py-3 px-6">Exchange</th>
              <th scope="col" className="py-3 px-6">Product Type</th>
              <th scope="col" className="py-3 px-6">Net Qty</th>
              <th scope="col" className="py-3 px-6">Avg Net Price</th>
            </tr>
          </thead>
          <tbody>
            {positions && positions.length > 0 ? (
              positions.map((position, index) => (
                <tr key={`${position.symbol}-${index}`} className="bg-gray-900 border-b border-gray-800">
                  <td className="py-4 px-6">{position.symbol}</td>
                  <td className="py-4 px-6">{position.exchange}</td>
                  <td className="py-4 px-6">{position.product}</td>
                  <td className="py-4 px-6">{position.quantity}</td>
                  <td className="py-4 px-6">{position.average_price}</td>
                </tr>
              ))
            ) : (
              <tr className="bg-gray-900 border-b border-gray-800">
                <td colSpan={5} className="py-4 px-6 text-center">
                  {error ? 'Unable to load positions' : 'No positions found'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Positions;