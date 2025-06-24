import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, MoreVertical, User, LogOut, Heart, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { UrdheroLogo, UrdheroLogoCompact } from '../ui/UrdheroLogo';
import { LanguageSelector } from '../ui/LanguageSelector';
import { CustomerAuth } from '../auth/CustomerAuth';
import { CustomerProfile } from '../profile/CustomerProfile';
import { useCart } from '../../hooks/useCart';
import { useCustomerAuth } from '../../hooks/useCustomerAuth';
import { useLanguage } from '../../hooks/useTranslation';
import { getTranslation } from '../../translations';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  backTo?: string;
  showCart?: boolean;
  showMenu?: boolean;
  showLanguage?: boolean;
  onBackClick?: () => void;
  actions?: React.ReactNode;
  transparent?: boolean;
  children?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  backTo = '/',
  showCart = false,
  showMenu = false,
  showLanguage = false,
  onBackClick,
  actions,
  transparent = false,
  children
}) => {
  const { getTotalItems } = useCart();
  const { user, isAuthenticated, logout } = useCustomerAuth();
  const { language } = useLanguage();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const cartItemCount = getTotalItems();

  const t = (key: string) => getTranslation(language, key);

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      window.history.back();
    }
  };

  const handleAuthSuccess = (userData: any) => {
    setShowAuthModal(false);
  };

  const handleUserMenuClick = () => {
    if (isAuthenticated) {
      setShowUserMenu(!showUserMenu);
    } else {
      setShowAuthModal(true);
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  const isCustomerPage = location.pathname.includes('/menu') || 
                        location.pathname.includes('/cart') || 
                        location.pathname.includes('/order') ||
                        location.pathname.includes('/qr-landing');

  return (
    <>
      <motion.header
        className={`
          sticky top-0 z-50 transition-all duration-300
          ${transparent 
            ? 'bg-white/70 backdrop-blur-xl border-b border-white/20' 
            : 'bg-white/95 backdrop-blur-md border-b border-gray-200/50'
          }
        `}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left Section */}
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <AnimatePresence>
                {showBack && (
                  <motion.button
                    onClick={handleBackClick}
                    className="p-2 -ml-2 rounded-xl hover:bg-gray-100/80 transition-colors active:scale-95"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                  </motion.button>
                )}
              </AnimatePresence>

              {title ? (
                <motion.h1
                  className="text-lg font-semibold text-gray-900 truncate"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {title}
                </motion.h1>
              ) : (
                <Link to="/" className="flex items-center group">
                  <UrdheroLogo size="sm" animated showText />
                </Link>
              )}
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-2">
              {children}
              {actions}
              
              {/* Language Selector */}
              {showLanguage && (
                <LanguageSelector variant="compact" />
              )}
              
              {/* User Account Button (only on customer pages) */}
              {isCustomerPage && (
                <div className="relative">
                  <motion.button
                    onClick={handleUserMenuClick}
                    className="relative p-2 rounded-xl hover:bg-gray-100/80 transition-all active:scale-95"
                    whileTap={{ scale: 0.9 }}
                  >
                    <User className={`w-6 h-6 transition-colors ${
                      isAuthenticated ? 'text-blue-600' : 'text-gray-600'
                    }`} />
                    {isAuthenticated && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </motion.button>

                  {/* User Menu Dropdown */}
                  <AnimatePresence>
                    {showUserMenu && isAuthenticated && (
                      <motion.div
                        className="absolute right-0 top-full mt-2 w-64 z-50"
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.15 }}
                      >
                        <Card className="p-4 shadow-xl border-gray-200">
                          <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-gray-900 truncate">{user?.name}</div>
                              <div className="text-sm text-gray-600 truncate">{user?.email}</div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start"
                              onClick={() => {
                                setShowProfile(true);
                                setShowUserMenu(false);
                              }}
                              icon={<User className="w-4 h-4" />}
                              iconPosition="left"
                            >
                              {t('nav.profile')}
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start"
                              icon={<Heart className="w-4 h-4" />}
                              iconPosition="left"
                            >
                              Të Preferuar ({user?.preferences.favoriteItems.length || 0})
                            </Button>
                            
                            <hr className="my-2" />
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start text-red-600 hover:bg-red-50"
                              onClick={handleLogout}
                              icon={<LogOut className="w-4 h-4" />}
                              iconPosition="left"
                            >
                              {t('nav.logout')}
                            </Button>
                          </div>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
              
              <AnimatePresence>
                {showCart && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Link
                      to="/cart"
                      className="relative p-2 rounded-xl hover:bg-gray-100/80 transition-all active:scale-95 group"
                      data-testid="cart-button"
                    >
                      <ShoppingCart className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
                      <AnimatePresence>
                        {cartItemCount > 0 && (
                          <motion.div
                            className="absolute -top-1 -right-1"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            transition={{ type: "spring", stiffness: 500 }}
                            key={cartItemCount}
                          >
                            <Badge variant="danger" size="sm" animate data-testid="cart-badge">
                              {cartItemCount > 99 ? '99+' : cartItemCount}
                            </Badge>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>

              {showMenu && (
                <motion.button
                  className="p-2 rounded-xl hover:bg-gray-100/80 transition-colors active:scale-95"
                  whileTap={{ scale: 0.9 }}
                >
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Backdrop for dropdowns */}
      <AnimatePresence>
        {showUserMenu && (
          <motion.div
            className="fixed inset-0 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowUserMenu(false)}
          />
        )}
      </AnimatePresence>

      {/* Authentication Modal */}
      <CustomerAuth
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onGuestContinue={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
        context="account"
      />

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfile && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-4 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowProfile(false)}
          >
            <motion.div
              className="w-full max-w-md mt-8 mb-8"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gray-50 rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between p-4 bg-white border-b">
                  <h2 className="font-semibold text-gray-900">{t('nav.profile')}</h2>
                  <button
                    onClick={() => setShowProfile(false)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="p-4">
                  <CustomerProfile onClose={() => setShowProfile(false)} />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};