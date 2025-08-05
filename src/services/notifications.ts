/**
 * Notification service for SMS and Email communications
 */

import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase/config';

// SMS Service Implementation
export class SMSService {
  private static instance: SMSService;
  private smsFunction = httpsCallable(functions, 'sendSMS');

  static getInstance(): SMSService {
    if (!SMSService.instance) {
      SMSService.instance = new SMSService();
    }
    return SMSService.instance;
  }

  /**
   * Send order confirmation SMS
   */
  async sendOrderConfirmation(data: {
    phoneNumber: string;
    orderNumber: string;
    restaurantName: string;
    estimatedTime: number;
    language?: string;
  }): Promise<boolean> {
    try {
      const message = this.formatOrderConfirmationMessage(data);
      
      const result = await this.smsFunction({
        to: data.phoneNumber,
        message,
        type: 'order_confirmation'
      });

      return result.data.success;
    } catch (error) {
      console.error('Failed to send order confirmation SMS:', error);
      return false;
    }
  }

  /**
   * Send order status update SMS
   */
  async sendStatusUpdate(data: {
    phoneNumber: string;
    orderNumber: string;
    status: string;
    restaurantName: string;
    message?: string;
    language?: string;
  }): Promise<boolean> {
    try {
      const message = this.formatStatusUpdateMessage(data);
      
      const result = await this.smsFunction({
        to: data.phoneNumber,
        message,
        type: 'status_update'
      });

      return result.data.success;
    } catch (error) {
      console.error('Failed to send status update SMS:', error);
      return false;
    }
  }

  /**
   * Send promotional SMS
   */
  async sendPromotion(data: {
    phoneNumber: string;
    customerName: string;
    promotionDetails: string;
    expiryDate?: Date;
    language?: string;
  }): Promise<boolean> {
    try {
      const message = this.formatPromotionMessage(data);
      
      const result = await this.smsFunction({
        to: data.phoneNumber,
        message,
        type: 'promotion'
      });

      return result.data.success;
    } catch (error) {
      console.error('Failed to send promotion SMS:', error);
      return false;
    }
  }

  private formatOrderConfirmationMessage(data: any): string {
    const { orderNumber, restaurantName, estimatedTime, language = 'sq' } = data;
    
    const messages = {
      sq: `✅ Porosia juaj #${orderNumber} u pranua nga ${restaurantName}! Koha e vlerësuar: ${estimatedTime} min. Ndiqni progresin: urdhero.al/order/${orderNumber}`,
      en: `✅ Your order #${orderNumber} was accepted by ${restaurantName}! Estimated time: ${estimatedTime} min. Track progress: urdhero.al/order/${orderNumber}`,
      it: `✅ Il tuo ordine #${orderNumber} è stato accettato da ${restaurantName}! Tempo stimato: ${estimatedTime} min. Traccia: urdhero.al/order/${orderNumber}`
    };

    return messages[language as keyof typeof messages] || messages.sq;
  }

  private formatStatusUpdateMessage(data: any): string {
    const { orderNumber, status, restaurantName, language = 'sq' } = data;
    
    const statusMessages = {
      sq: {
        preparing: `👨‍🍳 Porosia juaj #${orderNumber} po përgatitet nga ${restaurantName}`,
        ready: `🍽️ Porosia juaj #${orderNumber} është gati! Mund ta merrni nga ${restaurantName}`,
        served: `✅ Porosia juaj #${orderNumber} u shërbya me sukses! Faleminderit që zgjodhët ${restaurantName}`
      },
      en: {
        preparing: `👨‍🍳 Your order #${orderNumber} is being prepared by ${restaurantName}`,
        ready: `🍽️ Your order #${orderNumber} is ready! You can pick it up from ${restaurantName}`,
        served: `✅ Your order #${orderNumber} was served successfully! Thank you for choosing ${restaurantName}`
      }
    };

    const langMessages = statusMessages[language as keyof typeof statusMessages] || statusMessages.sq;
    return langMessages[status as keyof typeof langMessages] || `Order #${orderNumber} status updated`;
  }

  private formatPromotionMessage(data: any): string {
    const { customerName, promotionDetails, expiryDate, language = 'sq' } = data;
    
    const messages = {
      sq: `🎉 ${customerName}, keni një ofertë speciale! ${promotionDetails}${expiryDate ? ` Skadon: ${expiryDate.toLocaleDateString('sq-AL')}` : ''} Urdhëro tani: urdhero.al`,
      en: `🎉 ${customerName}, you have a special offer! ${promotionDetails}${expiryDate ? ` Expires: ${expiryDate.toLocaleDateString('en-US')}` : ''} Order now: urdhero.al`
    };

    return messages[language as keyof typeof messages] || messages.sq;
  }
}

// Email Service Implementation
export class EmailService {
  private static instance: EmailService;
  private emailFunction = httpsCallable(functions, 'sendEmail');

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  /**
   * Send order confirmation email
   */
  async sendOrderConfirmation(data: {
    email: string;
    customerName: string;
    orderNumber: string;
    restaurantName: string;
    orderItems: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
    totalAmount: number;
    estimatedTime: number;
    language?: string;
  }): Promise<boolean> {
    try {
      const result = await this.emailFunction({
        to: data.email,
        template: 'order_confirmation',
        data: {
          customerName: data.customerName,
          orderNumber: data.orderNumber,
          restaurantName: data.restaurantName,
          orderItems: data.orderItems,
          totalAmount: data.totalAmount,
          estimatedTime: data.estimatedTime,
          trackingUrl: `${window.location.origin}/order/${data.orderNumber}`
        },
        language: data.language || 'sq'
      });

      return result.data.success;
    } catch (error) {
      console.error('Failed to send order confirmation email:', error);
      return false;
    }
  }

  /**
   * Send order receipt email
   */
  async sendOrderReceipt(data: {
    email: string;
    customerName: string;
    orderNumber: string;
    restaurantName: string;
    orderItems: Array<{
      name: string;
      quantity: number;
      price: number;
      total: number;
    }>;
    totalAmount: number;
    paymentMethod: string;
    orderDate: Date;
    language?: string;
  }): Promise<boolean> {
    try {
      const result = await this.emailFunction({
        to: data.email,
        template: 'order_receipt',
        data: {
          ...data,
          receiptUrl: `${window.location.origin}/receipt/${data.orderNumber}`
        },
        language: data.language || 'sq'
      });

      return result.data.success;
    } catch (error) {
      console.error('Failed to send order receipt email:', error);
      return false;
    }
  }

  /**
   * Send loyalty program welcome email
   */
  async sendLoyaltyWelcome(data: {
    email: string;
    customerName: string;
    welcomePoints: number;
    referralCode: string;
    language?: string;
  }): Promise<boolean> {
    try {
      const result = await this.emailFunction({
        to: data.email,
        template: 'loyalty_welcome',
        data: {
          customerName: data.customerName,
          welcomePoints: data.welcomePoints,
          referralCode: data.referralCode,
          loyaltyUrl: `${window.location.origin}/loyalty`,
          shareUrl: `${window.location.origin}/join?ref=${data.referralCode}`
        },
        language: data.language || 'sq'
      });

      return result.data.success;
    } catch (error) {
      console.error('Failed to send loyalty welcome email:', error);
      return false;
    }
  }

  /**
   * Send restaurant staff notification
   */
  async sendStaffNotification(data: {
    email: string;
    staffName: string;
    subject: string;
    message: string;
    actionUrl?: string;
    urgency?: 'low' | 'medium' | 'high';
  }): Promise<boolean> {
    try {
      const result = await this.emailFunction({
        to: data.email,
        template: 'staff_notification',
        data: {
          staffName: data.staffName,
          subject: data.subject,
          message: data.message,
          actionUrl: data.actionUrl,
          urgency: data.urgency || 'medium',
          dashboardUrl: `${window.location.origin}/restaurant/dashboard`
        }
      });

      return result.data.success;
    } catch (error) {
      console.error('Failed to send staff notification email:', error);
      return false;
    }
  }

  /**
   * Send marketing email
   */
  async sendMarketing(data: {
    email: string;
    customerName: string;
    subject: string;
    content: string;
    ctaText?: string;
    ctaUrl?: string;
    unsubscribeUrl: string;
    language?: string;
  }): Promise<boolean> {
    try {
      const result = await this.emailFunction({
        to: data.email,
        template: 'marketing',
        data,
        language: data.language || 'sq'
      });

      return result.data.success;
    } catch (error) {
      console.error('Failed to send marketing email:', error);
      return false;
    }
  }
}

// Push Notification Service
export class PushNotificationService {
  private static instance: PushNotificationService;
  private registration: ServiceWorkerRegistration | null = null;

  static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService();
    }
    return PushNotificationService.instance;
  }

  /**
   * Initialize push notifications
   */
  async initialize(): Promise<boolean> {
    try {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.warn('Push notifications not supported');
        return false;
      }

      // Register service worker
      this.registration = await navigator.serviceWorker.register('/sw.js');
      
      // Request notification permission
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        await this.subscribeToNotifications();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to initialize push notifications:', error);
      return false;
    }
  }

  /**
   * Subscribe to push notifications
   */
  private async subscribeToNotifications(): Promise<void> {
    if (!this.registration) {
      throw new Error('Service worker not registered');
    }

    const subscription = await this.registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: this.urlBase64ToUint8Array(
        import.meta.env.VITE_VAPID_PUBLIC_KEY || ''
      )
    });

    // Send subscription to backend
    const subscribeFunction = httpsCallable(functions, 'subscribeToPushNotifications');
    await subscribeFunction({
      subscription: subscription.toJSON(),
      userAgent: navigator.userAgent
    });
  }

  /**
   * Send local notification for order status
   */
  async showOrderNotification(data: {
    orderNumber: string;
    status: string;
    message: string;
    restaurantName: string;
  }): Promise<void> {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return;
    }

    const statusIcons = {
      accepted: '✅',
      preparing: '👨‍🍳',
      ready: '🍽️',
      served: '✨'
    };

    const notification = new Notification(
      `${statusIcons[data.status as keyof typeof statusIcons] || '📱'} Order #${data.orderNumber}`,
      {
        body: `${data.message} at ${data.restaurantName}`,
        icon: '/pwa-192x192.png',
        badge: '/pwa-192x192.png',
        tag: `order-${data.orderNumber}`,
        data: {
          orderNumber: data.orderNumber,
          url: `/order/${data.orderNumber}`
        },
        actions: [
          {
            action: 'view',
            title: 'View Order'
          }
        ]
      }
    );

    notification.onclick = () => {
      window.focus();
      window.location.href = `/order/${data.orderNumber}`;
      notification.close();
    };

    // Auto close after 10 seconds
    setTimeout(() => {
      notification.close();
    }, 10000);
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}

// Unified Notification Manager
export class NotificationManager {
  private smsService = SMSService.getInstance();
  private emailService = EmailService.getInstance();
  private pushService = PushNotificationService.getInstance();

  /**
   * Send complete order confirmation across all channels
   */
  async sendOrderConfirmation(orderData: {
    customer: {
      name: string;
      email?: string;
      phone?: string;
    };
    order: {
      number: string;
      items: Array<{
        name: string;
        quantity: number;
        price: number;
      }>;
      total: number;
      estimatedTime: number;
    };
    restaurant: {
      name: string;
    };
    preferences: {
      sms: boolean;
      email: boolean;
      push: boolean;
    };
    language?: string;
  }): Promise<void> {
    const promises: Promise<any>[] = [];

    // Send SMS if enabled and phone available
    if (orderData.preferences.sms && orderData.customer.phone) {
      promises.push(
        this.smsService.sendOrderConfirmation({
          phoneNumber: orderData.customer.phone,
          orderNumber: orderData.order.number,
          restaurantName: orderData.restaurant.name,
          estimatedTime: orderData.order.estimatedTime,
          language: orderData.language
        })
      );
    }

    // Send email if enabled and email available
    if (orderData.preferences.email && orderData.customer.email) {
      promises.push(
        this.emailService.sendOrderConfirmation({
          email: orderData.customer.email,
          customerName: orderData.customer.name,
          orderNumber: orderData.order.number,
          restaurantName: orderData.restaurant.name,
          orderItems: orderData.order.items,
          totalAmount: orderData.order.total,
          estimatedTime: orderData.order.estimatedTime,
          language: orderData.language
        })
      );
    }

    // Send push notification if enabled
    if (orderData.preferences.push) {
      promises.push(
        this.pushService.showOrderNotification({
          orderNumber: orderData.order.number,
          status: 'accepted',
          message: 'Your order has been confirmed!',
          restaurantName: orderData.restaurant.name
        })
      );
    }

    // Execute all notifications
    const results = await Promise.allSettled(promises);
    
    // Log any failures
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.error(`Notification ${index} failed:`, result.reason);
      }
    });
  }

  /**
   * Send order status update
   */
  async sendStatusUpdate(data: {
    customer: {
      name: string;
      email?: string;
      phone?: string;
    };
    order: {
      number: string;
      status: string;
    };
    restaurant: {
      name: string;
    };
    preferences: {
      sms: boolean;
      email: boolean;
      push: boolean;
    };
    language?: string;
  }): Promise<void> {
    const promises: Promise<any>[] = [];

    const statusMessage = this.getStatusMessage(data.order.status, data.language);

    // SMS notification
    if (data.preferences.sms && data.customer.phone) {
      promises.push(
        this.smsService.sendStatusUpdate({
          phoneNumber: data.customer.phone,
          orderNumber: data.order.number,
          status: data.order.status,
          restaurantName: data.restaurant.name,
          message: statusMessage,
          language: data.language
        })
      );
    }

    // Push notification
    if (data.preferences.push) {
      promises.push(
        this.pushService.showOrderNotification({
          orderNumber: data.order.number,
          status: data.order.status,
          message: statusMessage,
          restaurantName: data.restaurant.name
        })
      );
    }

    await Promise.allSettled(promises);
  }

  private getStatusMessage(status: string, language = 'sq'): string {
    const messages = {
      sq: {
        accepted: 'Porosia juaj u pranua!',
        preparing: 'Porosia juaj po përgatitet!',
        ready: 'Porosia juaj është gati!',
        served: 'Porosia juaj u shërbya!'
      },
      en: {
        accepted: 'Your order has been accepted!',
        preparing: 'Your order is being prepared!',
        ready: 'Your order is ready!',
        served: 'Your order has been served!'
      }
    };

    const langMessages = messages[language as keyof typeof messages] || messages.sq;
    return langMessages[status as keyof typeof langMessages] || 'Order status updated';
  }
}

// Export singleton instances
export const smsService = SMSService.getInstance();
export const emailService = EmailService.getInstance();
export const pushService = PushNotificationService.getInstance();
export const notificationManager = new NotificationManager();