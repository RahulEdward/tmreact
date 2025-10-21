import { io, Socket } from 'socket.io-client';
import { 
  OrderEvent, 
  ClosePositionEvent, 
  CancelOrderEvent, 
  ModifyOrderEvent 
} from '../types';

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  connect(): void {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io('http://localhost:5000', {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      timeout: 20000,
    });

    this.socket.on('connect', () => {
      console.log('Connected to Flask SocketIO server');
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected from Flask SocketIO server:', reason);
      this.handleReconnect();
    });

    this.socket.on('connect_error', (error) => {
      console.error('SocketIO connection error:', error);
      this.handleReconnect();
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  // Order Events
  onOrderEvent(callback: (data: OrderEvent) => void): void {
    if (this.socket) {
      this.socket.on('order_event', callback);
    }
  }

  offOrderEvent(): void {
    if (this.socket) {
      this.socket.off('order_event');
    }
  }

  // Close Position Events
  onClosePosition(callback: (data: ClosePositionEvent) => void): void {
    if (this.socket) {
      this.socket.on('close_position', callback);
    }
  }

  offClosePosition(): void {
    if (this.socket) {
      this.socket.off('close_position');
    }
  }

  // Cancel Order Events
  onCancelOrder(callback: (data: CancelOrderEvent) => void): void {
    if (this.socket) {
      this.socket.on('cancel_order_event', callback);
    }
  }

  offCancelOrder(): void {
    if (this.socket) {
      this.socket.off('cancel_order_event');
    }
  }

  // Modify Order Events
  onModifyOrder(callback: (data: ModifyOrderEvent) => void): void {
    if (this.socket) {
      this.socket.on('modify_order_event', callback);
    }
  }

  offModifyOrder(): void {
    if (this.socket) {
      this.socket.off('modify_order_event');
    }
  }

  // Master Contract Download Events
  onMasterContractDownload(callback: (data: { status: string; message: string }) => void): void {
    if (this.socket) {
      this.socket.on('master_contract_download', callback);
    }
  }

  offMasterContractDownload(): void {
    if (this.socket) {
      this.socket.off('master_contract_download');
    }
  }

  // Generic event listener
  on(event: string, callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event: string): void {
    if (this.socket) {
      this.socket.off(event);
    }
  }

  // Check connection status
  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

// Export singleton instance
export const socketService = new SocketService();
export default socketService;