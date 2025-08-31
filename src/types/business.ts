// Business types based on the database schema
export interface Business {
  id?: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  website?: string;
  description?: string;
  address_line1?: string;
  address_line2?: string;
  address_city?: string;
  address_state?: string;
  address_zip_code?: string;
  address_country?: string;
  logo_url?: string;
  is_active?: boolean;
  updated_at?: string;
}

// Business data for onboarding/forms (excludes auth fields)
export interface BusinessData {
  name: string;
  email: string;
  phone?: string;
  website?: string;
  description?: string;
  address_line1?: string;
  address_line2?: string;
  address_city?: string;
  address_state?: string;
  address_zip_code?: string;
  address_country?: string;
}

// Type for creating a business (excludes auto-generated fields)
export type CreateBusinessData = Omit<Business, "id" | "updated_at">;

// Type for updating business data
export type UpdateBusinessData = Partial<Omit<Business, "id" | "email" | "password">>;

// Business profile data (excludes sensitive fields)
export type BusinessProfile = Omit<Business, "password" | "email">;
