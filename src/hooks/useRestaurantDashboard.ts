import { useState, useEffect } from 'react';
import { useFirebase } from './useFirebase';
import { Order, OrderStatus } from '../types';
import toast from 'react-hot-toast';
import { DocumentData } from 'firebase/firestore';

export const useRestaurantDashboard = (venueId: string) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');
  const [stats, setStats] = useState({
    today: { orders: 0, revenue: 0 },
    pending: 0,
    avgTime: 0
  });

  const { 
    subscribeToVenueOrders, 
    updateOrderStatus, 
    getVenueAnalytics 
  } = useFirebase();

  useEffect(() => {
    if (!venueId) return;

    setLoading(true);
    
    // Subscribe to real-time updates for venue orders
    const unsubscribe = subscribeToVenueOrders(venueId, (ordersData: DocumentData[]) => {
      setOrders(ordersData);
      
      // Calculate dashboard stats
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      // Today's orders and revenue
      const todayOrders = ordersData.filter(order => {
        const orderDate = order.krijuarNe instanceof Date 
          ? order.krijuarNe 
          : new Date(order.krijuarNe);
        return orderDate >= startOfDay;
      });
      
      const todayRevenue = todayOrders.reduce((sum, order) => sum + order.shumaTotale, 0);
      
      // Pending orders (not served or cancelled)
      const pendingOrders = ordersData.filter(order => 
        order.statusi !== OrderStatus.SHERBYER && order.statusi !== OrderStatus.ANULUAR
      );
      
      // Calculate average preparation time
      let totalPrepTime = 0;
      let prepOrderCount = 0;
      
      ordersData.forEach(order => {
        if (order.pranusNe && order.gatiNe) {
          const acceptedTime = order.pranusNe instanceof Date 
            ? order.pranusNe 
            : new Date(order.pranusNe);
            
          const readyTime = order.gatiNe instanceof Date 
            ? order.gatiNe 
            : new Date(order.gatiNe);
            
          const prepMinutes = Math.floor((readyTime.getTime() - acceptedTime.getTime()) / 60000);
          totalPrepTime += prepMinutes;
          prepOrderCount++;
        }
      });
      
      const avgPrepTime = prepOrderCount > 0 ? Math.round(totalPrepTime / prepOrderCount) : 0;
      
      setStats({
        today: { 
          orders: todayOrders.length, 
          revenue: todayRevenue 
        },
        pending: pendingOrders.length,
        avgTime: avgPrepTime
      });
      
      setLoading(false);
    });
    
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [venueId, subscribeToVenueOrders]);

  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus, cancellationReason?: string) => {
    try {
      await updateOrderStatus({
        orderId,
        status: newStatus,
        cancellationReason
      });
      
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error: any) {
      console.error('Error updating order status:', error);
      toast.error(error.message || 'Failed to update order status');
    }
  };

  const loadAnalytics = async (timeRange: 'today' | 'week' | 'month' | 'year' = 'month') => {
    try {
      return await getVenueAnalytics(timeRange);
    } catch (error: any) {
      console.error('Error loading analytics:', error);
      toast.error('Failed to load analytics data');
      return null;
    }
  };

  // Get filtered orders based on selected filter
  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.statusi === filter);

  return {
    orders,
    filteredOrders,
    loading,
    stats,
    filter,
    setFilter,
    updateOrderStatus: handleUpdateOrderStatus,
    loadAnalytics
  };
};