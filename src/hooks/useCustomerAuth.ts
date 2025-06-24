import { useState, useEffect } from 'react';

interface CustomerUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  preferences: {
    dietary: string[];
    favoriteItems: string[];
    defaultTable: string | null;
  };
  orderHistory: any[];
  totalOrders: number;
  joinedAt: Date;
}

export const useCustomerAuth = () => {
  const [user, setUser] = useState<CustomerUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem('customer-user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('customer-user');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData: CustomerUser) => {
    setUser(userData);
    localStorage.setItem('customer-user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('customer-user');
  };

  const updateUser = (updates: Partial<CustomerUser>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('customer-user', JSON.stringify(updatedUser));
  };

  const addToFavorites = (itemId: string) => {
    if (!user) return;
    
    const favoriteItems = [...user.preferences.favoriteItems];
    if (!favoriteItems.includes(itemId)) {
      favoriteItems.push(itemId);
      updateUser({
        preferences: {
          ...user.preferences,
          favoriteItems
        }
      });
    }
  };

  const removeFromFavorites = (itemId: string) => {
    if (!user) return;
    
    const favoriteItems = user.preferences.favoriteItems.filter(id => id !== itemId);
    updateUser({
      preferences: {
        ...user.preferences,
        favoriteItems
      }
    });
  };

  const addOrderToHistory = (order: any) => {
    if (!user) return;
    
    const orderHistory = [order, ...user.orderHistory];
    updateUser({
      orderHistory,
      totalOrders: user.totalOrders + 1
    });
  };

  const isFavorite = (itemId: string) => {
    return user?.preferences.favoriteItems.includes(itemId) || false;
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    updateUser,
    addToFavorites,
    removeFromFavorites,
    addOrderToHistory,
    isFavorite
  };
};