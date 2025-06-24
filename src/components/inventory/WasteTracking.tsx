import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Calendar, DollarSign, BarChart3, Plus, Filter } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { useInventory } from '../../hooks/useInventory';
import { WasteReason, InventoryCategory } from '../../types/inventory';

export const WasteTracking: React.FC = () => {
  const { wasteRecords, items, analytics, formatCurrency } = useInventory();
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('week');
  const [categoryFilter, setCategoryFilter] = useState<InventoryCategory | 'all'>('all');

  // Filter waste records by time range
  const getFilteredRecords = () => {
    const now = new Date();
    let cutoffDate: Date;
    
    switch (timeRange) {
      case 'today':
        cutoffDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'week':
        cutoffDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        cutoffDate = new Date(now.setDate(now.getDate() - 30));
        break;
      default:
        cutoffDate = new Date(now.setDate(now.getDate() - 7));
    }
    
    return wasteRecords.filter(record => {
      const matchesDate = record.createdAt >= cutoffDate;
      const matchesCategory = categoryFilter === 'all' || 
        items.find(item => item.id === record.itemId)?.category === categoryFilter;
      
      return matchesDate && matchesCategory;
    });
  };

  const filteredRecords = getFilteredRecords();
  
  // Calculate waste metrics
  const totalWasteValue = filteredRecords.reduce((sum, record) => sum + record.costValue, 0);
  
  const wasteByReason = Object.values(WasteReason).map(reason => {
    const records = filteredRecords.filter(r => r.reason === reason);
    const value = records.reduce((sum, r) => sum + r.costValue, 0);
    const count = records.length;
    
    return { reason, value, count };
  }).filter(r => r.count > 0).sort((a, b) => b.value - a.value);
  
  const wasteByCategory = Object.values(InventoryCategory).map(category => {
    const records = filteredRecords.filter(r => {
      const item = items.find(i => i.id === r.itemId);
      return item?.category === category;
    });
    
    const value = records.reduce((sum, r) => sum + r.costValue, 0);
    const count = records.length;
    
    return { category, value, count };
  }).filter(c => c.count > 0).sort((a, b) => b.value - a.value);

  const getReasonLabel = (reason: WasteReason) => {
    const labels = {
      [WasteReason.EXPIRED]: 'Skaduar',
      [WasteReason.DAMAGED]: 'Dëmtuar',
      [WasteReason.SPOILED]: 'Prishur',
      [WasteReason.OVERCOOKED]: 'Gatuar Tepër',
      [WasteReason.CUSTOMER_RETURN]: 'Kthyer nga Klienti',
      [WasteReason.SPILLED]: 'Derdhur',
      [WasteReason.OTHER]: 'Tjetër'
    };
    return labels[reason] || reason;
  };

  const getReasonIcon = (reason: WasteReason) => {
    const icons = {
      [WasteReason.EXPIRED]: '⏱️',
      [WasteReason.DAMAGED]: '💔',
      [WasteReason.SPOILED]: '🦠',
      [WasteReason.OVERCOOKED]: '🔥',
      [WasteReason.CUSTOMER_RETURN]: '↩️',
      [WasteReason.SPILLED]: '💧',
      [WasteReason.OTHER]: '❓'
    };
    return icons[reason] || '🗑️';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Waste Tracking</h2>
            <p className="text-sm text-gray-600">
              Monitorimi dhe reduktimi i humbjeve
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="today">Sot</option>
            <option value="week">Kjo Javë</option>
            <option value="month">Ky Muaj</option>
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
          
          <Button
            icon={<Plus className="w-4 h-4" />}
            iconPosition="left"
          >
            Regjistro Humbje
          </Button>
        </div>
      </div>

      {/* Waste Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-red-600" />
            </div>
            <Badge variant="danger" size="sm">
              Humbje Totale
            </Badge>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(totalWasteValue)}
            </div>
            <div className="text-sm text-gray-600">
              {filteredRecords.length} raste të regjistruara
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Shkalla e Humbjeve</h3>
          <div className="text-center mb-4">
            <div className="text-3xl font-bold text-red-600 mb-1">
              {analytics?.wastePercentage.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">e vlerës së inventarit</div>
          </div>
          <ProgressBar 
            progress={analytics?.wastePercentage || 0} 
            color="red"
            className="mb-2"
          />
          <div className="text-sm text-gray-600 text-center">
            {"Objektivi: <3% • Industria: 4.2%"}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Arsyet Kryesore</h3>
          <div className="space-y-3">
            {wasteByReason.slice(0, 3).map((item) => (
              <div key={item.reason} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getReasonIcon(item.reason as WasteReason)}</span>
                  <span className="text-sm text-gray-600">{getReasonLabel(item.reason as WasteReason)}</span>
                </div>
                <span className="font-medium text-red-600">{formatCurrency(item.value)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Waste by Category */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Humbjet sipas Kategorive</h3>
        
        <div className="space-y-4">
          {wasteByCategory.map((category) => {
            const percentage = totalWasteValue > 0 ? (category.value / totalWasteValue) * 100 : 0;
            
            return (
              <div key={category.category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{category.category}</span>
                    <span className="text-sm text-gray-600">({category.count} raste)</span>
                  </div>
                  <span className="font-medium text-red-600">{formatCurrency(category.value)}</span>
                </div>
                <div className="space-y-1">
                  <ProgressBar 
                    progress={percentage} 
                    color="red"
                    size="sm"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{percentage.toFixed(1)}% e humbjeve totale</span>
                    <span>{(category.value / totalWasteValue * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Recent Waste Records */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Regjistrimet e Fundit</h3>
          <Button 
            variant="outline" 
            size="sm"
            icon={<Calendar className="w-4 h-4" />}
            iconPosition="left"
          >
            Shiko Të Gjitha
          </Button>
        </div>
        
        <div className="space-y-4">
          {filteredRecords.slice(0, 5).map((record) => {
            const item = items.find(i => i.id === record.itemId);
            
            return (
              <motion.div
                key={record.id}
                className="p-4 bg-gray-50 rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <span className="text-lg">{getReasonIcon(record.reason)}</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{record.itemName}</div>
                      <div className="text-sm text-gray-600">
                        {record.quantity} {record.unit} • {getReasonLabel(record.reason)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {record.createdAt.toLocaleDateString('sq-AL')} • {record.reportedBy}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-semibold text-red-600">
                      {formatCurrency(record.costValue)}
                    </div>
                    {item && (
                      <div className="text-xs text-gray-500">
                        {(record.quantity / (item.currentStock + record.quantity) * 100).toFixed(1)}% e stockut
                      </div>
                    )}
                  </div>
                </div>
                
                {record.notes && (
                  <div className="mt-2 text-sm text-gray-600 bg-white p-2 rounded-lg border border-gray-200">
                    {record.notes}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};