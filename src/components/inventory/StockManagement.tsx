import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Search, Filter, Plus, Minus, Edit, Eye, Trash2, ArrowDown, ArrowUp } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useInventory } from '../../hooks/useInventory';
import { InventoryCategory, InventoryUnit, MovementType } from '../../types/inventory';

export const StockManagement: React.FC = () => {
  const { items, formatCurrency, addStockMovement } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<InventoryCategory | 'all'>('all');
  const [showAddMovement, setShowAddMovement] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [movementType, setMovementType] = useState<MovementType>(MovementType.STOCK_IN);
  const [quantity, setQuantity] = useState<number>(1);
  const [reason, setReason] = useState<string>('');

  const filteredItems = items.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nameAlbanian.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleAddMovement = () => {
    if (!selectedItem || quantity <= 0 || !reason) return;

    addStockMovement({
      itemId: selectedItem.id,
      itemName: selectedItem.nameAlbanian,
      type: movementType,
      quantity,
      unit: selectedItem.unit,
      reason,
      userId: 'user_001',
      userName: 'Admin'
    });

    // Reset form
    setShowAddMovement(false);
    setQuantity(1);
    setReason('');
  };

  const getCategoryIcon = (category: InventoryCategory) => {
    const icons = {
      [InventoryCategory.VEGETABLES]: '🥬',
      [InventoryCategory.MEAT]: '🥩',
      [InventoryCategory.DAIRY]: '🧀',
      [InventoryCategory.SEAFOOD]: '🐟',
      [InventoryCategory.GRAINS]: '🌾',
      [InventoryCategory.BEVERAGES]: '🍷',
      [InventoryCategory.SPICES]: '🌿',
      [InventoryCategory.FROZEN]: '🧊',
      [InventoryCategory.CLEANING]: '🧽',
      [InventoryCategory.PACKAGING]: '📦'
    };
    return icons[category] || '📦';
  };

  const getStockStatus = (item: any) => {
    const ratio = item.currentStock / item.minimumStock;
    if (ratio <= 0.5) return { label: 'Kritik', color: 'danger' };
    if (ratio <= 1) return { label: 'I Ulët', color: 'warning' };
    if (ratio >= 2) return { label: 'I Lartë', color: 'success' };
    return { label: 'Optimal', color: 'primary' };
  };

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Kërko artikuj..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Të gjitha kategoritë</option>
            {Object.values(InventoryCategory).map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          
          <Button onClick={() => {
            setSelectedItem(null);
            setShowAddMovement(true);
          }}>
            <Plus className="w-4 h-4 mr-2" />
            Lëvizje e Re
          </Button>
        </div>
      </div>

      {/* Items Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Artikulli
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Aktual
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vlera
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statusi
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Veprime
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map((item) => {
                const stockStatus = getStockStatus(item);
                
                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-sm">{getCategoryIcon(item.category)}</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{item.nameAlbanian}</div>
                          <div className="text-xs text-gray-500">{item.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{item.category}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {item.currentStock} {item.unit}
                      </div>
                      <div className="text-xs text-gray-500">
                        Min: {item.minimumStock} • Max: {item.maximumStock}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(item.currentStock * item.costPerUnit)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatCurrency(item.costPerUnit)}/{item.unit}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge 
                        variant={stockStatus.color as any} 
                        size="sm"
                      >
                        {stockStatus.label}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedItem(item);
                            setMovementType(MovementType.STOCK_IN);
                            setShowAddMovement(true);
                          }}
                        >
                          <ArrowDown className="w-4 h-4 text-green-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedItem(item);
                            setMovementType(MovementType.STOCK_OUT);
                            setShowAddMovement(true);
                          }}
                        >
                          <ArrowUp className="w-4 h-4 text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedItem(item);
                            setMovementType(MovementType.WASTE);
                            setShowAddMovement(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Movement Modal */}
      <AnimatePresence>
        {showAddMovement && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddMovement(false)}
          >
            <motion.div
              className="bg-white rounded-xl shadow-xl max-w-md w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {movementType === MovementType.STOCK_IN ? 'Shto Stock' : 
                   movementType === MovementType.STOCK_OUT ? 'Hiq Stock' : 'Regjistro Humbje'}
                </h3>
                
                <div className="space-y-4">
                  {/* Item Selection */}
                  {!selectedItem && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Artikulli
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => {
                          const item = items.find(i => i.id === e.target.value);
                          setSelectedItem(item);
                        }}
                      >
                        <option value="">Zgjidhni një artikull</option>
                        {items.map(item => (
                          <option key={item.id} value={item.id}>
                            {item.nameAlbanian} ({item.currentStock} {item.unit})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  
                  {/* Selected Item Info */}
                  {selectedItem && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                          <span className="text-lg">{getCategoryIcon(selectedItem.category)}</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{selectedItem.nameAlbanian}</div>
                          <div className="text-sm text-gray-600">
                            Stock aktual: {selectedItem.currentStock} {selectedItem.unit}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Movement Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lloji i Lëvizjes
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        className={`p-2 rounded-lg border-2 text-center ${
                          movementType === MovementType.STOCK_IN 
                            ? 'border-green-500 bg-green-50 text-green-700' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setMovementType(MovementType.STOCK_IN)}
                      >
                        <ArrowDown className="w-5 h-5 mx-auto mb-1" />
                        <span className="text-xs">Shto</span>
                      </button>
                      <button
                        className={`p-2 rounded-lg border-2 text-center ${
                          movementType === MovementType.STOCK_OUT 
                            ? 'border-blue-500 bg-blue-50 text-blue-700' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setMovementType(MovementType.STOCK_OUT)}
                      >
                        <ArrowUp className="w-5 h-5 mx-auto mb-1" />
                        <span className="text-xs">Hiq</span>
                      </button>
                      <button
                        className={`p-2 rounded-lg border-2 text-center ${
                          movementType === MovementType.WASTE 
                            ? 'border-red-500 bg-red-50 text-red-700' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setMovementType(MovementType.WASTE)}
                      >
                        <Trash2 className="w-5 h-5 mx-auto mb-1" />
                        <span className="text-xs">Humbje</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Quantity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sasia
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={quantity}
                        onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-gray-600">
                        {selectedItem?.unit || 'unit'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Reason */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Arsyeja
                    </label>
                    <input
                      type="text"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder={
                        movementType === MovementType.STOCK_IN ? "Furnizim i rregullt" :
                        movementType === MovementType.STOCK_OUT ? "Përdorim për porosi" :
                        "Arsyeja e humbjes"
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowAddMovement(false)}
                  >
                    Anulo
                  </Button>
                  <Button
                    onClick={handleAddMovement}
                    disabled={!selectedItem || quantity <= 0 || !reason}
                  >
                    Konfirmo
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};