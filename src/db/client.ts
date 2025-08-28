import { createClient } from "@supabase/supabase-js";
import { checkEnvironmentConfiguration, logEnvironmentStatus } from "../utils/envChecker";

// Check environment configuration on initialization
const envConfig = checkEnvironmentConfiguration();
logEnvironmentStatus();

// Environment variables - these should be set in your .env.local file
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Create the Supabase client for auth and database operations
export const supabase = envConfig.hasSupabase ? createClient(supabaseUrl!, supabaseAnonKey!) : null;

// Auth helper functions
export const authHelpers = {
  // Sign up a new user with email and password
  signUp: async (email: string, password: string) => {
    if (!supabase) {
      throw new Error("Supabase client not initialized");
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return data;
  },

  // Sign in existing user
  signIn: async (email: string, password: string) => {
    if (!supabase) {
      throw new Error("Supabase client not initialized");
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return data;
  },

  // Sign out current user
  signOut: async () => {
    if (!supabase) {
      throw new Error("Supabase client not initialized");
    }

    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  },

  // Get current user
  getCurrentUser: async () => {
    if (!supabase) {
      return null;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  },

  // Listen to auth state changes
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    if (!supabase) {
      return { data: { subscription: null } };
    }

    return supabase.auth.onAuthStateChange(callback);
  },
};

// Database helper functions using Supabase client
export const dbHelpers = {
  // Insert business using Supabase client
  insertBusiness: async (businessData: any) => {
    if (!supabase) {
      throw new Error("No database connection available");
    }

    const { data, error } = await supabase.from("businesses").insert([businessData]).select().single();

    if (error) {
      throw error;
    }

    return data;
  },

  // Get business by user ID
  getBusinessByUserId: async (userId: string) => {
    if (!supabase) {
      throw new Error("No database connection available");
    }

    const { data, error } = await supabase.from("businesses").select("*").eq("id", userId).single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 is "not found" error, which is ok
      throw error;
    }

    return data;
  },

  // Update business
  updateBusiness: async (userId: string, updateData: any) => {
    if (!supabase) {
      throw new Error("No database connection available");
    }

    const { data, error } = await supabase.from("businesses").update(updateData).eq("id", userId).select().single();

    if (error) {
      throw error;
    }

    return data;
  },

  // Delete business
  deleteBusiness: async (userId: string) => {
    if (!supabase) {
      throw new Error("No database connection available");
    }

    const { error } = await supabase.from("businesses").delete().eq("id", userId);

    if (error) {
      throw error;
    }

    return true;
  },
};

// Mock functions for development when Supabase is not available
const mockHelpers = {
  signUp: async (email: string, password: string) => {
    console.log(`🚧 MOCK MODE: Creating user account for email: ${email}`);
    console.log(`ℹ️  To enable real authentication, see SUPABASE_SETUP.md`);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      user: {
        id: crypto.randomUUID(),
        email,
        email_confirmed_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      },
      session: null,
    };
  },

  signIn: async (email: string, password: string) => {
    console.log(`🚧 MOCK MODE: Signing in user: ${email}`);
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      user: {
        id: crypto.randomUUID(),
        email,
        email_confirmed_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      },
      session: {
        access_token: "mock-access-token",
        refresh_token: "mock-refresh-token",
      },
    };
  },

  signOut: async () => {
    console.log(`🚧 MOCK MODE: Signing out user`);
    await new Promise((resolve) => setTimeout(resolve, 300));
  },

  getCurrentUser: async () => {
    console.log(`🚧 MOCK MODE: Getting current user`);
    return null;
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    console.log(`🚧 MOCK MODE: Auth state change listener registered`);
    return { data: { subscription: null } };
  },

  insertBusiness: async (businessData: any) => {
    console.log("🚧 MOCK MODE: Business registration data:", businessData);
    console.log(`ℹ️  To save to real database, see SUPABASE_SETUP.md`);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return { ...businessData, id: businessData.id || crypto.randomUUID() };
  },

  getBusinessByUserId: async (userId: string) => {
    console.log(`🚧 MOCK MODE: Getting business for user: ${userId}`);
    await new Promise((resolve) => setTimeout(resolve, 300));
    return null;
  },

  updateBusiness: async (userId: string, updateData: any) => {
    console.log(`🚧 MOCK MODE: Updating business for user: ${userId}`, updateData);
    await new Promise((resolve) => setTimeout(resolve, 400));
    return { ...updateData, id: userId };
  },

  deleteBusiness: async (userId: string) => {
    console.log(`🚧 MOCK MODE: Deleting business for user: ${userId}`);
    await new Promise((resolve) => setTimeout(resolve, 300));
    return true;
  },
};

// Export the appropriate helpers based on availability
export const auth = envConfig.hasSupabase ? authHelpers : mockHelpers;
export const database = envConfig.hasSupabase ? dbHelpers : mockHelpers;

// Export configuration status for components to use
export const isConfigured = envConfig.isConfigured;
export const isMockMode = !envConfig.hasSupabase;

// Export types
export type SupabaseClient = typeof supabase;

// Export helper for getting error messages
export const getErrorMessage = (error: any): string => {
  if (typeof error === "string") {
    return error;
  }

  if (error?.message) {
    // Handle specific Supabase auth errors
    if (error.message.includes("User already registered")) {
      return "An account with this email already exists. Please use a different email or sign in instead.";
    }
    if (error.message.includes("Invalid login credentials")) {
      return "Invalid email or password. Please check your credentials and try again.";
    }
    if (error.message.includes("Email not confirmed")) {
      return "Please check your email and click the verification link before signing in.";
    }
    if (error.message.includes("Password should be at least 6 characters")) {
      return "Password must be at least 6 characters long.";
    }
    if (error.message.includes("Unable to validate email address")) {
      return "Please enter a valid email address.";
    }
    if (error.message.includes("signup_disabled")) {
      return "New user signups are currently disabled. Please contact support.";
    }

    return error.message;
  }

  if (error?.error_description) {
    return error.error_description;
  }

  return "An unexpected error occurred. Please try again.";
};
