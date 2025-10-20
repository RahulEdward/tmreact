import { useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { useNotification } from '../contexts/NotificationContext';

export const useRealtimeNotifications = () => {
  const { 
    onOrderEvent, 
    onClosePosition, 
    onCancelOrder, 
    onModifyOrder, 
    onMasterContractDownload 
  } = useSocket();
  const { addNotification } = useNotification();

  useEffect(() => {
    // Order Events
    onOrderEvent((data) => {
      addNotification({
        type: 'success',
        title: 'Order Executed',
        message: `${data.action} order for ${data.symbol} (ID: ${data.orderid})`,
        sound: true,
        duration: 5000,
      });
    });

    // Close Position Events
    onClosePosition((data) => {
      addNotification({
        type: 'info',
        title: 'Positions Closed',
        message: data.message || 'All open positions have been squared off',
        sound: true,
        duration: 5000,
      });
    });

    // Cancel Order Events
    onCancelOrder((data) => {
      if (data.status === 'success') {
        addNotification({
          type: 'warning',
          title: 'Order Cancelled',
          message: `Order ${data.orderid} has been cancelled`,
          sound: true,
          duration: 4000,
        });
      } else {
        addNotification({
          type: 'error',
          title: 'Cancellation Failed',
          message: data.message || 'Failed to cancel order',
          sound: true,
          duration: 5000,
        });
      }
    });

    // Modify Order Events
    onModifyOrder((data) => {
      if (data.status === 'success') {
        addNotification({
          type: 'info',
          title: 'Order Modified',
          message: `Order ${data.orderid} has been modified`,
          sound: true,
          duration: 4000,
        });
      } else {
        addNotification({
          type: 'error',
          title: 'Modification Failed',
          message: data.message || 'Failed to modify order',
          sound: true,
          duration: 5000,
        });
      }
    });

    // Master Contract Download Events
    onMasterContractDownload((data) => {
      addNotification({
        type: data.status === 'success' ? 'success' : 'error',
        title: 'Master Contract Update',
        message: data.message,
        sound: data.status === 'error',
        duration: 6000,
      });
    });

  }, [onOrderEvent, onClosePosition, onCancelOrder, onModifyOrder, onMasterContractDownload, addNotification]);
};