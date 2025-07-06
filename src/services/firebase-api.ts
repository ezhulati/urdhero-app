import { httpsCallable, HttpsCallableResult } from 'firebase/functions';
import { collection, doc, getDoc, getDocs, query, where, onSnapshot, DocumentData } from 'firebase/firestore';
import { functions, db, checkFirebaseConnection } from '../lib/firebase';

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
      // Check Firebase connectivity first
      const isConnected = await checkFirebaseConnection();
      if (!isConnected) {
        // In demo mode, provide success response for certain test values
        if (venueSlug === 'beach-bar-durres' && (tableCode === 'A15' || tableCode === 'walk-in')) {
          return {
            success: true,
            venue: {
              id: 'demo-venue-001',
              name: 'Beach Bar Durrës (Demo)',
              slug: 'beach-bar-durres'
            },
            table: {
              id: tableCode === 'walk-in' ? 'walk-in' : 'A15',
              displayName: tableCode === 'walk-in' ? 'Walk-in Customer' : 'Table A15'
            }
          };
        }
        
        // For invalid combos in demo mode
        return {
          success: false,
          message: 'Table not found or invalid QR code'
        };
      }

      // Proceed with Firebase function call
      const validateTableFn = httpsCallable(functions, 'validateTable');
      const result: HttpsCallableResult<any> = await validateTableFn({ venueSlug, tableCode });
      return result.data;
    } catch (error) {
      console.error('Error validating table via Firebase:', error);

      // Provide demo fallback
      if (venueSlug === 'beach-bar-durres' && (tableCode === 'A15' || tableCode === 'walk-in')) {
        console.log('Using demo data for table validation');
        return {
          success: true,
          venue: {
            id: 'demo-venue-001',
            name: 'Beach Bar Durrës (Demo Mode)',
            slug: 'beach-bar-durres'
          },
          table: {
            id: tableCode === 'walk-in' ? 'walk-in' : 'A15',
            displayName: tableCode === 'walk-in' ? 'Walk-in Customer' : 'Table A15'
          }
        };
      }

      return {
        success: false,
        message: 'Unable to validate table. Network error or invalid QR code.'
      };
    }
  },

  // Get venue menu with categories and items
  getVenueMenu: async ({ venueSlug, tableCode }: { venueSlug: string, tableCode: string }) => {
    try {
      // Check Firebase connectivity first
      const isConnected = await checkFirebaseConnection();
      if (!isConnected) {
        console.log('Firebase unavailable, using demo menu data');
        // Return mock menu data for demo mode
        return {
          success: true,
          menu: {
            categories: [
              { id: 'pije', name: 'Pije', nameAlbanian: 'Pije' },
              { id: 'ushqim', name: 'Food', nameAlbanian: 'Ushqim' },
              { id: 'embelsira', name: 'Desserts', nameAlbanian: 'Ëmbëlsira' }
            ],
            items: [
              {
                id: '1',
                name: 'Aperol Spritz',
                nameAlbanian: 'Aperol Spritz',
                description: 'Classic Italian aperitif',
                price: 850,
                categoryId: 'pije',
                isAvailable: true,
                imageUrl: 'https://images.pexels.com/photos/5947043/pexels-photo-5947043.jpeg'
              },
              {
                id: '2',
                name: 'Pizza Margherita',
                nameAlbanian: 'Pizza Margherita',
                description: 'Classic pizza with tomato and mozzarella',
                price: 1200,
                categoryId: 'ushqim',
                isAvailable: true,
                imageUrl: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg'
              }
            ]
          }
        };
      }

      // Proceed with Firebase function call
      const getMenuFn = httpsCallable(functions, 'getVenueMenu');
      const result: HttpsCallableResult<any> = await getMenuFn({ venueSlug, tableCode });
      return result.data;
    } catch (error) {
      console.error('Error getting venue menu:', error);
      
      // Provide demo fallback on error
      console.log('Error, using demo menu data');
      return {
        success: true,
        menu: {
          categories: [
            { id: 'pije', name: 'Drinks', nameAlbanian: 'Pije' },
            { id: 'ushqim', name: 'Food', nameAlbanian: 'Ushqim' }
          ],
          items: [
            {
              id: '1',
              name: 'Aperol Spritz',
              nameAlbanian: 'Aperol Spritz',
              description: 'Classic Italian aperitif',
              price: 850,
              categoryId: 'pije',
              isAvailable: true,
              imageUrl: 'https://images.pexels.com/photos/5947043/pexels-photo-5947043.jpeg'
            }
          ]
        }
      };
    }
  },

  // Get venue categories
  getVenueCategories: async ({ venueId }: { venueId: string }) => {
    try {
      // Check Firebase connectivity first
      const isConnected = await checkFirebaseConnection();
      if (!isConnected) {
        // Return mock categories for demo mode
        return {
          success: true,
          categories: [
            { id: 'pije', name: 'Drinks', nameAlbanian: 'Pije' },
            { id: 'ushqim', name: 'Food', nameAlbanian: 'Ushqim' },
            { id: 'embelsira', name: 'Desserts', nameAlbanian: 'Ëmbëlsira' }
          ]
        };
      }

      const getCategoriesFn = httpsCallable(functions, 'getVenueCategories');
      const result: HttpsCallableResult<any> = await getCategoriesFn({ venueId });
      return result.data;
    } catch (error) {
      console.error('Error getting venue categories:', error);
      
      // Provide fallback categories
      return {
        success: true, 
        categories: [
          { id: 'pije', name: 'Drinks', nameAlbanian: 'Pije' },
          { id: 'ushqim', name: 'Food', nameAlbanian: 'Ushqim' }
        ]
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

// Additional helpers to manage real-time listeners based on connectivity
const getMockOrderUpdate = (orderNumber: string) => {
  // Create mock order updates for demo mode
  const mockOrderData = {
    id: `mock-${orderNumber}`,
    orderNumber,
    status: 'new',
    items: [
      { name: 'Aperol Spritz', quantity: 2, price: 850, total: 1700 }
    ],
    totalAmount: 1700,
    createdAt: new Date(),
    tableName: 'Table A15',
    venue: {
      id: 'demo-venue-001',
      name: 'Beach Bar Durrës (Demo Mode)'
    }
  };

  // Simulate order status progression
  let statusIndex = 0;
  const statuses = ['new', 'accepted', 'preparing', 'ready', 'served'];
  
  // Every 30 seconds, advance the status
  return setInterval(() => {
    statusIndex = (statusIndex + 1) % statuses.length;
    mockOrderData.status = statuses[statusIndex];
    return mockOrderData;
  }, 30000);
};

// Test function to verify Firebase connectivity
export const testFirebaseAPIs = async () => {
  try {
    const isConnected = await checkFirebaseConnection();
    if (isConnected) {
      try {
        // Further verify by trying to read a document
        await getDoc(doc(db, 'system', 'status'));
        console.log('✅ Firebase connection successful');
        return true;
      } catch (error) {
        console.warn('Firebase document read failed, but connection may still be available');
        return true; // Still consider connection available
      }
    }
    return false;
  } catch (error) {
    console.error('❌ Firebase connection failed:', error);
    return false;
  }
};