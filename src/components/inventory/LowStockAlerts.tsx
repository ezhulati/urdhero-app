import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Clock, Package, ShoppingCart, RefreshCw, Filter } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { EmptyState } from '../ui/EmptyState';
import { useInventory } from '../../hooks/useInventory';
import { AlertUrgency, InventoryCategory } from '../../types/inventory';

export const LowStockAlerts: React.FC = () => {
  const { alerts, items, suppliers, formatCurrency } = useInventory();
  const [filter, setFilter] = useState<AlertUrgency | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<InventoryCategory | 'all'>('all');

  const filteredAlerts = alerts.filter(alert => {
    const urgencyMatch = filter === 'all' || alert.urgency === filter;
    const categoryMatch = categoryFilter === 'all' || alert.category === categoryFilter;
    return urgencyMatch && categoryMatch;
  });

  const getUrgencyColor = (urgency: AlertUrgency) => {
    switch (urgency) {
      case AlertUrgency.CRITICAL: return 'danger';
      case AlertUrgency.HIGH: return 'warning';
      case AlertUrgency.MEDIUM: return 'secondary';
      default: return 'neutral';
    }
  };

  const getUrgencyIcon = (urgency: AlertUrgency) => {
    switch (urgency) {
      case AlertUrgency.CRITICAL: return '🚨';
      case AlertUrgency.HIGH: return '⚠️';
      case AlertUrgency.MEDIUM: return '⚡';
      default: return '📋';
    }
  };

  const getDaysUntilStockout = (alert: any) => {
    const days = Math.ceil((alert.estimatedStockoutDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return Math.max(0, days);
  };

  const getItemDetails = (itemId: string) => {
    return items.find(item => item.id === itemId);
  };

  const getSupplierInfo = (supplierId?: string) => {
    return suppliers.find(supplier => supplier.id === supplierId);
  };

  const handleCreatePurchaseOrder = (alert: any) => {
    const item = getItemDetails(alert.itemId);
    const supplier = getSupplierInfo(item?.supplierId);
    
    // In a real app, this would open a modal to create a purchase order
    alert(`Creating purchase order for ${alert.itemName} from ${supplier?.name || 'Unknown Supplier'}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Paralajmërime Stock i Ulët</h2>
            <p className="text-sm text-gray-600">
              {alerts.length} artikuj kanë nevojë për vëmendje
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Të gjitha</option>
            <option value={AlertUrgency.CRITICAL}>Kritike</option>
            <option value={AlertUrgency.HIGH}>Të larta</option>
            <option value={AlertUrgency.MEDIUM}>Mesatare</option>
            <option value={AlertUrgency.LOW}>Të ulëta</option>
          </select>
          
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Të gjitha kategoritë</option>
            {Object.values(InventoryCategory).map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Alerts List */}
      {filteredAlerts.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="Asnjë paralajmërim nuk përputhet me filtrat"
          description="Provoni të ndryshoni filtrat ose të kontrolloni më vonë"
          actionLabel="Pastro filtrat"
          onAction={() => {
            setFilter('all');
            setCategoryFilter('all');
          }}
        />
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filteredAlerts.map((alert) => {
              const item = getItemDetails(alert.itemId);
              const supplier = getSupplierInfo(item?.supplierId);
              const daysUntilStockout = getDaysUntilStockout(alert);
              
              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -300 }}
                  layout
                >
                  <Card className={`p-4 border-2 ${
                    alert.urgency === AlertUrgency.CRITICAL ? 'border-red-200 bg-red-50' :
                    alert.urgency === AlertUrgency.HIGH ? 'border-orange-200 bg-orange-50' :
                    alert.urgency === AlertUrgency.MEDIUM ? 'border-yellow-200 bg-yellow-50' :
                    'border-blue-200 bg-blue-50'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          alert.urgency === AlertUrgency.CRITICAL ? 'bg-red-600' :
                          alert.urgency === AlertUrgency.HIGH ? 'bg-orange-600' :
                          alert.urgency === AlertUrgency.MEDIUM ? 'bg-yellow-600' :
                          'bg-blue-600'
                        }`}>
                          <span className="text-white text-lg">{getUrgencyIcon(alert.urgency)}</span>
                        </div>
                        
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{alert.itemName}</h3>
                            <Badge variant={getUrgencyColor(alert.urgency) as any} size="sm">
                              {alert.urgency}
                            </Badge>
                          </div>
                          
                          <div className="text-sm text-gray-600 mb-2">
                            Stock aktual: <span className="font-medium">{alert.currentStock}</span> • 
                            Minimum: <span className="font-medium">{alert.minimumStock}</span>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1 text-gray-500" />
                              <span className={`${
                                daysUntilStockout <= 1 ? 'text-red-600 font-medium' : 
                                daysUntilStockout <= 3 ? 'text-orange-600' : 'text-gray-600'
                              }`}>
                                {daysUntilStockout} ditë deri në mbarim
                              </span>
                            </div>
                            
                            {supplier && (
                              <div className="flex items-center">
                                <Package className="w-4 h-4 mr-1 text-gray-500" />
                                <span className="text-gray-600">{supplier.name}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-300"
                        >
                          <RefreshCw className="w-4 h-4 mr-1" />
                          Rifresko
                        </Button>
                        
                        <Button
                          size="sm"
                          onClick={() => handleCreatePurchaseOrder(alert)}
                        >
                          <ShoppingCart className="w-4 h-4 mr-1" />
                          Porosit
                        </Button>
                      </div>
                    </div>
                    
                    {/* Suggested Order */}
                    <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between text-sm">
                        <div className="font-medium text-gray-900">
                          Sasia e sugjeruar për porosi:
                        </div>
                        <div className="font-bold text-blue-600">
                          {alert.suggestedOrderQuantity} {item?.unit}
                        </div>
                      </div>
                      {item?.costPerUnit && (
                        <div className="text-xs text-gray-600 mt-1">
                          Kosto e vlerësuar: {formatCurrency(alert.suggestedOrderQuantity * item.costPerUnit)}
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};