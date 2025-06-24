import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Clock, Heart, Gift, X, Sparkles, Star, CheckCircle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import toast from 'react-hot-toast';

interface AccountCreationPromptProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateAccount: () => void;
  orderNumber?: string;
  orderTotal?: number;
}

export const AccountCreationPrompt: React.FC<AccountCreationPromptProps> = ({
  isOpen,
  onClose,
  onCreateAccount,
  orderNumber,
  orderTotal
}) => {
  const [dismissed, setDismissed] = useState(false);

  const handleDismiss = () => {
    setDismissed(true);
    toast.success('We\'ll ask again next time!');
    onClose();
  };

  const handleCreateAccount = () => {
    onCreateAccount();
    onClose();
  };

  if (!isOpen || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-full max-w-sm"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
        >
          <Card className="relative overflow-hidden">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-6 text-center">
              {/* Success Icon */}
              <motion.div
                className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
              >
                <CheckCircle className="w-8 h-8 text-green-600" />
              </motion.div>

              <h2 className="text-lg font-bold text-gray-900 mb-2">
                Order Successfully Placed!
              </h2>
              
              {orderNumber && (
                <p className="text-sm text-gray-600 mb-4">
                  Order #{orderNumber}
                  {orderTotal && ` • ${(orderTotal / 100).toFixed(2)} €`}
                </p>
              )}

              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center mb-3">
                  <Sparkles className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-blue-900 mb-2">
                  Create Account for Extra Benefits
                </h3>
                <div className="space-y-2 text-xs text-blue-700">
                  <div className="flex items-center justify-center space-x-2">
                    <Clock className="w-3 h-3" />
                    <span>Order history</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Heart className="w-3 h-3" />
                    <span>Favorite items</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Star className="w-3 h-3" />
                    <span>Earn loyalty points</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleCreateAccount}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  icon={<UserPlus className="w-4 h-4 mr-1" />}
                  iconPosition="left"
                >
                  Create Free Account
                </Button>
                
                <Button
                  onClick={handleDismiss}
                  variant="ghost"
                  className="w-full text-gray-600"
                  size="sm"
                >
                  Maybe later
                </Button>
              </div>

              <p className="text-xs text-gray-500 mt-3">
                Takes just 30 seconds to unlock all benefits
              </p>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};