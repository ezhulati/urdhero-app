import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  AlertTriangle, 
  TrendingDown, 
  DollarSign,
  Calendar,
  BarChart3,
  Plus,
  Search,
  Filter,
  Download,
  RefreshCw,
  Clock,
  Trash2,
  Eye,
  Edit
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { EmptyState } from '../ui/EmptyState';
import { InventoryOverview } from './InventoryOverview';
import { StockManagement } from './StockManagement';
import { LowStockAlerts } from './LowStockAlerts';
import { WasteTracking } from './WasteTracking';
import { SupplierManagement } from './SupplierManagement';
import { InventoryAnalytics } from './InventoryAnalytics';
import { useInventory } from '../../hooks/useInventory';
import { InventoryCategory, AlertUrgency } from '../../types/inventory';

export const InventoryDashboard: React.FC = () => {
  const { 
    items, 
    alerts, 
    analytics, 
    loading, 
    formatCurrency,
    getLowStockItemsCount,
    getCriticalAlerts,
    getExpiringItems,
    refresh 
  } = useInventory();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'stock' | 'alerts' | 'waste' | 'suppliers' | 'analytics'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<InventoryCategory | 'all'>('all');

  if (loading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          </Card>
        ))}
      </div>
    );
  }

  const lowStockCount = getLowStockItemsCount();
  const criticalAlerts = getCriticalAlerts();
  const expiringItems = getExpiringItems();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Intelligence</h1>
          <p className="text-gray-600">Menaxhimi i avancuar i inventarit për restorantin tuaj</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={refresh}
            icon={<RefreshCw className="w-4 h-4" />}
            iconPosition="left"
          >
            Rifresko
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            icon={<Download className="w-4 h-4" />}
            iconPosition="left"
          >
            Eksporto
          </Button>
          <Button 
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            iconPosition="left"
          >
            Artikull i Ri
          </Button>
        </div>
      </div>

      {/* Critical Alerts Banner */}
      {criticalAlerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border-2 border-red-200 rounded-xl p-4"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-red-900">
                🚨 {criticalAlerts.length} Paralajmërime Kritike!
              </h3>
              <p className="text-sm text-red-700">
                Artikuj që kanë nevojë për vëmendje të menjëhershme
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => setActiveTab('alerts')}
              className="bg-red-600 hover:bg-red-700"
            >
              Shiko Tani
            </Button>
          </div>
        </motion.div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <Badge variant="secondary" size="sm">
                Inventar Total
              </Badge>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-gray-900">
                {analytics?.totalValue ? formatCurrency(analytics.totalValue) : '€0.00'}
              </div>
              <div className="text-sm text-gray-600">{analytics?.totalItems || 0} artikuj</div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <Badge variant={lowStockCount > 0 ? 'warning' : 'success'} size="sm">
                {lowStockCount > 0 ? 'Nevojë për Furnizim' : 'Stock i Mirë'}
              </Badge>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-orange-600">
                {lowStockCount}
              </div>
              <div className="text-sm text-gray-600">Artikuj me stock të ulët</div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
              <Badge variant="danger" size="sm">
                Humbje
              </Badge>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-red-600">
                {analytics?.wasteValue ? formatCurrency(analytics.wasteValue) : '€0.00'}
              </div>
              <div className="text-sm text-gray-600">
                {analytics?.wastePercentage ? analytics.wastePercentage.toFixed(1) : 0}% e totalit
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <Badge variant={expiringItems.length > 0 ? 'warning' : 'success'} size="sm">
                {expiringItems.length > 0 ? 'Duke Skaduar' : 'Në Rregull'}
              </Badge>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-purple-600">
                {expiringItems.length}
              </div>
              <div className="text-sm text-gray-600">Skadon në 3 ditë</div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-xl p-1 overflow-x-auto">
        {[
          { id: 'overview', label: 'Përmbledhje', icon: BarChart3 },
          { id: 'stock', label: 'Stock Management', icon: Package },
          { id: 'alerts', label: `Paralajmërime (${alerts.length})`, icon: AlertTriangle },
          { id: 'waste', label: 'Waste Tracking', icon: Trash2 },
          { id: 'suppliers', label: 'Furnizuesit', icon: DollarSign },
          { id: 'analytics', label: 'Analytics', icon: TrendingDown }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center space-x-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && <InventoryOverview />}
          {activeTab === 'stock' && <StockManagement />}
          {activeTab === 'alerts' && <LowStockAlerts />}
          {activeTab === 'waste' && <WasteTracking />}
          {activeTab === 'suppliers' && <SupplierManagement />}
          {activeTab === 'analytics' && <InventoryAnalytics />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};