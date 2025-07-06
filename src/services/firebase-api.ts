import { httpsCallable } from 'firebase/functions';
import { functions } from '../lib/firebase';
import { collection, doc, getDoc, getDocs, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

/**
 * Firebase API integration layer
 * 
 * This service provides methods to interact with Firebase Cloud Functions
 * and Firestore directly, with proper error handling.
 */

// Venue-related API calls
export const venueAPI = {
  // Validate a table in a venue using QR code details
  validateTable: async ({ venueSlug, tableCode }: { venueSlug: string, tableCode: string }) => {
    try {
      const validateTableFn = httpsCallable(functions, 'validateTable');
      const result = await validateTableFn({ venueSlug, tableCode });
      return result.data;
    } catch (error) {
      console.error('Error validating table:', error);
      // Handle demo mode or provide a fallback
      return {
        success: false,
        message: 'Failed to validate table. Please try again or contact support.'
      };
    }
  },

  // Get venue menu with categories and items
  getVenueMenu: async ({ venueSlug, tableCode }: { venueSlug: string, tableCode: string }) => {
    try {
      const getMenuFn = httpsCallable(functions, 'getVenueMenu');
      const result = await getMenuFn({ venueSlug, tableCode });
      return result.data;
    } catch (error) {
      console.error('Error getting venue menu:', error);
      // Handle demo mode or provide a fallback
      return {
        success: false,
        message: 'Failed to load menu. Please try again or contact support.'
      };
    }
  },

  // Get venue categories
  getVenueCategories: async ({ venueId }: { venueId: string }) => {
    try {
      const getCategoriesFn = httpsCallable(functions, 'getVenueCategories');
      const result = await getCategoriesFn({ venueId });
      return result.data;
    } catch (error) {
      console.error('Error getting venue categories:', error);
      return {
        success: false, 
        message: 'Failed to load categories.'
      };
    }
  }
};

// Order-related API calls
export const orderAPI = {
  // Create a new order
  createOrder: async (orderData: any) => {
    try {
      const createOrderFn = httpsCallable(functions, 'createOrder');
      const result = await createOrderFn(orderData);
      return result.data;
    } catch (error) {
      console.error('Error creating order:', error);
      return {
        success: false,
        message: 'Failed to create order. Please try again or contact support.'
      };
    }
  },

  // Get order status
  getOrderStatus: async ({ orderNumber }: { orderNumber: string }) => {
    try {
      const getOrderStatusFn = httpsCallable(functions, 'getOrderStatus');
      const result = await getOrderStatusFn({ orderNumber });
      return result.data;
    } catch (error) {
      console.error('Error getting order status:', error);
      return {
        success: false,
        message: 'Failed to get order status. Please try again or contact support.'
      };
    }
  },

  // Update order status (for staff)
  updateOrderStatus: async ({ orderNumber, status }: { orderNumber: string, status: string }) => {
    try {
      const updateOrderStatusFn = httpsCallable(functions, 'updateOrderStatus');
      const result = await updateOrderStatusFn({ orderNumber, status });
      return result.data;
    } catch (error) {
      console.error('Error updating order status:', error);
      return {
        success: false,
        message: 'Failed to update order status. Please try again or contact support.'
      };
    }
  }
};

// Firestore direct listeners (for real-time updates)
export const firestoreListeners = {
  // Listen to order changes in real-time
  subscribeToOrder: (orderNumber: string, callback: (order: any) => void) => {
    try {
      // Query orders collection for this order number
      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, where('orderNumber', '==', orderNumber));
      
      return onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const orderDoc = snapshot.docs[0];
          callback({
            id: orderDoc.id,
            ...orderDoc.data()
          });
        }
      }, (error) => {
        console.error('Error listening to order updates:', error);
        // Don't call callback on error to avoid UI issues
      });
    } catch (error) {
      console.error('Error setting up order listener:', error);
      return () => {}; // Return empty unsubscribe function
    }
  },
  
  // Listen to menu changes for a venue in real-time
  subscribeToVenueMenu: (venueId: string, callback: (items: any[]) => void) => {
    try {
      const menuItemsRef = collection(db, 'venues', venueId, 'menuItems');
      
      return onSnapshot(menuItemsRef, (snapshot) => {
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        callback(items);
      }, (error) => {
        console.error('Error listening to menu updates:', error);
        // Don't call callback on error
      });
    } catch (error) {
      console.error('Error setting up menu listener:', error);
      return () => {}; // Return empty unsubscribe function
    }
  }
};

// Test function to verify Firebase connectivity
export const testFirebaseAPIs = async () => {
  try {
    // Try to get a document from Firestore to verify connectivity
    const testDoc = await getDoc(doc(db, 'system', 'status'));
    
    if (testDoc.exists()) {
      console.log('✅ Firebase connection successful');
      return true;
    }
    
    // If document doesn't exist, try calling a simple function
    const testFunctionFn = httpsCallable(functions, 'ping');
    await testFunctionFn();
    
    console.log('✅ Firebase Functions connection successful');
    return true;
  } catch (error) {
    console.error('❌ Firebase connection failed:', error);
    return false;
  }
};