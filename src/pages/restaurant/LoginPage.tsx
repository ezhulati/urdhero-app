import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ArrowLeft } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Header } from '../../components/layout/Header';
import { UrdheroLogo } from '../../components/ui/UrdheroLogo';
import toast from 'react-hot-toast';

export const RestaurantLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
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
    const authData = localStorage.getItem('restaurant-auth');
    if (authData) {
      const parsed = JSON.parse(authData);
      // Check if login is recent (within 24 hours)
      const loginTime = new Date(parsed.loginTime);
      const now = new Date();
      const hoursSinceLogin = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60);
      
      if (hoursSinceLogin < 24) {
        // Auto-redirect to appropriate page
        if (role === 'kitchen' || parsed.role === 'kitchen') {
          navigate('/restaurant/kitchen');
        } else {
          navigate('/restaurant/dashboard');
        }
      }
    }
  }, [navigate, role]);

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
      newErrors.email = 'Email është i detyrueshëm';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format i email-it nuk është i vlefshëm';
    }

    if (!formData.password) {
      newErrors.password = 'Fjalëkalimi është i detyrueshëm';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Fjalëkalimi duhet të ketë të paktën 6 karaktere';
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Check demo credentials
      const validCredentials = Object.values(demoCredentials).some(
        cred => cred.email === formData.email && cred.password === formData.password
      );

      if (!validCredentials) {
        setErrors({
          general: 'Email ose fjalëkalim i pasaktë. Provoni kredencialet demo.'
        });
        setLoading(false);
        return;
      }

      // Store auth state
      localStorage.setItem('restaurant-auth', JSON.stringify({
        email: formData.email,
        role: role,
        loginTime: new Date().toISOString()
      }));

      toast.success('Keni hyrë me sukses në Urdhëro!');
      
      // Redirect based on role
      if (role === 'kitchen') {
        navigate('/restaurant/kitchen');
      } else {
        navigate('/restaurant/dashboard');
      }
    } catch (error) {
      setErrors({
        general: 'Ndodhi një gabim gjatë hyrjes në Urdhëro. Provoni përsëri.'
      });
      setLoading(false);
    }
  };

  const fillDemoCredentials = (type: keyof typeof demoCredentials) => {
    setFormData(demoCredentials[type]);
    setErrors({});
  };

  const roleLabels = {
    admin: 'Administrator',
    staff: 'Personeli',
    kitchen: 'Kuzhina'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title={`Hyrje Urdhëro - ${roleLabels[role as keyof typeof roleLabels]}`} 
        showBack 
        onBackClick={() => navigate('/')}
      />
      
      <div className="max-w-md mx-auto px-4 pt-8">
        <Card className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <UrdheroLogo size="lg" showText={false} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Mirë se erdhe në Urdhëro
            </h1>
            <p className="text-gray-600">
              Hyr në sistemin e menaxhimit të restorantit
            </p>
            <p className="text-sm text-blue-700 font-medium mt-1">
              Platform për Restorante
            </p>
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
                  placeholder="emri@restorant.al"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Fjalëkalimi
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
                  placeholder="Fjalëkalimi juaj"
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
              className="w-full bg-gradient-to-r from-blue-800 to-indigo-800 hover:from-blue-900 hover:to-indigo-900"
              size="lg"
            >
              Hyr në Urdhëro
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center mb-4">
              Kredenciale demo për testim në Urdhëro:
            </p>
            <div className="space-y-2">
              {Object.entries(demoCredentials).map(([type, creds]) => (
                <button
                  key={type}
                  onClick={() => fillDemoCredentials(type as keyof typeof demoCredentials)}
                  className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="font-medium text-gray-900 capitalize">{type}</div>
                  <div className="text-sm text-gray-600">{creds.email}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Branding Footer */}
          <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500">
              Powered by Urdhëro Platform 🇦🇱
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};