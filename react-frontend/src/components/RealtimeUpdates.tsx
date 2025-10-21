import React from 'react';
import { useRealtimeNotifications } from '../hooks/useRealtimeNotifications';

const RealtimeUpdates: React.FC = () => {
  // This component just sets up the real-time notifications
  // It doesn't render anything visible
  useRealtimeNotifications();
  
  return null;
};

export default RealtimeUpdates;