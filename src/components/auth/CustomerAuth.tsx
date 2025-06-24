import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, Heart, Clock, Gift, X } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import toast from 'react-hot-toast';

interface CustomerAuthProps {
  isOpen: boolean;
  onClose: () => void;
  onGuestContinue: () => void;
  onAuthSuccess: (user: any) => void;
  context: 'checkout' | 'menu' | 'account';
}

export const CustomerAuth: React.FC<CustomerAuthProps> = ({
  isOpen,
  onClose,
  onGuestContinue,
  onAuthSuccess,
  context
}) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'benefits'>('benefits');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: ''
  });

  const benefits = [
    {
      icon: Clock,
      title: 'Histori Porosish',
      description: 'Shiko të gjitha porositë e mëparshme dhe porosit përsëri lehtë'
    },
    {
      icon: Heart,
      title: 'Artikuj të Preferuar',
      description: 'Ruaj artikujt e preferuar për qasje të shpejtë'
    },
    {
      icon: Gift,
      title: 'Ofertat Ekskluzive',
      description: 'Merr zbritje speciale dhe oferta të personalizuara'
    },
    {
      icon: User,
      title: 'Profil i Personalizuar',
      description: 'Ruaj preferencat dhe informacionin për checkout më të shpejtë'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const user = {
        id: Date.now().toString(),
        email: formData.email,
        name: formData.name || formData.email.split('@')[0],
        phone: formData.phone,
        preferences: {
          dietary: [],
          favoriteItems: [],
          defaultTable: null
        },
        orderHistory: [],
        totalOrders: 0,
        joinedAt: new Date()
      };

      // Store user in localStorage (in real app, use proper auth)
      localStorage.setItem('customer-user', JSON.stringify(user));
      
      toast.success(mode === 'login' ? 'Mirë se erdhe!' : 'Llogaria u krijua me sukses!');
      onAuthSuccess(user);
    } catch (error) {
      toast.error('Ndodhi një gabim. Provoni përsëri.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestCheckout = () => {
    toast.success('Duke vazhduar si vizitor');
    onGuestContinue();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="w-full max-w-md"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="relative overflow-hidden">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {mode === 'benefits' && (
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    Krijo Llogari për Përfitime Ekstra
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Ose vazhdo si vizitor për një porosi të shpejtë
                  </p>
                </div>

                {/* Benefits */}
                <div className="space-y-4 mb-6">
                  {benefits.map((benefit, index) => {
                    const Icon = benefit.icon;
                    return (
                      <motion.div
                        key={index}
                        className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 text-sm">{benefit.title}</h3>
                          <p className="text-xs text-gray-600">{benefit.description}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={() => setMode('signup')}
                    className="w-full"
                    size="lg"
                  >
                    Krijo Llogari Falas
                  </Button>
                  
                  <Button
                    onClick={() => setMode('login')}
                    variant="outline"
                    className="w-full"
                  >
                    Kam një llogari
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">ose</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleGuestCheckout}
                    variant="ghost"
                    className="w-full text-gray-600"
                  >
                    Vazhdo si Vizitor
                  </Button>
                </div>

                {context === 'checkout' && (
                  <p className="text-xs text-gray-500 text-center mt-4">
                    Do të mund të krijosh llogari edhe pas porosisë
                  </p>
                )}
              </div>
            )}

            {(mode === 'login' || mode === 'signup') && (
              <div className="p-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {mode === 'login' ? 'Hyr në Llogari' : 'Krijo Llogari'}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {mode === 'login' 
                      ? 'Mirë se erdhe përsëri!' 
                      : 'Bashkohu me mijëra klientë të kënaqur'
                    }
                  </p>
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                  {mode === 'signup' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Emri i plotë
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  {mode === 'signup' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Telefon (opsional)
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fjalëkalimi
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    loading={loading}
                    className="w-full"
                    size="lg"
                  >
                    {mode === 'login' ? 'Hyr' : 'Krijo Llogari'}
                  </Button>
                </form>

                <div className="mt-4 space-y-3">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">ose</span>
                    </div>
                  </div>

                  <div className="flex space-x-2 text-sm">
                    <button
                      type="button"
                      onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      {mode === 'login' ? 'Krijo llogari' : 'Kam një llogari'}
                    </button>
                    <span className="text-gray-400">•</span>
                    <button
                      type="button"
                      onClick={handleGuestCheckout}
                      className="text-gray-600 hover:text-gray-700"
                    >
                      Vazhdo si vizitor
                    </button>
                  </div>
                </div>

                {mode === 'signup' && (
                  <p className="text-xs text-gray-500 text-center mt-4">
                    Duke krijuar llogari, pranoni Termat e Përdorimit dhe Politikën e Privatësisë
                  </p>
                )}
              </div>
            )}
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};