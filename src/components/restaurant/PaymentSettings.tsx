import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Banknote, Smartphone, Save, AlertCircle, Check } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Restaurant, PaymentMethod } from '../../types';
import toast from 'react-hot-toast';

interface PaymentSettingsProps {
  restaurant: Restaurant;
  onUpdate: (settings: Restaurant['paymentSettings']) => void;
}

export const PaymentSettings: React.FC<PaymentSettingsProps> = ({ restaurant, onUpdate }) => {
  const [settings, setSettings] = useState(restaurant.paymentSettings || {
    acceptsKesh: true,
    acceptsKarte: true,
    acceptsDigital: false,
    defaultMethod: PaymentMethod.KESH,
    minimumOrderForCard: 500, // 5 EUR minimum
    cardProcessingFee: 2.5 // 2.5% fee
  });
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const originalSettings = restaurant.paymentSettings || {};
    const isDifferent = JSON.stringify(settings) !== JSON.stringify(originalSettings);
    setHasChanges(isDifferent);
  }, [settings, restaurant.paymentSettings]);

  const handlePaymentMethodToggle = (method: keyof typeof settings) => {
    const newSettings = { ...settings, [method]: !settings[method] };
    
    // Ensure at least one payment method is enabled
    const enabledMethods = [
      newSettings.acceptsKesh,
      newSettings.acceptsKarte,
      newSettings.acceptsDigital
    ].filter(Boolean);

    if (enabledMethods.length === 0) {
      toast.error('Të paktën një metodë pagese duhet të jetë aktive');
      return;
    }

    // Update default method if current default is being disabled
    if (!newSettings[method] && settings.defaultMethod) {
      if (
        (method === 'acceptsKesh' && settings.defaultMethod === PaymentMethod.KESH) ||
        (method === 'acceptsKarte' && settings.defaultMethod === PaymentMethod.KARTE) ||
        (method === 'acceptsDigital' && settings.defaultMethod === PaymentMethod.DIGITAL)
      ) {
        // Set new default to first available method
        if (newSettings.acceptsKesh) {
          newSettings.defaultMethod = PaymentMethod.KESH;
        } else if (newSettings.acceptsKarte) {
          newSettings.defaultMethod = PaymentMethod.KARTE;
        } else if (newSettings.acceptsDigital) {
          newSettings.defaultMethod = PaymentMethod.DIGITAL;
        }
      }
    }

    setSettings(newSettings);
  };

  const handleInputChange = (field: string, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onUpdate(settings);
      setHasChanges(false);
      toast.success('Cilësimet e pagesës u ruajtën me sukses!');
    } catch (error) {
      toast.error('Gabim në ruajtjen e cilësimeve');
    } finally {
      setSaving(false);
    }
  };

  const getEnabledMethodsCount = () => {
    return [settings.acceptsKesh, settings.acceptsKarte, settings.acceptsDigital].filter(Boolean).length;
  };

  const formatPrice = (price: number) => {
    return (price / 100).toFixed(2);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Cilësimet e Pagesës</h2>
          <p className="text-gray-600 text-sm">
            Menaxhoni metodat e pagesës që pranohen në restorantin tuaj
          </p>
        </div>
        <Badge variant="secondary" size="sm">
          {getEnabledMethodsCount()} metoda aktive
        </Badge>
      </div>

      {/* Payment Methods */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Metodat e Pagesës</h3>
        
        <div className="space-y-4">
          {/* Cash */}
          <motion.div
            className={`p-4 rounded-xl border-2 transition-all ${
              settings.acceptsKesh 
                ? 'border-green-200 bg-green-50' 
                : 'border-gray-200 bg-gray-50'
            }`}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  settings.acceptsKesh ? 'bg-green-600' : 'bg-gray-400'
                }`}>
                  <Banknote className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Kesh</div>
                  <div className="text-sm text-gray-600">Pagesa me para fizike</div>
                </div>
              </div>
              <button
                onClick={() => handlePaymentMethodToggle('acceptsKesh')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.acceptsKesh ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.acceptsKesh ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </motion.div>

          {/* Card */}
          <motion.div
            className={`p-4 rounded-xl border-2 transition-all ${
              settings.acceptsKarte 
                ? 'border-blue-200 bg-blue-50' 
                : 'border-gray-200 bg-gray-50'
            }`}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  settings.acceptsKarte ? 'bg-blue-600' : 'bg-gray-400'
                }`}>
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Kartë</div>
                  <div className="text-sm text-gray-600">Pagesa me kartë debiti/kredit</div>
                </div>
              </div>
              <button
                onClick={() => handlePaymentMethodToggle('acceptsKarte')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.acceptsKarte ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.acceptsKarte ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </motion.div>

          {/* Digital */}
          <motion.div
            className={`p-4 rounded-xl border-2 transition-all ${
              settings.acceptsDigital 
                ? 'border-purple-200 bg-purple-50' 
                : 'border-gray-200 bg-gray-50'
            }`}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  settings.acceptsDigital ? 'bg-purple-600' : 'bg-gray-400'
                }`}>
                  <Smartphone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Pagesa Digjitale</div>
                  <div className="text-sm text-gray-600">Apple Pay, Google Pay, etj.</div>
                </div>
              </div>
              <button
                onClick={() => handlePaymentMethodToggle('acceptsDigital')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.acceptsDigital ? 'bg-purple-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.acceptsDigital ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </motion.div>
        </div>
      </Card>

      {/* Default Payment Method */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Metoda e Parazgjedhur</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: PaymentMethod.KESH, label: 'Kesh', icon: Banknote, enabled: settings.acceptsKesh },
            { value: PaymentMethod.KARTE, label: 'Kartë', icon: CreditCard, enabled: settings.acceptsKarte },
            { value: PaymentMethod.DIGITAL, label: 'Digjitale', icon: Smartphone, enabled: settings.acceptsDigital }
          ].map(method => {
            const Icon = method.icon;
            return (
              <button
                key={method.value}
                onClick={() => method.enabled && handleInputChange('defaultMethod', method.value)}
                disabled={!method.enabled}
                className={`p-3 rounded-xl border-2 transition-all text-center ${
                  settings.defaultMethod === method.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : method.enabled
                      ? 'border-gray-200 hover:border-gray-300 text-gray-700'
                      : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Icon className={`w-5 h-5 mx-auto mb-1 ${
                  settings.defaultMethod === method.value ? 'text-blue-600' : ''
                }`} />
                <div className="text-sm font-medium">{method.label}</div>
              </button>
            );
          })}
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Metoda e parazgjedhur do të zgjidhet automatikisht për klientët
        </p>
      </Card>

      {/* Card Payment Settings */}
      {settings.acceptsKarte && (
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Cilësimet e Kartës</h3>
          
          <div className="space-y-4">
            {/* Minimum Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Porosia Minimale për Kartë
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={settings.minimumOrderForCard || 0}
                  onChange={(e) => handleInputChange('minimumOrderForCard', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="500"
                  min="0"
                  step="50"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                  lekë
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Minimumi: {formatPrice(settings.minimumOrderForCard || 0)} €
              </p>
            </div>

            {/* Processing Fee */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Taksa e Procesimit (%)
              </label>
              <input
                type="number"
                value={settings.cardProcessingFee || 0}
                onChange={(e) => handleInputChange('cardProcessingFee', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="2.5"
                min="0"
                max="10"
                step="0.1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Taksa që aplikohet për pagesat me kartë
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Warning */}
      {getEnabledMethodsCount() === 1 && (
        <Card className="p-4 bg-orange-50 border-orange-200">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-orange-900 text-sm">Kujdes</div>
              <div className="text-orange-800 text-sm">
                Keni vetëm një metodë pagese aktive. Rekomandojmë të aktivizoni të paktën dy metoda për fleksibilitet më të madh.
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Save Button */}
      {hasChanges && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky bottom-6 flex justify-center"
        >
          <Card className="p-4 shadow-xl border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="text-sm text-gray-600">Ka ndryshime të paruajtura</div>
              <Button
                onClick={handleSave}
                loading={saving}
                size="sm"
                className="shadow-md"
                icon={<Save className="w-4 h-4" />}
                iconPosition="left"
              >
                Ruaj Ndryshimet
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};