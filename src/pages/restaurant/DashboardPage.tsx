import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Clock, CheckCircle, XCircle, TrendingUp, Users, LogOut, Settings, CreditCard, BarChart3, Package, Home, QrCode } from 'lucide-react';
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
import { Order, OrderStatus, Restaurant, PaymentMethod } from '../../types';
import toast from 'react-hot-toast';

export const RestaurantDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');
  const [activeTab, setActiveTab] = useState<'orders' | 'analytics' | 'inventory' | 'settings' | 'waiter-calls' | 'qr-codes'>('orders');
  const [stats, setStats] = useState({
    today: { orders: 0, revenue: 0 },
    pending: 0,
    avgTime: 0
  });

  useEffect(() => {
    // Check authentication
    const auth = localStorage.getItem('restaurant-auth');
    if (!auth) {
      navigate('/restaurant/login');
      return;
    }

    loadDashboardData();
  }, [navigate]);

  const loadDashboardData = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock restaurant data
      const mockRestaurant: Restaurant = {
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
      };

      // Mock orders data with Urdhëro branding
      const mockOrders: Order[] = [
        {
          id: '1',
          numriPorosise: 'UR-001',
          restorantiId: '1',
          tavolinaId: '1',
          emriTavolines: 'Tavolina A15',
          artikujt: [
            { menuItemId: '1', emriArtikulli: 'Aperol Spritz', sasia: 2, cmimiNjesi: 850, cmimiTotal: 1700 },
            { menuItemId: '2', emriArtikulli: 'Pizza Margherita', sasia: 1, cmimiNjesi: 1200, cmimiTotal: 1200 }
          ],
          shumaTotale: 2900,
          statusi: OrderStatus.E_RE,
          krijuarNe: new Date(Date.now() - 5 * 60 * 1000),
          metodaPageses: PaymentMethod.KESH,
          eshtePagetuar: false,
          burimiPorosise: 'urdhero_qr',
          versioni: 1
        },
        {
          id: '2',
          numriPorosise: 'UR-002',
          restorantiId: '1',
          tavolinaId: '2',
          emriTavolines: 'Tavolina B08',
          artikujt: [
            { menuItemId: '3', emriArtikulli: 'Sallata Greke', sasia: 1, cmimiNjesi: 900, cmimiTotal: 900 },
            { menuItemId: '4', emriArtikulli: 'Kafe Espresso', sasia: 2, cmimiNjesi: 200, cmimiTotal: 400 }
          ],
          shumaTotale: 1300,
          statusi: OrderStatus.DUKE_U_PERGATITUR,
          krijuarNe: new Date(Date.now() - 15 * 60 * 1000),
          pranusNe: new Date(Date.now() - 12 * 60 * 1000),
          duke_u_pergatitNe: new Date(Date.now() - 8 * 60 * 1000),
          metodaPageses: PaymentMethod.KARTE,
          eshtePagetuar: false,
          burimiPorosise: 'urdhero_qr',
          versioni: 1
        },
        {
          id: '3',
          numriPorosise: 'UR-003',
          restorantiId: '1',
          tavolinaId: '3',
          emriTavolines: 'Tavolina C12',
          artikujt: [
            { menuItemId: '5', emriArtikulli: 'Peshk i Grilluar', sasia: 1, cmimiNjesi: 1800, cmimiTotal: 1800 }
          ],
          shumaTotale: 1800,
          statusi: OrderStatus.GATI,
          krijuarNe: new Date(Date.now() - 25 * 60 * 1000),
          pranusNe: new Date(Date.now() - 22 * 60 * 1000),
          duke_u_pergatitNe: new Date(Date.now() - 18 * 60 * 1000),
          gatiNe: new Date(Date.now() - 2 * 60 * 1000),
          metodaPageses: PaymentMethod.KESH,
          eshtePagetuar: false,
          burimiPorosise: 'urdhero_qr',
          versioni: 1
        }
      ];

      setRestaurant(mockRestaurant);
      setOrders(mockOrders);
      
      // Calculate stats
      setStats({
        today: { orders: 42, revenue: 89500 },
        pending: mockOrders.filter(o => o.statusi !== OrderStatus.SHERBYER).length,
        avgTime: 18
      });
    } catch (error) {
      toast.error('Gabim në ngarkimin e të dhënave');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { ...order, statusi: newStatus, [`${newStatus}Ne`]: new Date() }
          : order
      ));

      toast.success('Statusi u përditësua me sukses në Urdhëro');
    } catch (error) {
      toast.error('Gabim në përditësimin e statusit');
    }
  };

  const updatePaymentSettings = async (newSettings: Restaurant['paymentSettings']) => {
    if (!restaurant) return;

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      setRestaurant(prev => prev ? { ...prev, paymentSettings: newSettings } : null);
      toast.success('Cilësimet e pagesës u përditësuan me sukses në Urdhëro');
    } catch (error) {
      toast.error('Gabim në përditësimin e cilësimeve');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('restaurant-auth');
    navigate('/');
    toast.success('Dolët me sukses nga Urdhëro');
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
        return 'E re';
      case OrderStatus.PRANUAR:
        return 'Pranuar';
      case OrderStatus.DUKE_U_PERGATITUR:
        return 'Në përgatitje';
      case OrderStatus.GATI:
        return 'Gati';
      case OrderStatus.SHERBYER:
        return 'Shërbyer';
      default:
        return 'I panjohur';
    }
  };

  const getTimeAgo = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    return `${minutes} min më parë`;
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.statusi === filter);

  const filterOptions = [
    { value: 'all', label: 'Të gjitha', count: orders.length },
    { value: OrderStatus.E_RE, label: 'Të reja', count: orders.filter(o => o.statusi === OrderStatus.E_RE).length },
    { value: OrderStatus.PRANUAR, label: 'Pranuar', count: orders.filter(o => o.statusi === OrderStatus.PRANUAR).length },
    { value: OrderStatus.DUKE_U_PERGATITUR, label: 'Në përgatitje', count: orders.filter(o => o.statusi === OrderStatus.DUKE_U_PERGATITUR).length },
    { value: OrderStatus.GATI, label: 'Gati', count: orders.filter(o => o.statusi === OrderStatus.GATI).length }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Dashboard Urdhëro për Restorante" />
        <div className="flex items-center justify-center pt-20">
          <div className="text-center">
            <LoadingSpinner size="lg" className="mb-4" />
            <p className="text-gray-600">Duke ngarkuar dashboard-in e Urdhëro...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Dashboard Urdhëro për Restorante">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-gray-600 hover:text-gray-900"
            icon={<LogOut className="w-4 h-4" />}
            iconPosition="left"
          >
            Dil
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
            <span>Porositë Urdhëro</span>
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
            <span>Thirrjet</span>
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
            <span>Cilësimet Urdhëro</span>
          </button>
        </div>

        {activeTab === 'inventory' ? (
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
                    <div className="text-sm text-gray-600">Porosi sot në Urdhëro</div>
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
                    <div className="text-sm text-gray-600">Shitje sot</div>
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
                    <div className="text-sm text-gray-600">Në pritje</div>
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
                    <div className="text-sm text-gray-600">Koha mesatare</div>
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
                    title="Asnjë porosi Urdhëro"
                    description={filter === 'all' ? "Nuk ka porosi për momentin." : `Nuk ka porosi me statusin "${filterOptions.find(f => f.value === filter)?.label}".`}
                    actionLabel="Rifresko"
                    onAction={loadDashboardData}
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
                            {order.metodaPageses === PaymentMethod.KESH ? 'Kesh' : 'Kartë'}
                          </Badge>
                          <Badge variant="gradient" size="sm">
                            Urdhëro
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
                              onClick={() => updateOrderStatus(order.id, OrderStatus.ANULUAR)}
                              icon={<XCircle className="w-4 h-4" />}
                              iconPosition="left"
                            >
                              Refuzo
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => updateOrderStatus(order.id, OrderStatus.PRANUAR)}
                              icon={<CheckCircle className="w-4 h-4" />}
                              iconPosition="left"
                            >
                              Prano
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
                            Fillo Përgatitjen
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
                            Shëno Gati
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
                            Shërbyer
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
              onUpdate={updatePaymentSettings}
            />
          )
        )}
      </div>
    </div>
  );
};