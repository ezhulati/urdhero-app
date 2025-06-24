import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, Heart, Clock, Gift, X, Sparkles, Shield } from 'lucide-react';
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
  const [mode, setMode] = useState<'welcome' | 'login' | 'signup'>('welcome');
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
      title: 'Quick Reorder',
      description: 'Instantly reorder your favorites from order history'
    },
    {
      icon: Heart,
      title: 'Personal Favorites',
      description: 'Save dishes you love for easy access'
    },
    {
      icon: Gift,
      title: 'Exclusive Perks',
      description: 'Get special offers and early access to new items'
    },
    {
      icon: Sparkles,
      title: 'Seamless Experience',
      description: 'Smooth ordering across all your favorite venues'
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

      localStorage.setItem('customer-user', JSON.stringify(user));
      
      toast.success(mode === 'login' ? 'Welcome back!' : 'Account created successfully!');
      onAuthSuccess(user);
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestCheckout = () => {
    toast.success('Continuing as guest');
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
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 z-10 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <AnimatePresence mode="wait">
              {mode === 'welcome' && (
                <motion.div
                  key="welcome"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-6"
                >
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      Enhance Your Experience
                    </h2>
                    <p className="text-gray-600 text-sm">
                      Create an account for a more personalized ordering experience, or continue as a guest
                    </p>
                  </div>

                  {/* Benefits */}
                  <div className="space-y-3 mb-6">
                    {benefits.map((benefit, index) => {
                      const Icon = benefit.icon;
                      return (
                        <motion.div
                          key={index}
                          className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                            <Icon className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 text-sm">{benefit.title}</h3>
                            <p className="text-xs text-gray-600 mt-0.5">{benefit.description}</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button
                      onClick={() => setMode('signup')}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      size="lg"
                      icon={<User className="w-5 h-5" />}
                      iconPosition="left"
                    >
                      Create Free Account
                    </Button>
                    
                    <Button
                      onClick={() => setMode('login')}
                      variant="outline"
                      className="w-full"
                    >
                      I have an account
                    </Button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">or</span>
                      </div>
                    </div>

                    <Button
                      onClick={handleGuestCheckout}
                      variant="ghost"
                      className="w-full text-gray-600 hover:text-gray-800"
                      icon={<Shield className="w-4 h-4" />}
                      iconPosition="left"
                    >
                      Continue as Guest
                    </Button>
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-gray-500">
                      By creating an account, you agree to our Terms of Service and Privacy Policy
                    </p>
                  </div>
                </motion.div>
              )}

              {(mode === 'login' || mode === 'signup') && (
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-6"
                >
                  <div className="text-center mb-6">
                    <button
                      onClick={() => setMode('welcome')}
                      className="absolute top-4 left-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      ←
                    </button>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p className="text-gray-600 text-sm">
                      {mode === 'login' 
                        ? 'Sign in to access your account' 
                        : 'Join thousands of satisfied customers'
                      }
                    </p>
                  </div>

                  <form onSubmit={handleAuth} className="space-y-4">
                    {mode === 'signup' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your email"
                        required
                      />
                    </div>

                    {mode === 'signup' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number <span className="text-gray-400">(optional)</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter your phone number"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter your password"
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
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      size="lg"
                    >
                      {mode === 'login' ? 'Sign In' : 'Create Account'}
                    </Button>
                  </form>

                  <div className="mt-4 space-y-3">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">or</span>
                      </div>
                    </div>

                    <div className="flex space-x-2 text-sm">
                      <button
                        type="button"
                        onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        {mode === 'login' ? 'Create account' : 'Sign in instead'}
                      </button>
                      <span className="text-gray-400">•</span>
                      <button
                        type="button"
                        onClick={handleGuestCheckout}
                        className="text-gray-600 hover:text-gray-700"
                      >
                        Continue as guest
                      </button>
                    </div>
                  </div>

                  {mode === 'signup' && (
                    <p className="text-xs text-gray-500 text-center mt-4">
                      By creating an account, you agree to our Terms of Service and Privacy Policy
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};