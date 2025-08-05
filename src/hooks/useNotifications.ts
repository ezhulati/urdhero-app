import { useState, useEffect } from 'react';
import { notificationManager, smsService, emailService, pushService } from '../services/notifications';

export const useNotifications = () => {
  const [permissions, setPermissions] = useState({
    push: false,
    sms: true,
    email: true
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeNotifications();
  }, []);

  const initializeNotifications = async () => {
    try {
      // Check push notification permission
      if ('Notification' in window) {
        const pushPermission = Notification.permission === 'granted';
        setPermissions(prev => ({ ...prev, push: pushPermission }));
        
        if (pushPermission) {
          await pushService.initialize();
        }
      }
      
      // Load user preferences from localStorage
      const savedPrefs = localStorage.getItem('notification-preferences');
      if (savedPrefs) {
        const prefs = JSON.parse(savedPrefs);
        setPermissions(prev => ({ ...prev, ...prefs }));
      }
    } catch (error) {
      console.error('Error initializing notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const requestPushPermission = async (): Promise<boolean> => {
    try {
      if (!('Notification' in window)) {
        throw new Error('Push notifications not supported');
      }

      const permission = await Notification.requestPermission();
      const granted = permission === 'granted';
      
      setPermissions(prev => ({ ...prev, push: granted }));
      
      if (granted) {
        await pushService.initialize();
      }
      
      return granted;
    } catch (error) {
      console.error('Error requesting push permission:', error);
      return false;
    }
  };

  const updatePreferences = (newPreferences: Partial<typeof permissions>) => {
    const updatedPrefs = { ...permissions, ...newPreferences };
    setPermissions(updatedPrefs);
    localStorage.setItem('notification-preferences', JSON.stringify(updatedPrefs));
  };

  const sendOrderConfirmation = async (orderData: {
    customer: {
      name: string;
      email?: string;
      phone?: string;
    };
    order: {
      number: string;
      items: Array<{
        name: string;
        quantity: number;
        price: number;
      }>;
      total: number;
      estimatedTime: number;
    };
    restaurant: {
      name: string;
    };
    language?: string;
  }) => {
    try {
      await notificationManager.sendOrderConfirmation({
        ...orderData,
        preferences: permissions
      });
    } catch (error) {
      console.error('Failed to send order confirmation:', error);
    }
  };

  const sendStatusUpdate = async (data: {
    customer: {
      name: string;
      email?: string;
      phone?: string;
    };
    order: {
      number: string;
      status: string;
    };
    restaurant: {
      name: string;
    };
    language?: string;
  }) => {
    try {
      await notificationManager.sendStatusUpdate({
        ...data,
        preferences: permissions
      });
    } catch (error) {
      console.error('Failed to send status update:', error);
    }
  };

  const sendTestNotification = async (type: 'sms' | 'email' | 'push') => {
    try {
      switch (type) {
        case 'sms':
          // Would need phone number for real test
          console.log('SMS test notification would be sent');
          break;
          
        case 'email':
          // Would need email for real test
          console.log('Email test notification would be sent');
          break;
          
        case 'push':
          await pushService.showOrderNotification({
            orderNumber: 'TEST-001',
            status: 'ready',
            message: 'This is a test notification',
            restaurantName: 'Test Restaurant'
          });
          break;
      }
    } catch (error) {
      console.error(`Failed to send ${type} test notification:`, error);
    }
  };

  return {
    permissions,
    loading,
    requestPushPermission,
    updatePreferences,
    sendOrderConfirmation,
    sendStatusUpdate,
    sendTestNotification
  };
};