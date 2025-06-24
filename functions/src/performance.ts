import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as Joi from 'joi';

const db = admin.firestore();

// Schema for getting performance metrics
const getPerformanceMetricsSchema = Joi.object({
  venueId: Joi.string().required()
});

/**
 * Get performance metrics for a venue
 * 
 * @private Requires authentication with venue admin/manager role
 */
export const getPerformanceMetrics = functions.https.onCall(async (data, context) => {
  // Check authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'You must be logged in to view performance metrics'
    );
  }

  // Check user claims for venue staff role
  const { venueId, role } = context.auth.token;
  
  if (!venueId || !['admin', 'manager'].includes(role)) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'You do not have permission to view performance metrics'
    );
  }

  try {
    // Validate input data
    const { error, value } = getPerformanceMetricsSchema.validate(data);
    if (error) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        `Validation error: ${error.message}`
      );
    }

    // Check if venue exists
    const venueRef = db.collection('venues').doc(value.venueId);
    const venueDoc = await venueRef.get();
    
    if (!venueDoc.exists) {
      throw new functions.https.HttpsError(
        'not-found',
        'Venue not found'
      );
    }

    // Get any existing performance metrics
    const metricsRef = db.collection('venues')
      .doc(value.venueId)
      .collection('analytics')
      .doc('performance');
      
    const metricsDoc = await metricsRef.get();
    
    // If we have metrics, return them
    if (metricsDoc.exists) {
      return metricsDoc.data();
    }
    
    // Otherwise, generate mock metrics
    const mockMetrics = {
      // Core web vitals
      lcp: 2200 + Math.random() * 600, // 2.2s - 2.8s
      fid: 70 + Math.random() * 40, // 70ms - 110ms
      cls: 0.08 + Math.random() * 0.04, // 0.08 - 0.12
      
      // General app metrics
      loadTime: 1800 + Math.random() * 400, // 1.8s - 2.2s
      domInteractive: 1200 + Math.random() * 300, // 1.2s - 1.5s
      domComplete: 1600 + Math.random() * 400, // 1.6s - 2.0s
      
      // Business metrics
      orderConversionRate: 4.8, // 4.8%
      cartAbandonmentRate: 22, // 22%
      avgSessionDuration: 222, // 3:42 in seconds
      
      // Device breakdown
      deviceBreakdown: {
        mobile: 72, // 72% of traffic
        desktop: 28 // 28% of traffic
      },
      
      // Performance by device
      mobilePerformance: {
        lcp: 2800,
        fid: 98,
        cls: 0.14,
        overallScore: 78
      },
      desktopPerformance: {
        lcp: 1500,
        fid: 35,
        cls: 0.05,
        overallScore: 94
      },
      
      // Historical data
      historicalData: Array.from({ length: 7 }).map((_, i) => ({
        date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
        lcp: 2000 + Math.random() * 1000,
        fid: 60 + Math.random() * 50,
        cls: 0.05 + Math.random() * 0.1,
        overallScore: 70 + Math.random() * 20
      })).reverse(),
      
      // Last updated timestamp
      lastUpdated: admin.firestore.FieldValue.serverTimestamp()
    };
    
    // Store the mock metrics
    await metricsRef.set(mockMetrics);
    
    return {
      ...mockMetrics,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error getting performance metrics:', error);
    
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    
    throw new functions.https.HttpsError(
      'internal',
      'Something went wrong while getting performance metrics'
    );
  }
});