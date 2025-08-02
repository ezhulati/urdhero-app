import { httpsCallable, HttpsCallableResult } from 'firebase/functions';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  DocumentData, 
  DocumentReference,
  QuerySnapshot
} from 'firebase/firestore';
import { functions, db } from '../firebase/config';
import { 
  checkFirebaseConnection, 
  createCallableWithFallback,
  doc,
  getDoc,
  safeGetDoc
} from '../firebase/utils';

/**
 * Firebase API integration layer
 * 
 * This service provides methods to interact with Firebase Cloud Functions
 * and Firestore directly, with proper error handling and fallback mechanisms.
 */

// Venue-related API calls
export const venueAPI = {
  /**
   * Validate a table in a venue using QR code details
   * @param data Object containing venueSlug and tableCode
   * @returns Validation result with venue and table information
   */
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
  
  /**
   * Get venue menu with categories and items
   * @param data Object containing venueSlug and tableCode
   * @returns Menu data including venue, table, and categories with items
   */
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
  
  /**
   * Get venue categories
   * @param data Object containing venueId
   * @returns List of categories for the venue
   */
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
  /**
   * Create a new order
   * @param orderData Order data including items, venue, table, etc.
   * @returns Order creation result with order number and tracking information
   */
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

  /**
   * Get order status for tracking
   * @param data Object containing orderNumber
   * @returns Order details including status, items, and timestamps
   */
  getOrderStatus: createCallableWithFallback<
    { orderNumber: string },
    any
  >(
    'getOrderStatus',
    async ({ orderNumber }) => {
      console.log('Using mock order status for:', orderNumber);
      
      // Validate orderNumber
      if (!orderNumber || typeof orderNumber !== 'string') {
        throw new Error('Invalid order number provided');
      }
      
      // Generate a stable status based on order number and time
      let orderDate;
      try {
        const parts = orderNumber.split('-');
        const timestamp = parts.length > 1 ? parseInt(parts[1]) : null;
        orderDate = timestamp ? new Date(timestamp) : new Date(Date.now() - 15 * 60000);
      } catch (parseError) {
        console.warn('Error parsing order number for date:', parseError);
        orderDate = new Date(Date.now() - 15 * 60000);
      }
      
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

  /**
   * Update order status (for restaurant staff)
   * @param data Object with orderNumber, status, and optional cancellationReason
   * @returns Status update result
   */
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
  ),
  
  /**
   * Create a new menu item
   * @param menuItemData Menu item data
   * @returns Created menu item
   */
  createMenuItem: createCallableWithFallback<
    Partial<MenuItem>,
    MenuItem
  >(
    'createMenuItem',
    async (menuItemData) => {
      console.log('Using mock menu item creation with data:', menuItemData);
      
      // Create mock menu item
      return {
        id: `item-${Date.now()}`,
        emri: menuItemData.emri || 'New Item',
        pershkrimi: menuItemData.pershkrimi || '',
        cmimi: menuItemData.cmimi || 0,
        kategoria: menuItemData.kategoria || 'Other',
        nenkategoria: menuItemData.nenkategoria,
        imazhi: menuItemData.imazhi,
        eshteVegan: menuItemData.eshteVegan || false,
        eshteVegetarian: menuItemData.eshteVegetarian || false,
        eshteIGatshem: menuItemData.eshteIGatshem !== undefined ? menuItemData.eshteIGatshem : true,
        kohaPergatitjes: menuItemData.kohaPergatitjes || 10,
        rradhaRenditjes: menuItemData.rradhaRenditjes || 0,
        krijuarNe: new Date(),
        perditesuesNe: new Date()
      };
    }
  ),
  
  /**
   * Update menu item availability
   * @param data Object with menuItemId and availability status
   * @returns Update result
   */
  updateMenuItemAvailability: createCallableWithFallback<
    { menuItemId: string; eshteIGatshem: boolean },
    { success: boolean; menuItemId: string; isAvailable: boolean }
  >(
    'updateMenuItemAvailability',
    async (data) => {
      console.log('Using mock menu item availability update with data:', data);
      
      return {
        success: true,
        menuItemId: data.menuItemId,
        isAvailable: data.eshteIGatshem
      };
    }
  ),
  
  /**
   * Update a menu item
   * @param data Menu item data to update
   * @returns Update result
   */
  updateMenuItem: createCallableWithFallback<
    Partial<MenuItem> & { menuItemId: string },
    { success: boolean; menuItemId: string }
  >(
    'updateMenuItem',
    async (data) => {
      console.log('Using mock menu item update with data:', data);
      
      return {
        success: true,
        menuItemId: data.menuItemId
      };
    }
  ),
  
  /**
   * Delete a menu item
   * @param data Object with menuItemId to delete
   * @returns Delete result
   */
  deleteMenuItem: createCallableWithFallback<
    { menuItemId: string },
    { success: boolean; menuItemId: string }
  >(
    'deleteMenuItem',
    async (data) => {
      console.log('Using mock menu item deletion with data:', data);
      
      return {
        success: true,
        menuItemId: data.menuItemId
      };
    }
  )
};

// Firestore direct listeners (for real-time updates)
export const firestoreListeners = {
  /**
   * Subscribe to real-time order updates
   * @param orderNumber The order number to track
   * @param callback Function to call with updated order data
   * @returns Unsubscribe function
   */
  subscribeToOrder: (orderNumber: string, callback: (order: DocumentData) => void) => {
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
  
  /**
   * Subscribe to real-time menu updates for a venue
   * @param venueId The venue ID
   * @param callback Function to call with updated menu data
   * @returns Unsubscribe function
   */
  subscribeToVenueMenu: (venueId: string, callback: (items: DocumentData[]) => void) => {
    try {
      const menuItemsRef = collection(db, 'venues', venueId, 'menuItems');
      
      return onSnapshot(menuItemsRef, (snapshot: QuerySnapshot) => {
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        callback(items);
      }, (error: Error) => {
        console.error('Error listening to menu updates:', error);
        // Don't call callback on error
      });
    } catch (error: unknown) {
      console.error('Error setting up menu listener:', error);
      return () => {}; // Return empty unsubscribe function
    }
  }
};

/**
 * Subscribe to venue orders in real-time for dashboard
 * @param venueId The venue ID
 * @param callback Function to call with updated orders data
 * @returns Unsubscribe function
 */
export const subscribeToVenueOrders = (
  venueId: string, 
  callback: (orders: DocumentData[]) => void
): (() => void) => {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, where('venueId', '==', venueId));
    
    return onSnapshot(q, (snapshot: QuerySnapshot) => {
      const orders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(orders);
    }, (error: Error) => {
      console.error('Error listening to venue orders:', error);
      // Provide empty data on error
      callback([]);
    });
  } catch (error) {
    console.error('Error setting up venue orders listener:', error);
    return () => {}; // Return empty unsubscribe function
  }
};

// Helper function to simulate order updates for demo mode
export const simulateOrderUpdates = (
  orderNumber: string, 
  callback: (order: DocumentData) => void
): number => {
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
export const getMockOrderUpdate = (orderNumber: string): DocumentData => {
  // Handle undefined or null orderNumber
  if (!orderNumber || typeof orderNumber !== 'string') {
    orderNumber = `UR-${Date.now().toString().slice(-6)}`;
  }

  // Parse order time from the order number if possible
  let orderTime;
  try {
    const parts = orderNumber.split('-');
    if (parts.length > 1 && !isNaN(parseInt(parts[1]))) {
      orderTime = new Date(parseInt(parts[1]));
    } else {
      orderTime = new Date(Date.now() - 15 * 60000);
    }
  } catch (parseError) {
    console.warn('Error parsing orderNumber in getMockOrderUpdate:', parseError);
    orderTime = new Date(Date.now() - 15 * 60000);
  }

  return {
    id: `mock-${orderNumber}`,
    numriPorosise: orderNumber,
    statusi: 'E_RE', // Use Albanian status format
    shumaTotale: 1700,
    artikujt: [
      { 
        id: '1', 
        emriArtikulli: 'Aperol Spritz', 
        sasia: 2, 
        cmimiNjesi: 850, 
        cmimiTotal: 1700 
      }
    ],
    specialInstructions: '',
    emriTavolines: 'Table A15',
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
    },
    venueInfo: {
      id: 'demo-venue-001',
      name: 'Beach Bar Durrës (Demo Mode)',
      slug: 'beach-bar-durres'
    },
    tableInfo: {
      id: 'A15',
      displayName: 'Table A15'
    }
  };
};

// Test function to verify Firebase connectivity
// Initialize offline mode immediately in WebContainer
if (typeof window !== 'undefined') {
  isOfflineMode = true;
  console.log('Firebase API running in offline mode with fallbacks');
}

export const testFirebaseAPIs = async (): Promise<boolean> => {
  try {
    return await checkFirebaseConnection();
  } catch (error) {
  // Always return false in WebContainer to use offline mode
  return false;
};