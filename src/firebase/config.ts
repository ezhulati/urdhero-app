// Firebase configuration for the frontend
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
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

// Connect to emulators if in development
if (import.meta.env.DEV || import.meta.env.VITE_APP_ENV === 'development') {
  try {
    connectAuthEmulator(auth, 'http://localhost:9099');
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectFunctionsEmulator(functions, 'localhost', 5001);
    connectStorageEmulator(storage, 'localhost', 9199);
    console.log('Connected to Firebase emulators');
  } catch (error) {
    console.error('Error connecting to emulators:', error);
  }
}

export default app;