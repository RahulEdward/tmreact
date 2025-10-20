import React from 'react';
import { TradeData } from '../types';

interface TradeTableProps {
  trades: TradeData[];
  isLoading: boolean;
  error: string | null;
}

const TradeTable: React.FC<TradeTableProps> = ({ trades, isLoading, error }) => {
  const getActionBadge = (action: string) => {
    const isSell = action.toLowerCase() === 'sell';
    const bgClass = isSell ? 'bg-red-900/30 text-red-400' : 'bg-green-900/30 text-green-400';
    
    return (
      <div className={`${bgClass} px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full`}>
        {action}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
        <div className="bg-gray-900 p-8 text-center">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="ml-3 text-gray-300">Loading trades...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-300">
        <thead className="text-xs text-gray-200 uppercase bg-gray-800 border-b border-gray-700">
          <tr>
            <th scope="col" className="py-3 px-6">Trading Symbol</th>
            <th scope="col" className="py-3 px-6">Exchange</th>
            <th scope="col" className="py-3 px-6">Product Type</th>
            <th scope="col" className="py-3 px-6">Transaction Type</th>
            <th scope="col" className="py-3 px-6">Fill Size</th>
            <th scope="col" className="py-3 px-6">Fill Price</th>
            <th scope="col" className="py-3 px-6">Trade Value</th>
            <th scope="col" className="py-3 px-6">Order ID</th>
            <th scope="col" className="py-3 px-6">Fill Time</th>
          </tr>
        </thead>
        <tbody>
          {trades && trades.length > 0 ? (
            trades.map((trade, index) => (
              <tr key={trade.orderid || index} className="bg-gray-900 border-b border-gray-800">
                <td className="py-4 px-6">{trade.symbol}</td>
                <td className="py-4 px-6">{trade.exchange}</td>
                <td className="py-4 px-6">{trade.product}</td>
                <td className="py-4 px-6">
                  {getActionBadge(trade.action)}
                </td>
                <td className="py-4 px-6">{trade.quantity}</td>
                <td className="py-4 px-6">{trade.average_price}</td>
                <td className="py-4 px-6">{trade.trade_value}</td>
                <td className="py-4 px-6">{trade.orderid}</td>
                <td className="py-4 px-6">{trade.timestamp}</td>
              </tr>
            ))
          ) : (
            <tr className="bg-gray-900 border-b border-gray-800">
              <td colSpan={9} className="py-4 px-6 text-center">
                {error ? 'Unable to load trades' : 'No trades found'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TradeTable;