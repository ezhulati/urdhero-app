import { useState } from 'react';
import { useFirebase } from './useFirebase';
import { PaymentMethod } from '../types';
import toast from 'react-hot-toast';

export const useStripePayment = (venueId: string) => {
  const [loading, setLoading] = useState(false);
  const [paymentIntent, setPaymentIntent] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const { createPaymentIntent } = useFirebase();

  const initializePayment = async (amount: number, currency: string = 'eur') => {
    setLoading(true);
    try {
      const result = await createPaymentIntent({
        venueId,
        amount,
        currency
      });
      
      setPaymentIntent(result.paymentIntent);
      setClientSecret(result.clientSecret);
      
      return result.clientSecret;
    } catch (error: any) {
      console.error('Error initializing payment:', error);
      toast.error(error.message || 'Failed to initialize payment');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const confirmCardPayment = async (paymentMethodId: string, orderData: any) => {
    setLoading(true);
    try {
      if (!clientSecret) {
        throw new Error('Payment not initialized');
      }
      
      // This would be handled by a secure cloud function in production
      // Example API call
      const response = await fetch(`${import.meta.env.VITE_API_URL}/confirm-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentIntentId: paymentIntent.id,
          paymentMethodId,
          orderData: {
            ...orderData,
            paymentMethod: PaymentMethod.KARTE
          }
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Payment failed');
      }
      
      const result = await response.json();
      
      if (result.success) {
        toast.success('Payment successful!');
        return result.order;
      } else {
        throw new Error(result.message || 'Payment failed');
      }
    } catch (error: any) {
      console.error('Error confirming payment:', error);
      toast.error(error.message || 'Payment failed');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    paymentIntent,
    clientSecret,
    initializePayment,
    confirmCardPayment
  };
};