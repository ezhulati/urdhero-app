import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Code, Home, QrCode, Menu, ShoppingCart, TrendingUp, Users, Lock, ChefHat, AlertTriangle, Utensils, Crown, Building } from 'lucide-react';

export const DeveloperBar: React.FC = () => {
  const location = useLocation();

  // Only show in development
  if (import.meta.env.PROD) {
    return null;
  }

  const routes = [
    { path: '/', label: 'User Selection', icon: Code, category: 'Main' },
    { path: '/home', label: 'Home', icon: Home, category: 'Customer' },
    { path: '/qr-landing?r=beach-bar-durres&t=A15', label: 'QR Landing', icon: QrCode, category: 'Customer' },
    { path: '/menu?r=beach-bar-durres&t=A15', label: 'Menu', icon: Menu, category: 'Customer' },
    { path: '/cart', label: 'Cart', icon: ShoppingCart, category: 'Customer' },
    { path: '/order/TN-001', label: 'Order Tracking', icon: TrendingUp, category: 'Customer' },
    { path: '/restaurant/login', label: 'Staff Login', icon: Lock, category: 'Restaurant' },
    { path: '/restaurant/dashboard', label: 'Dashboard', icon: Users, category: 'Restaurant' },
    { path: '/restaurant/dashboard?tab=menu', label: 'Menu Management', icon: Utensils, category: 'Restaurant' },
    { path: '/restaurant/kitchen', label: 'Kitchen', icon: ChefHat, category: 'Restaurant' },
    { path: '/admin/dashboard', label: 'Platform Admin', icon: Crown, category: 'Admin' },
    { path: '/venue/register', label: 'Venue Registration', icon: Building, category: 'Admin' },
    { path: '/restaurant-closed', label: 'Closed', icon: AlertTriangle, category: 'Error' },
    { path: '/network-error', label: 'Network Error', icon: AlertTriangle, category: 'Error' },
  ];

  const categories = {
    'Main': '#3B82F6',
    'Customer': '#10B981',
    'Restaurant': '#F59E0B',
    'Admin': '#8B5CF6',
    'Error': '#EF4444'
  };

  return (
    <div className="bg-gray-900 text-white px-4 py-2 text-sm border-b border-gray-700 overflow-x-auto">
      <div className="flex items-center space-x-4 min-w-max">
        <div className="flex items-center space-x-2 flex-shrink-0">
          <Code className="w-4 h-4" />
          <span className="font-medium">DEV NAVIGATION:</span>
        </div>
        
        <div className="flex items-center space-x-1">
          {routes.map((route, index) => {
            const Icon = route.icon;
            const isActive = location.pathname === route.path.split('?')[0];
            const categoryColor = categories[route.category as keyof typeof categories];
            
            return (
              <React.Fragment key={route.path}>
                {index > 0 && <span className="text-gray-600 mx-1">|</span>}
                <Link
                  to={route.path}
                  className={`flex items-center space-x-1 px-2 py-1 rounded transition-colors relative ${
                    isActive 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                  title={`${route.category} - ${route.label}`}
                >
                  <div 
                    className="w-2 h-2 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: categoryColor }}
                  />
                  <Icon className="w-3 h-3" />
                  <span className="whitespace-nowrap">{route.label}</span>
                </Link>
              </React.Fragment>
            );
          })}
        </div>

        <div className="ml-auto text-xs text-gray-400 flex-shrink-0">
          <span className="mr-4">Path: {location.pathname}{location.search}</span>
          <span>Time: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
};