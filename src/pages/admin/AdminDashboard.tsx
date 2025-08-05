import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Users, 
  Building, 
  BarChart3, 
  Settings, 
  Bell,
  Activity,
  Globe,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  LogOut
} from 'lucide-react';
import { Header } from '../../components/layout/Header';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { SystemMonitoring } from '../../components/admin/SystemMonitoring';
import { PredictiveAnalytics } from '../../components/analytics/PredictiveAnalytics';
import { MultiLocationManager } from '../../components/restaurant/MultiLocationManager';
import { StaffManagement } from '../../components/restaurant/StaffManagement';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'monitoring' | 'analytics' | 'locations' | 'users' | 'settings'>('overview');

  const platformStats = {
    totalVenues: 127,
    activeVenues: 98,
    totalUsers: 12847,
    monthlyOrders: 45672,
    monthlyRevenue: 1234567800, // €1,234,567.80
    systemHealth: 99.94,
    activeAlerts: 2
  };

  const formatCurrency = (cents: number) => `€${(cents / 100).toLocaleString()}`;

  const handleLogout = () => {
    // Admin logout
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Platform Administration">
        <div className="flex items-center space-x-2">
          <Badge variant="success" size="sm">
            <Shield className="w-3 h-3 mr-1" />
            Admin Access
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            icon={<LogOut className="w-4 h-4" />}
            iconPosition="left"
          >
            Logout
          </Button>
        </div>
      </Header>
      
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-8">
        {/* Platform Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          <Card className="p-4 text-center">
            <Building className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{platformStats.totalVenues}</div>
            <div className="text-xs text-gray-600">Total Venues</div>
          </Card>

          <Card className="p-4 text-center">
            <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{platformStats.activeVenues}</div>
            <div className="text-xs text-gray-600">Active</div>
          </Card>

          <Card className="p-4 text-center">
            <Users className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{platformStats.totalUsers.toLocaleString()}</div>
            <div className="text-xs text-gray-600">Platform Users</div>
          </Card>

          <Card className="p-4 text-center">
            <BarChart3 className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{platformStats.monthlyOrders.toLocaleString()}</div>
            <div className="text-xs text-gray-600">Monthly Orders</div>
          </Card>

          <Card className="p-4 text-center">
            <TrendingUp className="w-6 h-6 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(platformStats.monthlyRevenue)}</div>
            <div className="text-xs text-gray-600">Monthly GMV</div>
          </Card>

          <Card className="p-4 text-center">
            <Activity className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{platformStats.systemHealth}%</div>
            <div className="text-xs text-gray-600">System Health</div>
          </Card>

          <Card className="p-4 text-center">
            <AlertTriangle className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-600">{platformStats.activeAlerts}</div>
            <div className="text-xs text-gray-600">Active Alerts</div>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-xl p-1 mb-8 overflow-x-auto">
          {[
            { id: 'overview', label: 'Platform Overview', icon: BarChart3 },
            { id: 'monitoring', label: 'System Health', icon: Activity },
            { id: 'analytics', label: 'AI Analytics', icon: TrendingUp },
            { id: 'locations', label: 'Multi-Location', icon: Building },
            { id: 'users', label: 'User Management', icon: Users },
            { id: 'settings', label: 'Platform Settings', icon: Settings }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-shrink-0 py-3 px-4 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="whitespace-nowrap">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Platform Health */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Platform Health Summary</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-green-600 mb-1">Operational</div>
                  <div className="text-sm text-gray-600">All systems running</div>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Activity className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-blue-600 mb-1">245ms</div>
                  <div className="text-sm text-gray-600">Avg response time</div>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Globe className="w-8 h-8 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-purple-600 mb-1">99.94%</div>
                  <div className="text-sm text-gray-600">Uptime (30d)</div>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Bell className="w-8 h-8 text-orange-600" />
                  </div>
                  <div className="text-2xl font-bold text-orange-600 mb-1">2</div>
                  <div className="text-sm text-gray-600">Active alerts</div>
                </div>
              </div>
            </Card>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Venue Registrations</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Piceri Milano', type: 'Restaurant', location: 'Tirana', status: 'Pending Review' },
                    { name: 'Kafe Evropa', type: 'Cafe', location: 'Durrës', status: 'Approved' },
                    { name: 'Bar Adriatik', type: 'Bar', location: 'Vlora', status: 'Approved' }
                  ].map((venue, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{venue.name}</div>
                        <div className="text-sm text-gray-600">{venue.type} • {venue.location}</div>
                      </div>
                      <Badge 
                        variant={venue.status === 'Approved' ? 'success' : 'warning'} 
                        size="sm"
                      >
                        {venue.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Performance</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Daily Active Users</span>
                      <span className="font-medium text-gray-900">4,567</span>
                    </div>
                    <div className="text-xs text-green-600">+12.5% from yesterday</div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Order Success Rate</span>
                      <span className="font-medium text-gray-900">98.7%</span>
                    </div>
                    <div className="text-xs text-green-600">+0.3% from last week</div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Customer Satisfaction</span>
                      <span className="font-medium text-gray-900">4.8/5</span>
                    </div>
                    <div className="text-xs text-green-600">+0.1 from last month</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'monitoring' && (
          <SystemMonitoring />
        )}

        {activeTab === 'analytics' && (
          <PredictiveAnalytics restaurantId="platform-overview" />
        )}

        {activeTab === 'locations' && (
          <MultiLocationManager />
        )}

        {activeTab === 'users' && (
          <StaffManagement />
        )}

        {activeTab === 'settings' && (
          <Card className="p-8 text-center">
            <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Platform Settings</h3>
            <p className="text-gray-600 mb-6">
              Advanced platform configuration and system settings
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col space-y-2">
                <Globe className="w-6 h-6" />
                <span>Global Settings</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col space-y-2">
                <Shield className="w-6 h-6" />
                <span>Security Config</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col space-y-2">
                <Bell className="w-6 h-6" />
                <span>Notifications</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col space-y-2">
                <Activity className="w-6 h-6" />
                <span>Performance</span>
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};