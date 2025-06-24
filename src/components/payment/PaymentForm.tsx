import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Lock, AlertCircle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useStripePayment } from '../../hooks/useStripePayment';

// This is a mock implementation - in a real app, you would use Stripe Elements
interface PaymentFormProps {
  amount: number;
  venueId: string;
  onPaymentSuccess: (paymentData: any) => void;
  onPaymentError: (error: any) => void;
  onCancel: () => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  amount,
  venueId,
  onPaymentSuccess,
  onPaymentError,
  onCancel
}) => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { loading, initializePayment, confirmCardPayment } = useStripePayment(venueId);

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Format expiry date MM/YY
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length <= 2) {
      return v;
    }
    
    return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
  };

  // Validate the card
  const validateCard = () => {
    // Reset error
    setError(null);
    
    // Very basic validation - in a real app, use a library like card-validator
    if (cardNumber.replace(/\s+/g, '').length < 16) {
      setError('Please enter a valid card number');
      return false;
    }
    
    if (!cardHolder) {
      setError('Please enter the cardholder name');
      return false;
    }
    
    if (expiryDate.length < 5) {
      setError('Please enter a valid expiry date');
      return false;
    }
    
    if (cvv.length < 3) {
      setError('Please enter a valid CVV');
      return false;
    }
    
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateCard()) {
      return;
    }
    
    try {
      // In a real implementation, you would use Stripe.js to collect and tokenize card details
      const paymentMethodId = 'pm_card_visa'; // Mock payment method ID
      
      // Initialize payment intent
      const clientSecret = await initializePayment(amount);
      
      if (!clientSecret) {
        throw new Error('Could not initialize payment');
      }
      
      // Process payment
      const result = await confirmCardPayment(paymentMethodId, {
        amount,
        cardDetails: {
          last4: cardNumber.slice(-4),
          brand: 'visa',
          expMonth: parseInt(expiryDate.split('/')[0]),
          expYear: parseInt(expiryDate.split('/')[1])
        }
      });
      
      if (result) {
        onPaymentSuccess(result);
      } else {
        throw new Error('Payment processing failed');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      setError(error.message || 'Payment processing failed');
      onPaymentError(error);
    }
  };

  // Demo card feature - in a real app, remove this
  const fillDemoCard = () => {
    setCardNumber('4242 4242 4242 4242');
    setCardHolder('John Doe');
    setExpiryDate('12/25');
    setCvv('123');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full"
    >
      <Card className="overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
          <div className="flex items-center space-x-3">
            <CreditCard className="w-6 h-6" />
            <div>
              <h3 className="font-semibold text-lg">Secure Payment</h3>
              <p className="text-blue-100 text-sm">
                All transactions are secure and encrypted
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Card Number */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Card Number
            </label>
            <input
              type="text"
              value={cardNumber}
              onChange={e => setCardNumber(formatCardNumber(e.target.value))}
              maxLength={19}
              placeholder="1234 5678 9012 3456"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Card Holder */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Cardholder Name
            </label>
            <input
              type="text"
              value={cardHolder}
              onChange={e => setCardHolder(e.target.value)}
              placeholder="John Doe"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Expiry Date and CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Expiry Date
              </label>
              <input
                type="text"
                value={expiryDate}
                onChange={e => setExpiryDate(formatExpiryDate(e.target.value))}
                placeholder="MM/YY"
                maxLength={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                CVV
              </label>
              <input
                type="text"
                value={cvv}
                onChange={e => setCvv(e.target.value.replace(/\D/g, ''))}
                placeholder="123"
                maxLength={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* Amount */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span className="font-semibold text-gray-900">
                €{(amount / 100).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800 flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
              <div>{error}</div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600"
              icon={<Lock className="w-4 h-4" />}
              iconPosition="left"
            >
              Pay Securely
            </Button>
          </div>

          {/* Demo helper - remove in production */}
          <div className="pt-2 text-center border-t border-gray-200">
            <button
              type="button"
              onClick={fillDemoCard}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Fill with demo card
            </button>
            <div className="text-xs text-gray-500 mt-1">
              <Lock className="w-3 h-3 inline mr-1" />
              All payments are processed securely
            </div>
          </div>
        </form>
      </Card>
    </motion.div>
  );
};