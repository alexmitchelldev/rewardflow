import { createClient } from "@supabase/supabase-js";
import { checkEnvironmentConfiguration, logEnvironmentStatus } from "../utils/envChecker";

// Check environment configuration on initialization
const envConfig = checkEnvironmentConfiguration();
logEnvironmentStatus();

// Environment variables - these should be set in your .env.local file
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Ensure Supabase is properly configured
if (!envConfig.hasSupabase) {
  throw new Error("Supabase configuration is required. Please check your environment variables and see SUPABASE_SETUP.md for setup instructions.");
}

// Create the Supabase client for auth and database operations
export const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

// Auth helper functions
export const authHelpers = {
  // Sign up a new user with email and password
  signUp: async (email: string, password: string) => {
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
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  },

  // Get current user
  getCurrentUser: async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  },

  // Listen to auth state changes
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  },
};

// Database helper functions using Supabase client
export const dbHelpers = {
  // Insert business using Supabase client
  insertBusiness: async (businessData: any) => {
    const { data, error } = await supabase.from("businesses").insert([businessData]).select().single();

    if (error) {
      throw error;
    }

    return data;
  },

  // Get business by user ID
  getBusinessByUserId: async (businessId: string) => {
    const { data, error } = await supabase.from("businesses").select("*").eq("id", businessId).maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  },

  // Update business
  updateBusiness: async (businessId: string, updateData: any) => {
    const { data, error } = await supabase.from("businesses").update(updateData).eq("id", businessId).select().single();

    if (error) {
      throw error;
    }

    return data;
  },

  // Delete business
  deleteBusiness: async (businessId: string) => {
    const { error } = await supabase.from("businesses").delete().eq("id", businessId);

    if (error) {
      throw error;
    }

    return true;
  },

  // Product operations
  insertProduct: async (productData: any) => {
    const { data, error } = await supabase.from("products").insert([productData]).select().single();

    if (error) {
      throw error;
    }

    return data;
  },

  getProductsByBusinessId: async (businessId: string) => {
    const { data, error } = await supabase.from("products").select("*").eq("business_id", businessId).order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  },

  updateProduct: async (productId: number, updateData: any) => {
    const { data, error } = await supabase.from("products").update(updateData).eq("id", productId).select().single();

    if (error) {
      throw error;
    }

    return data;
  },

  deleteProduct: async (productId: number) => {
    const { error } = await supabase.from("products").delete().eq("id", productId);

    if (error) {
      throw error;
    }

    return true;
  },

  getProductById: async (productId: number) => {
    const { data, error } = await supabase.from("products").select("*").eq("id", productId).maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  },

  // Customer operations
  insertCustomer: async (customerData: any) => {
    const { data, error } = await supabase.from("customers").insert([customerData]).select().single();

    if (error) {
      throw error;
    }

    return data;
  },

  getCustomersByBusinessId: async (businessId: string) => {
    const { data, error } = await supabase.from("customers").select("*").eq("business_id", businessId);

    if (error) {
      throw error;
    }

    return data || [];
  },

  updateCustomer: async (customerId: number, updateData: any) => {
    const { data, error } = await supabase.from("customers").update(updateData).eq("id", customerId).select().single();

    if (error) {
      throw error;
    }

    return data;
  },

  deleteCustomer: async (customerId: number) => {
    const { error } = await supabase.from("customers").delete().eq("id", customerId);

    if (error) {
      throw error;
    }

    return true;
  },

  getCustomerById: async (customerId: number) => {
    const { data, error } = await supabase.from("customers").select("*").eq("id", customerId).maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  },

  // Transaction operations
  insertTransaction: async (transactionData: any) => {
    const { data, error } = await supabase.from("transactions").insert([transactionData]).select().single();

    if (error) {
      throw error;
    }

    return data;
  },

  getTransactionsByCustomerId: async (customerId: number) => {
    const { data, error } = await supabase.from("transactions").select("*, products(*)").eq("customer_id", customerId).order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  },

  getTransactionsByBusinessId: async (businessId: string) => {
    const { data, error } = await supabase.from("transactions").select("*, customers(*), products(*)").eq("business_id", businessId).order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  },

  updateTransaction: async (transactionId: number, updateData: any) => {
    const { data, error } = await supabase.from("transactions").update(updateData).eq("id", transactionId).select().single();

    if (error) {
      throw error;
    }

    return data;
  },

  deleteTransaction: async (transactionId: number) => {
    const { error } = await supabase.from("transactions").delete().eq("id", transactionId);

    if (error) {
      throw error;
    }

    return true;
  },

  getTransactionById: async (transactionId: number) => {
    const { data, error } = await supabase.from("transactions").select("*, customers(*), products(*)").eq("id", transactionId).maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  },
};

// Export the helpers directly (no conditional logic)
export const auth = authHelpers;
export const database = dbHelpers;

// Export configuration status for components to use
export const isConfigured = envConfig.isConfigured;

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
