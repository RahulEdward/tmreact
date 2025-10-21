import React from 'react';
import { useHoldings } from '../hooks/useHoldings';

const Holdings: React.FC = () => {
  const { holdings, portfolioStats, isLoading, error, refetch } = useHoldings();

  if (isLoading) {
    return (
      <div className="py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-primary">Investor Summary</h1>
          </div>
          <div className="bg-gray-900 p-8 text-center rounded-lg">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="ml-3 text-gray-300">Loading holdings...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-primary">Investor Summary</h1>
        </div>
        
        {/* Error Message Display */}
        {error && (
          <div className="bg-red-900/30 border border-red-600 text-red-400 px-4 py-3 rounded relative mb-6" role="alert">
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

        {/* Holdings Summary Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center mb-8">
          {/* Total Holding Value Card */}
          <div className="p-4 md:p-6 bg-blue-500 rounded-lg shadow-lg">
            <div className="text-white text-3xl font-bold">
              {portfolioStats?.totalholdingvalue?.toFixed(2) || '0.00'}
            </div>
            <div className="text-white mt-2">Total Holding Value</div>
          </div>

          {/* Total Investment Value Card */}
          <div className="p-4 md:p-6 bg-green-500 rounded-lg shadow-lg">
            <div className="text-white text-3xl font-bold">
              {portfolioStats?.totalinvvalue?.toFixed(2) || '0.00'}
            </div>
            <div className="text-white mt-2">Total Investment Value</div>
          </div>

          {/* Total Profit and Loss Card */}
          <div className="p-4 md:p-6 bg-yellow-500 rounded-lg shadow-lg">
            <div className="text-white text-3xl font-bold">
              {portfolioStats?.totalprofitandloss?.toFixed(2) || '0.00'}
            </div>
            <div className="text-white mt-2">Total Profit and Loss</div>
          </div>

          {/* Total PnL Percentage Card */}
          <div className="p-4 md:p-6 bg-red-500 rounded-lg shadow-lg">
            <div className="text-white text-3xl font-bold">
              {portfolioStats?.totalpnlpercentage?.toFixed(2) || '0.00'}%
            </div>
            <div className="text-white mt-2">Total PnL Percentage</div>
          </div>
        </div>

        {/* Holdings Table */}
        <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
          {holdings && holdings.length > 0 ? (
            <table className="w-full text-sm text-left text-gray-300">
              <thead className="text-xs text-gray-200 uppercase bg-gray-800 border-b border-gray-700">
                <tr>
                  <th scope="col" className="py-3 px-6">Trading Symbol</th>
                  <th scope="col" className="py-3 px-6">Exchange</th>
                  <th scope="col" className="py-3 px-6">Quantity</th>
                  <th scope="col" className="py-3 px-6">Product</th>
                  <th scope="col" className="py-3 px-6">Profit and Loss</th>
                  <th scope="col" className="py-3 px-6">PnL Percentage</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((holding, index) => (
                  <tr key={`${holding.symbol}-${index}`} className="bg-gray-900 border-b border-gray-800">
                    <td className="py-4 px-6">{holding.symbol}</td>
                    <td className="py-4 px-6">{holding.exchange}</td>
                    <td className="py-4 px-6">{holding.quantity}</td>
                    <td className="py-4 px-6">{holding.product}</td>
                    <td className="py-4 px-6">{holding.pnl}</td>
                    <td className="py-4 px-6">{holding.pnlpercent.toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-6 text-center">
              <p className="text-gray-300 text-lg">
                {error 
                  ? 'Unable to load holdings data.' 
                  : 'No holdings data available. If you have holdings, please try refreshing the page or check your account status.'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Holdings;