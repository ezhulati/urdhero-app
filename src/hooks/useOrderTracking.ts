import { useState, useEffect } from 'react';
import { useFirebase } from './useFirebase';
import { Order, OrderStatus } from '../types';
import toast from 'react-hot-toast';

export const useOrderTracking = (orderNumber: string) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  
  const { getOrderByNumber, subscribeToOrder } = useFirebase();

  useEffect(() => {
    if (!orderNumber) return;

    const fetchOrder = async () => {
      setLoading(true);
      try {
        // First get the order details including the orderId
        const orderDetails = await getOrderByNumber(orderNumber);
        
        if (!orderDetails) {
          setError('Order not found');
          setLoading(false);
          return;
        }
        
        // Set initial order state
        setOrder(orderDetails);
        
        // Set up real-time listener for order updates
        const unsubscribe = subscribeToOrder(orderDetails.orderId, (updatedOrder) => {
          setOrder(updatedOrder);
          
          // Show toast notification when status changes
          if (updatedOrder.statusi !== orderDetails.statusi) {
            const statusMessages = {
              [OrderStatus.PRANUAR]: 'Your order has been accepted!',
              [OrderStatus.DUKE_U_PERGATITUR]: 'Your order is being prepared!',
              [OrderStatus.GATI]: 'Your order is ready!',
              [OrderStatus.SHERBYER]: 'Your order has been served!',
              [OrderStatus.ANULUAR]: 'Your order has been cancelled'
            };
            
            const message = statusMessages[updatedOrder.statusi as OrderStatus] || 'Your order status has been updated';
            toast.success(message);
          }
        });
        
        // Clean up listener on unmount
        return () => unsubscribe();
      } catch (error: any) {
        console.error('Error fetching order:', error);
        setError(error.message || 'Failed to load order');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderNumber, getOrderByNumber, subscribeToOrder]);

  useEffect(() => {
    if (!order) return;

    // Calculate progress based on order status
    let progressValue = 0;
    switch (order.statusi) {
      case OrderStatus.E_RE:
        progressValue = 20;
        break;
      case OrderStatus.PRANUAR:
        progressValue = 40;
        break;
      case OrderStatus.DUKE_U_PERGATITUR:
        progressValue = 70;
        break;
      case OrderStatus.GATI:
      case OrderStatus.SHERBYER:
        progressValue = 100;
        break;
      case OrderStatus.ANULUAR:
        progressValue = 0;
        break;
    }
    
    setProgress(progressValue);
  }, [order]);

  const getEstimatedTime = () => {
    if (!order) return 0;
    if (order.statusi === OrderStatus.GATI || order.statusi === OrderStatus.SHERBYER) return 0;
    
    // Calculate based on order creation time and typical times for each stage
    const now = new Date();
    const createdTime = order.krijuarNe instanceof Date 
      ? order.krijuarNe 
      : new Date(order.krijuarNe);
      
    const minutesSinceCreation = Math.floor((now.getTime() - createdTime.getTime()) / 60000);
    
    // Default time estimates by status
    const defaultTimesByStatus = {
      [OrderStatus.E_RE]: 20,
      [OrderStatus.PRANUAR]: 15,
      [OrderStatus.DUKE_U_PERGATITUR]: 10
    };
    
    // Get the estimated total time based on the current status
    const estimatedTotalTime = defaultTimesByStatus[order.statusi as keyof typeof defaultTimesByStatus] || 0;
    
    // Remaining time is the estimated total minus time already elapsed
    return Math.max(0, estimatedTotalTime - minutesSinceCreation);
  };

  const callWaiter = async () => {
    // In a real implementation, this would use a separate Cloud Function
    toast.success('Staff will assist you shortly!');
  };

  return {
    order,
    loading,
    error,
    progress,
    estimatedTime: getEstimatedTime(),
    callWaiter
  };
};