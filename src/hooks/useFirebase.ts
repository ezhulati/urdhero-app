import { useState, useEffect } from 'react';
import { httpsCallable } from 'firebase/functions';
import { collection, doc, getDoc, getDocs, query, where, onSnapshot } from 'firebase/firestore';
import { db, functions } from '../firebase/config';
import { Restaurant, MenuItem, Table } from '../types';

/**
 * Hook to interact with Firebase backend
 */
export const useFirebase = () => {
  // Cloud Functions wrappers
  const createOrder = async (orderData: any) => {
    try {
      const createOrderFn = httpsCallable(functions, 'createOrder');
      const result = await createOrderFn(orderData);
      return result.data;
    } catch (error: any) {
      console.error('Error creating order:', error);
      throw new Error(error.message || 'Failed to create order');
    }
  };

  const updateOrderStatus = async (data: { orderId: string; status: string; cancellationReason?: string }) => {
    try {
      const updateOrderStatusFn = httpsCallable(functions, 'updateOrderStatus');
      const result = await updateOrderStatusFn(data);
      return result.data;
    } catch (error: any) {
      console.error('Error updating order status:', error);
      throw new Error(error.message || 'Failed to update order status');
    }
  };

  const getOrderByNumber = async (orderNumber: string) => {
    try {
      const getOrderByNumberFn = httpsCallable(functions, 'getOrderByNumber');
      const result = await getOrderByNumberFn({ orderNumber });
      return result.data;
    } catch (error: any) {
      console.error('Error getting order:', error);
      throw new Error(error.message || 'Failed to get order details');
    }
  };

  const createMenuItem = async (menuItemData: Partial<MenuItem>) => {
    try {
      const createMenuItemFn = httpsCallable(functions, 'createMenuItem');
      const result = await createMenuItemFn(menuItemData);
      return result.data;
    } catch (error: any) {
      console.error('Error creating menu item:', error);
      throw new Error(error.message || 'Failed to create menu item');
    }
  };

  const updateMenuItemAvailability = async (menuItemId: string, isAvailable: boolean) => {
    try {
      const updateMenuItemAvailabilityFn = httpsCallable(functions, 'updateMenuItemAvailability');
      const result = await updateMenuItemAvailabilityFn({ menuItemId, eshteIGatshem: isAvailable });
      return result.data;
    } catch (error: any) {
      console.error('Error updating menu item availability:', error);
      throw new Error(error.message || 'Failed to update menu item availability');
    }
  };

  const createTable = async (tableData: any) => {
    try {
      const createTableFn = httpsCallable(functions, 'createTable');
      const result = await createTableFn(tableData);
      return result.data;
    } catch (error: any) {
      console.error('Error creating table:', error);
      throw new Error(error.message || 'Failed to create table');
    }
  };

  const generateTableQR = async (tableId: string, size?: number) => {
    try {
      const generateTableQRFn = httpsCallable(functions, 'generateTableQR');
      const result = await generateTableQRFn({ tableId, size });
      return result.data;
    } catch (error: any) {
      console.error('Error generating QR code:', error);
      throw new Error(error.message || 'Failed to generate QR code');
    }
  };

  const getVenueAnalytics = async (timeRange: 'today' | 'week' | 'month' | 'year' = 'month') => {
    try {
      const getVenueAnalyticsFn = httpsCallable(functions, 'getVenueAnalytics');
      const result = await getVenueAnalyticsFn({ timeRange });
      return result.data;
    } catch (error: any) {
      console.error('Error getting analytics:', error);
      throw new Error(error.message || 'Failed to get venue analytics');
    }
  };

  // Firestore direct operations
  const getVenueBySlug = async (slug: string): Promise<Restaurant | null> => {
    try {
      const venuesRef = collection(db, 'venues');
      const q = query(venuesRef, where('slug', '==', slug));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        return null;
      }
      
      const venueDoc = snapshot.docs[0];
      return { id: venueDoc.id, ...venueDoc.data() } as Restaurant;
    } catch (error) {
      console.error('Error getting venue:', error);
      return null;
    }
  };

  const getTable = async (venueId: string, tableId: string): Promise<Table | null> => {
    try {
      const tableRef = doc(db, 'venues', venueId, 'tables', tableId);
      const tableSnap = await getDoc(tableRef);
      
      if (!tableSnap.exists()) {
        return null;
      }
      
      return { id: tableSnap.id, ...tableSnap.data() } as Table;
    } catch (error) {
      console.error('Error getting table:', error);
      return null;
    }
  };

  const getTableByCode = async (venueId: string, code: string): Promise<Table | null> => {
    try {
      const tablesRef = collection(db, 'venues', venueId, 'tables');
      const q = query(tablesRef, where('kodi', '==', code));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        return null;
      }
      
      const tableDoc = snapshot.docs[0];
      return { id: tableDoc.id, ...tableDoc.data() } as Table;
    } catch (error) {
      console.error('Error getting table by code:', error);
      return null;
    }
  };

  const getVenueMenuItems = async (venueId: string): Promise<MenuItem[]> => {
    try {
      const menuItemsRef = collection(db, 'venues', venueId, 'menuItems');
      const snapshot = await getDocs(menuItemsRef);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MenuItem[];
    } catch (error) {
      console.error('Error getting menu items:', error);
      return [];
    }
  };

  const subscribeToOrder = (orderId: string, callback: (order: any) => void) => {
    const orderRef = doc(db, 'orders', orderId);
    return onSnapshot(orderRef, (doc) => {
      if (doc.exists()) {
        callback({ id: doc.id, ...doc.data() });
      }
    });
  };

  const subscribeToVenueOrders = (venueId: string, callback: (orders: any[]) => void) => {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, where('restorantiId', '==', venueId));
    
    return onSnapshot(q, (snapshot) => {
      const orders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(orders);
    });
  };

  return {
    // Cloud Functions
    createOrder,
    updateOrderStatus,
    getOrderByNumber,
    createMenuItem,
    updateMenuItemAvailability,
    createTable,
    generateTableQR,
    getVenueAnalytics,
    
    // Firestore operations
    getVenueBySlug,
    getTable,
    getTableByCode,
    getVenueMenuItems,
    subscribeToOrder,
    subscribeToVenueOrders
  };
};