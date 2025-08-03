import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Bell, Clock, CheckCircle, XCircle, TrendingUp, Users, LogOut, Settings, CreditCard, BarChart3, Package, Home, QrCode, Utensils } from 'lucide-react';
import { Header } from '../../components/layout/Header';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge'; 
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { PaymentSettings } from '../../components/restaurant/PaymentSettings';
import { WaiterCallManager } from '../../components/restaurant/WaiterCallManager';
import { AnalyticsDashboard } from '../../components/analytics/AnalyticsDashboard';
import { InventoryDashboard } from '../../components/inventory/InventoryDashboard';
import { MenuManagement } from '../../components/restaurant/MenuManagement';
import { useRestaurantDashboard } from '../../hooks/useRestaurantDashboard';
import { Order, OrderStatus, Restaurant, PaymentMethod } from '../../types';
import { auth } from '../../firebase/config';
import { signOut } from 'firebase/auth';
import toast from 'react-hot-toast';

export const RestaurantDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [activeTab, setActiveTab] = useState<'orders' | 'analytics' | 'inventory' | 'settings' | 'waiter-calls' | 'qr-codes' | 'menu'>('orders');
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [searchParams] = useSearchParams();
  const venueId = 'beach-bar-durres'; // In a real app, get this from auth state

  const { 
    orders, 
    filteredOrders,
    loading, 
    stats, 
    filter, 
    setFilter, 
    updateOrderStatus,
    loadAnalytics 
  } = useRestaurantDashboard(venueId);

  useEffect(() => {
    // Check if tab is specified in URL params
    const tabParam = searchParams.get('tab');
    if (tabParam && ['orders', 'menu', 'analytics', 'inventory', 'qr-codes', 'waiter-calls', 'settings'].includes(tabParam)) {
      setActiveTab(tabParam as any);
    }
    
    // Check authentication
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate('/restaurant/login');
        return;
      }
      
      // In a real app, we'd check the custom claims here to verify venue access
      // For demo, we're proceeding regardless
      setIsAuthChecking(false);
      
      // Load restaurant data - in a real app, this would come from Firestore
      setRestaurant({
        id: '1',
        emri: 'Beach Bar Durrës',
        slug: 'beach-bar-durres',
        email: 'admin@beachbar.al',
        telefoni: '+355 69 123 4567',
        adresa: 'Rruga Taulantia, Durrës 2001',
        paymentSettings: {
          acceptsKesh: true,
          acceptsKarte: true,
          acceptsDigital: false,
          defaultMethod: PaymentMethod.KESH,
          minimumOrderForCard: 500,
          cardProcessingFee: 2.5
        },
        eshteAktiv: true,
        krijuarNe: new Date(),
        perditesuesNe: new Date()
      });
    });
    
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
      toast.success('Successfully signed out');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  const formatPrice = (price: number) => {
    return (price / 100).toFixed(2);
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.E_RE:
        return 'warning';
      case OrderStatus.PRANUAR:
        return 'primary';
      case OrderStatus.DUKE_U_PERGATITUR:
        return 'secondary';
      case OrderStatus.GATI:
        return 'success';
      case OrderStatus.SHERBYER:
        return 'success';
      default:
        return 'neutral';
    }
  };

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.E_RE:
        return 'New';
      case OrderStatus.PRANUAR:
        return 'Accepted';
      case OrderStatus.DUKE_U_PERGATITUR:
        return 'Preparing';
      case OrderStatus.GATI:
        return 'Ready';
      case OrderStatus.SHERBYER:
        return 'Served';
      case OrderStatus.ANULUAR:
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  const getTimeAgo = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    return `${minutes} min ago`;
  };

  const filterOptions = [
    { value: 'all', label: 'All', count: orders.length },
    { value: OrderStatus.E_RE, label: 'New', count: orders.filter(o => o.statusi === OrderStatus.E_RE).length },
    { value: OrderStatus.PRANUAR, label: 'Accepted', count: orders.filter(o => o.statusi === OrderStatus.PRANUAR).length },
    { value: OrderStatus.DUKE_U_PERGATITUR, label: 'Preparing', count: orders.filter(o => o.statusi === OrderStatus.DUKE_U_PERGATITUR).length },
    { value: OrderStatus.GATI, label: 'Ready', count: orders.filter(o => o.statusi === OrderStatus.GATI).length }
  ];

  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Checking authentication..." />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Restaurant Dashboard" />
        <div className="flex items-center justify-center pt-20">
          <div className="text-center">
            <LoadingSpinner size="lg" className="mb-4" />
            <p className="text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Restaurant Dashboard">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-gray-600 hover:text-gray-900"
            icon={<LogOut className="w-4 h-4" />}
            iconPosition="left"
          >
            Sign Out
          </Button>
        </div>
      </Header>
      
      <div className="max-w-6xl mx-auto px-4 pt-6 pb-8">
        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-gray-100 rounded-xl p-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center space-x-2 ${
              activeTab === 'orders'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Orders</span>
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center space-x-2 ${
              activeTab === 'menu'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>Menu</span>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center space-x-2 ${
              activeTab === 'analytics'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center space-x-2 ${
              activeTab === 'inventory'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Inventory</span>
          </button>
          <button
            onClick={() => setActiveTab('qr-codes')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center space-x-2 ${
              activeTab === 'qr-codes'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>QR Codes</span>
          </button>
          <button
            onClick={() => setActiveTab('waiter-calls')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center space-x-2 ${
              activeTab === 'waiter-calls'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Calls</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center space-x-2 ${
              activeTab === 'settings'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </div>

        {activeTab === 'menu' ? (
          <MenuManagement venueId={venueId} />
        ) : activeTab === 'inventory' ? (
          <InventoryDashboard />
        ) : activeTab === 'analytics' ? (
          <AnalyticsDashboard restaurantId={restaurant?.id || '1'} />
        ) : activeTab === 'qr-codes' ? (
          /* QR Codes Management */
          <div className="text-center py-8">
            <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">QR Code Management</h2>
            <p className="text-gray-600 mb-6">
              Manage table QR codes for your restaurant
            </p>
            <Button
              onClick={() => navigate('/restaurant/qr-management')}
              icon={<QrCode className="w-4 h-4" />}
              iconPosition="left"
            >
              Open QR Management
            </Button>
          </div>
        ) : activeTab === 'orders' ? (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-gray-900">{stats.today.orders}</div>
                    <div className="text-sm text-gray-600">Orders today</div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg font-bold text-green-600">€</span>
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-gray-900">{formatPrice(stats.today.revenue)}</div>
                    <div className="text-sm text-gray-600">Revenue today</div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Bell className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-gray-900">{stats.pending}</div>
                    <div className="text-sm text-gray-600">Pending</div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-gray-900">{stats.avgTime}min</div>
                    <div className="text-sm text-gray-600">Average time</div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-2 mb-6 overflow-x-auto">
              {filterOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => setFilter(option.value as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    filter === option.value
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  {option.label} {option.count > 0 && `(${option.count})`}
                </button>
              ))}
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {filteredOrders.length === 0 ? (
                <Card className="p-8">
                  <EmptyState
                    icon="📋"
                    title="No orders"
                    description={filter === 'all' ? "There are currently no orders." : `No orders with "${filterOptions.find(f => f.value === filter)?.label}" status.`}
                    actionLabel="Refresh"
                    onAction={() => window.location.reload()}
                  />
                </Card>
              ) : (
                filteredOrders.map(order => (
                  <Card key={order.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            #{order.numriPorosise}
                          </h3>
                          <Badge variant={getStatusColor(order.statusi) as any}>
                            {getStatusText(order.statusi)}
                          </Badge>
                          <Badge variant="neutral" size="sm">
                            <CreditCard className="w-3 h-3 mr-1" />
                            {order.metodaPageses === PaymentMethod.KESH ? 'Cash' : 'Card'}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          {order.emriTavolines} • {getTimeAgo(order.krijuarNe)}
                        </div>
                        <div className="text-lg font-bold text-gray-900">
                          {formatPrice(order.shumaTotale)} €
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        {order.statusi === OrderStatus.E_RE && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateOrderStatus(order.id, OrderStatus.ANULUAR, "Item out of stock")}
                              icon={<XCircle className="w-4 h-4" />}
                              iconPosition="left"
                            >
                              Reject
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => updateOrderStatus(order.id, OrderStatus.PRANUAR)}
                              icon={<CheckCircle className="w-4 h-4" />}
                              iconPosition="left"
                            >
                              Accept
                            </Button>
                          </>
                        )}
                        
                        {order.statusi === OrderStatus.PRANUAR && (
                          <Button
                            size="sm"
                            onClick={() => updateOrderStatus(order.id, OrderStatus.DUKE_U_PERGATITUR)}
                            icon={<Clock className="w-4 h-4" />}
                            iconPosition="left"
                          >
                            Start Preparing
                          </Button>
                        )}
                        
                        {order.statusi === OrderStatus.DUKE_U_PERGATITUR && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => updateOrderStatus(order.id, OrderStatus.GATI)}
                            icon={<CheckCircle className="w-4 h-4" />}
                            iconPosition="left"
                          >
                            Mark Ready
                          </Button>
                        )}
                        
                        {order.statusi === OrderStatus.GATI && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => updateOrderStatus(order.id, OrderStatus.SHERBYER)}
                            icon={<Users className="w-4 h-4" />}
                            iconPosition="left"
                          >
                            Mark Served
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="border-t border-gray-100 pt-4">
                      <div className="space-y-2">
                        {order.artikujt.map((item, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span className="text-gray-900">
                              {item.sasia}x {item.emriArtikulli}
                            </span>
                            <span className="text-gray-600">
                              {formatPrice(item.cmimiTotal)} €
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </>
        ) : activeTab === 'waiter-calls' ? (
          /* Waiter Calls Tab */
          <WaiterCallManager />
        ) : (
          /* Settings Tab */
          restaurant && (
            <PaymentSettings
              restaurant={restaurant}
              onUpdate={(settings) => {
                // In a real app, this would update Firestore
                setRestaurant({...restaurant, paymentSettings: settings});
                toast.success('Payment settings updated');
              }}
            />
          )
        )}
      </div>
    </div>
  );
};