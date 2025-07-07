import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ArrowLeft, ShieldCheck, Zap, Wifi, WifiOff } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Header } from '../../components/layout/Header';
import { useRestaurantAuth } from '../../hooks/useRestaurantAuth';
import toast from 'react-hot-toast';

export const RestaurantLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    login, 
    currentUser, 
    loading: authLoading,
    isInDemoMode, 
    enableDemoMode,
    disableDemoMode,
    isFirebaseAvailable
  } = useRestaurantAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const role = searchParams.get('role') || 'staff';

  // Check if already logged in
  useEffect(() => {
    if (currentUser) {
      const redirectPath = role === 'kitchen' 
        ? '/restaurant/kitchen'
        : '/restaurant/dashboard';
        
      navigate(redirectPath);
    }
  }, [currentUser, navigate, role]);

  // Demo credentials
  const demoCredentials = {
    admin: { email: 'admin@beachbar.al', password: 'admin123' },
    staff: { email: 'staff@beachbar.al', password: 'staff123' },
    kitchen: { email: 'kitchen@beachbar.al', password: 'kitchen123' }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const claims = await login(formData.email, formData.password);
      
      // Redirect based on role and custom claims
      if (role === 'kitchen' || claims.role === 'kitchen') {
        navigate('/restaurant/kitchen');
      } else {
        navigate('/restaurant/dashboard');
      }
    } catch (error) {
      // Error handling already done in the hook with toast notifications
      setErrors({
        general: 'Login failed. Please check your credentials.'
      });
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (type: keyof typeof demoCredentials) => {
    setFormData(demoCredentials[type]);
    setErrors({});
  };

  const roleLabels: Record<string, string> = {
    admin: 'Administrator',
    staff: 'Staff',
    kitchen: 'Kitchen'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title={`Restaurant Login - ${roleLabels[role] || 'Staff'}`} 
        showBack 
        onBackClick={() => navigate('/')}
      />
      
      <div className="max-w-md mx-auto px-4 pt-8">
        <Card className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Staff Login
            </h1>
            <p className="text-gray-600">
              Access restaurant management system
            </p>

            {/* Demo Mode Indicator */}
            {isInDemoMode && (
              <div className="mt-4">
                <div className="flex items-center justify-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                  <Zap className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-800">Demo Mode Active</span>
                </div>
                {!isFirebaseAvailable && (
                  <div className="mt-2 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
                    <WifiOff className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium text-red-800">Firebase Unavailable - Using Demo Mode</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    errors.email 
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  placeholder="email@restaurant.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    errors.password 
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  placeholder="Your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* General Error */}
            {errors.general && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              loading={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              size="lg"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
            
            {/* Forgot Password */}
            <div className="text-center">
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-800"
                onClick={() => navigate('/restaurant/forgot-password')}
              >
                Forgot password?
              </button>
            </div>
          </form>

          {/* Demo Mode Controls */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-gray-700">Demo Mode</p>
                {isFirebaseAvailable ? (
                  <Badge variant="success" size="sm">
                    <Wifi className="w-3 h-3 mr-1" />
                    Firebase Connected
                  </Badge>
                ) : (
                  <Badge variant="danger" size="sm">
                    <WifiOff className="w-3 h-3 mr-1" />
                    Firebase Offline
                  </Badge>
                )}
              </div>
              <Button
                onClick={isInDemoMode ? disableDemoMode : enableDemoMode}
                variant={isInDemoMode ? "secondary" : "primary"}
                size="sm"
                className="text-xs"
              >
                {isInDemoMode ? 'Disable' : 'Enable'}
              </Button>
            </div>
            
            <p className="text-xs text-gray-500 mb-4">
              {!isFirebaseAvailable 
                ? 'Firebase is currently unavailable. Demo mode has been automatically enabled.' 
                : isInDemoMode 
                  ? 'Demo mode is active. Firebase authentication is bypassed.' 
                  : 'Enable demo mode to test without Firebase connection.'}
                  ? 'Demo mode is active. Firebase authentication is bypassed.' 
                  : 'Enable demo mode to test without Firebase connection.'}
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600 text-center mb-4">
              Demo credentials for testing:
            </p>
            <div className="space-y-2">
              {Object.entries(demoCredentials).map(([type, creds]) => (
                <button
                  key={type}
                  onClick={() => fillDemoCredentials(type as keyof typeof demoCredentials)}
                  className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 capitalize">{type}</div>
                      <div className="text-sm text-gray-600">
                        {creds.email}
                        <span className="text-xs text-gray-400 ml-2">(Password: {creds.password})</span>
                      </div>
                    </div>
                    {isInDemoMode && (
                      <Zap className="w-4 h-4 text-amber-500" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Branding Footer */}
          <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500">
              Powered by Urdhëro Platform
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {isFirebaseAvailable ? 'Connected to Firebase' : 'Offline Mode - Demo Only'}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};