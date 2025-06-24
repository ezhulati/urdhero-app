import React from 'react';
import { motion } from 'framer-motion';
import { Package, TrendingUp, AlertTriangle, Calendar, Target, Clock } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { useInventory } from '../../hooks/useInventory';
import { InventoryCategory, AlertUrgency } from '../../types/inventory';

export const InventoryOverview: React.FC = () => {
  const { 
    items, 
    alerts, 
    analytics, 
    movements,
    formatCurrency,
    getExpiringItems 
  } = useInventory();

  const expiringItems = getExpiringItems(7); // Next 7 days
  const recentMovements = movements.slice(0, 5);

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

  const getCategoryName = (category: InventoryCategory) => {
    const names = {
      [InventoryCategory.VEGETABLES]: 'Perime',
      [InventoryCategory.MEAT]: 'Mish',
      [InventoryCategory.DAIRY]: 'Bulmet',
      [InventoryCategory.SEAFOOD]: 'Fruta Deti',
      [InventoryCategory.GRAINS]: 'Drithëra',
      [InventoryCategory.BEVERAGES]: 'Pije',
      [InventoryCategory.SPICES]: 'Erëza',
      [InventoryCategory.FROZEN]: 'Ngrira',
      [InventoryCategory.CLEANING]: 'Pastrimi',
      [InventoryCategory.PACKAGING]: 'Paketimi'
    };
    return names[category] || category;
  };

  const getUrgencyColor = (urgency: AlertUrgency) => {
    switch (urgency) {
      case AlertUrgency.CRITICAL: return 'text-red-600';
      case AlertUrgency.HIGH: return 'text-orange-600';
      case AlertUrgency.MEDIUM: return 'text-yellow-600';
      default: return 'text-blue-600';
    }
  };

  const getMovementIcon = (type: string) => {
    switch (type) {
      case 'stock_in': return '📥';
      case 'stock_out': return '📤';
      case 'waste': return '🗑️';
      case 'adjustment': return '⚖️';
      default: return '📦';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Category Breakdown */}
      <Card className="lg:col-span-2 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Inventari sipas Kategorive</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {analytics?.categoryBreakdown.map((category) => {
            const stockPercentage = category.itemCount > 0 
              ? ((category.itemCount - category.lowStockCount) / category.itemCount) * 100 
              : 100;
            
            return (
              <motion.div
                key={category.category}
                className="p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">{getCategoryIcon(category.category)}</span>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">
                      {getCategoryName(category.category)}
                    </h4>
                    <div className="text-xs text-gray-600">
                      {category.itemCount} artikuj
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Vlera:</span>
                    <span className="font-medium">{formatCurrency(category.totalValue)}</span>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Stock Status</span>
                      <span>{stockPercentage.toFixed(0)}%</span>
                    </div>
                    <ProgressBar 
                      progress={stockPercentage} 
                      color={stockPercentage >= 80 ? 'green' : stockPercentage >= 60 ? 'orange' : 'red'}
                      size="sm"
                    />
                  </div>

                  {category.lowStockCount > 0 && (
                    <Badge variant="warning" size="sm" className="w-full justify-center">
                      {category.lowStockCount} stock i ulët
                    </Badge>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>

      {/* Quick Actions & Alerts */}
      <div className="space-y-6">
        {/* Urgent Alerts */}
        <Card className="p-4">
          <div className="flex items-center space-x-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <h3 className="font-semibold text-gray-900">Paralajmërime Urgjente</h3>
          </div>
          
          {alerts.length === 0 ? (
            <div className="text-center py-4">
              <div className="text-2xl mb-2">✅</div>
              <p className="text-sm text-gray-600">Asnjë paralajmërim urgjent</p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.slice(0, 4).map((alert) => (
                <div key={alert.id} className="flex items-center justify-between text-sm">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{alert.itemName}</div>
                    <div className="text-xs text-gray-600">
                      Stock: {alert.currentStock} (min: {alert.minimumStock})
                    </div>
                  </div>
                  <Badge 
                    variant={
                      alert.urgency === AlertUrgency.CRITICAL ? 'danger' :
                      alert.urgency === AlertUrgency.HIGH ? 'warning' : 'secondary'
                    } 
                    size="sm"
                  >
                    {alert.urgency}
                  </Badge>
                </div>
              ))}
              
              {alerts.length > 4 && (
                <div className="text-center pt-2 border-t border-gray-200">
                  <span className="text-sm text-blue-600">+{alerts.length - 4} më shumë</span>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Expiring Soon */}
        <Card className="p-4">
          <div className="flex items-center space-x-2 mb-4">
            <Calendar className="w-5 h-5 text-red-600" />
            <h3 className="font-semibold text-gray-900">Skadon Së Shpejti</h3>
          </div>
          
          {expiringItems.length === 0 ? (
            <div className="text-center py-4">
              <div className="text-2xl mb-2">📅</div>
              <p className="text-sm text-gray-600">Asgjë nuk skadon së shpejti</p>
            </div>
          ) : (
            <div className="space-y-3">
              {expiringItems.slice(0, 3).map((item) => {
                const daysUntilExpiry = item.expiryDate 
                  ? Math.ceil((item.expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                  : 0;
                
                return (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{item.nameAlbanian}</div>
                      <div className="text-xs text-gray-600">
                        Stock: {item.currentStock} {item.unit}
                      </div>
                    </div>
                    <Badge 
                      variant={daysUntilExpiry <= 1 ? 'danger' : daysUntilExpiry <= 3 ? 'warning' : 'secondary'} 
                      size="sm"
                    >
                      {daysUntilExpiry}d
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      {/* Recent Movements */}
      <Card className="lg:col-span-2 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Lëvizjet e Fundit</h3>
        
        {recentMovements.length === 0 ? (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Asnjë lëvizje e regjistruar</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentMovements.map((movement) => (
              <motion.div
                key={movement.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <span className="text-lg">{getMovementIcon(movement.type)}</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{movement.itemName}</div>
                    <div className="text-sm text-gray-600">{movement.reason}</div>
                    <div className="text-xs text-gray-500">
                      {movement.createdAt.toLocaleDateString('sq-AL')} • {movement.userName}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`font-semibold ${
                    movement.type === 'stock_in' ? 'text-green-600' : 
                    movement.type === 'waste' ? 'text-red-600' : 'text-blue-600'
                  }`}>
                    {movement.type === 'stock_in' ? '+' : '-'}{movement.quantity} {movement.unit}
                  </div>
                  {movement.totalCost && (
                    <div className="text-sm text-gray-600">
                      {formatCurrency(movement.totalCost)}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>

      {/* Performance Indicators */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance</h3>
        
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Stock Turnover</span>
              <span className="font-semibold text-gray-900">
                {analytics?.stockTurnover.toFixed(1)}x
              </span>
            </div>
            <ProgressBar 
              progress={(analytics?.stockTurnover || 0) * 20} 
              color="blue" 
              size="sm"
            />
            <p className="text-xs text-gray-500 mt-1">Objektivi: 5.0x</p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Shkalla e Humbjes</span>
              <span className="font-semibold text-red-600">
                {analytics?.wastePercentage.toFixed(1)}%
              </span>
            </div>
            <ProgressBar 
              progress={analytics?.wastePercentage || 0} 
              color="red" 
              size="sm"
            />
            <p className="text-xs text-gray-500 mt-1">Objektivi: &lt;3%</p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Stock Adequacy</span>
              <span className="font-semibold text-green-600">
                {((items.length - alerts.length) / Math.max(items.length, 1) * 100).toFixed(1)}%
              </span>
            </div>
            <ProgressBar 
              progress={(items.length - alerts.length) / Math.max(items.length, 1) * 100} 
              color="green" 
              size="sm"
            />
            <p className="text-xs text-gray-500 mt-1">Objektivi: &gt;90%</p>
          </div>
        </div>
      </Card>
    </div>
  );
};