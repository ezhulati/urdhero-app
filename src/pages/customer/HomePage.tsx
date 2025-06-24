import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { QrCode, Utensils, Clock, Star, Zap, Shield, Heart, Camera } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { UrdheroLogo } from '../../components/ui/UrdheroLogo';
import { QRScanner } from '../../components/qr/QRScanner';
import { parseQRCode } from '../../utils/qrParser';
import toast from 'react-hot-toast';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
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
            Order directly from your table
          </p>
          
          <p className="text-sm text-blue-700 font-semibold mb-2">
            #1 Restaurant Platform in Albania
          </p>
          
          <p className="text-xs text-gray-500 mb-8">
            🇦🇱 Made in Albania • 150+ Partner Restaurants
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
              Scan QR Code
            </Button>
            
            {isDev && (
              <Button 
                variant="outline"
                size="sm" 
                className="w-full text-gray-600"
                onClick={handleDemoQR}
              >
                🔧 Demo QR (Development)
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
                <h3 className="font-semibold text-gray-900">Instant & Fast</h3>
                <p className="text-sm text-gray-600">
                  Scan QR code and order immediately - zero waiting
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
                <h3 className="font-semibold text-gray-900">100% Secure</h3>
                <p className="text-sm text-gray-600">
                  Secure payments and real-time order tracking
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
                <h3 className="font-semibold text-gray-900">Easy to Use</h3>
                <p className="text-sm text-gray-600">
                  Simple and intuitive interface for all ages
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
                <div className="text-xl font-bold">150+</div>
                <div className="text-blue-200 text-xs">Restaurants</div>
              </div>
              <div>
                <div className="text-xl font-bold">50K+</div>
                <div className="text-blue-200 text-xs">Orders</div>
              </div>
              <div>
                <div className="text-xl font-bold">98%</div>
                <div className="text-blue-200 text-xs">Satisfaction</div>
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
                SSL Secure
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1 text-blue-600" />
                24/7 Support
              </div>
              <div className="flex items-center">
                <Heart className="w-4 h-4 mr-1 text-red-500" />
                Made in 🇦🇱
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <div className="max-w-md mx-auto px-4 pb-8 text-center">
        <p className="text-sm text-gray-500 mb-1">
          © 2024 Urdhëro Platform. All rights reserved.
        </p>
        <p className="text-xs text-gray-400">
          🇦🇱 Made with love in Albania
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