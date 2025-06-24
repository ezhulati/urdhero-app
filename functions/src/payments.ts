import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';

const db = admin.firestore();

// Initialize Stripe with your secret key
const stripe = new Stripe(functions.config().stripe.secret_key, {
  apiVersion: '2023-10-16',
});

/**
 * Create a payment intent for a card payment
 */
export const createPaymentIntent = functions.https.onCall(async (data, context) => {
  try {
    const { venueId, amount, currency = 'eur' } = data;
    
    if (!venueId || !amount || amount <= 0) {
      throw new functions.https.HttpsError(
        'invalid-argument', 
        'Invalid payment request: venueId and amount are required'
      );
    }
    
    // Get the venue
    const venueDoc = await db.collection('venues').doc(venueId).get();
    if (!venueDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Venue not found');
    }
    
    const venue = venueDoc.data();
    if (!venue || !venue.eshteAktiv) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'Venue is not active'
      );
    }
    
    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        venueId,
        venueName: venue.emri,
        source: 'urdhero_platform'
      }
    });
    
    // Store payment intent reference in Firestore
    await db.collection('paymentIntents').doc(paymentIntent.id).set({
      venueId,
      amount,
      currency,
      status: paymentIntent.status,
      created: admin.firestore.FieldValue.serverTimestamp(),
      orderId: null // Will be updated when order is created
    });
    
    return {
      paymentIntent: {
        id: paymentIntent.id,
        amount: paymentIntent.amount,
        status: paymentIntent.status,
      },
      clientSecret: paymentIntent.client_secret
    };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    throw new functions.https.HttpsError(
      'internal',
      'Failed to create payment intent'
    );
  }
});

/**
 * Webhook for handling Stripe events
 */
export const stripeWebhook = functions.https.onRequest(async (req, res) => {
  const signature = req.headers['stripe-signature'];
  
  if (!signature) {
    return res.status(400).send('Webhook Error: No signature provided');
  }
  
  try {
    const endpointSecret = functions.config().stripe.webhook_secret;
    const event = stripe.webhooks.constructEvent(
      req.rawBody,
      signature,
      endpointSecret
    );
    
    // Handle the event based on its type
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object);
        break;
      // Add handlers for other event types as needed
    }
    
    res.json({ received: true });
  } catch (error) {
    console.error('Webhook Error:', error);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

/**
 * Handle successful payment intent
 */
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  try {
    // Get the payment intent from Firestore
    const paymentIntentDoc = await db.collection('paymentIntents')
      .doc(paymentIntent.id)
      .get();
    
    if (!paymentIntentDoc.exists) {
      console.error('Payment intent not found in Firestore:', paymentIntent.id);
      return;
    }
    
    const paymentIntentData = paymentIntentDoc.data();
    
    // If this payment is already associated with an order, update the payment status
    if (paymentIntentData?.orderId) {
      await db.collection('orders').doc(paymentIntentData.orderId).update({
        eshtePagetuar: true,
        pagetuarNe: admin.firestore.FieldValue.serverTimestamp(),
        paymentStatus: 'succeeded',
        paymentDetails: {
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          paymentMethod: paymentIntent.payment_method,
          receiptUrl: paymentIntent.charges?.data?.[0]?.receipt_url || null
        }
      });
    }
    
    // Update the payment intent status in Firestore
    await db.collection('paymentIntents').doc(paymentIntent.id).update({
      status: 'succeeded',
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log('Payment succeeded:', paymentIntent.id);
  } catch (error) {
    console.error('Error handling payment success:', error);
  }
}

/**
 * Handle failed payment intent
 */
async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    // Get the payment intent from Firestore
    const paymentIntentDoc = await db.collection('paymentIntents')
      .doc(paymentIntent.id)
      .get();
    
    if (!paymentIntentDoc.exists) {
      console.error('Payment intent not found in Firestore:', paymentIntent.id);
      return;
    }
    
    const paymentIntentData = paymentIntentDoc.data();
    
    // If this payment is already associated with an order, update the payment status
    if (paymentIntentData?.orderId) {
      await db.collection('orders').doc(paymentIntentData.orderId).update({
        paymentStatus: 'failed',
        paymentError: paymentIntent.last_payment_error?.message || 'Payment failed',
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
    
    // Update the payment intent status in Firestore
    await db.collection('paymentIntents').doc(paymentIntent.id).update({
      status: 'failed',
      error: paymentIntent.last_payment_error?.message || 'Payment failed',
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log('Payment failed:', paymentIntent.id);
  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}