import React from 'react';
import { OrderData } from '../types';

interface OrderTableProps {
  orders: OrderData[];
  isLoading: boolean;
  error: string | null;
}

const OrderTable: React.FC<OrderTableProps> = ({ orders, isLoading, error }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'complete':
        return 'text-green-500';
      case 'rejected':
        return 'text-red-500';
      case 'open':
        return 'text-orange-500';
      default:
        return 'text-blue-500';
    }
  };

  const getActionBadge = (action: string) => {
    const isBuy = action.toLowerCase() === 'buy';
    const bgClass = isBuy ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400';
    
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
            <span className="ml-3 text-gray-300">Loading orders...</span>
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
            <th scope="col" className="py-3 px-6">Transaction Type</th>
            <th scope="col" className="py-3 px-6">Quantity</th>
            <th scope="col" className="py-3 px-6">Price</th>
            <th scope="col" className="py-3 px-6">Trigger Price</th>
            <th scope="col" className="py-3 px-6">Order Type</th>
            <th scope="col" className="py-3 px-6">Product Type</th>
            <th scope="col" className="py-3 px-6">Order ID</th>
            <th scope="col" className="py-3 px-6">Status</th>
            <th scope="col" className="py-3 px-6">Time</th>
          </tr>
        </thead>
        <tbody>
          {orders && orders.length > 0 ? (
            orders.map((order, index) => (
              <tr key={order.orderid || index} className="bg-gray-900 border-b border-gray-800">
                <td className="py-4 px-6">{order.symbol}</td>
                <td className="py-4 px-6">{order.exchange}</td>
                <td className="py-4 px-6">
                  {getActionBadge(order.action)}
                </td>
                <td className="py-4 px-6">{order.quantity}</td>
                <td className="py-4 px-6">{order.price}</td>
                <td className="py-4 px-6">{order.trigger_price}</td>
                <td className="py-4 px-6">{order.pricetype}</td>
                <td className="py-4 px-6">{order.product}</td>
                <td className="py-4 px-6">{order.orderid}</td>
                <td className={`py-4 px-6 ${getStatusColor(order.order_status)}`}>
                  {order.order_status}
                </td>
                <td className="py-4 px-6">{order.timestamp}</td>
              </tr>
            ))
          ) : (
            <tr className="bg-gray-900 border-b border-gray-800">
              <td colSpan={11} className="py-4 px-6 text-center">
                {error ? 'Unable to load orders' : 'No orders found'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;