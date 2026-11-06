import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile as updateFirebaseProfile,
  signInAnonymously
} from 'firebase/auth';
import { auth } from '../firebase';
import { UserProfile, UserRole } from '../types';
import { getUserProfile, saveUserProfile } from '../services/eventService';

const ADMIN_EMAIL = 'joshikasri104@gmail.com';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  isAdmin: boolean;
  isLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (name: string, email: string, pass: string, role: UserRole, phone?: string) => Promise<void>;
  loginAsDemoAdmin: () => Promise<void>;
  loginAsDemoUser: () => Promise<void>;
  logout: () => Promise<void>;
  updateCurrentProfile: (updates: Partial<UserProfile>) => Promise<void>;
  switchRoleForTesting: (newRole: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sync profile when auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          let profile = await getUserProfile(user.uid);
          if (!profile) {
            const isInitialAdmin = user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
            profile = {
              id: user.uid,
              email: user.email || `user_${user.uid.slice(0, 5)}@eventease.demo`,
              displayName: user.displayName || (isInitialAdmin ? 'Lead Organizer' : 'Event Attendee'),
              role: isInitialAdmin ? 'admin' : 'user',
              avatarUrl: user.photoURL || undefined,
              createdAt: new Date().toISOString(),
            };
            await saveUserProfile(profile);
          }
          setUserProfile(profile);
        } catch (error) {
          console.warn('Error loading or creating user profile:', error);
          // Fallback profile if Firestore permission is delayed
          setUserProfile({
            id: user.uid,
            email: user.email || 'user@eventease.app',
            displayName: user.displayName || 'Event Attendee',
            role: user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'user',
            createdAt: new Date().toISOString(),
          });
        }
      } else {
        setUserProfile(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      setIsLoading(false);
      console.error('Google Sign In Error:', error);
      throw error;
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error: any) {
      setIsLoading(false);
      // Clean up common Firebase Auth error messages
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        throw new Error('Invalid email or password. Please verify your credentials.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Please enter a valid email address.');
      }
      throw error;
    }
  };

  const registerWithEmail = async (
    name: string,
    email: string,
    pass: string,
    role: UserRole,
    phone?: string
  ) => {
    setIsLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      if (cred.user) {
        await updateFirebaseProfile(cred.user, { displayName: name });
        const newProfile: UserProfile = {
          id: cred.user.uid,
          email: cred.user.email || email,
          displayName: name,
          role,
          phone: phone || '',
          createdAt: new Date().toISOString(),
        };
        await saveUserProfile(newProfile);
        setUserProfile(newProfile);
      }
    } catch (error: any) {
      setIsLoading(false);
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('An account with this email address already exists. Please log in instead.');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('Password must be at least 6 characters long.');
      }
      throw error;
    }
  };

  // Demo Admin Login (for instant testing & demonstration)
  const loginAsDemoAdmin = async () => {
    setIsLoading(true);
    try {
      // First try signing in anonymously or with mock demo email
      const cred = await signInAnonymously(auth);
      const adminProfile: UserProfile = {
        id: cred.user.uid,
        email: ADMIN_EMAIL,
        displayName: 'Administrator (Demo)',
        role: 'admin',
        bio: 'Senior Event Director & System Administrator',
        createdAt: new Date().toISOString(),
      };
      await saveUserProfile(adminProfile);
      setUserProfile(adminProfile);
    } catch (error: any) {
      console.warn('Anonymous demo login fallback:', error);
      // Fallback local demo state if anonymous auth isn't enabled in console
      setUserProfile({
        id: 'demo-admin-uid-101',
        email: ADMIN_EMAIL,
        displayName: 'Administrator (Demo)',
        role: 'admin',
        bio: 'Senior Event Director & System Administrator',
        createdAt: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Demo User Login (for instant attendee booking testing)
  const loginAsDemoUser = async () => {
    setIsLoading(true);
    try {
      const cred = await signInAnonymously(auth);
      const userProf: UserProfile = {
        id: cred.user.uid,
        email: 'alex.rivers@example.com',
        displayName: 'Alex Rivers',
        role: 'user',
        phone: '+1 (555) 234-8901',
        bio: 'Passionate tech enthusiast and live concert lover.',
        createdAt: new Date().toISOString(),
      };
      await saveUserProfile(userProf);
      setUserProfile(userProf);
    } catch (error: any) {
      console.warn('Anonymous demo login fallback:', error);
      setUserProfile({
        id: 'demo-user-uid-202',
        email: 'alex.rivers@example.com',
        displayName: 'Alex Rivers',
        role: 'user',
        phone: '+1 (555) 234-8901',
        bio: 'Passionate tech enthusiast and live concert lover.',
        createdAt: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Signout note:', e);
    }
    setCurrentUser(null);
    setUserProfile(null);
  };

  const updateCurrentProfile = async (updates: Partial<UserProfile>) => {
    if (!userProfile) return;
    const updated = { ...userProfile, ...updates };
    setUserProfile(updated);
    try {
      await saveUserProfile(updated);
    } catch (err) {
      console.error('Failed to update profile in Firestore:', err);
    }
  };

  const switchRoleForTesting = async (newRole: UserRole) => {
    if (!userProfile) return;
    await updateCurrentProfile({ role: newRole });
  };

  const isAdmin =
    userProfile?.role === 'admin' ||
    currentUser?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        isAdmin,
        isLoading,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        loginAsDemoAdmin,
        loginAsDemoUser,
        logout,
        updateCurrentProfile,
        switchRoleForTesting,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
