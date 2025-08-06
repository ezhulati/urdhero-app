import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { QrCode, Utensils, Clock, Star, Zap, Shield, Heart, Camera } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { UrdheroLogo } from '../../components/ui/UrdheroLogo';
import { LanguageSelector } from '../../components/ui/LanguageSelector';
import { QRScanner } from '../../components/qr/QRScanner';
import { useTranslation } from '../../contexts/TranslationContext';
import { parseQRCode } from '../../utils/qrParser';
import toast from 'react-hot-toast';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showScanner, setShowScanner] = useState(false);
  const isDev = !import.meta.env.PROD;

  const handleQRScanSuccess = (qrData: string) => {
    const parsed = parseQRCode(qrData);
    
    if (parsed.isValid) {
      setShowScanner(false);
      toast.success(`QR Code scanned successfully!`);
      navigate(`/qr-landing?r=${parsed.restaurantSlug}&t=${parsed.tableCode}`);
    } else {
      toast.error(parsed.error || 'Invalid QR code format');
    }
  };

  const handleScannerClose = () => {
    setShowScanner(false);
  };

  const handleDemoQR = () => {
    // Demo QR for development
    navigate('/qr-landing?r=beach-bar-durres&t=A15');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Language Selector - Top Right */}
      <div className="absolute top-4 right-4 z-10">
        <LanguageSelector variant="compact" />
      </div>

      {/* Hero Section */}
      <div className="max-w-md mx-auto px-4 pt-8 pb-6">
        <div className="text-center">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <UrdheroLogo size="xxl" showText={false} />
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent">
              Urdhëro
            </span>
          </h1>
          
          <p className="text-lg text-gray-700 leading-relaxed mb-2 font-medium">
            {t('home.tagline')}
          </p>
          
          <p className="text-sm text-blue-700 font-semibold mb-2">
            {t('home.subtitle')}
          </p>
          
          <p className="text-xs text-gray-500 mb-8">
            {t('home.madeInAlbania')} • {t('home.partnerCount')}
          </p>

          {/* QR Scanner Button */}
          <div className="space-y-3 mb-8">
            <Button 
              size="lg" 
              className="w-full shadow-lg hover:shadow-xl"
              icon={<Camera className="w-6 h-6" />}
              iconPosition="left"
              onClick={() => setShowScanner(true)}
              data-testid="qr-scanner-button"
            >
              {t('nav.scanQR')}
            </Button>
            
            {isDev && (
              <Button 
                variant="outline"
                size="sm" 
                className="w-full text-gray-600"
                onClick={handleDemoQR}
              >
                🔧 {t('home.demoQR')}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-md mx-auto px-4 pb-8">
        <div className="space-y-3">
          <Card className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-blue-800" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{t('home.features.instant.title')}</h3>
                <p className="text-sm text-gray-600">
                  {t('home.features.instant.description')}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-indigo-800" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{t('home.features.secure.title')}</h3>
                <p className="text-sm text-gray-600">
                  {t('home.features.secure.description')}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-emerald-800" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{t('home.features.easy.title')}</h3>
                <p className="text-sm text-gray-600">
                  {t('home.features.easy.description')}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-md mx-auto px-4 pb-8">
        <Card className="p-6 bg-gradient-to-r from-blue-800 to-indigo-800 text-white shadow-lg">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Star className="w-6 h-6 text-yellow-300 mr-2" />
              <span className="text-2xl font-bold">4.9</span>
              <span className="text-blue-100 ml-2">/5 rating</span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xl font-bold">{t('home.stats.restaurants')}</div>
                <div className="text-blue-200 text-xs">{t('common.restaurant')}</div>
              </div>
              <div>
                <div className="text-xl font-bold">{t('home.stats.orders')}</div>
                <div className="text-blue-200 text-xs">{t('common.order')}</div>
              </div>
              <div>
                <div className="text-xl font-bold">{t('home.stats.satisfaction')}</div>
                <div className="text-blue-200 text-xs">{t('home.stats.satisfactionLabel')}</div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Trust Indicators */}
      <div className="max-w-md mx-auto px-4 pb-8">
        <Card className="p-4 bg-gray-50 border-gray-200">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 text-xs text-gray-600">
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-1 text-green-600" />
                {t('home.trust.ssl')}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1 text-blue-600" />
                {t('home.trust.support')}
              </div>
              <div className="flex items-center">
                <Heart className="w-4 h-4 mr-1 text-red-500" />
                {t('home.trust.madeIn')}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <div className="max-w-md mx-auto px-4 pb-8 text-center">
        <p className="text-sm text-gray-500 mb-1">
          {t('home.footer.copyright')}
        </p>
        <p className="text-xs text-gray-400">
          {t('home.footer.madeWithLove')}
        </p>
      </div>

      {/* QR Scanner Modal */}
      <QRScanner
        isOpen={showScanner}
        onScanSuccess={handleQRScanSuccess}
        onClose={handleScannerClose}
      />
    </div>
  );
};