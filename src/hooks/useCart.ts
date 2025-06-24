import { useState, useEffect, useCallback, useRef } from 'react';
import { CartItem, MenuItem } from '../types';
import toast from 'react-hot-toast';

const CART_STORAGE_KEY = 'urdhero-albania-cart';

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const toastShownRef = useRef<Set<string>>(new Set());

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          setItems(parsedCart);
        }
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      localStorage.removeItem(CART_STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save cart to localStorage whenever items change (except on initial load)
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    }
  }, [items, loading]);

  const addItem = useCallback((menuItem: MenuItem, quantity: number = 1, instruksioneSpeciale?: string) => {
    setItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(
        item => item.menuItemId === menuItem.id && item.instruksioneSpeciale === instruksioneSpeciale
      );

      let newItems;
      if (existingItemIndex >= 0) {
        // Update existing item
        newItems = [...prevItems];
        const existingItem = newItems[existingItemIndex];
        existingItem.sasia += quantity;
        existingItem.cmimiTotal = existingItem.cmimiNjesi * existingItem.sasia;
      } else {
        // Add new item
        const newItem: CartItem = {
          menuItemId: menuItem.id,
          emriArtikulli: menuItem.emri,
          sasia: quantity,
          cmimiNjesi: menuItem.cmimi,
          cmimiTotal: menuItem.cmimi * quantity,
          instruksioneSpeciale,
          menuItem
        };
        newItems = [...prevItems, newItem];
      }

      // Show success toast only once per item per session
      const toastKey = `${menuItem.id}-added`;
      if (!toastShownRef.current.has(toastKey)) {
        toastShownRef.current.add(toastKey);
        toast.success(`${menuItem.emri} u shtua në porosi!`, {
          duration: 2000,
          icon: '🛒',
          id: toastKey // Prevent duplicate toasts
        });
        
        // Clear the toast key after some time to allow new toasts for the same item
        setTimeout(() => {
          toastShownRef.current.delete(toastKey);
        }, 3000);
      }

      return newItems;
    });
  }, []);

  const removeItem = useCallback((menuItemId: string, instruksioneSpeciale?: string) => {
    setItems(prevItems => {
      const newItems = prevItems.filter(item => 
        !(item.menuItemId === menuItemId && item.instruksioneSpeciale === instruksioneSpeciale)
      );
      
      toast.success('Artikulli u hoq nga porosia', {
        duration: 1500,
        icon: '🗑️'
      });
      
      return newItems;
    });
  }, []);

  const updateQuantity = useCallback((menuItemId: string, quantity: number, instruksioneSpeciale?: string) => {
    if (quantity <= 0) {
      removeItem(menuItemId, instruksioneSpeciale);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item => {
        if (item.menuItemId === menuItemId && item.instruksioneSpeciale === instruksioneSpeciale) {
          return {
            ...item,
            sasia: quantity,
            cmimiTotal: item.cmimiNjesi * quantity
          };
        }
        return item;
      })
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
    toast.success('Porosia u pastrua', {
      duration: 1500,
      icon: '🧹'
    });
  }, []);

  const getTotalPrice = useCallback(() => {
    return items.reduce((total, item) => total + item.cmimiTotal, 0);
  }, [items]);

  const getTotalItems = useCallback(() => {
    return items.reduce((total, item) => total + item.sasia, 0);
  }, [items]);

  const getItemCount = useCallback((menuItemId: string) => {
    return items
      .filter(item => item.menuItemId === menuItemId)
      .reduce((total, item) => total + item.sasia, 0);
  }, [items]);

  return {
    items,
    loading,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
    getItemCount
  };
};