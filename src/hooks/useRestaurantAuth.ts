import { useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { checkFirebaseConnection } from '../firebase/utils';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

export interface RestaurantStaffUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: 'admin' | 'manager' | 'staff' | 'kitchen';
  venueId: string;
  isDemo?: boolean;
}

// Demo mode detection
const isDemoMode = () => {
  return localStorage.getItem('restaurant-demo-mode') === 'true' || 
         import.meta.env.VITE_DEMO_MODE === 'true';
};

// Demo user data
const demoUsers: Record<string, RestaurantStaffUser> = {
  'admin@beachbar.al': {
    uid: 'demo-admin-001',
    email: 'admin@beachbar.al',
    displayName: 'Demo Administrator',
    role: 'admin',
    venueId: 'demo-venue-001',
    isDemo: true
  },
  'staff@beachbar.al': {
    uid: 'demo-staff-001',
    email: 'staff@beachbar.al',
    displayName: 'Demo Staff Member',
    role: 'staff',
    venueId: 'demo-venue-001',
    isDemo: true
  },
  'kitchen@beachbar.al': {
    uid: 'demo-kitchen-001',
    email: 'kitchen@beachbar.al',
    displayName: 'Demo Kitchen Staff',
    role: 'kitchen',
    venueId: 'demo-venue-001',
    isDemo: true
  }
};

const demoPasswords: Record<string, string> = {
  'admin@beachbar.al': 'admin123',
  'staff@beachbar.al': 'staff123',
  'kitchen@beachbar.al': 'kitchen123'
};

export const useRestaurantAuth = () => {
  const [currentUser, setCurrentUser] = useState<RestaurantStaffUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInDemoMode, setIsInDemoMode] = useState(false);

  // Track Firebase availability for UI feedback
  const [isFirebaseAvailable, setIsFirebaseAvailable] = useState(true);

  // Check for demo mode and existing demo session
  useEffect(() => {
    const demoMode = isDemoMode();
    setIsInDemoMode(demoMode);

    // Check Firebase connectivity on component mount
    checkFirebaseConnection().then(isAvailable => {
      setIsFirebaseAvailable(isAvailable);
      
      // If Firebase is not available, enable demo mode automatically
      if (!isAvailable && !demoMode) {
        console.log('Firebase unavailable, automatically enabling demo mode');
        enableDemoMode();
      }
    });

    if (demoMode) {
      // Check for existing demo session
      const demoSession = localStorage.getItem('restaurant-demo-session');
      if (demoSession) {
        try {
          const sessionData = JSON.parse(demoSession);
          setCurrentUser(sessionData);
        } catch (error) {
          console.error('Error parsing demo session:', error);
          localStorage.removeItem('restaurant-demo-session');
        }
      }
      setLoading(false);
      return;
    }

    // Only subscribe to Firebase auth if not in demo mode
    if (!demoMode) {
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
    }
  }, []);

  // Demo login
  const demoLogin = async (email: string, password: string) => {
    try {
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const user = demoUsers[email];
      const correctPassword = demoPasswords[email];

      if (!user || password !== correctPassword) {
        throw new Error('Invalid email or password');
      }

      // Store demo session
      localStorage.setItem('restaurant-demo-session', JSON.stringify(user));
      setCurrentUser(user);
      
      return {
        role: user.role,
        venueId: user.venueId,
        isDemo: true
      };
    } catch (error) {
      throw error;
    }
  };

  // Login with email and password
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // First check Firebase connectivity
      const isConnected = await checkFirebaseConnection();
      setIsFirebaseAvailable(isConnected);
      
      // If Firebase is not available, automatically use demo mode
      if (!isConnected && !isInDemoMode) {
        console.warn('Firebase unavailable, automatically enabling demo mode');
        enableDemoMode();
        
        // Try demo login
        const demoResult = await demoLogin(email, password);
        toast.success('Demo login successful (Firebase unavailable)', {
          icon: '🔌'
        });
        return demoResult;
      }

      // Try demo mode first if enabled or if Firebase fails
      if (isInDemoMode) {
        const result = await demoLogin(email, password);
        toast.success('Demo login successful');
        return result;
      }

      // Try Firebase authentication
      try {
        // Proceed with Firebase authentication
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
        
        toast.success('Login successful! Connected to Firebase', {
          icon: '🔥'
        });
        return claims;
      } catch (firebaseError: any) {
        // If Firebase authentication fails with network error, fall back to demo mode
        if (firebaseError.code === 'auth/network-request-failed' || 
            firebaseError.message?.includes('network') ||
            firebaseError.code === 'auth/timeout') {
          console.warn('Firebase network failed, falling back to demo mode');
          localStorage.setItem('restaurant-demo-mode', 'true');
          setIsInDemoMode(true);
          
          const result = await demoLogin(email, password);
          toast.success('Demo login successful (Firebase unavailable)', {
            icon: '🔌'
          });
          return result;
        }
        
        // Re-throw other Firebase errors
        throw firebaseError;
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.message.includes('Invalid email or password')) {
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
      if (isInDemoMode || currentUser?.isDemo) {
        // Demo logout
        localStorage.removeItem('restaurant-demo-session');
        localStorage.removeItem('restaurant-demo-mode');
        setCurrentUser(null);
        setIsInDemoMode(false);
        toast.success('Demo session ended');
      } else {
        // Firebase logout
        await signOut(auth);
        toast.success('Logged out successfully', {
          icon: isInDemoMode ? '🎮' : '🔥'
        });
      }
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error(error.message || 'Failed to logout');
      throw error;
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      if (isInDemoMode) {
        // Demo password reset
        if (demoUsers[email]) {
          toast.success('Demo: Password reset email sent. Use the demo credentials to login.');
        } else {
          toast.error('No demo account found with this email');
        }
        return;
      }

      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent. Check your inbox.');
    } catch (error: any) {
      console.error('Password reset error:', error);
      
      if (error.code === 'auth/user-not-found') {
        toast.error('No account found with this email');
      } else {
        toast.error(error.message || 'Failed to send password reset email');
      }
      
      throw error;
    }
  };

  // Get restaurant information for the current user
  const getRestaurantInfo = async () => {
    if (!currentUser?.venueId) {
      return null;
    }
    
    if (currentUser.isDemo) {
      // Return demo restaurant info
      return {
        id: 'demo-venue-001',
        name: 'Demo Beach Bar',
        address: '123 Demo Street, Demo City',
        phone: '+355 69 123 4567',
        email: 'info@demobeachbar.al',
        description: 'A beautiful demo beach bar for testing purposes',
        cuisine: ['Mediterranean', 'Seafood', 'Cocktails'],
        priceRange: '$$',
        hours: {
          monday: { open: '10:00', close: '23:00' },
          tuesday: { open: '10:00', close: '23:00' },
          wednesday: { open: '10:00', close: '23:00' },
          thursday: { open: '10:00', close: '23:00' },
          friday: { open: '10:00', close: '24:00' },
          saturday: { open: '10:00', close: '24:00' },
          sunday: { open: '10:00', close: '23:00' }
        },
        isDemo: true
      };
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

  // Enable demo mode manually
  const enableDemoMode = async () => {
    localStorage.setItem('restaurant-demo-mode', 'true');
    setIsInDemoMode(true);
    
    // Check Firebase status
    const isAvailable = await checkFirebaseConnection();
    setIsFirebaseAvailable(isAvailable);
    
    toast.success(`Demo mode enabled ${!isAvailable ? '(Firebase unavailable)' : ''}`, {
      icon: '🎮'
    });
  };

  // Disable demo mode
  const disableDemoMode = async () => {
    localStorage.removeItem('restaurant-demo-mode');
    localStorage.removeItem('restaurant-demo-session');
    setIsInDemoMode(false);
    
    // Check Firebase connectivity
    const isAvailable = await checkFirebaseConnection();
    setIsFirebaseAvailable(isAvailable);
    
    if (isAvailable) {
      setCurrentUser(null);
      toast.success('Demo mode disabled. Using Firebase', {
        icon: '🔥'
      });
    } else {
      // If Firebase is not available, keep demo mode enabled
      localStorage.setItem('restaurant-demo-mode', 'true');
      setIsInDemoMode(true);
      toast.error('Cannot disable demo mode: Firebase unavailable', {
        icon: '🔌'
      });
    }
  };

  return {
    currentUser,
    loading,
    login,
    logout,
    resetPassword,
    getRestaurantInfo,
    isAuthenticated: !!currentUser,
    isInDemoMode,
    enableDemoMode,
    disableDemoMode, 
    isFirebaseAvailable,
    demoUsers: Object.keys(demoUsers)
  };
};