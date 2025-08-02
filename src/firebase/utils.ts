import { httpsCallable } from 'firebase/functions';
import { auth, db, functions } from './config';
import { 
  doc, 
  getDoc, 
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  DocumentReference, 
  DocumentData,
  CollectionReference
} from 'firebase/firestore';

/**
 * Check if Firebase connection is available with proper error handling
 * @returns Promise<boolean> True if connection is successful
 */
export const checkFirebaseConnection = async (): Promise<boolean> => {
  try {
    // Use a lightweight query to test Firebase connectivity
    const testDocRef = doc(db, '_connection_test', 'test');
    
    // Set a timeout to avoid hanging if Firebase is unavailable
    const timeoutPromise = new Promise<boolean>((_, reject) => {
      setTimeout(() => reject(new Error('Firebase connection timeout')), 5000);
    });
    
    // Race between the Firestore query and the timeout
    await Promise.race([getDoc(testDocRef), timeoutPromise]);
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
 * @returns A function that will try Firebase first, then fall back to the local implementation
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
      
      // Add timeout for Firebase function calls
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error(`Firebase function ${functionName} timeout`)), 10000);
      });
      
      const result = await Promise.race([
        callable(data),
        timeoutPromise
      ]);
      
      return result.data;
    } catch (error) {
      // Log the error with context
      console.error(`Error calling Firebase function ${functionName}:`, error);
      
      // Fall back to local implementation
      console.log(`Falling back to local implementation for ${functionName}`);
      try {
        return await fallbackFn(data);
      } catch (fallbackError) {
        console.error(`Fallback function also failed for ${functionName}:`, fallbackError);
        throw new Error(`Both Firebase and fallback failed for ${functionName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };
}

/**
 * Helper to safely get a document from Firestore with proper error handling
 * @param docRef The document reference to fetch
 * @param fallback Optional fallback data to use if fetching fails
 * @returns The document data or fallback if unavailable
 */
export async function safeGetDoc<T = DocumentData>(
  docRef: DocumentReference,
  fallback?: T
): Promise<T | null> {
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as T;
    }
    return fallback || null;
  } catch (error) {
    console.error('Error fetching document:', error);
    return fallback || null;
  }
}

// Re-export Firebase utilities for easier access
export { 
  doc, 
  getDoc, 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs,
  query,
  where
};