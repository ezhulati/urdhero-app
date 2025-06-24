import { useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  User,
  updateProfile
} from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  emailVerified: boolean;
  phoneNumber: string | null;
  photoURL: string | null;
  role?: string;
  venueId?: string;
}

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Subscribe to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Convert Firebase User to AuthUser
        const authUser: AuthUser = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          emailVerified: user.emailVerified,
          phoneNumber: user.phoneNumber,
          photoURL: user.photoURL,
        };
        
        // If user has custom claims, add them to the AuthUser
        user.getIdTokenResult().then((idTokenResult) => {
          if (idTokenResult.claims.role) {
            authUser.role = idTokenResult.claims.role as string;
          }
          
          if (idTokenResult.claims.venueId) {
            authUser.venueId = idTokenResult.claims.venueId as string;
          }
          
          setCurrentUser(authUser);
          setLoading(false);
        });
      } else {
        setCurrentUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Register a new user
  const register = async (email: string, password: string, displayName: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update profile
      await updateProfile(user, { displayName });
      
      // Send verification email
      await sendEmailVerification(user);
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email,
        displayName,
        createdAt: serverTimestamp(),
        emailVerified: false,
        preferences: {
          dietary: [],
          favoriteItems: [],
          defaultTable: null
        },
        orderHistory: [],
        totalOrders: 0
      });
      
      toast.success('Registration successful! Please check your email for verification.');
      return user;
    } catch (error: any) {
      console.error('Registration error:', error);
      
      if (error.code === 'auth/email-already-in-use') {
        toast.error('This email is already in use');
      } else {
        toast.error(error.message || 'Failed to register');
      }
      
      throw error;
    }
  };

  // Login with email and password
  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Update last login time
      const userDoc = doc(db, 'users', userCredential.user.uid);
      await updateDoc(userDoc, {
        lastLoginAt: serverTimestamp()
      });
      
      toast.success('Login successful!');
      return userCredential.user;
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

  // Send password reset email
  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent!');
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

  // Send email verification
  const sendVerificationEmail = async (user: User) => {
    try {
      await sendEmailVerification(user);
      toast.success('Verification email sent!');
    } catch (error: any) {
      console.error('Email verification error:', error);
      toast.error(error.message || 'Failed to send verification email');
      throw error;
    }
  };

  // Get user profile data
  const getUserProfile = async (userId: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (userDoc.exists()) {
        return userDoc.data();
      }
      
      return null;
    } catch (error) {
      console.error('Get user profile error:', error);
      return null;
    }
  };

  // Update user profile
  const updateUserProfile = async (userId: string, data: any) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        ...data,
        updatedAt: serverTimestamp()
      });
      
      // Update display name if provided
      if (data.displayName && auth.currentUser) {
        await updateProfile(auth.currentUser, { 
          displayName: data.displayName,
          photoURL: data.photoURL || auth.currentUser.photoURL
        });
      }
      
      toast.success('Profile updated successfully');
      return true;
    } catch (error: any) {
      console.error('Update profile error:', error);
      toast.error(error.message || 'Failed to update profile');
      return false;
    }
  };

  return {
    currentUser,
    loading,
    register,
    login,
    logout,
    resetPassword,
    sendVerificationEmail,
    getUserProfile,
    updateUserProfile
  };
};