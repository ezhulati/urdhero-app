import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Clock, ChefHat, Utensils, MapPin, Phone, Star, Share2, Home } from 'lucide-react';
import { Header } from '../../components/layout/Header';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { CustomerStatusBanner } from '../../components/ui/CustomerStatusBanner';
import { useCustomerAuth } from '../../hooks/useCustomerAuth';
import { useOrderTracking } from '../../hooks/useOrderTracking';
import { OrderStatus } from '../../types';
import toast from 'react-hot-toast';

export const OrderTrackingPage: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useCustomerAuth();
  const { order, loading, error, progress, estimatedTime, callWaiter } = useOrderTracking(orderNumber || '');
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(0);

  // Show feedback form when order is ready
  React.useEffect(() => {
    if (order?.statusi === OrderStatus.GATI) {
      setShowFeedback(true);
    }
  }, [order?.statusi]);

  const formatPrice = (price: number) => {
    return (price / 100).toFixed(2);
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.E_RE:
        return 'warning';
      case OrderStatus.PRANUAR:
        return 'primary';
      case OrderStatus.DUKE_U_PERGATITUR:
        return 'secondary';
      case OrderStatus.GATI:
        return 'success';
      case OrderStatus.SHERBYER:
        return 'success';
      case OrderStatus.ANULUAR:
        return 'danger';
      default:
        return 'neutral';
    }
  };

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.E_RE:
        return 'New order';
      case OrderStatus.PRANUAR:
        return 'Accepted';
      case OrderStatus.DUKE_U_PERGATITUR:
        return 'Preparing';
      case OrderStatus.GATI:
        return 'Ready';
      case OrderStatus.SHERBYER:
        return 'Served';
      case OrderStatus.ANULUAR:
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  const orderSteps = [
    { 
      key: OrderStatus.E_RE, 
      label: 'New order', 
      icon: Clock,
      description: 'Order successfully placed' 
    },
    { 
      key: OrderStatus.PRANUAR, 
      label: 'Accepted', 
      icon: CheckCircle,
      description: 'Venue accepted your order' 
    },
    { 
      key: OrderStatus.DUKE_U_PERGATITUR, 
      label: 'Preparing', 
      icon: ChefHat,
      description: 'Kitchen is preparing your order' 
    },
    { 
      key: OrderStatus.GATI, 
      label: 'Ready', 
      icon: Utensils,
      description: 'Order is ready for service' 
    }
  ];

  const getCurrentStepIndex = () => {
    if (!order) return 0;
    
    switch (order.statusi) {
      case OrderStatus.E_RE:
        return 0;
      case OrderStatus.PRANUAR:
        return 1;
      case OrderStatus.DUKE_U_PERGATITUR:
        return 2;
      case OrderStatus.GATI:
      case OrderStatus.SHERBYER:
        return 3;
      default:
        return 0;
    }
  };

  const handleShareOrder = () => {
    if (navigator.share) {
      navigator.share({
        title: `Order #${orderNumber}`,
        text: `Track my order`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleRating = (stars: number) => {
    setRating(stars);
    toast.success(`Thank you for your ${stars} ⭐ rating!`);
    // In real app, this would send rating to backend
  };

  const handleBackClick = () => {
    // Try to go to menu if we have context, otherwise home
    const urlParams = new URLSearchParams(window.location.search);
    const restaurant = urlParams.get('r') || 'beach-bar-durres';
    const table = urlParams.get('t') || 'A15';
    
    if (restaurant && table) {
      navigate(`/menu?r=${restaurant}&t=${table}`);
    } else {
      navigate('/');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Order Tracking" showBack onBackClick={handleBackClick} />
        <div className="flex items-center justify-center pt-20">
          <div className="text-center">
            <LoadingSpinner size="lg" className="mb-4" text="Loading..." />
            <p className="text-gray-600">Checking your order status</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Order Tracking" showBack onBackClick={handleBackClick} />
        
        <div className="max-w-md mx-auto px-4 pt-8">
          <Card className="text-center p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">❌</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Order not found
            </h2>
            <p className="text-gray-600 mb-6">
              {error || 'The order number is not valid.'}
            </p>
            <div className="space-y-3">
              <Button 
                onClick={() => navigate('/')} 
                className="w-full"
                icon={<Home className="w-4 h-4" />}
                iconPosition="left"
              >
                Return Home
              </Button>
              <Button onClick={() => window.location.reload()} variant="outline" className="w-full">
                Try Again
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Ensure order has required structure
  if (!order.artikujt || !Array.isArray(order.artikujt)) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Order Tracking" showBack onBackClick={handleBackClick} />
        
        <div className="max-w-md mx-auto px-4 pt-8">
          <Card className="text-center p-8">
            <LoadingSpinner size="lg" className="mb-4" text="Loading order data..." />
            <p className="text-gray-600">Please wait while we fetch your order details</p>
          </Card>
        </div>
      </div>
    );
  }

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Order Tracking" showBack onBackClick={handleBackClick} />
      
      <motion.div 
        className="max-w-md mx-auto px-4 pt-6 pb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Customer Status Banner */}
        <CustomerStatusBanner 
          user={user}
          isAuthenticated={isAuthenticated}
          currentOrder={{
            orderNumber: order.numriPorosise,
            status: order.statusi,
            estimatedTime: estimatedTime > 0 ? estimatedTime : undefined
          }}
          className="mb-4"
        />

        {/* Order Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Order #{order.numriPorosise}
                </h1>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <MapPin className="w-4 h-4 mr-1" />
                  {order.emriTavolines}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={getStatusColor(order.statusi) as any} animate>
                  {getStatusText(order.statusi)}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShareOrder}
                  className="p-2"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <ProgressBar 
                progress={progress} 
                color={order.statusi === OrderStatus.GATI ? 'green' : 'blue'}
                showPercentage={false}
              />
            </div>

            {estimatedTime > 0 && (
              <motion.div 
                className="bg-white rounded-lg p-3"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Estimated time:</span>
                  <span className="font-medium text-gray-900 flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {estimatedTime} min
                  </span>
                </div>
              </motion.div>
            )}
          </Card>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="mb-6 p-4">
            <h2 className="font-medium text-gray-900 mb-4">Order Progress</h2>
            
            <div className="space-y-4">
              {orderSteps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                
                return (
                  <motion.div 
                    key={step.key} 
                    className="flex items-center space-x-3"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <motion.div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        isCompleted 
                          ? isCurrent 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-green-600 text-white'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                      animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.div>
                    
                    <div className="flex-1">
                      <div className={`font-medium ${
                        isCompleted ? 'text-gray-900' : 'text-gray-400'
                      }`}>
                        {step.label}
                      </div>
                      <div className={`text-sm ${
                        isCompleted ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        {step.description}
                      </div>
                    </div>
                    
                    <AnimatePresence>
                      {isCompleted && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* Order Items */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="mb-6">
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-medium text-gray-900">Ordered Items</h2>
            </div>
            
            <div className="divide-y divide-gray-100">
              {order.artikujt.map((item, index) => (
                <motion.div 
                  key={index} 
                  className="p-4 flex items-center justify-between"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{item.emriArtikulli}</div>
                    <div className="text-sm text-gray-600">
                      {formatPrice(item.cmimiNjesi)} € × {item.sasia}
                    </div>
                  </div>
                  <div className="font-medium text-gray-900">
                    {formatPrice(item.cmimiTotal)} €
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="font-bold text-lg text-gray-900">
                  {formatPrice(order.shumaTotale)} €
                </span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Button
              variant="outline"
              onClick={callWaiter}
              icon={<Phone className="w-4 h-4" />}
              iconPosition="left"
            >
              Call Staff
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate(`/menu?r=${order.venueInfo?.slug || 'beach-bar-durres'}&t=${order.tableInfo?.id || 'A15'}`)}
              icon={<Utensils className="w-4 h-4" />}
              iconPosition="left"
            >
              Order Again
            </Button>
          </div>
        </motion.div>

        {/* Status Messages */}
        <AnimatePresence>
          {order.statusi === OrderStatus.GATI && (
            <motion.div
              initial={{ y: 20, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -20, opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="p-4 bg-green-50 border-green-200 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                    <Utensils className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-green-900">
                      Your order is ready! 🍽️
                    </div>
                    <div className="text-sm text-green-700">
                      Staff will bring it to your table
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feedback Section */}
        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="p-4 bg-blue-50 border-blue-200">
                <div className="text-center">
                  <h3 className="font-medium text-blue-900 mb-3">
                    How was your experience?
                  </h3>
                  <div className="flex justify-center space-x-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        key={star}
                        onClick={() => handleRating(star)}
                        className={`p-1 transition-colors ${
                          star <= rating ? 'text-yellow-500' : 'text-gray-300'
                        }`}
                        whileTap={{ scale: 0.8 }}
                        whileHover={{ scale: 1.2 }}
                      >
                        <Star className="w-6 h-6 fill-current" />
                      </motion.button>
                    ))}
                  </div>
                  {rating > 0 && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm text-blue-700"
                    >
                      Thank you for your feedback!
                    </motion.p>
                  )}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};