import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Edit, Trash2, Eye, AlertTriangle, Check, X, Coffee, Pizza, Utensils } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Toggle } from '../ui/Toggle';
import { Modal } from '../ui/Modal';
import { MenuItemForm } from './MenuItemForm';
import { MenuItem, MenuCategory } from '../../types';
import toast from 'react-hot-toast';

// Mock data for development
const mockMenuItems: MenuItem[] = [
  {
    id: '1',
    emri: 'Aperol Spritz',
    pershkrimi: 'Classic Italian aperitif with Aperol, Prosecco and soda, garnished with fresh orange',
    cmimi: 850,
    kategoria: MenuCategory.PIJE,
    nenkategoria: 'Alcoholic',
    imazhi: 'https://images.pexels.com/photos/5947043/pexels-photo-5947043.jpeg?auto=compress&cs=tinysrgb&w=400',
    eshteIGatshem: true,
    eshteVegetarian: true,
    kohaPergatitjes: 5,
    rradhaRenditjes: 1,
    krijuarNe: new Date(),
    perditesuesNe: new Date()
  },
  {
    id: '2',
    emri: 'Pizza Margherita',
    pershkrimi: 'Classic pizza with fresh tomato sauce, buffalo mozzarella and fresh basil from our garden',
    cmimi: 1200,
    kategoria: MenuCategory.PIZZA,
    imazhi: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400',
    eshteIGatshem: true,
    eshteVegetarian: true,
    kohaPergatitjes: 15,
    rradhaRenditjes: 1,
    krijuarNe: new Date(),
    perditesuesNe: new Date()
  },
  {
    id: '3',
    emri: 'Greek Salad',
    pershkrimi: 'Traditional Greek salad with fresh tomatoes, cucumber, Kalamata olives and original feta cheese',
    cmimi: 900,
    kategoria: MenuCategory.SALLATAT,
    imazhi: 'https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=400',
    eshteIGatshem: true,
    eshteVegetarian: true,
    eshteVegan: false,
    kohaPergatitjes: 8,
    rradhaRenditjes: 1,
    krijuarNe: new Date(),
    perditesuesNe: new Date()
  },
  {
    id: '4',
    emri: 'Espresso Coffee',
    pershkrimi: 'Perfect Italian coffee, prepared from selected beans roasted in-house',
    cmimi: 200,
    kategoria: MenuCategory.PIJE,
    nenkategoria: 'Non-alcoholic',
    imazhi: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400',
    eshteIGatshem: true,
    eshteVegan: true,
    kohaPergatitjes: 3,
    rradhaRenditjes: 2,
    krijuarNe: new Date(),
    perditesuesNe: new Date()
  }
];

export interface MenuManagementProps {
  venueId?: string;
}

export const MenuManagement: React.FC<MenuManagementProps> = ({ venueId = 'demo-venue' }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);

  // Load menu items
  useEffect(() => {
    const fetchMenuItems = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call to get menu items
        // For now, we'll use mock data
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
        setMenuItems(mockMenuItems);
        setFilteredItems(mockMenuItems);
      } catch (error) {
        console.error('Error fetching menu items:', error);
        toast.error('Failed to load menu items');
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [venueId]);

  // Filter menu items when filters change
  useEffect(() => {
    let filtered = menuItems;
    
    // Search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.emri.toLowerCase().includes(term) || 
        item.pershkrimi.toLowerCase().includes(term)
      );
    }
    
    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.kategoria === categoryFilter);
    }
    
    // Availability filter
    if (availabilityFilter === 'available') {
      filtered = filtered.filter(item => item.eshteIGatshem);
    } else if (availabilityFilter === 'unavailable') {
      filtered = filtered.filter(item => !item.eshteIGatshem);
    }
    
    setFilteredItems(filtered);
  }, [menuItems, searchTerm, categoryFilter, availabilityFilter]);

  // Get unique categories from menu items
  const categories = Array.from(new Set(menuItems.map(item => item.kategoria)));

  // Handle availability toggle
  const handleAvailabilityToggle = async (item: MenuItem, newAvailability: boolean) => {
    try {
      // In a real app, this would be an API call to update item availability
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
      
      // Update local state
      setMenuItems(prev => prev.map(menuItem => 
        menuItem.id === item.id 
          ? { ...menuItem, eshteIGatshem: newAvailability } 
          : menuItem
      ));
      
      toast.success(`${item.emri} is now ${newAvailability ? 'available' : 'unavailable'}`);
    } catch (error) {
      console.error('Error updating item availability:', error);
      toast.error('Failed to update availability');
    }
  };

  // Handle add/edit form submission
  const handleSaveMenuItem = async (itemData: Partial<MenuItem>, isEdit: boolean) => {
    try {
      // In a real app, this would be an API call to create/update a menu item
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      if (isEdit && editingItem?.id) {
        // Update existing item
        const updatedItem = {
          ...editingItem,
          ...itemData,
          perditesuesNe: new Date()
        };
        
        // Update local state
        setMenuItems(prev => prev.map(item => 
          item.id === editingItem.id ? updatedItem : item
        ));
        
        toast.success(`${itemData.emri} updated successfully`);
      } else {
        // Create new item
        const newItem: MenuItem = {
          id: `temp-${Date.now()}`, // In a real app, this would come from the backend
          emri: itemData.emri || '',
          pershkrimi: itemData.pershkrimi || '',
          cmimi: itemData.cmimi || 0,
          kategoria: itemData.kategoria || '',
          nenkategoria: itemData.nenkategoria,
          imazhi: itemData.imazhi,
          eshteVegan: itemData.eshteVegan || false,
          eshteVegetarian: itemData.eshteVegetarian || false,
          eshteIGatshem: itemData.eshteIGatshem !== undefined ? itemData.eshteIGatshem : true,
          kohaPergatitjes: itemData.kohaPergatitjes || 10,
          rradhaRenditjes: itemData.rradhaRenditjes || 0,
          krijuarNe: new Date(),
          perditesuesNe: new Date()
        };
        
        // Add to local state
        setMenuItems(prev => [...prev, newItem]);
        
        toast.success(`${itemData.emri} added to menu`);
      }
      
      // Close modal
      setShowAddModal(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving menu item:', error);
      toast.error('Failed to save menu item');
    }
  };

  // Handle delete
  const handleDeleteItem = async () => {
    if (!itemToDelete?.id) return;
    
    try {
      // In a real app, this would be an API call to delete a menu item
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      
      // Remove from local state
      setMenuItems(prev => prev.filter(item => item.id !== itemToDelete.id));
      
      toast.success(`${itemToDelete.emri} removed from menu`);
      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (error) {
      console.error('Error deleting menu item:', error);
      toast.error('Failed to delete menu item');
    }
  };

  // Format price display
  const formatPrice = (price: number) => `€${(price / 100).toFixed(2)}`;

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case MenuCategory.PIJE:
        return <Coffee className="w-4 h-4 mr-1" />;
      case MenuCategory.PIZZA:
        return <Pizza className="w-4 h-4 mr-1" />;
      default:
        return <Utensils className="w-4 h-4 mr-1" />;
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading menu items...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Menu Management</h2>
          <p className="text-gray-600 text-sm">
            Manage your restaurant's menu items
          </p>
        </div>
        <Button 
          onClick={() => {
            setEditingItem(null);
            setShowAddModal(true);
          }}
          icon={<Plus className="w-4 h-4" />}
          iconPosition="left"
        >
          Add Menu Item
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {searchTerm && (
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setSearchTerm('')}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        
        <div className="w-full md:w-48">
          <Select
            options={[
              { value: 'all', label: 'All Categories' },
              ...categories.map(cat => ({ value: cat, label: cat, icon: getCategoryIcon(cat) }))
            ]}
            value={categoryFilter}
            onChange={setCategoryFilter}
            placeholder="Category"
          />
        </div>
        
        <div className="w-full md:w-48">
          <Select
            options={[
              { value: 'all', label: 'All Items' },
              { value: 'available', label: 'Available Only' },
              { value: 'unavailable', label: 'Unavailable Only' }
            ]}
            value={availabilityFilter}
            onChange={setAvailabilityFilter}
            placeholder="Availability"
          />
        </div>
      </div>

      {/* Menu Items List */}
      {filteredItems.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No menu items found
          </h3>
          <p className="text-gray-600 mb-6">
            {menuItems.length === 0
              ? "You haven't added any menu items yet."
              : "No items match your current filters."}
          </p>
          {menuItems.length === 0 ? (
            <Button 
              onClick={() => setShowAddModal(true)}
              icon={<Plus className="w-4 h-4" />}
              iconPosition="left"
            >
              Add First Item
            </Button>
          ) : (
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('all');
                setAvailabilityFilter('all');
              }}
            >
              Clear Filters
            </Button>
          )}
        </Card>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          {item.imazhi ? (
                            <img
                              className="h-10 w-10 rounded-md object-cover"
                              src={item.imazhi}
                              alt={item.emri}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-500 text-xs">No img</span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">{item.emri}</div>
                          <div className="text-xs text-gray-500 line-clamp-1">{item.pershkrimi}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="secondary" size="sm">{item.kategoria}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">{formatPrice(item.cmimi)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Toggle
                        checked={item.eshteIGatshem}
                        onChange={(isChecked) => handleAvailabilityToggle(item, isChecked)}
                        size="sm"
                        color={item.eshteIGatshem ? "green" : "red"}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingItem(item);
                            setShowAddModal(true);
                          }}
                          icon={<Edit className="w-4 h-4" />}
                          iconPosition="left"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                          onClick={() => {
                            setItemToDelete(item);
                            setShowDeleteModal(true);
                          }}
                          icon={<Trash2 className="w-4 h-4" />}
                          iconPosition="left"
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingItem(null);
        }}
        title={editingItem ? `Edit ${editingItem.emri}` : 'Add Menu Item'}
        size="lg"
      >
        <div className="p-6">
          <MenuItemForm
            existingItem={editingItem}
            onSave={handleSaveMenuItem}
            onCancel={() => {
              setShowAddModal(false);
              setEditingItem(null);
            }}
            categories={categories}
          />
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setItemToDelete(null);
        }}
        title="Confirm Deletion"
        size="sm"
      >
        <div className="p-6">
          <p className="text-gray-700 mb-6">
            Are you sure you want to delete <span className="font-semibold">{itemToDelete?.emri}</span>? 
            This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteModal(false);
                setItemToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteItem}
            >
              Delete Item
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};