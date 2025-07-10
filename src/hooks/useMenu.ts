import { useState, useEffect, useCallback } from 'react';
import { useFirebase } from './useFirebase';
import { MenuItem, Restaurant, Table } from '../types';
import toast from 'react-hot-toast';

export const useMenu = (restaurantSlug: string, tableCode: string) => {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [table, setTable] = useState<Table | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  const { getVenueBySlug, getTableByCode, getVenueMenuItems } = useFirebase();

  useEffect(() => {
    if (!restaurantSlug || !tableCode) return;

    const loadMenuData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Get venue information
        const venueData = await getVenueBySlug(restaurantSlug);
        
        if (!venueData) {
          setError('Venue not found');
          return;
        }
        
        if (!venueData.eshteAktiv) {
          setError('This venue is currently closed');
          return;
        }
        
        setRestaurant(venueData);
        
        // Get table information
        const tableData = await getTableByCode(venueData.id, tableCode);
        
        if (!tableData) {
          // For walk-in scenario, create a temporary table object
          if (tableCode === 'walk-in') {
            setTable({
              id: 'walk-in',
              kodi: 'walk-in',
              emriPerShfaqje: 'Walk-in Customer',
              pershkrimi: 'Order without table reservation - pay at counter or at table',
              eshteAktive: true,
              krijuarNe: new Date()
            });
          } else {
            setError('Table not found');
            return;
          }
        } else {
          setTable(tableData);
        }
        
        // Get menu items
        const items = await getVenueMenuItems(venueData.id);
        setMenuItems(items);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(items.map(item => item.kategoria))];
        setCategories(uniqueCategories);
        
        // Show welcome message
        const isReturning = new URLSearchParams(window.location.search).get('returning') === 'true';
        const isWalkIn = tableCode === 'walk-in';
        
        if (isReturning) {
          toast.success('Welcome back! Here\'s the full menu.', { id: 'welcome-returning' });
        } else if (isWalkIn) {
          toast.success('Welcome! You can order without a table reservation.', { id: 'welcome-walkin' });
        } else {
          toast.success(`Welcome to ${venueData.emri}!`, { id: 'welcome-venue' });
        }
      } catch (err: any) {
        console.error('Error loading menu data:', err);
        setError(err.message || 'Error loading menu');
      } finally {
        setLoading(false);
      }
    };

    loadMenuData();
  }, [restaurantSlug, tableCode, getVenueBySlug, getTableByCode, getVenueMenuItems]);

  return {
    restaurant,
    table,
    menuItems,
    categories,
    loading,
    error
  };
};

/**
 * Hook for managing menu items for a restaurant 
 */
export const useMenuManagement = (venueId: string) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getVenueMenuItems, createMenuItem, updateMenuItemAvailability } = useFirebase();
  
  // Load menu items
  const loadMenuItems = useCallback(async () => {
    try {
      setLoading(true);
      const items = await getVenueMenuItems(venueId);
      setMenuItems(items);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(items.map(item => item.kategoria))];
      setCategories(uniqueCategories);
      
      setError(null);
    } catch (err: any) {
      console.error('Error loading menu items:', err);
      setError(err.message || 'Error loading menu items');
      toast.error('Failed to load menu items');
    } finally {
      setLoading(false);
    }
  }, [venueId, getVenueMenuItems]);

  // Initial load
  useEffect(() => {
    if (venueId) {
      loadMenuItems();
    }
  }, [venueId, loadMenuItems]);
  
  // Create menu item
  const addMenuItem = async (itemData: Partial<MenuItem>) => {
    try {
      const result = await createMenuItem(itemData);
      
      // Update local state
      setMenuItems(prev => [...prev, result as MenuItem]);
      
      // Update categories if needed
      if (itemData.kategoria && !categories.includes(itemData.kategoria)) {
        setCategories(prev => [...prev, itemData.kategoria as string]);
      }
      
      toast.success(`${itemData.emri} added to menu`);
      return result;
    } catch (err: any) {
      console.error('Error creating menu item:', err);
      toast.error(err.message || 'Failed to create menu item');
      throw err;
    }
  };
  
  // Update menu item
  const updateMenuItem = async (itemId: string, itemData: Partial<MenuItem>) => {
    try {
      // In a real implementation, this would call an API function
      // For now, we'll simulate the update
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local state
      setMenuItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, ...itemData, perditesuesNe: new Date() } : item
      ));
      
      // Update categories if needed
      if (itemData.kategoria && !categories.includes(itemData.kategoria)) {
        setCategories(prev => [...prev, itemData.kategoria as string]);
      }
      
      toast.success(`${itemData.emri || 'Item'} updated successfully`);
    } catch (err: any) {
      console.error('Error updating menu item:', err);
      toast.error(err.message || 'Failed to update menu item');
      throw err;
    }
  };
  
  // Delete menu item
  const deleteMenuItem = async (itemId: string) => {
    try {
      // In a real implementation, this would call an API function
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Update local state
      setMenuItems(prev => prev.filter(item => item.id !== itemId));
      
      toast.success('Item removed from menu');
    } catch (err: any) {
      console.error('Error deleting menu item:', err);
      toast.error(err.message || 'Failed to delete menu item');
      throw err;
    }
  };
  
  // Toggle item availability
  const toggleItemAvailability = async (itemId: string, isAvailable: boolean) => {
    try {
      await updateMenuItemAvailability(itemId, isAvailable);
      
      // Update local state
      setMenuItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, eshteIGatshem: isAvailable, perditesuesNe: new Date() } : item
      ));
      
      toast.success(`Item is now ${isAvailable ? 'available' : 'unavailable'}`);
    } catch (err: any) {
      console.error('Error updating availability:', err);
      toast.error(err.message || 'Failed to update availability');
      throw err;
    }
  };

  return {
    menuItems,
    categories,
    loading,
    error,
    refresh: loadMenuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleItemAvailability
  };
};