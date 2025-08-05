import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as Joi from 'joi';

const db = admin.firestore();

// SMS Service using external provider (e.g., Twilio, InfoBip)
const SMS_API_KEY = functions.config().sms?.api_key || 'demo-key';
const SMS_API_URL = functions.config().sms?.api_url || 'https://api.infobip.com/sms/2/text/advanced';

// Email service using SendGrid or similar
const EMAIL_API_KEY = functions.config().email?.api_key || 'demo-key';

// Schema for SMS sending
const sendSMSSchema = Joi.object({
  to: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required(),
  message: Joi.string().max(160).required(),
  type: Joi.string().valid('order_confirmation', 'status_update', 'promotion').required()
});

// Schema for Email sending
const sendEmailSchema = Joi.object({
  to: Joi.string().email().required(),
  template: Joi.string().required(),
  data: Joi.object().required(),
  language: Joi.string().valid('sq', 'en', 'it', 'de', 'fr', 'es').default('sq')
});

/**
 * Send SMS notification
 * 
 * @private Requires authentication
 */
export const sendSMS = functions.https.onCall(async (data, context) => {
  // Check authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'You must be logged in to send SMS'
    );
  }

  try {
    // Validate input data
    const { error, value } = sendSMSSchema.validate(data);
    if (error) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        `Validation error: ${error.message}`
      );
    }

    // For demo purposes, we'll simulate SMS sending
    // In production, you would integrate with actual SMS provider
    
    console.log('SMS would be sent:', {
      to: value.to,
      message: value.message,
      type: value.type
    });

    // Simulate SMS API call
    const smsResult = await simulateSMSDelivery(value);
    
    // Log the SMS in Firestore for tracking
    await db.collection('smsLogs').add({
      to: value.to,
      message: value.message,
      type: value.type,
      status: smsResult.success ? 'delivered' : 'failed',
      sentAt: admin.firestore.FieldValue.serverTimestamp(),
      sentBy: context.auth.uid
    });

    return {
      success: smsResult.success,
      messageId: smsResult.messageId,
      cost: smsResult.cost
    };
  } catch (error) {
    console.error('Error sending SMS:', error);
    
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    
    throw new functions.https.HttpsError(
      'internal',
      'Failed to send SMS notification'
    );
  }
});

/**
 * Send Email notification
 * 
 * @private Requires authentication or system access
 */
export const sendEmail = functions.https.onCall(async (data, context) => {
  try {
    // Validate input data
    const { error, value } = sendEmailSchema.validate(data);
    if (error) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        `Validation error: ${error.message}`
      );
    }

    // Get email template
    const template = await getEmailTemplate(value.template, value.language);
    
    if (!template) {
      throw new functions.https.HttpsError(
        'not-found',
        `Email template '${value.template}' not found`
      );
    }

    // Render email content
    const emailContent = renderEmailTemplate(template, value.data);
    
    // For demo purposes, simulate email sending
    const emailResult = await simulateEmailDelivery({
      to: value.to,
      subject: emailContent.subject,
      html: emailContent.html,
      template: value.template
    });

    // Log the email
    await db.collection('emailLogs').add({
      to: value.to,
      template: value.template,
      subject: emailContent.subject,
      status: emailResult.success ? 'delivered' : 'failed',
      sentAt: admin.firestore.FieldValue.serverTimestamp(),
      sentBy: context.auth?.uid || 'system'
    });

    return {
      success: emailResult.success,
      messageId: emailResult.messageId
    };
  } catch (error) {
    console.error('Error sending email:', error);
    
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    
    throw new functions.https.HttpsError(
      'internal',
      'Failed to send email notification'
    );
  }
});

/**
 * Subscribe to push notifications
 */
export const subscribeToPushNotifications = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Authentication required'
    );
  }

  try {
    const { subscription, userAgent } = data;
    
    // Store push subscription in Firestore
    await db.collection('pushSubscriptions').doc(context.auth.uid).set({
      subscription,
      userAgent,
      subscribedAt: admin.firestore.FieldValue.serverTimestamp(),
      isActive: true
    });

    return { success: true };
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Failed to subscribe to push notifications'
    );
  }
});

/**
 * Send push notification to user
 */
export const sendPushNotification = functions.https.onCall(async (data, context) => {
  try {
    const { userId, title, body, data: notificationData } = data;
    
    // Get user's push subscription
    const subscriptionDoc = await db.collection('pushSubscriptions').doc(userId).get();
    
    if (!subscriptionDoc.exists) {
      throw new functions.https.HttpsError(
        'not-found',
        'User push subscription not found'
      );
    }

    const subscriptionData = subscriptionDoc.data();
    
    // Send push notification (would use web-push library in production)
    const pushResult = await simulatePushDelivery({
      subscription: subscriptionData?.subscription,
      payload: {
        title,
        body,
        data: notificationData,
        icon: '/pwa-192x192.png',
        badge: '/pwa-192x192.png'
      }
    });

    // Log push notification
    await db.collection('pushLogs').add({
      userId,
      title,
      body,
      status: pushResult.success ? 'delivered' : 'failed',
      sentAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return {
      success: pushResult.success,
      messageId: pushResult.messageId
    };
  } catch (error) {
    console.error('Error sending push notification:', error);
    
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    
    throw new functions.https.HttpsError(
      'internal',
      'Failed to send push notification'
    );
  }
});

// Helper functions for demo/simulation

async function simulateSMSDelivery(smsData: any) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Simulate 98% success rate
  const success = Math.random() > 0.02;
  
  return {
    success,
    messageId: `sms_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    cost: 0.05 // EUR per SMS
  };
}

async function simulateEmailDelivery(emailData: any) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Simulate 99% success rate
  const success = Math.random() > 0.01;
  
  return {
    success,
    messageId: `email_${Date.now()}_${Math.random().toString(36).substring(7)}`
  };
}

async function simulatePushDelivery(pushData: any) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Simulate 95% success rate
  const success = Math.random() > 0.05;
  
  return {
    success,
    messageId: `push_${Date.now()}_${Math.random().toString(36).substring(7)}`
  };
}

async function getEmailTemplate(templateName: string, language: string) {
  // In production, this would fetch from a template storage system
  const templates: Record<string, any> = {
    order_confirmation: {
      sq: {
        subject: 'Konfirmim Porosie - Urdhëro #{orderNumber}',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #1d4ed8, #312e81); padding: 30px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 28px;">✅ Porosia u Konfirmua!</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Faleminderit që zgjodhët {{restaurantName}}</p>
            </div>
            <div style="padding: 30px; background: white;">
              <h2 style="color: #1d4ed8; margin-bottom: 20px;">Detajet e Porosisë #{{orderNumber}}</h2>
              <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                {{#each orderItems}}
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                  <span>{{quantity}}x {{name}}</span>
                  <span>€{{price}}</span>
                </div>
                {{/each}}
                <hr style="margin: 15px 0; border: none; border-top: 1px solid #e2e8f0;">
                <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 18px;">
                  <span>Total:</span>
                  <span>€{{totalAmount}}</span>
                </div>
              </div>
              <p style="text-align: center; color: #64748b;">
                <strong>Koha e vlerësuar:</strong> {{estimatedTime}} minuta<br>
                <a href="{{trackingUrl}}" style="color: #1d4ed8; text-decoration: none;">Ndiqni progresin e porosisë →</a>
              </p>
            </div>
            <div style="background: #f1f5f9; padding: 20px; text-align: center; color: #64748b; font-size: 12px;">
              <p>© 2024 Urdhëro Platform - Made in Albania 🇦🇱</p>
            </div>
          </div>
        `
      },
      en: {
        subject: 'Order Confirmation - Urdhëro #{orderNumber}',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #1d4ed8, #312e81); padding: 30px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 28px;">✅ Order Confirmed!</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Thank you for choosing {{restaurantName}}</p>
            </div>
            <div style="padding: 30px; background: white;">
              <h2 style="color: #1d4ed8; margin-bottom: 20px;">Order Details #{{orderNumber}}</h2>
              <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                {{#each orderItems}}
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                  <span>{{quantity}}x {{name}}</span>
                  <span>€{{price}}</span>
                </div>
                {{/each}}
                <hr style="margin: 15px 0; border: none; border-top: 1px solid #e2e8f0;">
                <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 18px;">
                  <span>Total:</span>
                  <span>€{{totalAmount}}</span>
                </div>
              </div>
              <p style="text-align: center; color: #64748b;">
                <strong>Estimated time:</strong> {{estimatedTime}} minutes<br>
                <a href="{{trackingUrl}}" style="color: #1d4ed8; text-decoration: none;">Track your order →</a>
              </p>
            </div>
            <div style="background: #f1f5f9; padding: 20px; text-align: center; color: #64748b; font-size: 12px;">
              <p>© 2024 Urdhëro Platform - Made in Albania 🇦🇱</p>
            </div>
          </div>
        `
      }
    },
    loyalty_welcome: {
      sq: {
        subject: 'Mirë se erdhe në Urdhëro Loyalty! 🎉',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #9b59b6, #3498db); padding: 30px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 28px;">🎉 Mirë se erdhe!</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Në Urdhëro Loyalty Program</p>
            </div>
            <div style="padding: 30px; background: white;">
              <h2 style="color: #9b59b6;">Përfitimet tuaja:</h2>
              <ul style="color: #64748b; line-height: 1.6;">
                <li>✨ {{welcomePoints}} pikë bonus të dhuruara</li>
                <li>⭐ Fitoni pikë për çdo porosi</li>
                <li>🎁 Shkëmbeni pikë për shpërblime</li>
                <li>👥 Ftoni miq dhe fitoni 500 pikë ekstra</li>
              </ul>
              <div style="text-align: center; margin: 30px 0;">
                <a href="{{loyaltyUrl}}" style="background: #9b59b6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
                  Eksploro Loyalty Dashboard
                </a>
              </div>
              <div style="background: #f8fafc; padding: 20px; border-radius: 8px; text-align: center;">
                <h3 style="color: #1d4ed8; margin-bottom: 10px;">Ftoni Miqtë Tuaj!</h3>
                <p style="color: #64748b; margin-bottom: 15px;">Kodi juaj i ftesës:</p>
                <div style="font-family: monospace; font-size: 24px; font-weight: bold; color: #1d4ed8; background: white; padding: 15px; border-radius: 8px; border: 2px dashed #1d4ed8;">
                  {{referralCode}}
                </div>
                <a href="{{shareUrl}}" style="color: #1d4ed8; text-decoration: none; font-size: 14px;">
                  Ndani këtë kod me miqtë tuaj →
                </a>
              </div>
            </div>
          </div>
        `
      },
      en: {
        subject: 'Welcome to Urdhëro Loyalty! 🎉',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #9b59b6, #3498db); padding: 30px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 28px;">🎉 Welcome!</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">To Urdhëro Loyalty Program</p>
            </div>
            <div style="padding: 30px; background: white;">
              <h2 style="color: #9b59b6;">Your Benefits:</h2>
              <ul style="color: #64748b; line-height: 1.6;">
                <li>✨ {{welcomePoints}} bonus points awarded</li>
                <li>⭐ Earn points on every order</li>
                <li>🎁 Redeem points for rewards</li>
                <li>👥 Refer friends and earn 500 extra points</li>
              </ul>
              <div style="text-align: center; margin: 30px 0;">
                <a href="{{loyaltyUrl}}" style="background: #9b59b6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
                  Explore Loyalty Dashboard
                </a>
              </div>
            </div>
          </div>
        `
      }
    }
  };

  const languageTemplates = templates[templateName];
  return languageTemplates?.[language] || languageTemplates?.sq || null;
}

function renderEmailTemplate(template: any, data: any): { subject: string; html: string } {
  let { subject, html } = template;
  
  // Simple template rendering (in production, use a proper template engine)
  Object.entries(data).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    subject = subject.replace(regex, value);
    html = html.replace(regex, value);
  });

  return { subject, html };
}

async function simulateSMSDelivery(smsData: any) {
  // Simulate SMS provider API call
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Check if phone number is valid (basic validation)
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  if (!phoneRegex.test(smsData.to)) {
    return {
      success: false,
      error: 'Invalid phone number format'
    };
  }
  
  // Simulate high success rate
  const success = Math.random() > 0.02; // 98% success rate
  
  return {
    success,
    messageId: `sms_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    cost: 0.05, // 5 cents per SMS
    deliveredAt: success ? new Date() : null
  };
}

async function simulateEmailDelivery(emailData: any) {
  // Simulate email provider API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Simulate very high success rate for emails
  const success = Math.random() > 0.005; // 99.5% success rate
  
  return {
    success,
    messageId: `email_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    deliveredAt: success ? new Date() : null
  };
}

async function simulatePushDelivery(pushData: any) {
  // Simulate push notification delivery
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Simulate good success rate for push
  const success = Math.random() > 0.05; // 95% success rate
  
  return {
    success,
    messageId: `push_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    deliveredAt: success ? new Date() : null
  };
}