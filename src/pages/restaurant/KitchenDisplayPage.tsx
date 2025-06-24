import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, AlertCircle, ChefHat, Home } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { UrdheroLogo } from '../../components/ui/UrdheroLogo';
import { Order, OrderStatus } from '../../types';
import toast from 'react-hot-toast';

export const KitchenDisplayPage: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user has access to kitchen (can be bypassed for demo)
    const auth = localStorage.getItem('restaurant-auth');
    if (auth) {
      const authData = JSON.parse(auth);
      if (authData.role !== 'kitchen' && authData.role !== 'admin') {
        // Allow access but show warning
        toast('⚠️ Kjo faqe është për kuzhinën. Ju keni qasje demo.', { duration: 3000 });
      }
    }

    loadKitchenOrders();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadKitchenOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadKitchenOrders = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock kitchen orders (only accepted and in preparation) with Urdhëro branding
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
          statusi: OrderStatus.PRANUAR,
          krijuarNe: new Date(Date.now() - 3 * 60 * 1000),
          pranusNe: new Date(Date.now() - 2 * 60 * 1000),
          metodaPageses: 'kesh' as any,
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
            { menuItemId: '5', emriArtikulli: 'Peshk i Grilluar', sasia: 1, cmimiNjesi: 1800, cmimiTotal: 1800 }
          ],
          shumaTotale: 2700,
          statusi: OrderStatus.DUKE_U_PERGATITUR,
          krijuarNe: new Date(Date.now() - 12 * 60 * 1000),
          pranusNe: new Date(Date.now() - 10 * 60 * 1000),
          duke_u_pergatitNe: new Date(Date.now() - 7 * 60 * 1000),
          metodaPageses: 'kesh' as any,
          eshtePagetuar: false,
          burimiPorosise: 'urdhero_qr',
          versioni: 1
        }
      ];

      setOrders(mockOrders);
    } catch (error) {
      toast.error('Gabim në ngarkimin e porosive nga Urdhëro');
    } finally {
      setLoading(false);
    }
  };

  const startCooking = async (orderId: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { ...order, statusi: OrderStatus.DUKE_U_PERGATITUR, duke_u_pergatitNe: new Date() }
          : order
      ));

      toast.success('Përgatitja filloi!');
    } catch (error) {
      toast.error('Gabim në përditësim');
    }
  };

  const markReady = async (orderId: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setOrders(prev => prev.filter(order => order.id !== orderId));
      toast.success('Porosia është gati për shërbim!');
    } catch (error) {
      toast.error('Gabim në përditësim');
    }
  };

  const getTimeInPreparation = (order: Order) => {
    const startTime = order.duke_u_pergatitNe || order.pranusNe || order.krijuarNe;
    const minutes = Math.floor((Date.now() - startTime.getTime()) / 60000);
    return minutes;
  };

  const getOrderPriority = (order: Order) => {
    const timeWaiting = Math.floor((Date.now() - order.krijuarNe.getTime()) / 60000);
    if (timeWaiting > 20) return 'high';
    if (timeWaiting > 10) return 'medium';
    return 'low';
  };

  const priorityColors = {
    high: 'border-red-300 bg-red-50',
    medium: 'border-orange-300 bg-orange-50',
    low: 'border-green-300 bg-green-50'
  };

  const handleBackToDashboard = () => {
    const auth = localStorage.getItem('restaurant-auth');
    if (auth) {
      navigate('/restaurant/dashboard');
    } else {
      navigate('/');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('restaurant-auth');
    navigate('/');
    toast.success('Dolët me sukses nga Urdhëro');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="flex items-center justify-center pt-20">
          <div className="text-center">
            <LoadingSpinner size="lg" className="mb-4" />
            <p className="text-gray-300">Duke ngarkuar porositë nga Urdhëro...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Ekrani i Kuzhinës - Urdhëro</h1>
              <p className="text-gray-400">
                {orders.length} porosi aktive • Përditësuar: {new Date().toLocaleTimeString('sq-AL')}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <UrdheroLogo size="sm" variant="white" />
            <Button
              onClick={loadKitchenOrders}
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Rifresko
            </Button>
            <Button
              onClick={handleBackToDashboard}
              variant="ghost"
              size="sm"
              className="text-gray-400"
            >
              Dashboard
            </Button>
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="text-gray-400"
              icon={<Home className="w-4 h-4" />}
              iconPosition="left"
            >
              Dil
            </Button>
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="max-w-7xl mx-auto p-6">
        {orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <ChefHat className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-300 mb-2">
              Asnjë porosi aktive nga Urdhëro
            </h2>
            <p className="text-gray-500">
              Porositë e reja nga Urdhëro do të shfaqen këtu automatikisht
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map(order => {
              const priority = getOrderPriority(order);
              const timeInPrep = order.statusi === OrderStatus.DUKE_U_PERGATITUR ? getTimeInPreparation(order) : 0;
              
              return (
                <div
                  key={order.id}
                  className={`bg-white rounded-xl border-2 overflow-hidden ${priorityColors[priority]}`}
                >
                  {/* Header */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-gray-900">
                        #{order.numriPorosise}
                      </h3>
                      <div className="flex items-center space-x-2">
                        {priority === 'high' && (
                          <AlertCircle className="w-5 h-5 text-red-600" />
                        )}
                        <Badge 
                          variant={order.statusi === OrderStatus.DUKE_U_PERGATITUR ? 'warning' : 'primary'}
                          size="sm"
                        >
                          {order.statusi === OrderStatus.DUKE_U_PERGATITUR ? 'Në përgatitje' : 'Në pritje'}
                        </Badge>
                        <Badge variant="gradient" size="sm">
                          Urdhëro
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{order.emriTavolines}</span>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {order.statusi === OrderStatus.DUKE_U_PERGATITUR 
                          ? `${timeInPrep} min në përgatitje`
                          : `${Math.floor((Date.now() - order.krijuarNe.getTime()) / 60000)} min në pritje`
                        }
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-4 space-y-3">
                    {order.artikujt.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">
                            {item.sasia}x {item.emriArtikulli}
                          </div>
                          {item.instruksioneSpeciale && (
                            <div className="text-xs text-orange-600 mt-1">
                              📝 {item.instruksioneSpeciale}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="p-4 border-t border-gray-200">
                    {order.statusi === OrderStatus.PRANUAR ? (
                      <Button
                        onClick={() => startCooking(order.id)}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        Fillo Përgatitjen
                      </Button>
                    ) : (
                      <Button
                        onClick={() => markReady(order.id)}
                        className="w-full bg-green-600 hover:bg-green-700"
                        icon={<CheckCircle className="w-4 h-4" />}
                        iconPosition="left"
                      >
                        Shëno Gati
                      </Button>
                    )}
                  </div>

                  {/* Source indicator */}
                  <div className="px-4 pb-2">
                    <div className="text-xs text-gray-500 text-center">
                      Urdhëruar përmes Urdhëro Platform
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};