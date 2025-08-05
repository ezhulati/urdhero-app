import React from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, Users, Coffee, Utensils, Crown, ChefHat, UserCheck, User, LogOut, Star, Clock, Heart } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { UrdheroLogo } from '../components/ui/UrdheroLogo';
import { useCustomerAuth } from '../hooks/useCustomerAuth';

export const UserSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, login } = useCustomerAuth();

  const userScenarios = [
    {
      id: 'customer-qr',
      title: 'Customer with QR Code',
      description: 'Scan QR code from restaurant table',
      icon: QrCode,
      color: 'from-blue-700 to-blue-800',
      path: '/qr-landing?r=beach-bar-durres&t=A15',
      badge: 'Most Common'
    },
    {
      id: 'customer-walk-in',
      title: 'Walk-in Customer',
      description: 'Order without table assignment (walk-in)',
      icon: UserCheck,
      color: 'from-orange-600 to-orange-700',
      path: '/qr-landing?r=beach-bar-durres&t=walk-in',
      badge: 'Walk-in'
    },
    {
      id: 'customer-direct',
      title: 'Browse Menu Directly',
      description: 'View menu without QR validation',
      icon: Coffee,
      color: 'from-indigo-600 to-indigo-700',
      path: '/menu?r=beach-bar-durres&t=walk-in',
      badge: 'Direct Access'
    },
    {
      id: 'customer-return',
      title: 'Returning Customer',
      description: 'Continue previous order or reorder favorites',
      icon: Utensils,
      color: 'from-purple-600 to-purple-700',
      path: '/menu?r=beach-bar-durres&t=A15&returning=true',
      badge: 'Has History'
    },
    {
      id: 'staff-waiter',
      title: 'Restaurant Staff',
      description: 'Waiter or kitchen staff dashboard',
      icon: Users,
      color: 'from-orange-600 to-orange-700',
      path: '/restaurant/login?role=staff',
      badge: 'Staff'
    },
    {
      id: 'admin',
      title: 'Restaurant Manager',
      description: 'Admin panel for menu and restaurant management',
      icon: Crown,
      color: 'from-red-600 to-red-700',
      path: '/restaurant/login?role=admin',
      badge: 'Admin'
    },
    {
      id: 'kitchen',
      title: 'Kitchen Display',
      description: 'Kitchen-only order management system',
      icon: ChefHat,
      color: 'from-green-600 to-green-700',
      path: '/restaurant/kitchen',
      badge: 'Kitchen'
    }
  ];

  const adminScenarios = [
    {
      id: 'platform-admin',
      title: 'Platform Administrator',
      description: 'System-wide monitoring and management',
      icon: Crown,
      color: 'from-purple-600 to-purple-700',
      path: '/admin/dashboard',
      badge: 'Super Admin'
    },
    {
      id: 'venue-registration',
      title: 'Venue Registration',
      description: 'New restaurant onboarding process',
      icon: Users,
      color: 'from-green-600 to-green-700',
      path: '/venue/register',
      badge: 'Onboarding'
    }
  ];

  const errorScenarios = [
    {
      id: 'invalid-qr',
      title: 'Invalid QR Code',
      description: 'Test error handling for invalid QR codes',
      path: '/qr-landing?r=invalid&t=invalid'
    },
    {
      id: 'restaurant-closed',
      title: 'Restaurant Closed',
      description: 'Test closed restaurant scenario',
      path: '/restaurant-closed'
    },
    {
      id: 'network-error',
      title: 'Network Issues',
      description: 'Test offline and network error handling',
      path: '/network-error'
    },
    {
      id: 'empty-menu',
      title: 'Empty Menu',
      description: 'Test restaurant with no menu items',
      path: '/menu?r=empty-restaurant&t=A1'
    }
  ];

  const demoUsers = [
    {
      id: 'new-customer',
      name: 'Andi Marku',
      email: 'andi@demo.al',
      phone: '+355 69 123 4567',
      totalOrders: 0,
      preferences: {
        dietary: [],
        favoriteItems: [],
        defaultTable: null
      },
      orderHistory: [],
      joinedAt: new Date(),
      type: 'new',
      description: 'First-time customer'
    },
    {
      id: 'regular-customer',
      name: 'Elvira Hoxha',
      email: 'elvira@demo.al',
      phone: '+355 69 234 5678',
      totalOrders: 8,
      preferences: {
        dietary: ['vegetarian'],
        favoriteItems: ['3', '4', '7'], // Sallata Greke, Kafe Espresso, Burger Vegan
        defaultTable: 'A15'
      },
      orderHistory: [
        {
          numriPorosise: 'UR-087',
          shumaTotale: 1500,
          krijuarNe: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
        },
        {
          numriPorosise: 'UR-062',
          shumaTotale: 2200,
          krijuarNe: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 1 week ago
        }
      ],
      joinedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 2 months ago
      type: 'regular',
      description: 'Regular customer with favorites'
    },
    {
      id: 'vip-customer',
      name: 'Gentian Shehi',
      email: 'gentian@demo.al',
      phone: '+355 69 345 6789',
      totalOrders: 23,
      preferences: {
        dietary: [],
        favoriteItems: ['2', '5', '6'], // Pizza Margherita, Peshk i Grilluar, Tiramisu
        defaultTable: 'VIP-01'
      },
      orderHistory: [
        {
          numriPorosise: 'UR-145',
          shumaTotale: 4500,
          krijuarNe: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // Yesterday
        },
        {
          numriPorosise: 'UR-132',
          shumaTotale: 3800,
          krijuarNe: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) // 4 days ago
        },
        {
          numriPorosise: 'UR-118',
          shumaTotale: 5200,
          krijuarNe: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) // 10 days ago
        }
      ],
      joinedAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), // 6 months ago
      type: 'vip',
      description: 'VIP customer with extensive history'
    }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
  };

  const handleUserLogin = (demoUser: typeof demoUsers[0]) => {
    const userData = {
      id: demoUser.id,
      email: demoUser.email,
      name: demoUser.name,
      phone: demoUser.phone,
      preferences: demoUser.preferences,
      orderHistory: demoUser.orderHistory,
      totalOrders: demoUser.totalOrders,
      joinedAt: demoUser.joinedAt
    };
    
    login(userData);
  };

  const getUserTypeIcon = (type: string) => {
    switch (type) {
      case 'new': return User;
      case 'regular': return Heart;
      case 'vip': return Star;
      default: return User;
    }
  };

  const getUserTypeColor = (type: string) => {
    switch (type) {
      case 'new': return 'from-blue-600 to-blue-700';
      case 'regular': return 'from-green-600 to-green-700';
      case 'vip': return 'from-purple-600 to-purple-700';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getUserTypeBadge = (type: string) => {
    switch (type) {
      case 'new': return { variant: 'primary' as const, label: 'New Customer' };
      case 'regular': return { variant: 'success' as const, label: 'Regular' };
      case 'vip': return { variant: 'gradient' as const, label: 'VIP' };
      default: return { variant: 'neutral' as const, label: 'Customer' };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Current User Status */}
        {isAuthenticated && user && (
          <div className="mb-8">
            <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-green-900">
                      Currently logged in as: {user.name}
                    </div>
                    <div className="text-sm text-green-700">
                      {user.email} • {user.totalOrders} total orders
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="success" size="sm">
                    ✓ Authenticated
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="border-green-300 text-green-700 hover:bg-green-100"
                    icon={<LogOut className="w-4 h-4" />}
                    iconPosition="left"
                  >
                    Logout
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {!isAuthenticated && (
          <div className="mb-8">
            <Card className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Not logged in</div>
                  <div className="text-sm text-gray-600">
                    You can test customer flows as a guest or log in as a demo user below
                  </div>
                </div>
                <Badge variant="neutral" size="sm">
                  Guest Mode
                </Badge>
              </div>
            </Card>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <UrdheroLogo size="xxl" showText={false} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent">
              Urdhëro
            </span> Demo
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose your user type to experience the complete restaurant ordering platform. 
            Each scenario demonstrates different user flows and edge cases for Urdhëro.
          </p>
        </div>

        {/* Demo Users Selection */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Login as Demo User</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {demoUsers.map((demoUser) => {
              const Icon = getUserTypeIcon(demoUser.type);
              const colorClass = getUserTypeColor(demoUser.type);
              const badge = getUserTypeBadge(demoUser.type);
              const isCurrentUser = isAuthenticated && user?.email === demoUser.email;
              
              return (
                <Card
                  key={demoUser.id}
                  className={`p-6 transition-all duration-300 ${
                    isCurrentUser 
                      ? 'ring-2 ring-green-500 bg-green-50' 
                      : 'hover:shadow-lg hover:-translate-y-1'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${colorClass} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <Badge variant={badge.variant} size="sm">
                      {badge.label}
                    </Badge>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {demoUser.name}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-4">
                    {demoUser.description}
                  </p>

                  {/* User Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                    <div className="bg-gray-50 rounded-lg p-2 text-center">
                      <div className="font-semibold text-gray-900">{demoUser.totalOrders}</div>
                      <div className="text-gray-600">Orders</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2 text-center">
                      <div className="font-semibold text-gray-900">{demoUser.preferences.favoriteItems.length}</div>
                      <div className="text-gray-600">Favorites</div>
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="space-y-1 text-xs text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      Member since {new Date(demoUser.joinedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </div>
                    {demoUser.preferences.dietary.length > 0 && (
                      <div className="flex items-center">
                        <span className="text-green-600">🌱</span>
                        <span className="ml-1">{demoUser.preferences.dietary.join(', ')}</span>
                      </div>
                    )}
                    {demoUser.preferences.defaultTable && (
                      <div className="text-purple-600">
                        Preferred: {demoUser.preferences.defaultTable}
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    variant={isCurrentUser ? "success" : "primary"}
                    size="sm" 
                    className="w-full"
                    onClick={() => handleUserLogin(demoUser)}
                    disabled={isCurrentUser}
                    icon={isCurrentUser ? <User className="w-4 h-4" /> : undefined}
                    iconPosition="left"
                  >
                    {isCurrentUser ? 'Current User' : `Login as ${demoUser.name.split(' ')[0]}`}
                  </Button>
                </Card>
              );
            })}
          </div>
          <p className="text-sm text-gray-500 text-center mt-4">
            Each demo user has different order history, preferences, and loyalty status for comprehensive testing.
          </p>
        </div>

        {/* Main User Scenarios */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose User Flow</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userScenarios.map((scenario) => {
              const Icon = scenario.icon;
              return (
                <Card
                  key={scenario.id}
                  hover
                  className="p-6 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${scenario.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <Badge variant="secondary" size="sm">
                      {scenario.badge}
                    </Badge>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {scenario.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-4">
                    {scenario.description}
                  </p>
                  
                  <Button 
                    variant="primary" 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleNavigation(scenario.path)}
                  >
                    Try This Flow
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Admin & System Scenarios */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Admin & System Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {adminScenarios.map((scenario) => {
              const Icon = scenario.icon;
              return (
                <Card
                  key={scenario.id}
                  hover
                  className="p-6 transition-all duration-300 border-purple-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${scenario.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <Badge variant="gradient" size="sm">
                      {scenario.badge}
                    </Badge>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {scenario.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-4">
                    {scenario.description}
                  </p>
                  
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleNavigation(scenario.path)}
                  >
                    Access {scenario.title}
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Error & Edge Case Testing */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Error & Edge Case Testing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {errorScenarios.map((scenario) => (
              <Card
                key={scenario.id}
                hover
                className="p-4 transition-all duration-300 border-orange-200"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="text-orange-600 text-sm">⚠️</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {scenario.title}
                    </h4>
                    <p className="text-sm text-gray-600">{scenario.description}</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => handleNavigation(scenario.path)}
                >
                  Test Scenario
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Development Info */}
        <Card className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200">
          <div className="text-center">
            <h3 className="font-semibold text-gray-900 mb-2">Development Mode - Urdhëro Platform</h3>
            <p className="text-sm text-gray-600 mb-4">
              This page shows all available user flows and testing scenarios for the Urdhëro restaurant ordering platform. 
              In production, customers would typically scan a QR code directly.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant="primary" size="sm">React + TypeScript</Badge>
              <Badge variant="secondary" size="sm">Firebase Backend</Badge>
              <Badge variant="success" size="sm">PWA Ready</Badge>
              <Badge variant="warning" size="sm">Mobile First</Badge>
              <Badge variant="gradient" size="sm">🇦🇱 Made in Albania</Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};