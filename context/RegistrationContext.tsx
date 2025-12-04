

import React, { createContext, useContext, useState } from 'react';
import { RegistrationState } from '../types';

interface RegistrationContextType {
  data: RegistrationState;
  updateData: (newData: Partial<RegistrationState>) => void;
  updateBasicInfo: (info: Partial<RegistrationState['basicInfo']>) => void;
  updateProviderInfo: (info: Partial<RegistrationState['providerInfo']>) => void;
  reset: () => void;
}

const initialState: RegistrationState = {
  role: null,
  basicInfo: {
    name: '',
    phone: '',
    birthDate: '',
    email: '',
    password: '',
    confirmPassword: '',
    condoName: '',
    address: ''
  },
  providerInfo: {
    document: '',
    type: null,
    categories: [],
    bio: ''
  },
  step: 1,
  residentInfo: {
    condo: '',
    block: '',
    unit: ''
  }
};

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

export const RegistrationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<RegistrationState>(initialState);

  const updateData = (newData: Partial<RegistrationState>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const updateBasicInfo = (info: Partial<RegistrationState['basicInfo']>) => {
    setData(prev => ({
      ...prev,
      basicInfo: { ...prev.basicInfo, ...info }
    }));
  };

  const updateProviderInfo = (info: Partial<RegistrationState['providerInfo']>) => {
    setData(prev => ({
      ...prev,
      providerInfo: { ...prev.providerInfo, ...info }
    }));
  };

  const reset = () => setData(initialState);

  return (
    <RegistrationContext.Provider value={{ data, updateData, updateBasicInfo, updateProviderInfo, reset }}>
      {children}
    </RegistrationContext.Provider>
  );
};

export const useRegistration = () => {
  const context = useContext(RegistrationContext);
  if (!context) throw new Error('useRegistration must be used within a RegistrationProvider');
  return context;
};