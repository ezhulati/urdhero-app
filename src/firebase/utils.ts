import { httpsCallable } from 'firebase/functions';
import { auth, db, functions } from './config';

/**
 * Check if Firebase connection is available
 */
export const checkFirebaseConnection = async (): Promise<boolean> => {
  try {
    // Try to access Firestore as a connectivity check
    const testDocRef = doc(db, '_connection_test', 'test');
    await getDoc(testDocRef);
    return true;
  } catch (error) {
    console.warn('Firebase connection check failed:', error);
    return false;
  }
};

/**
 * Create a callable function with fallback for demo mode
 * 
 * @param functionName The name of the Firebase Cloud Function
 * @param fallbackFn A fallback implementation for when Firebase is unavailable
 */
export function createCallableWithFallback<TData, TResult>(
  functionName: string,
  fallbackFn: (data: TData) => Promise<TResult>
) {
  return async (data: TData): Promise<TResult> => {
    try {
      // First check if Firebase is available
      const isConnected = await checkFirebaseConnection();
      if (!isConnected) {
        console.log(`Firebase unavailable, using fallback for ${functionName}`);
        return fallbackFn(data);
      }

      // Try to call the Firebase function
      const callable = httpsCallable<TData, TResult>(functions, functionName);
      const result = await callable(data);
      return result.data;
    } catch (error) {
      console.error(`Error calling Firebase function ${functionName}:`, error);
      // Fall back to mock implementation
      console.log(`Falling back to mock implementation for ${functionName}`);
      return fallbackFn(data);
    }
  };
}

// Make sure doc and getDoc are imported and exported for use in other files
import { doc, getDoc } from 'firebase/firestore';
export { doc, getDoc };