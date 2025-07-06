import { checkFirebaseConnection } from '../lib/firebase';
import { Restaurant, MenuItem, Table, Order, OrderStatus } from '../types';
import { useState, useEffect } from 'react';
import { venueAPI, orderAPI, firestoreListeners, testFirebaseAPIs, getMockOrderUpdate } from '../services/firebase-api';
import { Restaurant, MenuItem, Table } from '../types';
import toast from 'react-hot-toast';

// Hook that wraps Firebase services with better error handling and state management
/**
 * Hook to interact with Firebase backend
 */
export const useFirebase = () => {
  // Cloud Functions wrappers
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
          totalAmount: orderData.items.reduce((sum: number, item: any) => sum + (item.quantity * item.price), 0),
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

  const getOrderByNumber = async (orderNumber: string) => {
    try {
      let result;
      try {
        // Try to use Firebase API first
        result = await orderAPI.getOrderStatus({ orderNumber });
      } catch (apiError) {
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
        result = await orderAPI.getOrderStatus({ orderNumber });
      } catch (apiError) {
        console.error('Error calling Firebase getOrderStatus function:', apiError);
        
        // Fall back to mock implementation
        console.log('Using mock order status implementation');
        
        // Create mock order data
        result = {
          success: true,
          order: {
            id: `mock-${orderNumber}`,
            orderNumber,
            status: 'preparing',
            totalAmount: 1700,
            items: [
              { menuItemId: '1', name: 'Aperol Spritz', quantity: 2, price: 850, total: 1700 }
            ],
            specialInstructions: '',
            tableName: 'Table A15',
            createdAt: new Date(Date.now() - 15 * 60000),
            timestamps: {
              created: new Date(Date.now() - 15 * 60000).toISOString(),
              accepted: new Date(Date.now() - 10 * 60000).toISOString(),
              preparing: new Date(Date.now() - 5 * 60000).toISOString()
            },
            venue: {
              id: 'demo-venue-001',
              name: 'Beach Bar Durrës',
              type: 'beach_bar'
            }
          }
        };
      }
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to get order details');
      }
      
      return result;
    } catch (error: any) {
      console.error('Error getting order:', error);
      throw new Error(error.message || 'Failed to get order details');
    }
  };

  const createMenuItem = async (menuItemData: Partial<MenuItem>) => {
    try {
      // This function is not implemented in the API service yet
      // Using a mock function for now
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Return a mock result
      return {
        success: true,
        menuItemId: `item-${Date.now()}`,
        ...menuItemData
      };
    } catch (error: any) {
      console.error('Error creating menu item:', error);
      throw new Error(error.message || 'Failed to create menu item');
    }
  };

  const updateMenuItemAvailability = async (menuItemId: string, isAvailable: boolean) => {
    try {
      // This function is not implemented in the API service yet
      // Using a mock function for now
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return a mock result
      return {
        success: true,
        menuItemId,
        isAvailable
      };
    } catch (error: any) {
      console.error('Error updating menu item availability:', error);
      throw new Error(error.message || 'Failed to update menu item availability');
    }
  };

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

  const getTableByCode = async (venueId: string, code: string): Promise<Table | null> => {
    try {
      // Reuse the getTable function as they're effectively the same in our mock implementation
      return await getTable(venueId, code);
    } catch (error) {
      console.error('Error getting table by code:', error);
      return null;
    }
  };

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

  const subscribeToOrder = (orderId: string, callback: (order: any) => void) => {
    try {
      // Try to use Firestore listener
      return firestoreListeners.subscribeToOrder(orderId, callback);
    } catch (error) {
      console.error('Error setting up order subscription:', error);
      
      // For demo purposes, set up a mock data subscription
      const interval = simulateOrderUpdates(orderId, callback);
      
      return () => clearInterval(interval);
    }
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

  // Test Firebase connectivity
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
    createTable,
    generateTableQR,
    getVenueAnalytics,
    
    // Firestore operations
    getVenueBySlug,
    getTable,
    getTableByCode,
    getVenueMenuItems, 
    subscribeToOrder, 
    testFirebaseConnection: async () => {
      const isConnected = await testFirebaseAPIs();
      if (isConnected) {
        toast.success('Firebase connection successful!');
      } else {
        toast.error('Firebase connection failed - using demo mode');
      }
      return isConnected;
    }
    isFirebaseAvailable: async () => {
      try {
        const isConnected = await testFirebaseConnection();
        return isConnected;
      } catch (error) {
import { venueAPI, orderAPI, firestoreListeners, testFirebaseAPIs, getMockOrderUpdate, simulateOrderUpdates } from '../services/firebase-api';
        return false;