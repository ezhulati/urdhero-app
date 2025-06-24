import { useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

export interface RestaurantStaffUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: 'admin' | 'manager' | 'staff' | 'kitchen';
  venueId: string;
}

export const useRestaurantAuth = () => {
  const [currentUser, setCurrentUser] = useState<RestaurantStaffUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Subscribe to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Get custom claims to determine restaurant access
          const { claims } = await user.getIdTokenResult();
          
          if (claims.venueId && claims.role) {
            // This user has restaurant staff access
            const staffUser: RestaurantStaffUser = {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              role: claims.role as any,
              venueId: claims.venueId as string
            };
            
            setCurrentUser(staffUser);
          } else {
            // User is authenticated but not restaurant staff
            setCurrentUser(null);
          }
        } catch (error) {
          console.error('Error checking staff claims:', error);
          setCurrentUser(null);
        }
      } else {
        // User is not authenticated
        setCurrentUser(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Login with email and password
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Get custom claims to verify restaurant access
      const { claims } = await userCredential.user.getIdTokenResult();
      
      if (!claims.venueId || !claims.role) {
        // Not a restaurant staff account
        await signOut(auth);
        throw new Error('This account does not have restaurant staff access');
      }
      
      // Update last login
      try {
        const userDocRef = doc(db, 'staff', userCredential.user.uid);
        await updateDoc(userDocRef, {
          lastLoginAt: serverTimestamp()
        });
      } catch (err) {
        // Non-critical error, just log it
        console.warn('Failed to update last login time:', err);
      }
      
      toast.success('Login successful');
      return claims;
    } catch (error: any) {
      console.error('Login error:', error);
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        toast.error('Invalid email or password');
      } else if (error.code === 'auth/too-many-requests') {
        toast.error('Too many failed login attempts. Please try again later');
      } else {
        toast.error(error.message || 'Failed to login');
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error(error.message || 'Failed to logout');
      throw error;
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent. Check your inbox.');
    } catch (error: any) {
      console.error('Password reset error:', error);
      
      if (error.code === 'auth/user-not-found') {
        toast.error('No account found with this email');
      } else {
        toast.error(error.message || 'Failed to send reset email');
      }
      
      throw error;
    }
  };

  // Get restaurant information for the current user
  const getRestaurantInfo = async () => {
    if (!currentUser?.venueId) {
      return null;
    }
    
    try {
      const venueDocRef = doc(db, 'venues', currentUser.venueId);
      const venueDoc = await getDoc(venueDocRef);
      
      if (!venueDoc.exists()) {
        return null;
      }
      
      return { id: venueDoc.id, ...venueDoc.data() };
    } catch (error) {
      console.error('Error getting restaurant info:', error);
      return null;
    }
  };

  return {
    currentUser,
    loading,
    login,
    logout,
    resetPassword,
    getRestaurantInfo,
    isAuthenticated: !!currentUser
  };
};