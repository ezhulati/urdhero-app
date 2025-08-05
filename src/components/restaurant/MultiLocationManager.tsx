import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building, 
  Plus, 
  MapPin, 
  Phone, 
  Mail,
  Users,
  BarChart3,
  Settings,
  Eye,
  Edit,
  Trash2,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  Globe
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { VenueType, VENUE_CONFIGS } from '../../types';
import toast from 'react-hot-toast';

interface Location {
  id: string;
  name: string;
  slug: string;
  type: VenueType;
  address: string;
  phone?: string;
  email?: string;
  isActive: boolean;
  staff: number;
  tables: number;
  monthlyOrders: number;
  monthlyRevenue: number;
  rating: number;
  manager: {
    name: string;
    email: string;
    phone?: string;
  };
  createdAt: Date;
  lastActivity: Date;
}

export const MultiLocationManager: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockLocations: Location[] = [
        {
          id: '1',
          name: 'Beach Bar Durrës - Main',
          slug: 'beach-bar-durres-main',
          type: VenueType.BEACH_BAR,
          address: 'Rruga Taulantia, Durrës 2001',
          phone: '+355 69 123 4567',
          email: 'durres@beachbar.al',
          isActive: true,
          staff: 12,
          tables: 25,
          monthlyOrders: 1847,
          monthlyRevenue: 4250000, // €42,500
          rating: 4.8,
          manager: {
            name: 'Ana Koci',
            email: 'ana@beachbar.al',
            phone: '+355 69 234 5678'
          },
          createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          lastActivity: new Date(Date.now() - 5 * 60 * 1000)
        },
        {
          id: '2',
          name: 'Beach Bar Durrës - Terrace',
          slug: 'beach-bar-durres-terrace',
          type: VenueType.ROOFTOP,
          address: 'Rruga Taulantia 45, Durrës 2001',
          phone: '+355 69 234 5678',
          email: 'terrace@beachbar.al',
          isActive: true,
          staff: 8,
          tables: 15,
          monthlyOrders: 892,
          monthlyRevenue: 2890000, // €28,900
          rating: 4.9,
          manager: {
            name: 'Marko Shehi',
            email: 'marko@beachbar.al'
          },
          createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
          lastActivity: new Date(Date.now() - 12 * 60 * 1000)
        },
        {
          id: '3',
          name: 'Urban Cafe Tirana',
          slug: 'urban-cafe-tirana',
          type: VenueType.CAFE,
          address: 'Blloku, Tiranë 1001',
          phone: '+355 69 345 6789',
          email: 'tirana@urbancafe.al',
          isActive: false,
          staff: 6,
          tables: 20,
          monthlyOrders: 234,
          monthlyRevenue: 890000, // €8,900
          rating: 4.2,
          manager: {
            name: 'Elena Hoxha',
            email: 'elena@urbancafe.al',
            phone: '+355 69 456 7890'
          },
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          lastActivity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        }
      ];

      setLocations(mockLocations);
    } catch (error) {
      toast.error('Failed to load locations');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (cents: number) => `€${(cents / 100).toFixed(0)}`;

  const getLocationStatus = (location: Location) => {
    if (!location.isActive) return { label: 'Inactive', color: 'neutral' };
    
    const minutesAgo = Math.floor((Date.now() - location.lastActivity.getTime()) / 60000);
    if (minutesAgo < 10) return { label: 'Online', color: 'success' };
    if (minutesAgo < 60) return { label: 'Recently Active', color: 'primary' };
    return { label: 'Offline', color: 'warning' };
  };

  const getTotalStats = () => {
    const activeLocations = locations.filter(l => l.isActive);
    return {
      totalLocations: locations.length,
      activeLocations: activeLocations.length,
      totalStaff: activeLocations.reduce((sum, l) => sum + l.staff, 0),
      totalTables: activeLocations.reduce((sum, l) => sum + l.tables, 0),
      totalMonthlyOrders: activeLocations.reduce((sum, l) => sum + l.monthlyOrders, 0),
      totalMonthlyRevenue: activeLocations.reduce((sum, l) => sum + l.monthlyRevenue, 0),
      averageRating: activeLocations.length > 0 
        ? activeLocations.reduce((sum, l) => sum + l.rating, 0) / activeLocations.length 
        : 0
    };
  };

  const totalStats = getTotalStats();

  const handleLocationToggle = async (locationId: string, newStatus: boolean) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setLocations(prev => 
        prev.map(location => 
          location.id === locationId 
            ? { ...location, isActive: newStatus }
            : location
        )
      );
      
      toast.success(`Location ${newStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      toast.error('Failed to update location status');
    }
  };

  const handleViewLocation = (locationId: string) => {
    // In a real app, this would switch to the location's dashboard
    toast.success('Switching to location dashboard...');
  };

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading locations...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Multi-Location Management</h1>
          <p className="text-gray-600 text-sm">
            Manage all your venue locations from one central dashboard
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? '📊' : '📋'} {viewMode === 'grid' ? 'List' : 'Grid'}
          </Button>
          <Button
            onClick={() => setShowAddModal(true)}
            icon={<Plus className="w-4 h-4" />}
            iconPosition="left"
          >
            Add Location
          </Button>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card className="p-4 text-center">
          <Building className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{totalStats.totalLocations}</div>
          <div className="text-xs text-gray-600">Total Locations</div>
        </Card>

        <Card className="p-4 text-center">
          <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-600">{totalStats.activeLocations}</div>
          <div className="text-xs text-gray-600">Active</div>
        </Card>

        <Card className="p-4 text-center">
          <Users className="w-6 h-6 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{totalStats.totalStaff}</div>
          <div className="text-xs text-gray-600">Total Staff</div>
        </Card>

        <Card className="p-4 text-center">
          <MapPin className="w-6 h-6 text-orange-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{totalStats.totalTables}</div>
          <div className="text-xs text-gray-600">Tables</div>
        </Card>

        <Card className="p-4 text-center">
          <BarChart3 className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{totalStats.totalMonthlyOrders.toLocaleString()}</div>
          <div className="text-xs text-gray-600">Monthly Orders</div>
        </Card>

        <Card className="p-4 text-center">
          <span className="text-2xl mx-auto mb-2 block">💰</span>
          <div className="text-2xl font-bold text-gray-900">{formatCurrency(totalStats.totalMonthlyRevenue)}</div>
          <div className="text-xs text-gray-600">Monthly Revenue</div>
        </Card>

        <Card className="p-4 text-center">
          <Star className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{totalStats.averageRating.toFixed(1)}</div>
          <div className="text-xs text-gray-600">Avg Rating</div>
        </Card>
      </div>

      {/* Locations Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map(location => {
            const status = getLocationStatus(location);
            const config = VENUE_CONFIGS[location.type];
            
            return (
              <motion.div
                key={location.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative group"
              >
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                  {/* Header */}
                  <div 
                    className="p-4 text-white relative"
                    style={{ background: `linear-gradient(135deg, ${config.color}, ${config.color}dd)` }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                          <span className="text-2xl">{config.icon}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{location.name}</h3>
                          <p className="text-sm opacity-90">{config.name}</p>
                        </div>
                      </div>
                      <Badge 
                        variant={status.color as any} 
                        size="sm"
                        className="bg-white bg-opacity-20"
                      >
                        {status.label}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span className="truncate">{location.address}</span>
                      </div>
                      
                      {location.phone && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="w-4 h-4 mr-2" />
                          <span>{location.phone}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-2" />
                        <span>{location.staff} staff • {location.tables} tables</span>
                      </div>
                    </div>

                    {/* Performance Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold text-gray-900">{location.monthlyOrders}</div>
                        <div className="text-xs text-gray-600">Monthly Orders</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold text-gray-900">{formatCurrency(location.monthlyRevenue)}</div>
                        <div className="text-xs text-gray-600">Monthly Revenue</div>
                      </div>
                    </div>

                    {/* Manager Info */}
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex items-center justify-between text-sm">
                        <div>
                          <div className="font-medium text-gray-900">{location.manager.name}</div>
                          <div className="text-gray-600">Manager</div>
                        </div>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 mr-1" />
                          <span className="font-medium">{location.rating}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2 mt-4">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleViewLocation(location.id)}
                        className="flex-1"
                        icon={<Eye className="w-4 h-4" />}
                        iconPosition="left"
                      >
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedLocation(location.id);
                          setShowStatsModal(true);
                        }}
                        icon={<BarChart3 className="w-4 h-4" />}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<Settings className="w-4 h-4" />}
                      />
                    </div>
                  </div>

                  {/* Status Toggle */}
                  <div className="px-4 pb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {location.isActive ? 'Accepting Orders' : 'Closed'}
                      </span>
                      <button
                        onClick={() => handleLocationToggle(location.id, !location.isActive)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          location.isActive ? 'bg-green-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            location.isActive ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Staff</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Performance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Manager</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {locations.map(location => {
                  const status = getLocationStatus(location);
                  const config = VENUE_CONFIGS[location.type];
                  
                  return (
                    <tr key={location.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                            style={{ backgroundColor: config.color }}
                          >
                            <span className="text-lg">{config.icon}</span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{location.name}</div>
                            <div className="text-sm text-gray-600">{location.address}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={status.color as any} size="sm">
                          {status.label}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {location.staff} staff • {location.tables} tables
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">{location.monthlyOrders} orders</div>
                          <div className="text-gray-600">{formatCurrency(location.monthlyRevenue)} revenue</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">{location.manager.name}</div>
                          <div className="text-gray-600">{location.manager.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewLocation(location.id)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedLocation(location.id);
                              setShowStatsModal(true);
                            }}
                          >
                            <BarChart3 className="w-4 h-4" />
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
      )}

      {/* Performance Overview */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Network Performance</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Top Performing Locations</h4>
            <div className="space-y-3">
              {locations
                .filter(l => l.isActive)
                .sort((a, b) => b.monthlyRevenue - a.monthlyRevenue)
                .slice(0, 3)
                .map((location, index) => (
                  <div key={location.id} className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-yellow-600">#{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-sm">{location.name}</div>
                      <div className="text-xs text-gray-600">{formatCurrency(location.monthlyRevenue)}</div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-4">Growth Opportunities</h4>
            <div className="space-y-3">
              {locations
                .filter(l => l.monthlyOrders < 1000)
                .slice(0, 3)
                .map(location => (
                  <div key={location.id} className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <ArrowRight className="w-3 h-3 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-sm">{location.name}</div>
                      <div className="text-xs text-gray-600">{location.monthlyOrders} orders potential</div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-4">Recent Activity</h4>
            <div className="space-y-3">
              {locations
                .sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime())
                .slice(0, 3)
                .map(location => (
                  <div key={location.id} className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <Clock className="w-3 h-3 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-sm">{location.name}</div>
                      <div className="text-xs text-gray-600">
                        {Math.floor((Date.now() - location.lastActivity.getTime()) / 60000)} min ago
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Add Location Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Location"
        size="lg"
      >
        <div className="p-6 text-center">
          <Building className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Ready to expand your business?
          </h3>
          <p className="text-gray-600 mb-6">
            Adding new locations is easy with Urdhëro's multi-location management system.
          </p>
          <Button
            onClick={() => {
              setShowAddModal(false);
              // Navigate to venue registration
              window.location.href = '/venue/register';
            }}
            size="lg"
            icon={<Plus className="w-5 h-5" />}
            iconPosition="left"
          >
            Start Registration Process
          </Button>
        </div>
      </Modal>

      {/* Location Stats Modal */}
      <Modal
        isOpen={showStatsModal}
        onClose={() => {
          setShowStatsModal(false);
          setSelectedLocation(null);
        }}
        title="Location Analytics"
        size="xl"
      >
        <div className="p-6">
          {selectedLocation && (() => {
            const location = locations.find(l => l.id === selectedLocation);
            if (!location) return null;

            return (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{location.name}</h3>
                  <p className="text-gray-600">{VENUE_CONFIGS[location.type].name}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{location.monthlyOrders}</div>
                    <div className="text-sm text-gray-600">Orders</div>
                  </Card>
                  <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{formatCurrency(location.monthlyRevenue)}</div>
                    <div className="text-sm text-gray-600">Revenue</div>
                  </Card>
                  <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">{location.rating}</div>
                    <div className="text-sm text-gray-600">Rating</div>
                  </Card>
                  <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">{location.staff}</div>
                    <div className="text-sm text-gray-600">Staff</div>
                  </Card>
                </div>

                <div className="text-center">
                  <Button
                    onClick={() => handleViewLocation(location.id)}
                    icon={<ArrowRight className="w-4 h-4" />}
                    iconPosition="right"
                  >
                    Open Location Dashboard
                  </Button>
                </div>
              </div>
            );
          })()}
        </div>
      </Modal>
    </div>
  );
};