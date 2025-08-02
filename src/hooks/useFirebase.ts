import { checkFirebaseConnection } from '../firebase/utils';
import { Restaurant, MenuItem, Table, Order, OrderStatus } from '../types';
import { useState, useEffect } from 'react';
import { 
  venueAPI, 
  orderAPI, 
  firestoreListeners, 
  testFirebaseAPIs, 
  getMockOrderUpdate, 
  subscribeToVenueOrders 
} from '../services/firebase-api';
import toast from 'react-hot-toast';

/**
 * Hook to interact with Firebase backend
 * @returns Object containing Firebase service functions
 */
export const useFirebase = () => {
  // Cloud Functions wrappers
  /**
   * Create a new order
   * @param orderData Order details including items, venue, table, etc.
    // In WebContainer, always use offline mode
    setIsOnline(false);
    setIsLoading(false);
    return;

   * @returns Order creation result with tracking information
   */
  const createOrder = async (orderData: any) => {
    try {
      // Try to use Firebase API first
      let result;
      try {
        result = await orderAPI.createOrder(orderData);
      } catch (apiError) {
        console.error('Error calling Firebase createOrder function:', apiError);
        
        // Fall back to mock implementation for development/demo
        console.log('Using mock order creation implementation');
        
        // Create mock order number and simulate API response
        const orderNumber = `UR-${Date.now().toString().slice(-6)}`;
        result = {
          success: true,
          orderId: `mock-${Date.now()}`,
          orderNumber,
          totalAmount: orderData.items.reduce((sum: number, item: any) => {
            return sum + (item.quantity * (item.price || item.cmimiNjesi || 0));
          }, 0),
          estimatedPreparationTime: 20,
          trackingUrl: `/order/${orderNumber}`
        };
      }
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to create order');
      }
      return result;
    } catch (error: any) {
      console.error('Error creating order:', error);
      throw new Error(error.message || 'Failed to create order');
    }
  };

  /**
   * Update the status of an existing order
   * @param data Object containing orderId, status, and optional cancellationReason
   * @returns Status update result
   */
  const updateOrderStatus = async (data: { orderId: string; status: string; cancellationReason?: string }) => {
    try {
      let result;
      try {
        // Try to use Firebase API first
        result = await orderAPI.updateOrderStatus({ 
          orderNumber: data.orderId,
          status: data.status,
          cancellationReason: data.cancellationReason
        });
      } catch (apiError) {
        console.error('Error calling Firebase updateOrderStatus function:', apiError);
        
        // Fall back to mock implementation
        console.log('Using mock order status update implementation');
        
        // Simulate API response
        result = {
          success: true,
          newStatus: data.status
        };
      }
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to update order status');
      }
      
      return result;
    } catch (error: any) {
      console.error('Error updating order status:', error);
      throw new Error(error.message || 'Failed to update order status');
    }
  };

  /**
   * Get order details by order number
   * @param orderNumber The unique order number
   * @returns Order details with status and tracking information
   */
  const getOrderByNumber = async (orderNumber: string) => {
    try {
      // Validate input
      if (!orderNumber || typeof orderNumber !== 'string') {
        throw new Error('Order number is required');
      }
      
      let result;
      try {
        // Try to use Firebase API first
        result = await orderAPI.getOrderStatus({ orderNumber });
      } catch (apiError: any) {
        console.error('Error calling Firebase getOrderStatus function:', apiError);
        
        // Fall back to mock implementation
        console.log('Using mock order status implementation');
        
        // Create mock order data
        const mockOrder = getMockOrderUpdate(orderNumber);
        result = {
          success: true,
          order: mockOrder
        };
      }
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to get order details');
      }
      
      return result.order;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get order details';
      console.error('Error getting order:', errorMessage);
      throw new Error(errorMessage);
    }
  };

  /**
   * Create a new menu item for a venue
   * @param menuItemData Menu item data to create
   * @returns Created menu item with ID
   */
  const createMenuItem = async (menuItemData: Partial<MenuItem>) => {
    try {
      // Try to use the Firebase Cloud Function
      try {
        // Set default values if not provided
        const finalItemData = {
          eshteIGatshem: true,
          eshteVegan: false,
          eshteVegetarian: false,
          rradhaRenditjes: 0,
          ...menuItemData
        };
        
        const result = await orderAPI.createMenuItem(finalItemData);
        return result;
      } catch (apiError) {
        console.error('Error using Firebase createMenuItem function:', apiError);
        
        // Fall back to mock implementation
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Create a temporary ID
        const tempId = `item-${Date.now()}`;
        
        // Return a mock result
        const createdItem: MenuItem = {
          id: tempId,
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
        return createdItem;
      }
    } catch (error: any) {
      console.error('Error creating menu item:', error);
      throw new Error(error.message || 'Failed to create menu item');
    }
  };

  /**
   * Update menu item availability
   * @param menuItemId Item ID to update
   * @param isAvailable New availability status
   * @returns Update result
   */
  const updateMenuItemAvailability = async (menuItemId: string, isAvailable: boolean) => {
    try {
      // Try to use the Firebase Cloud Function
      try {
        const result = await orderAPI.updateMenuItemAvailability({
          menuItemId,
          eshteIGatshem: isAvailable
        });
        return result;
      } catch (apiError) {
        console.error('Error using Firebase updateMenuItemAvailability function:', apiError);
        
        // Fall back to mock implementation
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Return a mock result
        return {
          success: true,
          menuItemId,
          isAvailable
        };
      }
    } catch (error: any) {
      console.error('Error updating menu item availability:', error);
      throw new Error(error.message || 'Failed to update menu item availability');
    }
  };
  /**
   * Update a menu item
   * @param menuItemId Item ID to update
   * @param menuItemData Updated menu item data
   * @returns Updated menu item
   */
  const updateMenuItem = async (menuItemId: string, menuItemData: Partial<MenuItem>) => {
    try {
      // Try to use the Firebase Cloud Function
      try {
        // Implementation would call a Cloud Function
        const result = await orderAPI.updateMenuItem({
          menuItemId,
          ...menuItemData
        });
        return result;
      } catch (apiError) {
        console.error('Error using Firebase updateMenuItem function:', apiError);
        
        // Fall back to mock implementation
        await new Promise(resolve => setTimeout(resolve, 700));
        
        // Return a mock result
        return {
          success: true,
          menuItemId,
          ...menuItemData
        };
      }
    } catch (error: any) {
      console.error('Error updating menu item:', error);
      throw new Error(error.message || 'Failed to update menu item');
    }
  };

  /**
   * Delete a menu item
   * @param menuItemId Item ID to delete
   * @returns Success result
   */
  const deleteMenuItem = async (menuItemId: string) => {
    try {
      // Try to use the Firebase Cloud Function
      try {
        // Implementation would call a Cloud Function
        const result = await orderAPI.deleteMenuItem({
          menuItemId
        });
        return result;
      } catch (apiError) {
        console.error('Error using Firebase deleteMenuItem function:', apiError);
        
        // Fall back to mock implementation
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Return a mock result
        return {
          success: true,
          menuItemId
        };
      }
    } catch (error: any) {
      console.error('Error deleting menu item:', error);
      throw new Error(error.message || 'Failed to delete menu item');
    }
  };

  /**
   * Create a new table for a venue
   * @param tableData Table details
   * @returns Created table with ID
   */
  const createTable = async (tableData: any) => {
    try {
      // This function is not implemented in the API service yet
      // Using a mock function for now
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Return a mock result
      return {
        success: true,
        tableId: `table-${Date.now()}`,
        ...tableData
      };
    } catch (error: any) {
      console.error('Error creating table:', error);
      throw new Error(error.message || 'Failed to create table');
    }
  };

  /**
   * Generate a QR code for a table
   * @param tableId Table ID
   * @param size Optional size in pixels
   * @returns QR code URLs and table information
   */
  const generateTableQR = async (tableId: string, size?: number) => {
    try {
      // This function is not implemented in the API service yet
      // Using a mock function for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return a mock result
      return {
        success: true,
        qrCodeUrl: `https://example.com/qr-code/${tableId}.png`,
        downloadUrl: `https://example.com/qr-code/${tableId}.png`,
        tableCode: 'A15',
        tableName: 'Table A15'
      };
    } catch (error: any) {
      console.error('Error generating QR code:', error);
      throw new Error(error.message || 'Failed to generate QR code');
    }
  };

  /**
   * Get analytics data for a venue
   * @param timeRange Time period for the analytics
   * @returns Analytics data including revenue, orders, and customers
   */
  const getVenueAnalytics = async (timeRange: 'today' | 'week' | 'month' | 'year' = 'month') => {
    try {
      // This function is not implemented in the API service yet
      // Using a mock function for now
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Return mock analytics data
      return {
        success: true,
        analytics: {
          // Mock analytics data would go here
          revenue: {
            total: 32500,
            growth: 8.7
          },
          orders: {
            total: 1642,
            average: 54.7
          },
          customers: {
            total: 2847,
            new: 186
          }
        }
      };
    } catch (error: any) {
      console.error('Error getting analytics:', error);
      throw new Error(error.message || 'Failed to get venue analytics');
    }
  };

  /**
   * Get venue information by slug
   * @param slug The venue's URL slug
   * @returns Venue information or null if not found
   */
  // Mock data function for development
  const getVenueBySlug = async (slug: string): Promise<Restaurant | null> => {
    try {
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Return mock data for Beach Bar Durrës
      if (slug === 'beach-bar-durres') {
        return {
          id: '1',
          emri: 'Beach Bar Durrës',
          slug: 'beach-bar-durres',
          email: 'info@beachbar.al',
          telefoni: '+355 69 123 4567',
          adresa: 'Rruga Taulantia, Durrës 2001',
          pershkrimi: 'The best beachside venue with amazing views and fresh food',
          eshteAktiv: true,
          krijuarNe: new Date(),
          perditesuesNe: new Date()
        };
      }

      return null; // Venue not found
    } catch (error) {
      console.error('Error getting venue:', error);
      return null;
    }
  };

  /**
   * Get table information by ID and venue
   * @param venueId The venue ID
   * @param tableCode The table code
   * @returns Table information or null if not found
   */
  const getTable = async (venueId: string, tableCode: string): Promise<Table | null> => {
    try {
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Return mock table data
      if (tableCode === 'A15') {
        return {
          id: '1',
          kodi: 'A15',
          emriPerShfaqje: 'Table A15',
          pershkrimi: 'Premium table with sea view and relaxing atmosphere',
          pozicioni: { x: 10, y: 20, zona: 'VIP Terrace' },
          eshteAktive: true,
          krijuarNe: new Date()
        };
      }

      if (tableCode === 'walk-in') {
        return {
          id: 'walk-in',
          kodi: 'walk-in',
          emriPerShfaqje: 'Walk-in Customer',
          pershkrimi: 'Order without table reservation',
          eshteAktive: true,
          krijuarNe: new Date()
        };
      }

      if (!tableCode) {
        return null;
      }

      return null; // Table not found
    } catch (error) {
      console.error('Error getting table:', error);
      return null;
    }
  };

  /**
   * Get table by code
   * @param venueId The venue ID
   * @param code The table code
   * @returns Table information or null if not found
   */
  const getTableByCode = async (venueId: string, code: string): Promise<Table | null> => {
    try {
      // Reuse the getTable function as they're effectively the same in our mock implementation
      return await getTable(venueId, code);
    } catch (error) {
      console.error('Error getting table by code:', error);
      return null;
    }
  };

  /**
   * Get menu items for a venue
   * @param venueId The venue ID
   * @returns Array of menu items
   */
  const getVenueMenuItems = async (venueId: string): Promise<MenuItem[]> => {
    try {
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Return mock menu items
      if (venueId === '1' || venueId === 'demo-venue-001') {
        return [
          {
            id: '1',
            emri: 'Aperol Spritz',
            pershkrimi: 'Classic Italian aperitif with Aperol, Prosecco and soda',
            cmimi: 850,
            kategoria: 'Pije',
            imazhi: 'https://images.pexels.com/photos/5947043/pexels-photo-5947043.jpeg?auto=compress&cs=tinysrgb&w=400',
            eshteIGatshem: true,
            eshteVegetarian: true,
            rradhaRenditjes: 1,
            krijuarNe: new Date(),
            perditesuesNe: new Date()
          },
          {
            id: '2',
            emri: 'Pizza Margherita',
            pershkrimi: 'Classic pizza with fresh tomato sauce and mozzarella',
            cmimi: 1200,
            kategoria: 'Pizza',
            imazhi: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400',
            eshteIGatshem: true,
            eshteVegetarian: true,
            rradhaRenditjes: 1,
            krijuarNe: new Date(),
            perditesuesNe: new Date()
          }
        ];
      }

      return []; // No menu items for other venues
    } catch (error) {
      console.error('Error getting menu items:', error);
      return [];
    }
  };

  /**
   * Subscribe to real-time order updates
   * @param orderId Order ID to track
   * @param callback Function called with updated order data
   * @returns Unsubscribe function
   */
  const subscribeToOrder = (orderId: string, callback: (order: any) => void) => {
    try {
      // Try to use Firestore listener
      return firestoreListeners.subscribeToOrder(orderId, callback);
    } catch (error) {
      console.error('Error setting up order subscription:', error);
      
      // For demo purposes, set up a mock data subscription
      const interval = setInterval(() => {
        // Mock a single order that updates every 5 seconds
        const mockOrder = {
            id: '1',
            numriPorosise: orderId,
            restorantiId: 'venueId',
            statusi: ['e_re', 'pranuar', 'duke_u_pergatitur', 'gati', 'sherbyer'][Math.floor(Math.random() * 3)],
            krijuarNe: new Date(Date.now() - 5 * 60 * 1000),
            artikujt: [{ menuItemId: '1', emriArtikulli: 'Aperol Spritz', sasia: 2, cmimiNjesi: 850, cmimiTotal: 1700 }],
            shumaTotale: 1700,
            emriTavolines: 'Table A15',
            metodaPageses: 'kesh',
            eshtePagetuar: false,
            burimiPorosise: 'qr',
            versioni: 1
        };
        
        callback(mockOrder);
      }, 5000); // Update every 5 seconds for demo purposes
      
      return () => clearInterval(interval);
    }
  };

  /**
   * Subscribe to venue orders
   * @param venueId Venue ID
   * @param callback Function called with updated orders
   * @returns Unsubscribe function
   */
  const subscribeToVenueOrders = (venueId: string, callback: (orders: any[]) => void) => {
    return subscribeToVenueOrders(venueId, callback);
  };

  // Test Firebase connectivity
  /**
   * Test Firebase connectivity
   * @returns True if connection is successful
   */
  const testFirebaseConnection = async () => {
    const isConnected = await testFirebaseAPIs();
    if (isConnected) {
      toast.success('Firebase connection successful');
    } else {
      toast.error('Firebase connection failed. Using demo mode.');
    }
    return isConnected;
  };

  return {
    // Cloud Functions
    createOrder,
    updateOrderStatus,
    getOrderByNumber,
    createMenuItem,
    updateMenuItemAvailability,
    updateMenuItem,
    deleteMenuItem,
    createTable,
    generateTableQR,
    getVenueAnalytics,
    
    // Firestore operations
    getVenueBySlug,
    getTable,
    getTableByCode,
    getVenueMenuItems, 
    subscribeToOrder, 
    subscribeToVenueOrders,
    testFirebaseConnection,
    isFirebaseAvailable: async () => {
      try {
        const isConnected = await testFirebaseConnection();
        return isConnected;
      } catch (error) {
        return false;
      }
    }
  };
};