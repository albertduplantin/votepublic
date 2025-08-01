import { useState, useCallback } from 'react';
import { NotificationType } from '../components/ui/Notification';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((
    type: NotificationType,
    title: string,
    message?: string,
    duration?: number
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification: Notification = {
      id,
      type,
      title,
      ...(message !== undefined && { message }),
      ...(duration !== undefined && { duration })
    };

    setNotifications(prev => [...prev, newNotification]);
    return id;
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Méthodes utilitaires pour différents types de notifications
  const showSuccess = useCallback((title: string, message?: string, duration?: number) => {
    return addNotification('success', title, message, duration);
  }, [addNotification]);

  const showError = useCallback((title: string, message?: string, duration?: number) => {
    return addNotification('error', title, message, duration);
  }, [addNotification]);

  const showWarning = useCallback((title: string, message?: string, duration?: number) => {
    return addNotification('warning', title, message, duration);
  }, [addNotification]);

  const showInfo = useCallback((title: string, message?: string, duration?: number) => {
    return addNotification('info', title, message, duration);
  }, [addNotification]);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};