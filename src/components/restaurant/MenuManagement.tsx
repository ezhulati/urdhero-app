import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  AlertTriangle, 
  Check, 
  X, 
  Coffee, 
  Pizza, 
  Utensils,
  Sparkles,
  Copy,
  Download,
  Upload,
  Grid,
  List,
  SortAsc,
  SortDesc,
  Star,
  TrendingUp,
  Image,
  Wand2,
  RefreshCw,
  Settings,
  MoreHorizontal,
  DragHandleDots2
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button'; 
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Toggle } from '../ui/Toggle';
import { Modal } from '../ui/Modal';
import { Tabs, Tab } from '../ui/Tabs';
import { MenuItemForm } from './MenuItemForm';
import { MenuItemCard } from '../business/MenuItemCard';
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
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'category' | 'popularity' | 'created'>('created');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'items' | 'categories' | 'analytics' | 'templates'>('items');
  const [draggedItem, setDraggedItem] = useState<MenuItem | null>(null);

  // Filter and sort menu items when filters change
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
    
    // Sort items
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.emri.toLowerCase();
          bValue = b.emri.toLowerCase();
          break;
        case 'price':
          aValue = a.cmimi;
          bValue = b.cmimi;
          break;
        case 'category':
          aValue = a.kategoria.toLowerCase();
          bValue = b.kategoria.toLowerCase();
          break;
        case 'popularity':
          // Mock popularity based on order count (in real app, this would come from analytics)
          aValue = a.rradhaRenditjes || 0;
          bValue = b.rradhaRenditjes || 0;
          break;
        case 'created':
        default:
          aValue = a.krijuarNe;
          bValue = b.krijuarNe;
          break;
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    
    setFilteredItems(filtered);
  }, [menuItems, searchTerm, categoryFilter, availabilityFilter, sortBy, sortOrder]);

  // Handle item selection
  const handleItemSelect = (itemId: string, selected: boolean) => {
    const newSelected = new Set(selectedItems);
    if (selected) {
      newSelected.add(itemId);
    } else {
      newSelected.delete(itemId);
    }
    setSelectedItems(newSelected);
    setShowBulkActions(newSelected.size > 0);
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedItems.size === filteredItems.length) {
      setSelectedItems(new Set());
      setShowBulkActions(false);
    } else {
      setSelectedItems(new Set(filteredItems.map(item => item.id)));
      setShowBulkActions(true);
    }
  };

  // Handle bulk availability toggle
  const handleBulkAvailabilityToggle = async (available: boolean) => {
    setIsProcessing(true);
    try {
      const promises = Array.from(selectedItems).map(itemId => {
        const item = menuItems.find(i => i.id === itemId);
        return item ? toggleItemAvailability(item.id, available) : Promise.resolve();
      });
      
      await Promise.all(promises);
      
      toast.success(`${selectedItems.size} items ${available ? 'enabled' : 'disabled'}`);
      setSelectedItems(new Set());
      setShowBulkActions(false);
    } catch (error) {
      toast.error('Failed to update items');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    setIsProcessing(true);
    try {
      const promises = Array.from(selectedItems).map(itemId => deleteMenuItem(itemId));
      await Promise.all(promises);
      
      toast.success(`${selectedItems.size} items deleted`);
      setSelectedItems(new Set());
      setShowBulkActions(false);
    } catch (error) {
      toast.error('Failed to delete items');
    } finally {
      setIsProcessing(false);
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

  // AI-powered features (mock implementation)
  const handleAIDescriptionGeneration = async (itemName: string) => {
    // Simulate AI API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const descriptions = [
      `Expertly crafted ${itemName.toLowerCase()} with carefully selected ingredients, prepared fresh daily with authentic techniques that honor traditional recipes while embracing modern culinary innovation.`,
      `Our signature ${itemName.toLowerCase()} features premium ingredients sourced locally, combined with time-honored cooking methods to create an unforgettable dining experience.`,
      `Indulge in our ${itemName.toLowerCase()}, a perfect harmony of flavors that showcases the finest ingredients, prepared with passion and attention to every detail.`
    ];
    
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  };

  const handleAIPriceAnalysis = async (itemName: string, category: string) => {
    // Simulate AI price analysis
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const basePrices: Record<string, number> = {
      [MenuCategory.PIJE]: 650,
      [MenuCategory.PIZZA]: 1200,
      [MenuCategory.USHQIM]: 1500,
      [MenuCategory.EMBELSIRA]: 450
    };
    
    const basePrice = basePrices[category] || 1000;
    const variation = Math.random() * 400 - 200; // ±2€ variation
    
    return Math.round(basePrice + variation);
  };

  // Drag and drop handlers
  const handleDragStart = (item: MenuItem) => {
    setDraggedItem(item);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetCategory: string) => {
    e.preventDefault();
    if (draggedItem && draggedItem.kategoria !== targetCategory) {
      updateMenuItem(draggedItem.id, { kategoria: targetCategory });
      toast.success(`${draggedItem.emri} moved to ${targetCategory}`);
    }
    setDraggedItem(null);
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
          <h2 className="text-2xl font-bold text-gray-900">Menu Intelligence Hub</h2>
          <p className="text-gray-600 text-sm">
            AI-powered menu management for modern restaurants
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline"
            size="sm"
            onClick={() => setShowAIModal(true)}
            icon={<Wand2 className="w-4 h-4" />}
            iconPosition="left"
          >
            AI Assistant
          </Button>
          <Button 
            onClick={() => {
              setEditingItem(null);
              setShowAddModal(true);
            }}
            icon={<Plus className="w-4 h-4" />}
            iconPosition="left"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
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
              <Star className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{categories.length}</div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Tab Navigation */}
      <Tabs activeTab={activeTab} onChange={(tab) => setActiveTab(tab as any)} variant="pills">
        <Tab id="items" label="Menu Items" icon={<Utensils className="w-4 h-4" />}>
          <div className="space-y-6">
            {/* Advanced Filters and Controls */}
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
                  
                  <Select
                    options={[
                      { value: 'created', label: 'Recently Added' },
                      { value: 'name', label: 'Name' },
                      { value: 'price', label: 'Price' },
                      { value: 'category', label: 'Category' },
                      { value: 'popularity', label: 'Popularity' }
                    ]}
                    value={sortBy}
                    onChange={(value) => setSortBy(value as any)}
                    width="w-40"
                  />
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    icon={sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
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

              {/* Bulk Actions */}
              <AnimatePresence>
                {showBulkActions && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-gray-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-700">
                          {selectedItems.size} items selected
                        </span>
                        <button
                          onClick={() => {
                            setSelectedItems(new Set());
                            setShowBulkActions(false);
                          }}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          Clear selection
                        </button>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleBulkAvailabilityToggle(true)}
                          disabled={isProcessing}
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Enable All
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleBulkAvailabilityToggle(false)}
                          disabled={isProcessing}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Disable All
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={handleBulkDelete}
                          disabled={isProcessing}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>

            {/* Menu Items Display */}
            {filteredItems.length === 0 ? (
              <Card className="p-8">
                <EmptyState
                  icon={menuItems.length === 0 ? "🍽️" : "🔍"}
                  title={menuItems.length === 0 ? "Build your menu" : "No items match filters"}
                  description={
                    menuItems.length === 0 
                      ? "Create your first menu item to get started. Use our AI assistant for suggestions and optimization."
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
                    {/* Selection Checkbox */}
                    <div className="absolute top-2 left-2 z-10">
                      <input
                        type="checkbox"
                        checked={selectedItems.has(item.id)}
                        onChange={(e) => handleItemSelect(item.id, e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>

                    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                      {/* Image */}
                      <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                        {item.imazhi ? (
                          <img
                            src={item.imazhi}
                            alt={item.emri}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            draggable="false"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="text-center">
                              <Image className="w-8 h-8 text-gray-400 mx-auto mb-2" />
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
                              onClick={() => {
                                setEditingItem(item);
                                setShowAddModal(true);
                              }}
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
                              onClick={() => {
                                setEditingItem(item);
                                setShowAddModal(true);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigator.clipboard.writeText(JSON.stringify(item, null, 2))}
                            >
                              <Copy className="w-4 h-4" />
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
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedItems.size === filteredItems.length && filteredItems.length > 0}
                        onChange={handleSelectAll}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="font-medium text-gray-700">Select All</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {filteredItems.length} items
                    </div>
                  </div>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {filteredItems.map(item => (
                    <motion.div
                      key={item.id}
                      layout
                      className="p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <input
                          type="checkbox"
                          checked={selectedItems.has(item.id)}
                          onChange={(e) => handleItemSelect(item.id, e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {item.imazhi ? (
                            <img
                              src={item.imazhi}
                              alt={item.emri}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Image className="w-6 h-6 text-gray-400" />
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
                              onClick={() => {
                                setEditingItem(item);
                                setShowAddModal(true);
                              }}
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
          </div>
        </Tab>

        <Tab id="categories" label="Categories" icon={<Coffee className="w-4 h-4" />}>
          <Card className="p-6">
            <div className="text-center py-8">
              <Coffee className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Category Management</h3>
              <p className="text-gray-600 mb-6">
                Organize your menu items into categories for better customer experience
              </p>
              <Button>Manage Categories</Button>
            </div>
          </Card>
        </Tab>

        <Tab id="analytics" label="Analytics" icon={<TrendingUp className="w-4 h-4" />}>
          <Card className="p-6">
            <div className="text-center py-8">
              <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Menu Analytics</h3>
              <p className="text-gray-600 mb-6">
                Track performance, popularity, and optimization opportunities for each menu item
              </p>
              <Button>View Analytics</Button>
            </div>
          </Card>
        </Tab>

        <Tab id="templates" label="Templates" icon={<Sparkles className="w-4 h-4" />}>
          <Card className="p-6">
            <div className="text-center py-8">
              <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Templates</h3>
              <p className="text-gray-600 mb-6">
                Use AI-generated templates and suggestions to quickly build your menu
              </p>
              <Button>Browse Templates</Button>
            </div>
          </Card>
        </Tab>
      </Tabs>

      {/* Enhanced Add/Edit Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingItem(null);
        }}
        title={editingItem ? `Edit ${editingItem.emri}` : 'Add Menu Item'}
        size="xl"
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
            onAIDescriptionGenerate={handleAIDescriptionGeneration}
            onAIPriceAnalysis={handleAIPriceAnalysis}
          />
        </div>
      </Modal>

      {/* AI Assistant Modal */}
      <Modal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        title="AI Menu Assistant"
        size="lg"
      >
        <div className="p-6">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              AI-Powered Menu Optimization
            </h3>
            <p className="text-gray-600 mb-6">
              Get intelligent suggestions for descriptions, pricing, categories, and menu optimization
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <Wand2 className="w-6 h-6 text-purple-600 mb-2" />
                <h4 className="font-semibold text-gray-900 mb-1">Smart Descriptions</h4>
                <p className="text-sm text-gray-600">Generate compelling descriptions that sell</p>
              </Card>
              
              <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <TrendingUp className="w-6 h-6 text-blue-600 mb-2" />
                <h4 className="font-semibold text-gray-900 mb-1">Price Analysis</h4>
                <p className="text-sm text-gray-600">AI-powered pricing recommendations</p>
              </Card>
              
              <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <Star className="w-6 h-6 text-yellow-600 mb-2" />
                <h4 className="font-semibold text-gray-900 mb-1">Menu Optimization</h4>
                <p className="text-sm text-gray-600">Optimize layout and item placement</p>
              </Card>
              
              <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <Image className="w-6 h-6 text-green-600 mb-2" />
                <h4 className="font-semibold text-gray-900 mb-1">Image Suggestions</h4>
                <p className="text-sm text-gray-600">Find perfect images for your dishes</p>
              </Card>
            </div>
            
            <Button className="mt-6" onClick={() => setShowAIModal(false)}>
              Coming Soon
            </Button>
          </div>
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
              This action cannot be undone and will remove the item from all customer views.
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