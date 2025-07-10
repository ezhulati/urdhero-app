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
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { EmptyState } from '../ui/EmptyState';
import { useMenuManagement } from '../../hooks/useMenu';
import { MenuItem, MenuCategory } from '../../types';
import toast from 'react-hot-toast';

export interface MenuManagementProps {
  venueId?: string;
}

export const MenuManagement: React.FC<MenuManagementProps> = ({ venueId = 'demo-venue' }) => {
  const { 
    menuItems, 
    categories,
    loading, 
    refresh,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleItemAvailability
  } = useMenuManagement(venueId);
  
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

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

  // Handle availability toggle
  const handleAvailabilityToggle = async (item: MenuItem, newAvailability: boolean) => {
    try {
      await toggleItemAvailability(item.id, newAvailability);
    } catch (error) {
      console.error('Error updating item availability:', error);
      toast.error('Failed to update availability');
    }
  };

  // Handle add/edit form submission
  const handleSaveMenuItem = async (itemData: Partial<MenuItem>, isEdit: boolean) => {
    setIsProcessing(true);
    try {
      if (isEdit && editingItem?.id) {
        await updateMenuItem(editingItem.id, itemData);
      } else {
        await addMenuItem(itemData);
      }
    } catch (error) {
      console.error('Error saving menu item:', error);
      toast.error('Failed to save menu item');
    } finally {
      setIsProcessing(false);
      setShowAddModal(false);
      setEditingItem(null);
    }
  };

  // Handle delete
  const handleDeleteItem = async () => {
    if (!itemToDelete?.id) return;
    setIsProcessing(true);
    try {
      await deleteMenuItem(itemToDelete.id);
    } catch (error) {
      console.error('Error deleting menu item:', error);
      toast.error('Failed to delete menu item');
    } finally {
      setIsProcessing(false);
      setShowDeleteModal(false);
      setItemToDelete(null);
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
      <div className="p-8 text-center">
        <LoadingSpinner size="lg" text="Loading menu items..." />
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
        
        <div className="w-full md:w-48">
          <Button
            variant="outline"
            size="sm"
            onClick={refresh}
            className="w-full"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
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
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <table className="min-w-full divide-y divide-gray-200 table-fixed">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[40%]">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
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
            onSave={(data, isEdit) => handleSaveMenuItem(data, isEdit)}
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
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteItem}
              loading={isProcessing}
            >
              Delete Item
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// Lucide icons not imported above
import { RefreshCw } from 'lucide-react';