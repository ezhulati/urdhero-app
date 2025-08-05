// Firebase configuration for the frontend
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, enableNetwork } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "your-firebase-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "urdhero-albania.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "urdhero-albania",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "urdhero-albania.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get service instances
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);
export const storage = getStorage(app);

// Configure Firebase based on environment variables
if (import.meta.env.DEV) {
  // Only connect to emulators if explicitly enabled
  if (import.meta.env.VITE_FIREBASE_EMULATORS_ENABLED === 'true' && import.meta.env.VITE_DEMO_MODE !== 'true') {
    (async () => {
      try {
        // Test if emulators are actually running before connecting
        const testResponse = await fetch('http://localhost:8080', { signal: AbortSignal.timeout(2000) });
        if (testResponse.ok || testResponse.status === 404) {
          connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
          connectFirestoreEmulator(db, 'localhost', 8080);
          connectFunctionsEmulator(functions, 'localhost', 5001);
          connectStorageEmulator(storage, 'localhost', 9199);
          console.log('Connected to Firebase emulators');
        } else {
          console.log('Firebase emulators not running, using demo mode');
        }
      } catch (error) {
        console.log('Firebase emulators not accessible, using demo mode');
        // Don't attempt any Firebase operations
      }
    })();
  } else {
    console.log('Running in demo mode - Firebase emulators disabled');
  }
}

export default app;