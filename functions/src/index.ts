import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

// Initialize Firebase Admin SDK
admin.initializeApp();

// Export functions from other modules
export * from './venues';
export * from './orders';
export * from './menu';
export * from './tables';
export * from './analytics';
export * from './payments';
export * from './performance';

// Ensure Firestore settings are optimal
const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });