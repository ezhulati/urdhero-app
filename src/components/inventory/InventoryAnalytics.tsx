import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingDown, 
  DollarSign, 
  Calendar, 
  PieChart,
  Trash2,
  Package,
  RefreshCw,
  Download
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { useInventory } from '../../hooks/useInventory';
import { InventoryCategory } from '../../types/inventory';

export const InventoryAnalytics: React.FC = () => {
  const { analytics, wasteRecords, formatCurrency } = useInventory();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('month');

  if (!analytics) {
    return (
      <Card className="p-8 text-center">
        <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Të dhënat nuk janë të disponueshme
        </h3>
        <p className="text-gray-600 mb-4">
          Nuk mund të ngarkojmë të dhënat e analytics për momentin.
        </p>
        <Button>
          <RefreshCw className="w-4 h-4 mr-2" />
          Riprovo
        </Button>
      </Card>
    );
  }

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Inventory Analytics</h2>
            <p className="text-sm text-gray-600">
              Analiza e thellë e inventarit dhe humbjeve
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">Kjo Javë</option>
            <option value="month">Ky Muaj</option>
            <option value="quarter">Ky Tremujor</option>
          </select>
          
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Eksporto Raport
          </Button>
        </div>
      </div>

      {/* Value Distribution */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Shpërndarja e Vlerës së Inventarit</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="h-64 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <PieChart className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <p className="text-blue-800 font-medium">Grafiku i Shpërndarjes</p>
                <p className="text-blue-600 text-sm">Sipas Kategorive</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            {analytics.categoryBreakdown
              .sort((a, b) => b.totalValue - a.totalValue)
              .slice(0, 5)
              .map((category) => {
                const percentage = analytics.totalValue > 0 
                  ? (category.totalValue / analytics.totalValue) * 100 
                  : 0;
                
                return (
                  <div key={category.category} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">{getCategoryName(category.category)}</span>
                      <span className="font-medium text-gray-900">{formatCurrency(category.totalValue)}</span>
                    </div>
                    <ProgressBar 
                      progress={percentage} 
                      color="blue" 
                      size="sm"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{category.itemCount} artikuj</span>
                      <span>{percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </Card>

      {/* Waste Analysis */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Analiza e Humbjeve</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Humbjet sipas Arsyes</h4>
              <div className="space-y-3">
                {analytics.topWastedItems.slice(0, 3).map((item, index) => (
                  <div key={item.itemId} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-bold text-red-600">#{index + 1}</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{item.itemName}</div>
                        <div className="text-sm text-gray-600">{item.wasteQuantity.toFixed(1)} njësi</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-red-600">
                        {formatCurrency(item.wasteValue)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {(item.wasteValue / analytics.wasteValue * 100).toFixed(1)}% e totalit
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Trendi i Humbjeve</h4>
              <div className="h-40 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <TrendingDown className="w-10 h-10 text-red-600 mx-auto mb-2" />
                  <p className="text-red-800 font-medium">Grafiku i Trendit</p>
                  <p className="text-red-600 text-sm">30 ditët e fundit</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Rekomandimet për Reduktimin e Humbjeve</h4>
            
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h5 className="font-medium text-blue-900 mb-1">Optimizo Porositë</h5>
                    <p className="text-sm text-blue-800">
                      Reduktoni sasinë e porosive për artikujt me humbje të larta. Fokusohuni në artikujt me datë skadence të shkurtër.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h5 className="font-medium text-green-900 mb-1">Përmirëso Ruajtjen</h5>
                    <p className="text-sm text-green-800">
                      Implementoni sistemin FIFO (First In, First Out) për të gjithë artikujt, veçanërisht për ushqimet e freskëta.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Trash2 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h5 className="font-medium text-purple-900 mb-1">Trajnim për Stafin</h5>
                    <p className="text-sm text-purple-800">
                      Trajnoni stafin për teknikat e duhura të ruajtjes dhe përgatitjes për të minimizuar humbjet.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Performance Metrics */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Metrikat e Performancës</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Stock Turnover</span>
                <span className="font-semibold text-gray-900">{analytics.stockTurnover.toFixed(1)}x</span>
              </div>
              <ProgressBar 
                progress={analytics.stockTurnover * 20} 
                color="blue" 
                size="sm"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Objektivi: 5.0x</span>
                <span>Industria: 4.5x</span>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Shkalla e Humbjeve</span>
                <span className="font-semibold text-red-600">{analytics.wastePercentage.toFixed(1)}%</span>
              </div>
              <ProgressBar 
                progress={analytics.wastePercentage} 
                color="red" 
                size="sm"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Objektivi: &lt;3%</span>
                <span>Industria: 4.2%</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Inventory Accuracy</span>
                <span className="font-semibold text-green-600">98.2%</span>
              </div>
              <ProgressBar 
                progress={98.2} 
                color="green" 
                size="sm"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Objektivi: &gt;95%</span>
                <span>Industria: 92%</span>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Supplier On-Time Delivery</span>
                <span className="font-semibold text-blue-600">94.5%</span>
              </div>
              <ProgressBar 
                progress={94.5} 
                color="blue" 
                size="sm"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Objektivi: &gt;95%</span>
                <span>Industria: 89%</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Inventory to Sales Ratio</span>
                <span className="font-semibold text-purple-600">12.4%</span>
              </div>
              <ProgressBar 
                progress={12.4 * 5} 
                color="purple" 
                size="sm"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Objektivi: &lt;15%</span>
                <span>Industria: 18%</span>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Stock Adequacy</span>
                <span className="font-semibold text-green-600">87.3%</span>
              </div>
              <ProgressBar 
                progress={87.3} 
                color="green" 
                size="sm"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Objektivi: &gt;90%</span>
                <span>Industria: 82%</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};