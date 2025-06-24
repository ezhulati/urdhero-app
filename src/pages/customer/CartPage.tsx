import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, Clock, ArrowRight, MessageCircle, CreditCard, Banknote, ShoppingBag, User, UserPlus, AlertCircle, Smartphone, Star, Gift } from 'lucide-react';
import { Header } from '../../components/layout/Header';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { LoyaltyWidget } from '../../components/loyalty/LoyaltyWidget';
import { CustomerAuth } from '../../components/auth/CustomerAuth';
import { AccountCreationPrompt } from '../../components/auth/AccountCreationPrompt';
import { useCart } from '../../hooks/useCart';
import { useCustomerAuth } from '../../hooks/useCustomerAuth';
import { useLoyalty } from '../../hooks/useLoyalty';
import { Restaurant, PaymentMethod } from '../../types';
import toast from 'react-hot-toast';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { items, updateQuantity, removeItem, getTotalPrice, getTotalItems, clearCart } = useCart();
  const { user, isAuthenticated, addOrderToHistory } = useCustomerAuth();
  const { loyaltyUser, processOrderForLoyalty, awardPoints } = useLoyalty();
  const [submitting, setSubmitting] = useState(false);
  const [orderNotes, setOrderNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.KESH);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAccountPrompt, setShowAccountPrompt] = useState(false);
  const [lastOrderNumber, setLastOrderNumber] = useState<string>('');
  const [proceedAsGuest, setProceedAsGuest] = useState(false);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [pointsToEarn, setPointsToEarn] = useState(0);

  const restaurantSlug = searchParams.get('r') || 'beach-bar-durres';

  useEffect(() => {
    loadRestaurantSettings();
  }, [restaurantSlug]);

  useEffect(() => {
    // Calculate points that will be earned from this order
    if (loyaltyUser) {
      const basePoints = Math.round(getTotalPrice() / 100);
      const multiplier = loyaltyUser ? 1.25 : 1; // Example multiplier for loyalty members
      setPointsToEarn(Math.round(basePoints * multiplier));
    }
  }, [getTotalPrice(), loyaltyUser]);

  const loadRestaurantSettings = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const mockRestaurant: Restaurant = {
        id: '1',
        emri: 'Beach Bar Durrës',
        slug: 'beach-bar-durres',
        email: 'admin@beachbar.al',
        paymentSettings: {
          acceptsKesh: true,
          acceptsKarte: true,
          acceptsDigital: false,
          defaultMethod: PaymentMethod.KESH,
          minimumOrderForCard: 500,
          cardProcessingFee: 2.5
        },
        eshteAktiv: true,
        krijuarNe: new Date(),
        perditesuesNe: new Date()
      };

      setRestaurant(mockRestaurant);
      
      if (mockRestaurant.paymentSettings?.defaultMethod) {
        setPaymentMethod(mockRestaurant.paymentSettings.defaultMethod);
      }
    } catch (error) {
      console.error('Error loading restaurant settings:', error);
      toast.error('Gabim në ngarkimin e cilësimeve');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return (price / 100).toFixed(2);
  };

  const handleQuantityChange = (itemId: string, newQuantity: number, specialInstructions?: string) => {
    if (newQuantity <= 0) {
      removeItem(itemId, specialInstructions);
    } else {
      updateQuantity(itemId, newQuantity, specialInstructions);
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Shto artikuj në porosi para se ta urdhërosh');
      return;
    }

    if (paymentMethod === PaymentMethod.KARTE && restaurant?.paymentSettings?.minimumOrderForCard) {
      const minOrder = restaurant.paymentSettings.minimumOrderForCard;
      if (getTotalPrice() < minOrder) {
        toast.error(`Porosi minimale për kartë: ${formatPrice(minOrder)} €`);
        return;
      }
    }

    if (isAuthenticated || proceedAsGuest) {
      handleSubmitOrder();
    } else {
      setShowAuthModal(true);
    }
  };

  const handleAuthSuccess = (userData: any) => {
    setShowAuthModal(false);
    toast.success('Mirë se erdhe në Urdhëro! Tani mund të vazhdosh me porosinë.');
    handleSubmitOrder();
  };

  const handleGuestContinue = () => {
    setShowAuthModal(false);
    setProceedAsGuest(true);
    toast.success('Duke vazhduar si vizitor në Urdhëro');
    handleSubmitOrder();
  };

  const handleSubmitOrder = async () => {
    setSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const orderNumber = `UR-${Date.now().toString().slice(-6)}`;
      setLastOrderNumber(orderNumber);

      let finalTotal = getTotalPrice();
      if (paymentMethod === PaymentMethod.KARTE && restaurant?.paymentSettings?.cardProcessingFee) {
        const feeAmount = Math.round(finalTotal * (restaurant.paymentSettings.cardProcessingFee / 100));
        finalTotal += feeAmount;
      }

      const orderData = {
        numriPorosise: orderNumber,
        artikujt: items,
        shumaTotale: finalTotal,
        orderNotes,
        paymentMethod,
        isGuest: !isAuthenticated,
        krijuarNe: new Date()
      };

      // Process loyalty points if user is a loyalty member
      if (isAuthenticated && loyaltyUser) {
        await processOrderForLoyalty(finalTotal, orderNumber);
        
        // Show loyalty success message
        toast.success(`Porosia u urdhërua + ${pointsToEarn} pikë të reja!`, {
          duration: 4000
        });
      }

      if (isAuthenticated && user) {
        addOrderToHistory(orderData);
      }
      
      clearCart();
      
      if (!loyaltyUser) {
        toast.success('Porosia u urdhërua me sukses përmes Urdhëro!', {
          duration: 4000
        });
      }

      if (!isAuthenticated) {
        setTimeout(() => {
          setShowAccountPrompt(true);
        }, 1000);
      }
      
      navigate(`/order/${orderNumber}`);
    } catch (error) {
      toast.error('Ndodhi një gabim. Provoni përsëri.');
    } finally {
      setSubmitting(false);
    }
  };

  const getAvailablePaymentMethods = () => {
    if (!restaurant?.paymentSettings) {
      return [PaymentMethod.KESH];
    }

    const methods = [];
    if (restaurant.paymentSettings.acceptsKesh) {
      methods.push(PaymentMethod.KESH);
    }
    if (restaurant.paymentSettings.acceptsKarte) {
      methods.push(PaymentMethod.KARTE);
    }
    if (restaurant.paymentSettings.acceptsDigital) {
      methods.push(PaymentMethod.DIGITAL);
    }

    return methods;
  };

  const getPaymentMethodInfo = (method: PaymentMethod) => {
    switch (method) {
      case PaymentMethod.KESH:
        return { icon: Banknote, label: 'Kesh', description: 'Pagesa me para fizike' };
      case PaymentMethod.KARTE:
        return { icon: CreditCard, label: 'Kartë', description: 'Kartë debiti/kredit' };
      case PaymentMethod.DIGITAL:
        return { icon: Smartphone, label: 'Digjitale', description: 'Apple Pay, Google Pay' };
    }
  };

  const isPaymentMethodAvailable = (method: PaymentMethod) => {
    return getAvailablePaymentMethods().includes(method);
  };

  const getCardProcessingFee = () => {
    if (paymentMethod === PaymentMethod.KARTE && restaurant?.paymentSettings?.cardProcessingFee) {
      return Math.round(getTotalPrice() * (restaurant.paymentSettings.cardProcessingFee / 100));
    }
    return 0;
  };

  const estimatedTime = Math.max(15, items.reduce((total, item) => {
    return total + (item.menuItem.kohaPergatitjes || 10) * item.sasia;
  }, 0));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -300, transition: { duration: 0.3 } }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Porosia Urdhëro" showBack showCart={false} />
        <div className="flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Duke ngarkuar Urdhëro...</p>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Porosia Urdhëro" showBack showCart={false} />
        
        <div className="max-w-md mx-auto px-4 pt-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="text-center p-8">
              <motion.div
                className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6"
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              >
                <ShoppingBag className="w-12 h-12 text-gray-400" />
              </motion.div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Porosia është bosh
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Kur të shtosh artikuj nga menuja, ato do të shfaqen këtu për të vazhduar me urdhërimin përmes Urdhëro.
              </p>
              <Button 
                onClick={() => navigate(`/menu?r=${restaurantSlug}&t=A15`)}
                className="w-full"
                size="lg"
              >
                Eksploro Menunë
              </Button>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  const availablePaymentMethods = getAvailablePaymentMethods();
  const cardFee = getCardProcessingFee();
  const finalTotal = getTotalPrice() + cardFee;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Porosia Urdhëro" showBack showCart={false} />
      
      <motion.div 
        className="max-w-md mx-auto px-4 pt-6 pb-32"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* User Status */}
        {!isAuthenticated && !proceedAsGuest && (
          <motion.div variants={itemVariants}>
            <Card className="mb-4 p-4 bg-blue-50 border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <UserPlus className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-blue-900 text-sm">Krijo llogari Urdhëro për përfitime</div>
                    <div className="text-xs text-blue-700">Histori porosish, artikuj të preferuar dhe më shumë</div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAuthModal(true)}
                  className="border-blue-300 text-blue-700 hover:bg-blue-100 flex items-center"
                  icon={<User className="w-4 h-4" />}
                  iconPosition="left"
                >
                  Krijo
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {isAuthenticated && user && (
          <motion.div variants={itemVariants}>
            <Card className="mb-4 p-4 bg-green-50 border-green-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-medium text-green-900 text-sm">Mirë se erdhe në Urdhëro, {user.name}!</div>
                  <div className="text-xs text-green-700">
                    {user.totalOrders > 0 ? `${user.totalOrders} porosi të mëparshme` : 'Porosia e parë në Urdhëro'}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Loyalty Widget */}
        {isAuthenticated && (
          <motion.div variants={itemVariants} className="mb-4">
            <LoyaltyWidget compact={true} />
          </motion.div>
        )}

        {/* Points Preview for this order */}
        {loyaltyUser && pointsToEarn > 0 && (
          <motion.div variants={itemVariants}>
            <Card className="mb-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <Star className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-medium text-yellow-900 text-sm">
                    +{pointsToEarn} pikë nga kjo porosi!
                  </div>
                  <div className="text-xs text-yellow-700">
                    Loyalty multiplier aktiv ({loyaltyUser?.tier ? 1.25 : 1}x)
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Order Summary */}
        <motion.div variants={itemVariants}>
          <Card className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-gray-900 text-lg">
                  {getTotalItems()} artikuj
                </div>
                <div className="text-sm text-gray-600 flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  Koha e vlerësuar: ~{estimatedTime} min
                </div>
              </div>
              <div className="text-right">
                <motion.div 
                  className="text-2xl font-bold text-gray-900"
                  key={finalTotal}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  {formatPrice(finalTotal)} €
                </motion.div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Cart Items */}
        <motion.div className="space-y-4 mb-6">
          <AnimatePresence>
            {items.map((item, index) => (
              <motion.div
                key={`${item.menuItemId}-${index}`}
                variants={itemVariants}
                layout
                exit="exit"
              >
                <Card className="p-4 overflow-hidden">
                  <div className="flex items-start space-x-4">
                    {/* Item Image */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden relative group">
                        {item.menuItem.imazhi ? (
                          <img
                            src={item.menuItem.imazhi}
                            alt={item.emriArtikulli}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-xl">🍽️</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {item.emriArtikulli}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {formatPrice(item.cmimiNjesi)} € × {item.sasia}
                      </p>
                      
                      {item.instruksioneSpeciale && (
                        <motion.div 
                          className="mt-2"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                        >
                          <Badge variant="neutral" size="sm">
                            <MessageCircle className="w-3 h-3 mr-1" />
                            {item.instruksioneSpeciale}
                          </Badge>
                        </motion.div>
                      )}

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-2 bg-gray-50 rounded-xl p-1">
                          <motion.button
                            onClick={() => handleQuantityChange(item.menuItemId, item.sasia - 1, item.instruksioneSpeciale)}
                            className="w-8 h-8 rounded-lg bg-white shadow-sm hover:bg-gray-50 flex items-center justify-center transition-colors"
                            whileTap={{ scale: 0.9 }}
                            whileHover={{ scale: 1.05 }}
                          >
                            <Minus className="w-4 h-4 text-gray-600" />
                          </motion.button>
                          <motion.span 
                            className="w-8 text-center font-medium text-gray-900"
                            key={item.sasia}
                            initial={{ scale: 1.2 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 400 }}
                          >
                            {item.sasia}
                          </motion.span>
                          <motion.button
                            onClick={() => handleQuantityChange(item.menuItemId, item.sasia + 1, item.instruksioneSpeciale)}
                            className="w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition-colors"
                            whileTap={{ scale: 0.9 }}
                            whileHover={{ scale: 1.05 }}
                          >
                            <Plus className="w-4 h-4 text-white" />
                          </motion.button>
                        </div>

                        <div className="flex items-center space-x-3">
                          <span className="font-semibold text-gray-900">
                            {formatPrice(item.cmimiTotal)} €
                          </span>
                          <motion.button
                            onClick={() => removeItem(item.menuItemId, item.instruksioneSpeciale)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            whileTap={{ scale: 0.9 }}
                            whileHover={{ scale: 1.1 }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Order Notes */}
        <motion.div variants={itemVariants}>
          <Card className="mb-6 p-4">
            <h3 className="font-medium text-gray-900 mb-3 flex items-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              Instruksione Speciale
            </h3>
            <textarea
              placeholder="Shto komente për porosinë (opsionale)..."
              rows={3}
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all"
            />
          </Card>
        </motion.div>

        {/* Payment Method */}
        <motion.div variants={itemVariants}>
          <Card className="mb-6 p-4">
            <h3 className="font-medium text-gray-900 mb-3">Metoda e Pagesës</h3>
            
            {availablePaymentMethods.length === 1 ? (
              <div className="p-3 rounded-xl border-2 border-blue-200 bg-blue-50">
                <div className="flex items-center space-x-3">
                  {React.createElement(getPaymentMethodInfo(availablePaymentMethods[0]).icon, {
                    className: "w-5 h-5 text-blue-600"
                  })}
                  <div>
                    <div className="font-medium text-blue-900">
                      {getPaymentMethodInfo(availablePaymentMethods[0]).label}
                    </div>
                    <div className="text-sm text-blue-700">
                      E vetmja metodë e disponueshme
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {[PaymentMethod.KESH, PaymentMethod.KARTE, PaymentMethod.DIGITAL].map(method => {
                  const methodInfo = getPaymentMethodInfo(method);
                  const Icon = methodInfo.icon;
                  const isAvailable = isPaymentMethodAvailable(method);
                  const isMinimumMet = method !== PaymentMethod.KARTE || 
                    !restaurant?.paymentSettings?.minimumOrderForCard ||
                    getTotalPrice() >= restaurant.paymentSettings.minimumOrderForCard;

                  if (!isAvailable) return null;

                  return (
                    <motion.button
                      key={method}
                      onClick={() => isMinimumMet && setPaymentMethod(method)}
                      disabled={!isMinimumMet}
                      className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center ${
                        paymentMethod === method
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : isMinimumMet
                            ? 'border-gray-200 hover:border-gray-300'
                            : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                      }`}
                      whileTap={isMinimumMet ? { scale: 0.98 } : {}}
                    >
                      <Icon className="w-5 h-5 mb-1" />
                      <div className="text-sm font-medium">{methodInfo.label}</div>
                      {!isMinimumMet && method === PaymentMethod.KARTE && (
                        <div className="text-xs text-red-500 mt-1">
                          Min. {formatPrice(restaurant?.paymentSettings?.minimumOrderForCard || 0)} €
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            )}

            {/* Card Fee Notice */}
            {paymentMethod === PaymentMethod.KARTE && cardFee > 0 && (
              <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <div className="font-medium text-orange-900">Taksa procesimi kartë</div>
                    <div className="text-orange-700">
                      +{formatPrice(cardFee)} € ({restaurant?.paymentSettings?.cardProcessingFee}%)
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </motion.div>
      </motion.div>

      {/* Fixed Bottom Bar */}
      <motion.div 
        className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 p-4 shadow-2xl"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        <div className="max-w-md mx-auto">
          <motion.div
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={handleCheckout}
              loading={submitting}
              size="lg"
              className="w-full shadow-lg hover:shadow-xl bg-gradient-to-r from-blue-800 to-indigo-800 hover:from-blue-900 hover:to-indigo-900 flex items-center justify-center"
              disabled={submitting}
              icon={!submitting ? <ArrowRight className="w-5 h-5" /> : undefined}
              iconPosition="right"
            >
              {submitting ? 'Duke urdhëruar...' : 'Urdhëro Tani'}
            </Button>
          </motion.div>
          
          <div className="flex items-center justify-between mt-3 text-sm text-gray-600">
            <span>Total: {formatPrice(finalTotal)} €</span>
            <span>Koha: ~{estimatedTime} min</span>
            <div className="flex items-center">
              {React.createElement(getPaymentMethodInfo(paymentMethod).icon, {
                className: "w-4 h-4 mr-1"
              })}
              <span>{getPaymentMethodInfo(paymentMethod).label}</span>
            </div>
          </div>
          
          {/* Points preview in bottom bar */}
          {loyaltyUser && pointsToEarn > 0 && (
            <div className="flex items-center justify-center mt-2 text-xs text-yellow-600">
              <Star className="w-3 h-3 mr-1" />
              <span>+{pointsToEarn} pikë loyalty pas porosisë</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Authentication Modal */}
      <CustomerAuth
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onGuestContinue={handleGuestContinue}
        onAuthSuccess={handleAuthSuccess}
        context="checkout"
      />

      {/* Account Creation Prompt (after order as guest) */}
      <AccountCreationPrompt
        isOpen={showAccountPrompt}
        onClose={() => setShowAccountPrompt(false)}
        onCreateAccount={() => {
          setShowAccountPrompt(false);
          setShowAuthModal(true);
        }}
        orderNumber={lastOrderNumber}
        orderTotal={getTotalPrice()}
      />
    </div>
  );
};