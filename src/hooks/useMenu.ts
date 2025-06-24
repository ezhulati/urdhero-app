import { useState, useEffect } from 'react';
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