import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, database, getErrorMessage } from '../db/client';
import type { User } from '@supabase/supabase-js';
import { Business } from '../types';

export interface AuthState {
  user: User | null;
  business: Business | null;
  loading: boolean;
  initialized: boolean;
}

export interface AuthContextType extends AuthState {
  signUp: (email: string, password: string, businessData: any) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateBusiness: (data: Partial<Business>) => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    business: null,
    loading: true,
    initialized: false,
  });

  const [error, setError] = useState<string | null>(null);

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Update state helper
  const updateState = (updates: Partial<AuthState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  // Sign up new user and create business
  const signUp = async (email: string, password: string, businessData: any) => {
    try {
      clearError();
      updateState({ loading: true });

      // Create auth user
      const authResponse = await auth.signUp(email, password);

      if (!authResponse.user) {
        throw new Error('Failed to create user account');
      }

      const userId = authResponse.user.id;

      // Create business record
      const businessRecord = {
        id: userId,
        name: businessData.name,
        email: businessData.email,
        phone: businessData.phone || null,
        website: businessData.website || null,
        description: businessData.description || null,
        address_line1: businessData.address_line1 || null,
        address_line2: businessData.address_line2 || null,
        address_city: businessData.address_city || null,
        address_state: businessData.address_state || null,
        address_zip_code: businessData.address_zip_code || null,
        address_country: businessData.address_country || null,
        logo_url: null,
        is_active: true,
        updated_at: new Date().toISOString(),
      };

      const createdBusiness = await database.insertBusiness(businessRecord);

      updateState({
        user: authResponse.user as User,
        business: createdBusiness,
        loading: false,
      });

    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      updateState({ loading: false });
      throw new Error(errorMessage);
    }
  };

  // Sign in existing user
  const signIn = async (email: string, password: string) => {
    try {
      clearError();
      updateState({ loading: true });

      const response = await auth.signIn(email, password);

      if (!response.user) {
        throw new Error('Failed to sign in');
      }

      // Get business data
      const business = await database.getBusinessByUserId(response.user.id);

      updateState({
        user: response.user as User,
        business,
        loading: false,
      });

    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      updateState({ loading: false });
      throw new Error(errorMessage);
    }
  };

  // Sign out current user
  const signOut = async () => {
    try {
      clearError();
      updateState({ loading: true });

      await auth.signOut();

      updateState({
        user: null,
        business: null,
        loading: false,
      });

    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      updateState({ loading: false });
      throw new Error(errorMessage);
    }
  };

  // Refresh user data
  const refreshUser = async () => {
    try {
      clearError();

      const currentUser = await auth.getCurrentUser();

      if (currentUser) {
        const business = await database.getBusinessByUserId(currentUser.id);

        updateState({
          user: currentUser as User,
          business,
        });
      } else {
        updateState({
          user: null,
          business: null,
        });
      }

    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      console.error('Error refreshing user:', errorMessage);
    }
  };

  // Update business data
  const updateBusiness = async (data: Partial<Business>) => {
    try {
      clearError();

      if (!state.user) {
        throw new Error('No user logged in');
      }

      updateState({ loading: true });

      const updatedBusiness = await database.updateBusiness(state.user.id, data);

      updateState({
        business: updatedBusiness,
        loading: false,
      });

    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      updateState({ loading: false });
      throw new Error(errorMessage);
    }
  };

  // Initialize auth state on mount
  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        // Check if there's a current session
        const currentUser = await auth.getCurrentUser();

        if (currentUser && isMounted) {
          // Get business data
          const business = await database.getBusinessByUserId(currentUser.id);

          if (isMounted) {
            updateState({
              user: currentUser as User,
              business,
              loading: false,
              initialized: true,
            });
          }
        } else if (isMounted) {
          updateState({
            user: null,
            business: null,
            loading: false,
            initialized: true,
          });
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
        if (isMounted) {
          updateState({
            user: null,
            business: null,
            loading: false,
            initialized: true,
          });
        }
      }
    };

    initializeAuth();

    // Set up auth state listener
    const { data: authListener } = auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      console.log('Auth state changed:', event, session?.user?.email);

      if (event === 'SIGNED_OUT' || !session) {
        updateState({
          user: null,
          business: null,
          loading: false,
        });
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session.user) {
          try {
            const business = await database.getBusinessByUserId(session.user.id);
            updateState({
              user: session.user as User,
              business,
              loading: false,
            });
          } catch (err) {
            console.error('Error loading business data:', err);
            updateState({
              user: session.user as User,
              business: null,
              loading: false,
            });
          }
        }
      }
    });

    // Cleanup function
    return () => {
      isMounted = false;
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const value: AuthContextType = {
    ...state,
    signUp,
    signIn,
    signOut,
    refreshUser,
    updateBusiness,
    error,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Helper hooks
export function useRequireAuth() {
  const auth = useAuth();

  if (!auth.user) {
    throw new Error('This component requires authentication');
  }

  return auth;
}

export function useBusinessAuth() {
  const auth = useRequireAuth();

  if (!auth.business) {
    throw new Error('This component requires a business profile');
  }

  return auth;
}
