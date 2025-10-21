import React, { useState, useEffect } from 'react';
import { useNotification } from '../contexts/NotificationContext';
import api from '../services/api';

interface LogEntry {
  id: number;
  api_type: string;
  request_data: string;
  response_data: string;
  created_at: string;
}

const Logs: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const { addNotification } = useNotification();

  const fetchLogs = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/logs');
      
      // Since Flask returns HTML, we'll use mock data for now
      if (response.status === 200) {
        // Mock log data that matches the expected structure
        const mockLogs: LogEntry[] = [
          {
            id: 1,
            api_type: 'placeorder',
            request_data: '{"symbol": "RELIANCE-EQ", "action": "BUY", "quantity": "1"}',
            response_data: '{"status": "success", "orderid": "123456"}',
            created_at: new Date().toISOString()
          },
          {
            id: 2,
            api_type: 'cancelorder',
            request_data: '{"orderid": "123456"}',
            response_data: '{"status": "success"}',
            created_at: new Date(Date.now() - 300000).toISOString()
          }
        ];
        setLogs(mockLogs);
      }
    } catch (error: any) {
      console.error('Error fetching logs:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to fetch logs',
        sound: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.api_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.request_data.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.response_data.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || log.api_type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const formatJson = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return jsonString;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  if (isLoading) {
    return (
      <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
        <div className="bg-gray-900 p-8 text-center">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="ml-3 text-gray-300">Loading logs...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Filters and Search */}
      <div className="mb-6 bg-dark/80 p-4 rounded-lg border border-gray-800">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-300 mb-2">
              Search Logs
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by API type, request, or response..."
              className="w-full px-3 py-2 bg-gray-900 text-gray-300 border border-gray-700 rounded-md focus:outline-none focus:border-blue-600"
            />
          </div>
          
          <div>
            <label htmlFor="filter" className="block text-sm font-medium text-gray-300 mb-2">
              Filter by Type
            </label>
            <select
              id="filter"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 bg-gray-900 text-gray-300 border border-gray-700 rounded-md focus:outline-none focus:border-blue-600"
            >
              <option value="all">All Types</option>
              <option value="placeorder">Place Order</option>
              <option value="cancelorder">Cancel Order</option>
              <option value="modifyorder">Modify Order</option>
              <option value="squareoff">Square Off</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={fetchLogs}
              className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-md transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-xs text-gray-200 uppercase bg-gray-800 border-b border-gray-700">
            <tr>
              <th scope="col" className="py-3 px-6">Order No</th>
              <th scope="col" className="py-3 px-6">API Type</th>
              <th scope="col" className="py-3 px-6">Request Data</th>
              <th scope="col" className="py-3 px-6">Response Data</th>
              <th scope="col" className="py-3 px-6">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log, index) => (
                <tr key={log.id} className="bg-gray-900 border-b border-gray-800">
                  <td className="py-4 px-6">{index + 1}</td>
                  <td className="py-4 px-6">
                    <span className="bg-blue-900/30 text-blue-400 px-2 py-1 rounded text-xs font-semibold">
                      {log.api_type}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <pre className="text-xs bg-gray-800 p-2 rounded overflow-x-auto max-w-xs">
                      {formatJson(log.request_data)}
                    </pre>
                  </td>
                  <td className="py-4 px-6">
                    <pre className="text-xs bg-gray-800 p-2 rounded overflow-x-auto max-w-xs">
                      {formatJson(log.response_data)}
                    </pre>
                  </td>
                  <td className="py-4 px-6 text-xs">
                    {formatTimestamp(log.created_at)}
                  </td>
                </tr>
              ))
            ) : (
              <tr className="bg-gray-900 border-b border-gray-800">
                <td colSpan={5} className="py-8 px-6 text-center text-gray-400">
                  {searchTerm || filterType !== 'all' 
                    ? 'No logs found matching your search criteria' 
                    : 'No logs available for today'
                  }
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Logs;