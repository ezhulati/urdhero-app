import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Eye, AlertTriangle, Check, X, Coffee, Pizza, Utensils, Grid, List, RefreshCw, Settings } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button'; 
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Toggle } from '../ui/Toggle';
import { Modal } from '../ui/Modal';
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Simple form state for adding/editing items
  const [formData, setFormData] = useState({
    emri: '',
    pershkrimi: '',
    cmimi: '',
    kategoria: '',
    eshteVegan: false,
    eshteVegetarian: false,
    eshteIGatshem: true,
    kohaPergatitjes: '10'
  });

  // Filter menu items when filters change
  useEffect(() => {
    let filtered = [...menuItems];
    
    // Search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.emri.toLowerCase().includes(term) || 
        item.pershkrimi.toLowerCase().includes(term) ||
        item.kategoria.toLowerCase().includes(term)
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

  // Reset form
  const resetForm = () => {
    setFormData({
      emri: '',
      pershkrimi: '',
      cmimi: '',
      kategoria: '',
      eshteVegan: false,
      eshteVegetarian: false,
      eshteIGatshem: true,
      kohaPergatitjes: '10'
    });
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle toggle changes
  const handleToggleChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  // Handle add/edit form submission
  const handleSaveMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.emri || !formData.kategoria || !formData.cmimi) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsProcessing(true);
    try {
      const itemData = {
        ...formData,
        cmimi: Math.round(parseFloat(formData.cmimi) * 100), // Convert to cents
        kohaPergatitjes: parseInt(formData.kohaPergatitjes) || 10,
        rradhaRenditjes: 0
      };

      if (editingItem?.id) {
        await updateMenuItem(editingItem.id, itemData);
        toast.success('Menu item updated successfully!');
      } else {
        await addMenuItem(itemData);
        toast.success('Menu item added successfully!');
      }
      
      setShowAddModal(false);
      setEditingItem(null);
      resetForm();
    } catch (error) {
      console.error('Error saving menu item:', error);
      toast.error('Failed to save menu item');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle edit
  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      emri: item.emri,
      pershkrimi: item.pershkrimi,
      cmimi: (item.cmimi / 100).toFixed(2),
      kategoria: item.kategoria,
      eshteVegan: item.eshteVegan || false,
      eshteVegetarian: item.eshteVegetarian || false,
      eshteIGatshem: item.eshteIGatshem,
      kohaPergatitjes: (item.kohaPergatitjes || 10).toString()
    });
    setShowAddModal(true);
  };

  // Handle delete
  const handleDeleteItem = async () => {
    if (!itemToDelete?.id) return;
    setIsProcessing(true);
    try {
      await deleteMenuItem(itemToDelete.id);
      toast.success('Menu item deleted successfully!');
    } catch (error) {
      console.error('Error deleting menu item:', error);
      toast.error('Failed to delete menu item');
    } finally {
      setIsProcessing(false);
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  // Handle availability toggle
  const handleAvailabilityToggle = async (item: MenuItem, newAvailability: boolean) => {
    try {
      await toggleItemAvailability(item.id, newAvailability);
    } catch (error) {
      console.error('Error updating item availability:', error);
      toast.error('Failed to update availability');
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
        <LoadingSpinner size="lg" text="Loading menu management..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Menu Management</h2>
          <p className="text-gray-600 text-sm">
            Manage your restaurant menu items
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline"
            size="sm"
            onClick={refresh}
            icon={<RefreshCw className="w-4 h-4" />}
            iconPosition="left"
          >
            Refresh
          </Button>
          <Button 
            onClick={() => {
              setEditingItem(null);
              resetForm();
              setShowAddModal(true);
            }}
            icon={<Plus className="w-4 h-4" />}
            iconPosition="left"
          >
            Add Menu Item
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Utensils className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{menuItems.length}</div>
              <div className="text-sm text-gray-600">Total Items</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {menuItems.filter(item => item.eshteIGatshem).length}
              </div>
              <div className="text-sm text-gray-600">Available</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {menuItems.filter(item => !item.eshteIGatshem).length}
              </div>
              <div className="text-sm text-gray-600">Unavailable</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Coffee className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{categories.length}</div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Controls */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search items, descriptions, categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
              {searchTerm && (
                <button
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setSearchTerm('')}
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
          
          {/* Filters */}
          <div className="flex items-center space-x-3">
            <Select
              options={[
                { value: 'all', label: 'All Categories' },
                ...categories.map(cat => ({ 
                  value: cat, 
                  label: cat, 
                  icon: getCategoryIcon(cat) 
                }))
              ]}
              value={categoryFilter}
              onChange={setCategoryFilter}
              width="w-48"
            />
            
            <Select
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'available', label: 'Available' },
                { value: 'unavailable', label: 'Unavailable' }
              ]}
              value={availabilityFilter}
              onChange={setAvailabilityFilter}
              width="w-40"
            />
            
            <div className="border-l border-gray-300 pl-3 flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                icon={<Grid className="w-4 h-4" />}
              />
              <Button
                variant={viewMode === 'list' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                icon={<List className="w-4 h-4" />}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Menu Items Display */}
      {filteredItems.length === 0 ? (
        <Card className="p-8">
          <EmptyState
            icon={menuItems.length === 0 ? "🍽️" : "🔍"}
            title={menuItems.length === 0 ? "Build your menu" : "No items match filters"}
            description={
              menuItems.length === 0 
                ? "Create your first menu item to get started."
                : "Try adjusting your search terms or filters to find items."
            }
            actionLabel={
              menuItems.length === 0 
                ? "Create First Item" 
                : "Clear Filters"
            }
            onAction={() => {
              if (menuItems.length === 0) {
                setShowAddModal(true);
              } else {
                setSearchTerm('');
                setCategoryFilter('all');
                setAvailabilityFilter('all');
              }
            }}
          />
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative group"
            >
              <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                {/* Image */}
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                  {item.imazhi ? (
                    <img
                      src={item.imazhi}
                      alt={item.emri}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <Utensils className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <span className="text-sm text-gray-500">No image</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Quick Actions Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(item)}
                        className="bg-white bg-opacity-20 text-white hover:bg-opacity-30"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setItemToDelete(item);
                          setShowDeleteModal(true);
                        }}
                        className="bg-white bg-opacity-20 text-white hover:bg-opacity-30"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Availability Toggle */}
                  <div className="absolute top-2 right-2">
                    <Toggle
                      checked={item.eshteIGatshem}
                      onChange={(checked) => handleAvailabilityToggle(item, checked)}
                      size="sm"
                      color={item.eshteIGatshem ? "green" : "red"}
                    />
                  </div>

                  {/* Category Badge */}
                  <div className="absolute bottom-2 left-2">
                    <Badge variant="secondary" size="sm">
                      {item.kategoria}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 line-clamp-1">{item.emri}</h3>
                    <span className="text-lg font-bold text-gray-900 ml-2">
                      {formatPrice(item.cmimi)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {item.pershkrimi || 'No description'}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.eshteVegan && (
                      <Badge variant="success" size="sm">Vegan</Badge>
                    )}
                    {item.eshteVegetarian && !item.eshteVegan && (
                      <Badge variant="secondary" size="sm">Vegetarian</Badge>
                    )}
                    {item.kohaPergatitjes && (
                      <Badge variant="neutral" size="sm">{item.kohaPergatitjes}min</Badge>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <Badge 
                      variant={item.eshteIGatshem ? 'success' : 'neutral'} 
                      size="sm"
                    >
                      {item.eshteIGatshem ? 'Available' : 'Unavailable'}
                    </Badge>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        /* List View */
        <Card className="overflow-hidden">
          <div className="divide-y divide-gray-200">
            {filteredItems.map(item => (
              <motion.div
                key={item.id}
                layout
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {item.imazhi ? (
                      <img
                        src={item.imazhi}
                        alt={item.emri}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Utensils className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">{item.emri}</h3>
                      <Badge variant="secondary" size="sm">{item.kategoria}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-1 mb-2">
                      {item.pershkrimi || 'No description'}
                    </p>
                    <div className="flex items-center space-x-2">
                      {item.eshteVegan && <Badge variant="success" size="sm">Vegan</Badge>}
                      {item.eshteVegetarian && !item.eshteVegan && <Badge variant="secondary" size="sm">Vegetarian</Badge>}
                      {item.kohaPergatitjes && <Badge variant="neutral" size="sm">{item.kohaPergatitjes}min</Badge>}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="font-bold text-lg text-gray-900">{formatPrice(item.cmimi)}</div>
                      <div className="text-sm text-gray-600">Price</div>
                    </div>
                    
                    <Toggle
                      checked={item.eshteIGatshem}
                      onChange={(checked) => handleAvailabilityToggle(item, checked)}
                      size="sm"
                      color={item.eshteIGatshem ? "green" : "red"}
                    />
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        onClick={() => {
                          setItemToDelete(item);
                          setShowDeleteModal(true);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingItem(null);
          resetForm();
        }}
        title={editingItem ? `Edit ${editingItem.emri}` : 'Add Menu Item'}
        size="lg"
      >
        <div className="p-6">
          <form onSubmit={handleSaveMenuItem} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Input
                  label="Item Name *"
                  name="emri"
                  value={formData.emri}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Margherita Pizza"
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Category *"
                    options={[
                      { value: '', label: 'Select Category' },
                      ...categories.map(cat => ({ value: cat, label: cat }))
                    ]}
                    value={formData.kategoria}
                    onChange={(value) => setFormData(prev => ({ ...prev, kategoria: value }))}
                    required
                  />
                  
                  <Input
                    label="Price (€) *"
                    name="cmimi"
                    type="number"
                    value={formData.cmimi}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="12.50"
                  />
                </div>

                <Input
                  label="Prep Time (minutes)"
                  name="kohaPergatitjes"
                  type="number"
                  value={formData.kohaPergatitjes}
                  onChange={handleInputChange}
                  min="1"
                  step="1"
                  placeholder="15"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="pershkrimi"
                    value={formData.pershkrimi}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe your dish in a way that makes customers want to order it..."
                  />
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Options</h4>
                  <div className="space-y-3">
                    <Toggle
                      label="Vegetarian"
                      checked={formData.eshteVegetarian}
                      onChange={(checked) => handleToggleChange('eshteVegetarian', checked)}
                      color="green"
                    />
                    
                    <Toggle
                      label="Vegan"
                      checked={formData.eshteVegan}
                      onChange={(checked) => handleToggleChange('eshteVegan', checked)}
                      color="green"
                    />
                    
                    <Toggle
                      label="Available for Ordering"
                      checked={formData.eshteIGatshem}
                      onChange={(checked) => handleToggleChange('eshteIGatshem', checked)}
                      color="blue"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddModal(false);
                  setEditingItem(null);
                  resetForm();
                }}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={isProcessing}
                icon={<Check className="w-4 h-4" />}
                iconPosition="left"
              >
                {editingItem ? 'Update Item' : 'Add Item'}
              </Button>
            </div>
          </form>
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
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Menu Item</h3>
            <p className="text-gray-600">
              Are you sure you want to delete <span className="font-semibold">{itemToDelete?.emri}</span>? 
              This action cannot be undone.
            </p>
          </div>
          
          <div className="flex justify-center space-x-3">
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