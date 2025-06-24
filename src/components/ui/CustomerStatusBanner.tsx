import React from 'react';
import { motion } from 'framer-motion';
import { User, Clock, Star, ChefHat, CheckCircle, AlertCircle } from 'lucide-react';
import { Card } from './Card';
import { Badge } from './Badge';

interface CustomerStatusBannerProps {
  user?: {
    name: string;
    email: string;
    totalOrders: number;
  };
  isAuthenticated: boolean;
  currentOrder?: {
    orderNumber: string;
    status: string;
    estimatedTime?: number;
  };
  venue?: {
    name: string;
    type: string;
  };
  className?: string;
}

export const CustomerStatusBanner: React.FC<CustomerStatusBannerProps> = ({
  user,
  isAuthenticated,
  currentOrder,
  venue,
  className = ''
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'preparing':
        return <ChefHat className="w-4 h-4 text-orange-600" />;
      case 'ready':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'served':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return <Clock className="w-4 h-4 text-blue-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'preparing':
        return 'from-orange-50 to-amber-50 border-orange-200';
      case 'ready':
        return 'from-green-50 to-emerald-50 border-green-200';
      case 'served':
        return 'from-green-50 to-emerald-50 border-green-200';
      default:
        return 'from-blue-50 to-indigo-50 border-blue-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'new':
        return 'Order placed';
      case 'accepted':
        return 'Order confirmed';
      case 'preparing':
        return 'Being prepared';
      case 'ready':
        return 'Ready for pickup';
      case 'served':
        return 'Order complete';
      default:
        return 'Processing';
    }
  };

  // Show current order status if there's an active order
  if (currentOrder) {
    return (
      <motion.div
        className={className}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className={`p-4 bg-gradient-to-r ${getStatusColor(currentOrder.status)}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                {getStatusIcon(currentOrder.status)}
              </div>
              <div>
                <div className="font-semibold text-gray-900">
                  Order #{currentOrder.orderNumber}
                </div>
                <div className="text-sm text-gray-700">
                  {getStatusText(currentOrder.status)}
                  {currentOrder.estimatedTime && currentOrder.status === 'preparing' && (
                    <span> • ~{currentOrder.estimatedTime} min remaining</span>
                  )}
                </div>
              </div>
            </div>
            <Badge variant="secondary" size="sm">
              Live Updates
            </Badge>
          </div>
        </Card>
      </motion.div>
    );
  }

  // Show welcome banner for authenticated users
  if (isAuthenticated && user) {
    return (
      <motion.div
        className={className}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-green-900">
                Welcome back, {user.name.split(' ')[0]}!
              </div>
              <div className="text-sm text-green-700">
                {user.totalOrders > 0 
                  ? `${user.totalOrders} previous orders${venue ? ` at ${venue.name}` : ''}`
                  : `Ready to place your first order${venue ? ` at ${venue.name}` : ''}?`
                }
              </div>
            </div>
            {user.totalOrders >= 5 && (
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-500 mr-1" />
                <Badge variant="secondary" size="sm">VIP</Badge>
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    );
  }

  // Show venue info for guests
  if (venue && !isAuthenticated) {
    return (
      <motion.div
        className={className}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-900">
                Welcome to {venue.name}
              </div>
              <div className="text-sm text-gray-600">
                Browsing as guest • Create account for enhanced experience
              </div>
            </div>
            <Badge variant="neutral" size="sm">
              Guest
            </Badge>
          </div>
        </Card>
      </motion.div>
    );
  }

  return null;
};