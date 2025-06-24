import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFirebase } from './useFirebase';
import { useCart } from './useCart';
import { useCustomerAuth } from './useCustomerAuth';
import { useLoyalty } from './useLoyalty';
import { PaymentMethod } from '../types';
import toast from 'react-hot-toast';

export const useCheckout = (restaurantId: string, tableId: string) => {
  const [submitting, setSubmitting] = useState(false);
  const [orderNotes, setOrderNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.KESH);
  
  const navigate = useNavigate();
  const { items, clearCart, getTotalPrice } = useCart();
  const { user, isAuthenticated, addOrderToHistory } = useCustomerAuth();
  const { loyaltyUser, processOrderForLoyalty } = useLoyalty();
  const { createOrder } = useFirebase();

  const handleSubmitOrder = async () => {
    if (items.length === 0) {
      toast.error('Add items to your order first');
      return;
    }

    setSubmitting(true);
    
    try {
      // Prepare order data
      const orderData = {
        venueId: restaurantId,
        tableId,
        items: items.map(item => ({
          menuItemId: item.menuItemId,
          quantity: item.sasia,
          specialInstructions: item.instruksioneSpeciale
        })),
        customerInfo: isAuthenticated && user ? {
          name: user.name,
          email: user.email,
          phone: user.phone
        } : null,
        specialInstructions: orderNotes,
        paymentMethod
      };

      // Submit order to Firebase
      const result = await createOrder(orderData);
      
      // Process loyalty points
      if (isAuthenticated && loyaltyUser) {
        await processOrderForLoyalty(result.totalAmount, result.orderNumber);
        
        // Show loyalty success message
        const pointsToEarn = Math.round(getTotalPrice() / 100);
        toast.success(`Order placed + ${pointsToEarn} new points!`, {
          duration: 4000
        });
      } else {
        toast.success('Order placed successfully!', {
          duration: 4000
        });
      }

      // Add to order history for authenticated users
      if (isAuthenticated && user) {
        addOrderToHistory({
          numriPorosise: result.orderNumber,
          shumaTotale: result.totalAmount,
          krijuarNe: new Date()
        });
      }
      
      // Clear the cart and navigate to the tracking page
      clearCart();
      navigate(`/order/${result.orderNumber}`);
    } catch (error: any) {
      console.error('Error submitting order:', error);
      toast.error(error.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    submitting,
    orderNotes,
    setOrderNotes,
    paymentMethod,
    setPaymentMethod,
    handleSubmitOrder
  };
};