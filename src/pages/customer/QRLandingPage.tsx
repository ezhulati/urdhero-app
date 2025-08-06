import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MapPin, Clock, Phone, CheckCircle, Wifi, AlertTriangle, Star, Users, UserCheck, Zap, Shield, Plus } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Header } from '../../components/layout/Header';
import { Badge } from '../../components/ui/Badge';
import { useWaiterCall } from '../../hooks/useWaiterCall';
import { useTranslation } from '../../contexts/TranslationContext';
import { LanguageSelector } from '../../components/ui/LanguageSelector';
import { CustomerStatusBanner } from '../../components/ui/CustomerStatusBanner';
import { useCustomerAuth } from '../../hooks/useCustomerAuth';
import { Restaurant, Table } from '../../types';
import toast from 'react-hot-toast';

export const QRLandingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useCustomerAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [table, setTable] = useState<Table | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { callWaiter, isWaiterCalled, getCallInfo } = useWaiterCall();
  const { t, language } = useTranslation();

  const restaurantSlug = searchParams.get('r');
  const tableCode = searchParams.get('t');
  const isReturning = searchParams.get('returning') === 'true';
  const isWalkIn = tableCode === 'walk-in';

  useEffect(() => {
    // Monitor network status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    if (!restaurantSlug || !tableCode) {
      setError(t('errors.invalidQR.description'));
      setLoading(false);
      return;
    }

    // Check for invalid restaurant/table combinations
    if (restaurantSlug === 'invalid' || tableCode === 'invalid') {
      setError(t('errors.invalidQR.description'));
      setLoading(false);
      return;
    }

    validateQRCode();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [restaurantSlug, tableCode, language]);

  const validateQRCode = async () => {
    try {
      // Simulate network check
      if (!isOnline) {
        throw new Error(t('errors.networkError.description'));
      }

      // Mock data for demonstration
      const mockRestaurant: Restaurant = {
        id: '1',
        emri: 'Beach Bar Durrës',
        slug: 'beach-bar-durres',
        email: 'info@beachbar.al',
        telefoni: '+355 69 123 4567',
        adresa: 'Rruga Taulantia, Durrës 2001',
        pershkrimi: 'The best beachside venue with amazing views and fresh food. Premium Partner.',
        orariPunes: {
          hapeNe: '08:00',
          mbyllNe: '23:00',
          ditetJaves: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        },
        eshteAktiv: true,
        krijuarNe: new Date(),
        perditesuesNe: new Date()
      };

      const mockTable: Table = {
        id: '1',
        kodi: tableCode!,
        emriPerShfaqje: isWalkIn ? t('qrLanding.walkInCustomer') : `${t('common.table')} ${tableCode}`,
        pershkrimi: isWalkIn 
          ? 'Order without table reservation - pay directly at counter or at table'
          : 'Premium table with sea view and relaxing atmosphere',
        pozicioni: isWalkIn 
          ? undefined
          : {
              x: 0,
              y: 0,
              zona: 'VIP Terrace with Sea View'
            },
        eshteAktive: true,
        krijuarNe: new Date()
      };

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Check if restaurant is currently open
      const now = new Date();
      const currentHour = now.getHours();
      const openHour = parseInt(mockRestaurant.orariPunes?.hapeNe.split(':')[0] || '8');
      const closeHour = parseInt(mockRestaurant.orariPunes?.mbyllNe.split(':')[0] || '23');
      
      if (currentHour < openHour || currentHour >= closeHour) {
        navigate('/restaurant-closed');
        return;
      }

      setRestaurant(mockRestaurant);
      setTable(mockTable);
      
      // Show success message only once and only for specific scenarios
      if (isWalkIn) {
        toast.success('Welcome! Order without table reservation.', { 
          duration: 4000,
          id: 'qr-walkin-success'
        });
      } else {
        toast.success(`Welcome to ${mockRestaurant.emri}!`, { 
          duration: 4000,
          id: 'qr-table-success'
        });
      }
    } catch (err) {
      if (!isOnline) {
        navigate('/network-error');
      } else {
        setError(t('errors.networkError.description'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleViewMenu = () => {
    if (restaurant && table) {
      navigate(`/menu?r=${restaurant.slug}&t=${table.kodi}`);
    }
  };

  const handleCallWaiter = () => {
    if (!table) return;
    
    const success = callWaiter(table.kodi, 'customer');
    if (!success) {
      // Show status if already called
      const callInfo = getCallInfo(table.kodi);
      if (callInfo) {
        const timeAgo = Math.floor((Date.now() - callInfo.calledAt.getTime()) / 60000);
        toast.error(`${t('waiterCall.alreadyCalled')} (${timeAgo} ${t('common.minutes')} ago)`);
      }
    }
  };

  const handleAddToHomeScreen = () => {
    toast('Add to home screen for instant access!', { duration: 3000 });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header showBack onBackClick={() => navigate('/')}>
          <LanguageSelector variant="compact" />
        </Header>
        <div className="flex items-center justify-center pt-20">
          <div className="text-center max-w-sm mx-auto px-4">
            <LoadingSpinner size="lg" className="mb-6" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Validating
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Verifying venue and table information
            </p>
            <div className="flex items-center justify-center space-x-3 text-sm">
              <div className="flex items-center text-green-600">
                <Wifi className="w-4 h-4 mr-1" />
                <span>{isOnline ? 'Connected' : 'Not connected'}</span>
              </div>
              <div className="flex items-center text-blue-600">
                <Shield className="w-4 h-4 mr-1" />
                <span>SSL Secure</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !restaurant || !table) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header showBack onBackClick={() => navigate('/')}>
          <LanguageSelector variant="compact" />
        </Header>
        <div className="max-w-md mx-auto px-4 pt-8">
          <Card className="text-center p-8">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {t('errors.invalidQR.title')}
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              {error || t('errors.invalidQR.description')}
            </p>
            <div className="space-y-3">
              <Button onClick={() => window.location.reload()} className="w-full">
                {t('common.tryAgain')}
              </Button>
              <Button variant="outline" onClick={() => navigate('/')} className="w-full">
                {t('common.back')}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const waiterCalled = isWaiterCalled(table.kodi);
  const callInfo = getCallInfo(table.kodi);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showBack onBackClick={() => navigate('/')}>
        <LanguageSelector variant="compact" />
      </Header>
      
      <div className="max-w-md mx-auto px-4 pt-6 pb-8">
        {/* Customer Status Banner */}
        <CustomerStatusBanner 
          user={user}
          isAuthenticated={isAuthenticated}
          venue={restaurant ? { name: restaurant.emri, type: 'restaurant' } : undefined}
          className="mb-4"
        />

        {/* Success Message */}
        <div className="flex items-center justify-center mb-6">
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-full border shadow-sm ${
            isWalkIn 
              ? 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200'
              : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
          }`}>
            {isWalkIn ? (
              <UserCheck className="w-5 h-5 text-orange-600" />
            ) : (
              <CheckCircle className="w-5 h-5 text-green-600" />
            )}
            <span className={`font-semibold text-sm ${
              isWalkIn ? 'text-orange-700' : 'text-green-700'
            }`}>
              Connected
            </span>
          </div>
        </div>

        {/* Restaurant Info */}
        <Card className="mb-6 overflow-hidden shadow-lg">
          {/* Restaurant Header */}
          <div className="bg-gradient-to-r from-blue-800 to-indigo-800 text-white p-6 text-center relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10"></div>
            </div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <span className="text-white font-bold text-xl">
                  {restaurant.emri.charAt(0)}
                </span>
              </div>
              <h1 className="text-xl font-bold mb-2">
                {restaurant.emri}
              </h1>
              <div className="flex items-center justify-center space-x-4 text-sm text-blue-100 mb-3">
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-1 text-yellow-300" />
                  4.9
                </div>
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-1" />
                  Premium Partner
                </div>
              </div>
            </div>
          </div>

          {/* Restaurant Details */}
          <div className="p-6">
            {restaurant.pershkrimi && (
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {restaurant.pershkrimi}
              </p>
            )}

            <div className="space-y-3">
              {/* Table/Customer Info */}
              <div className={`flex items-center space-x-3 p-4 rounded-xl border-2 ${
                isWalkIn 
                  ? 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200'
                  : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
              }`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  isWalkIn ? 'bg-orange-600' : 'bg-blue-800'
                }`}>
                  {isWalkIn ? (
                    <UserCheck className="w-6 h-6 text-white" />
                  ) : (
                    <span className="text-white font-bold text-sm">{table.kodi}</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{table.emriPerShfaqje}</div>
                  {table.pershkrimi && (
                    <div className="text-sm text-gray-600 mt-1">{table.pershkrimi}</div>
                  )}
                  {table.pozicioni && (
                    <Badge variant="secondary" size="sm" className="mt-2">
                      <MapPin className="w-3 h-3 mr-1" />
                      {table.pozicioni.zona}
                    </Badge>
                  )}
                  {isWalkIn && (
                    <Badge variant="warning" size="sm" className="mt-2">
                      <UserCheck className="w-3 h-3 mr-1" />
                      Walk-in Customer
                    </Badge>
                  )}
                </div>
              </div>

              {/* Restaurant Details */}
              {restaurant.adresa && (
                <div className="flex items-start space-x-3 text-gray-600 py-2">
                  <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5 text-gray-500" />
                  <span className="text-sm">{restaurant.adresa}</span>
                </div>
              )}

              {restaurant.telefoni && (
                <div className="flex items-center space-x-3 text-gray-600 py-2">
                  <Phone className="w-5 h-5 flex-shrink-0 text-gray-500" />
                  <a 
                    href={`tel:${restaurant.telefoni}`}
                    className="text-sm hover:text-blue-600 transition-colors font-medium"
                  >
                    {restaurant.telefoni}
                  </a>
                </div>
              )}

              {restaurant.orariPunes && (
                <div className="flex items-center space-x-3 text-gray-600 py-2">
                  <Clock className="w-5 h-5 flex-shrink-0 text-gray-500" />
                  <div className="text-sm">
                    <div className="font-medium">Open now: {restaurant.orariPunes.hapeNe} - {restaurant.orariPunes.mbyllNe}</div>
                    <div className="text-xs text-gray-500">{t('qrLanding.everyDay')}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Button 
            variant={waiterCalled ? "success" : "outline"}
            onClick={handleCallWaiter}
            disabled={waiterCalled}
            className="flex items-center justify-center"
            icon={<Phone className="w-4 h-4" />}
            iconPosition="left"
          >
            {waiterCalled ? 'Called' : 'Call Staff'}
          </Button>
          <Button 
            variant="outline"
            onClick={handleAddToHomeScreen}
            className="flex items-center justify-center"
            icon={<Plus className="w-4 h-4" />}
            iconPosition="left"
          >
            Add to Home
          </Button>
        </div>

        {/* Waiter Call Status */}
        {waiterCalled && callInfo && (
          <Card className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-semibold text-green-900 text-sm">
                  {t('waiterCall.waitingForWaiter')}
                </div>
                <div className="text-xs text-green-700">
                  Called {Math.floor((Date.now() - callInfo.calledAt.getTime()) / 60000)} {t('common.minutes')} ago
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Main Action Button */}
        <Button 
          size="lg" 
          className="w-full shadow-lg hover:shadow-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:-translate-y-0.5 transition-all duration-200 mb-6"
          onClick={handleViewMenu}
          data-testid="view-menu-button"
          icon={<Zap className="w-5 h-5" />}
          iconPosition="right"
        >
          {t('qrLanding.viewMenuAndOrder')}
        </Button>

        {/* Platform Info */}
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-start space-x-3">
            <Zap className="w-6 h-6 text-blue-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-blue-800 mb-1">
                Powered by Urdhëro Platform
              </p>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Instant and secure ordering</li>
                <li>• Real-time order tracking</li>
                <li>• 100% secure and protected</li>
                <li>• 24/7 support in Albanian</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};