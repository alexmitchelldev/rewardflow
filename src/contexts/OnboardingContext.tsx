import React, { createContext, useContext, useState, ReactNode } from 'react';

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

interface OnboardingContextType {
  businessData: BusinessData;
  updateBusinessData: (data: Partial<BusinessData>) => void;
  clearBusinessData: () => void;
  isComplete: boolean;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

const initialBusinessData: BusinessData = {
  name: '',
  email: '',
  phone: '',
  website: '',
  description: '',
  address_line1: '',
  address_line2: '',
  address_city: '',
  address_state: '',
  address_zip_code: '',
  address_country: 'United Kingdom',
};

interface OnboardingProviderProps {
  children: ReactNode;
}

export function OnboardingProvider({ children }: OnboardingProviderProps) {
  const [businessData, setBusinessData] = useState<BusinessData>(initialBusinessData);

  const updateBusinessData = (data: Partial<BusinessData>) => {
    setBusinessData(prev => ({ ...prev, ...data }));
  };

  const clearBusinessData = () => {
    setBusinessData(initialBusinessData);
  };

  const isComplete = businessData.name.trim() !== '' && businessData.email.trim() !== '';

  const value = {
    businessData,
    updateBusinessData,
    clearBusinessData,
    isComplete,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}