import { httpsCallable, HttpsCallableResult } from 'firebase/functions';
import { collection, doc, getDoc, getDocs, query, where, onSnapshot, DocumentData, DocumentReference } from 'firebase/firestore';
import { functions, db, checkFirebaseConnection, createCallableWithFallback } from '../lib/firebase';

/**
 * Firebase API integration layer
 * 
 * This service provides methods to interact with Firebase Cloud Functions
 * and Firestore directly, with proper error handling and fallback mechanisms.
 */

// Venue-related API calls
export const venueAPI = {
  // Validate a table in a venue using QR code details
  validateTable: createCallableWithFallback<
    { venueSlug: string; tableCode: string },
    any
  >(
    'validateTable',
    async ({ venueSlug, tableCode }) => {
      console.log('Using mock table validation for:', { venueSlug, tableCode });
      
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
            displayName: tableCode === 'walk-in' ? 'Walk-in Customer' : 'Table A15',
            section: 'VIP Terrace'
          }
        };
      }
      
      // For invalid combos in demo mode
      return {
        success: false,
        message: 'Table not found or invalid QR code'
      };
    }
  ),
  
  // Get venue menu with categories and items
  getMenu: createCallableWithFallback<
    { venueSlug: string; tableCode: string },
    any
  >(
    'getVenueMenu',
    async ({ venueSlug, tableCode }) => {
      console.log('Using mock menu data for:', { venueSlug, tableCode });
      
      // Return mock menu data for demo mode
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
        },
        categories: [
          { 
            id: 'pije', 
            name: 'Drinks', 
            nameAlbanian: 'Pije',
            items: [
              {
                id: '1',
                name: 'Aperol Spritz',
                nameAlbanian: 'Aperol Spritz',
                description: 'Classic Italian aperitif with Aperol, Prosecco and soda',
                descriptionAlbanian: 'Aperitiv klasik italian me Aperol, Prosecco dhe soda',
                price: 850,
                isAvailable: true,
                allergens: [],
                tags: ['alcohol', 'cocktail'],
                imageUrl: 'https://images.pexels.com/photos/5947043/pexels-photo-5947043.jpeg'
              },
              {
                id: '4',
                name: 'Espresso Coffee',
                nameAlbanian: 'Kafe Espresso',
                description: 'Perfect Italian coffee, prepared from selected beans',
                descriptionAlbanian: 'Kafe italiane perfekte, e përgatitur nga kokrra të zgjedhura',
                price: 200,
                isAvailable: true,
                allergens: [],
                tags: ['coffee', 'hot'],
                imageUrl: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg'
              }
            ]
          },
          {
            id: 'ushqim',
            name: 'Food',
            nameAlbanian: 'Ushqim',
            items: [
              {
                id: '2',
                name: 'Pizza Margherita',
                nameAlbanian: 'Pizza Margherita',
                description: 'Classic pizza with fresh tomato sauce and mozzarella',
                descriptionAlbanian: 'Picë klasike me salcë domate të freskët dhe mocarela',
                price: 1200,
                isAvailable: true,
                allergens: ['gluten', 'dairy'],
                tags: ['vegetarian'],
                imageUrl: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg'
              },
              {
                id: '5',
                name: 'Grilled Fish',
                nameAlbanian: 'Peshk i Grilluar',
                description: 'Catch of the day grilled to perfection with seasonal vegetables',
                descriptionAlbanian: 'Peshku i ditës i pjekur në perfeksion me perime sezonale',
                price: 1800,
                isAvailable: true,
                allergens: ['fish'],
                tags: [],
                imageUrl: 'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg'
              }
            ]
          }
        ]
      };
    }
  ),
  
  // Get venue categories
  getVenueCategories: createCallableWithFallback<
    { venueId: string },
    any
  >(
    'getVenueCategories',
    async ({ venueId }) => {
      console.log('Using mock category data for venue:', venueId);
      
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
  )
};

// Order-related API calls
export const orderAPI = {
  // Create a new order
  createOrder: createCallableWithFallback<any, any>(
    'createOrder',
    async (orderData) => {
      console.log('Using mock order creation with data:', orderData);
      
      // Create mock order response
      const orderNumber = `UR-${Date.now().toString().slice(-6)}`;
      
      return {
        success: true,
        orderId: `mock-${Date.now()}`,
        orderNumber,
        totalAmount: orderData.items.reduce((sum: number, item: any) => {
          return sum + (item.quantity * (item.price || 1000));
        }, 0),
        estimatedPreparationTime: 20,
        trackingUrl: `/order/${orderNumber}`
      };
    }
  ),

  // Get order status (for tracking)
  getOrderStatus: createCallableWithFallback<
    { orderNumber: string },
    any
  >(
    'getOrderStatus',
    async ({ orderNumber }) => {
      console.log('Using mock order status for:', orderNumber);
      
      // Generate a stable status based on order number and time
      const orderDate = new Date(parseInt(orderNumber.split('-')[1]) || Date.now() - 15 * 60000);
      const minutesElapsed = Math.floor((Date.now() - orderDate.getTime()) / 60000);
      
      // Determine status based on elapsed time
      let status;
      if (minutesElapsed < 5) status = 'new';
      else if (minutesElapsed < 10) status = 'accepted';
      else if (minutesElapsed < 20) status = 'preparing';
      else if (minutesElapsed < 30) status = 'ready';
      else status = 'served';
      
      return {
        success: true,
        order: {
          id: `mock-${orderNumber}`,
          orderNumber,
          status,
          totalAmount: 1700,
          items: [
            { menuItemId: '1', name: 'Aperol Spritz', quantity: 2, price: 850, total: 1700 }
          ],
          specialInstructions: '',
          tableName: 'Table A15',
          createdAt: orderDate,
          timestamps: {
            created: orderDate.toISOString(),
            accepted: minutesElapsed >= 5 ? new Date(orderDate.getTime() + 5 * 60000).toISOString() : null,
            preparing: minutesElapsed >= 10 ? new Date(orderDate.getTime() + 10 * 60000).toISOString() : null,
            ready: minutesElapsed >= 20 ? new Date(orderDate.getTime() + 20 * 60000).toISOString() : null,
            served: minutesElapsed >= 30 ? new Date(orderDate.getTime() + 30 * 60000).toISOString() : null
          },
          venue: {
            id: 'demo-venue-001',
            name: 'Beach Bar Durrës',
            slug: 'beach-bar-durres',
            type: 'beach_bar'
          }
        }
      };
    }
  ),

  // Update order status (for restaurant staff)
  updateOrderStatus: createCallableWithFallback<
    { orderNumber: string; status: string; cancellationReason?: string },
    any
  >(
    'updateOrderStatus',
    async ({ orderNumber, status, cancellationReason }) => {
      console.log('Using mock order status update:', { orderNumber, status, cancellationReason });
      
      return {
        success: true,
        newStatus: status,
        message: 'Order status updated successfully'
      };
    }
  )
};

// Firestore direct listeners (for real-time updates)
export const firestoreListeners = {
  // Listen to order changes in real-time
  subscribeToOrder: (orderNumber: string, callback: (order: any) => void) => {
    // First check if Firebase is available
    checkFirebaseConnection().then(isAvailable => {
      if (isAvailable) {
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
            } else {
              // Use mock data if order not found in Firestore
              callback(getMockOrderUpdate(orderNumber));
            }
          }, (error) => {
            console.error('Error listening to order updates:', error);
            // Fall back to mock updates on error
            const mockUpdateInterval = simulateOrderUpdates(orderNumber, callback);
            return () => clearInterval(mockUpdateInterval);
          });
        } catch (error) {
          console.error('Error setting up order listener:', error);
          // Fall back to mock updates
          const mockUpdateInterval = simulateOrderUpdates(orderNumber, callback);
          return () => clearInterval(mockUpdateInterval);
        }
      } else {
        console.log('Firebase unavailable, using mock order updates');
        // Use mock updates for demo mode
        const mockUpdateInterval = simulateOrderUpdates(orderNumber, callback);
        return () => clearInterval(mockUpdateInterval);
      }
    });
    
    // Default unsubscribe function
    return () => {};
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

// Helper function to simulate order updates for demo mode
export const simulateOrderUpdates = (orderNumber: string, callback: (order: any) => void): number => {
  // Create initial mock order
  const mockOrder = getMockOrderUpdate(orderNumber);
  callback(mockOrder);
  
  // Status progression
  const statuses = ['new', 'accepted', 'preparing', 'ready', 'served'];
  let statusIndex = 0;
  
  // Update every 30 seconds
  return window.setInterval(() => {
    statusIndex = (statusIndex + 1) % statuses.length;
    mockOrder.status = statuses[statusIndex];
    
    // Update timestamps
    const now = new Date();
    if (statusIndex >= 1) mockOrder.timestamps.accepted = now.toISOString();
    if (statusIndex >= 2) mockOrder.timestamps.preparing = now.toISOString();
    if (statusIndex >= 3) mockOrder.timestamps.ready = now.toISOString();
    if (statusIndex >= 4) mockOrder.timestamps.served = now.toISOString();
    
    callback({...mockOrder});
  }, 30000);
};

// Helper to create mock order data
export const getMockOrderUpdate = (orderNumber: string) => {
  // Parse order time from the order number if possible
  let orderTime;
  if (orderNumber.includes('-')) {
    const parts = orderNumber.split('-');
    if (parts.length > 1 && !isNaN(parseInt(parts[1]))) {
      orderTime = new Date(parseInt(parts[1]));
    } else {
      orderTime = new Date(Date.now() - 15 * 60000);
    }
  } else {
    orderTime = new Date(Date.now() - 15 * 60000);
  }

  return {
    id: `mock-${orderNumber}`,
    orderNumber,
    status: 'new',
    totalAmount: 1700,
    items: [
      { menuItemId: '1', name: 'Aperol Spritz', quantity: 2, price: 850, total: 1700 }
    ],
    specialInstructions: '',
    tableName: 'Table A15',
    createdAt: orderTime,
    timestamps: {
      created: orderTime.toISOString(),
      accepted: null,
      preparing: null,
      ready: null,
      served: null
    },
    venue: {
      id: 'demo-venue-001',
      name: 'Beach Bar Durrës (Demo Mode)',
      slug: 'beach-bar-durres',
      type: 'beach_bar'
    }
  };
};

// Test function to verify Firebase connectivity
export const testFirebaseAPIs = async () => {
  try {
    const isConnected = await checkFirebaseConnection();
    if (!isConnected) {
      console.warn('Firebase connection check failed');
      return false;
    }
    
    console.log('✅ Firebase connection successful');
    return true;
  } catch (error) {
    console.error('❌ Firebase connection test error:', error);
    return false;
  }
};