import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Star, Truck, Clock, Phone, Mail, MapPin, Package, DollarSign, Plus, Search } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useInventory } from '../../hooks/useInventory';
import { InventoryCategory } from '../../types/inventory';

export const SupplierManagement: React.FC = () => {
  const { suppliers, items } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<InventoryCategory | 'all'>('all');

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = searchTerm === '' || 
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contactName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || 
      supplier.categories.includes(categoryFilter as InventoryCategory);
    
    return matchesSearch && matchesCategory;
  });

  const getSupplierItems = (supplierId: string) => {
    return items.filter(item => item.supplierId === supplierId);
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4.0) return 'text-blue-600';
    if (rating >= 3.5) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getCategoryBadges = (categories: InventoryCategory[]) => {
    const colors: Record<string, string> = {
      [InventoryCategory.VEGETABLES]: 'success',
      [InventoryCategory.MEAT]: 'danger',
      [InventoryCategory.DAIRY]: 'primary',
      [InventoryCategory.SEAFOOD]: 'secondary',
      [InventoryCategory.BEVERAGES]: 'warning',
      [InventoryCategory.SPICES]: 'neutral'
    };

    return categories.map(category => (
      <Badge 
        key={category} 
        variant={(colors[category] || 'neutral') as any} 
        size="sm"
      >
        {category}
      </Badge>
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Furnizuesit</h2>
            <p className="text-sm text-gray-600">
              {suppliers.length} furnizues aktivë
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Kërko furnizues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Të gjitha kategoritë</option>
            {Object.values(InventoryCategory).map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Furnizues i Ri
          </Button>
        </div>
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSuppliers.map((supplier) => {
          const supplierItems = getSupplierItems(supplier.id);
          
          return (
            <motion.div
              key={supplier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{supplier.name}</h3>
                      <div className="flex items-center space-x-2 mb-2">
                        <div className={`flex items-center ${getRatingColor(supplier.rating)}`}>
                          <Star className="w-4 h-4 mr-1" />
                          <span className="font-medium">{supplier.rating.toFixed(1)}</span>
                        </div>
                        <span className="text-gray-400">•</span>
                        <div className="flex items-center text-gray-600 text-sm">
                          <Truck className="w-4 h-4 mr-1" />
                          <span>{supplier.deliveryTime} ditë</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {getCategoryBadges(supplier.categories)}
                      </div>
                    </div>
                  </div>
                  <Badge 
                    variant={supplier.isActive ? 'success' : 'neutral'} 
                    size="sm"
                  >
                    {supplier.isActive ? 'Aktiv' : 'Joaktiv'}
                  </Badge>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                    <a href={`mailto:${supplier.email}`} className="hover:text-blue-600">
                      {supplier.email}
                    </a>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                    <a href={`tel:${supplier.phone}`} className="hover:text-blue-600">
                      {supplier.phone}
                    </a>
                  </div>
                  <div className="flex items-start text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400 mt-0.5" />
                    <span>{supplier.address}</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Artikuj nga ky furnizues</span>
                    <span className="text-sm text-gray-600">{supplierItems.length} artikuj</span>
                  </div>
                  
                  {supplierItems.length > 0 ? (
                    <div className="space-y-2">
                      {supplierItems.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex items-center justify-between text-sm">
                          <div className="flex items-center">
                            <Package className="w-4 h-4 mr-2 text-gray-400" />
                            <span className="text-gray-600">{item.nameAlbanian}</span>
                          </div>
                          <span className="font-medium text-gray-900">
                            {item.currentStock} {item.unit}
                          </span>
                        </div>
                      ))}
                      
                      {supplierItems.length > 3 && (
                        <div className="text-center text-sm text-blue-600">
                          +{supplierItems.length - 3} më shumë
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 text-center py-2">
                      Asnjë artikull i lidhur
                    </div>
                  )}
                </div>
                
                <div className="mt-4 flex justify-end space-x-2">
                  <Button variant="outline" size="sm">
                    <Phone className="w-4 h-4 mr-1" />
                    Kontakto
                  </Button>
                  <Button size="sm">
                    <DollarSign className="w-4 h-4 mr-1" />
                    Porosit
                  </Button>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};