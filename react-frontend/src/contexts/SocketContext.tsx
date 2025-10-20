import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import socketService from '../services/socketService';
import { 
  OrderEvent, 
  ClosePositionEvent, 
  CancelOrderEvent, 
  ModifyOrderEvent 
} from '../types';

interface SocketContextType {
  isConnected: boolean;
  onOrderEvent: (callback: (data: OrderEvent) => void) => void;
  onClosePosition: (callback: (data: ClosePositionEvent) => void) => void;
  onCancelOrder: (callback: (data: CancelOrderEvent) => void) => void;
  onModifyOrder: (callback: (data: ModifyOrderEvent) => void) => void;
  onMasterContractDownload: (callback: (data: { status: string; message: string }) => void) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      // Connect to SocketIO when user is authenticated
      socketService.connect();
    } else {
      // Disconnect when user is not authenticated
      socketService.disconnect();
    }

    // Cleanup on unmount
    return () => {
      socketService.disconnect();
    };
  }, [isAuthenticated]);

  const value: SocketContextType = {
    isConnected: socketService.isConnected(),
    onOrderEvent: (callback) => socketService.onOrderEvent(callback),
    onClosePosition: (callback) => socketService.onClosePosition(callback),
    onCancelOrder: (callback) => socketService.onCancelOrder(callback),
    onModifyOrder: (callback) => socketService.onModifyOrder(callback),
    onMasterContractDownload: (callback) => socketService.onMasterContractDownload(callback),
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};