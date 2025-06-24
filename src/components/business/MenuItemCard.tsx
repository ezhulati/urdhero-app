import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Clock, Leaf, Heart, AlertCircle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { MenuItem } from '../../types';
import { useCart } from '../../hooks/useCart';
import { useCustomerAuth } from '../../hooks/useCustomerAuth';

interface MenuItemCardProps {
  item: MenuItem;
  featured?: boolean;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, featured = false }) => {
  const { addItem, getItemCount, updateQuantity } = useCart();
  const { isAuthenticated, isFavorite, addToFavorites, removeFromFavorites } = useCustomerAuth();
  const [isAdding, setIsAdding] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const cartQuantity = getItemCount(item.id);
  const isItemFavorite = isFavorite(item.id);

  const formatPrice = (price: number) => {
    return (price / 100).toFixed(2);
  };

  const handleAddToCart = useCallback(async () => {
    if (!item.eshteIGatshem || isAdding) return;
    
    setIsAdding(true);
    
    try {
      // Add haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
      
      addItem(item, 1);
      
      // Visual feedback delay
      await new Promise(resolve => setTimeout(resolve, 300));
    } finally {
      setIsAdding(false);
    }
  }, [item, addItem, isAdding]);

  const handleIncrement = useCallback(() => {
    if (!item.eshteIGatshem) return;
    addItem(item, 1);
    
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
  }, [item, addItem]);

  const handleDecrement = useCallback(() => {
    if (cartQuantity > 0) {
      updateQuantity(item.id, cartQuantity - 1);
      
      if (navigator.vibrate) {
        navigator.vibrate(30);
      }
    }
  }, [item.id, cartQuantity, updateQuantity]);

  const toggleFavorite = useCallback(() => {
    if (!isAuthenticated) return;
    
    if (isItemFavorite) {
      removeFromFavorites(item.id);
    } else {
      addToFavorites(item.id);
    }
    
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
  }, [isAuthenticated, isItemFavorite, item.id, addToFavorites, removeFromFavorites]);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      layout
    >
      <Card 
        hover={item.eshteIGatshem} 
        className={`overflow-hidden ${!item.eshteIGatshem ? 'opacity-75' : ''} ${featured ? 'ring-2 ring-blue-200' : ''}`}
        data-testid="menu-item-card"
      >
        <div className="flex space-x-4">
          {/* Image */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden relative group">
              {item.imazhi ? (
                <>
                  <motion.img
                    src={item.imazhi}
                    alt={item.emri}
                    className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-110 ${
                      imageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    loading="lazy"
                    onLoad={() => setImageLoaded(true)}
                  />
                  {!imageLoaded && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-2xl">🍽️</span>
                </div>
              )}
              
              {/* Favorite Button */}
              {isAuthenticated && (
                <motion.button
                  onClick={toggleFavorite}
                  className="absolute top-1 right-1 p-1 rounded-full bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  whileTap={{ scale: 0.8 }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Heart 
                    className={`w-3 h-3 transition-colors ${
                      isItemFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
                    }`} 
                  />
                </motion.button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {item.emri}
                  </h3>
                  {featured && (
                    <Badge variant="gradient" size="sm" animate>
                      ⭐ Popular
                    </Badge>
                  )}
                  {isAuthenticated && isItemFavorite && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500 }}
                    >
                      <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                    </motion.div>
                  )}
                </div>
                
                <p className="text-sm text-gray-600 line-clamp-2 mb-2 leading-relaxed">
                  {item.pershkrimi}
                </p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  <AnimatePresence>
                    {item.eshteVegan && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                      >
                        <Badge variant="success" size="sm">
                          <Leaf className="w-3 h-3 mr-1" />
                          Vegan
                        </Badge>
                      </motion.div>
                    )}
                    {item.eshteVegetarian && !item.eshteVegan && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                      >
                        <Badge variant="secondary" size="sm">
                          <Leaf className="w-3 h-3 mr-1" />
                          Vegetarian
                        </Badge>
                      </motion.div>
                    )}
                    {item.kohaPergatitjes && (
                      <Badge variant="neutral" size="sm">
                        <Clock className="w-3 h-3 mr-1" />
                        {item.kohaPergatitjes}min
                      </Badge>
                    )}
                    {!item.eshteIGatshem && (
                      <Badge variant="warning" size="sm" pulse>
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Jo i gatshëm
                      </Badge>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Price and Actions */}
              <div className="flex flex-col items-end space-y-3 ml-4">
                <motion.span 
                  className="font-bold text-lg text-gray-900"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  {formatPrice(item.cmimi)} €
                </motion.span>

                <AnimatePresence mode="wait">
                  {!item.eshteIGatshem ? (
                    <motion.div
                      key="unavailable"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <Button 
                        variant="outline" 
                        size="sm" 
                        disabled
                        className="text-gray-400 border-gray-300 min-w-[80px]"
                      >
                        Jo i gatshëm
                      </Button>
                    </motion.div>
                  ) : cartQuantity === 0 ? (
                    <motion.div
                      key="add"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleAddToCart}
                        loading={isAdding}
                        disabled={isAdding}
                        data-testid="add-to-cart-button"
                        className="min-w-[80px]"
                        icon={<Plus className="w-4 h-4" />}
                      >
                        Shto
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="quantity"
                      className="flex items-center space-x-2 bg-gray-50 rounded-xl p-1"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      layout
                    >
                      <motion.button
                        onClick={handleDecrement}
                        className="w-8 h-8 rounded-lg bg-white shadow-sm hover:bg-gray-50 flex items-center justify-center transition-colors"
                        whileTap={{ scale: 0.9 }}
                      >
                        <Minus className="w-4 h-4 text-gray-600" />
                      </motion.button>
                      
                      <motion.span 
                        className="w-8 text-center font-medium text-gray-900"
                        key={cartQuantity}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        {cartQuantity}
                      </motion.span>
                      
                      <motion.button
                        onClick={handleIncrement}
                        className="w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition-colors"
                        whileTap={{ scale: 0.9 }}
                      >
                        <Plus className="w-4 h-4 text-white" />
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};