import { useState, useCallback } from 'react';

export interface Account {
  id: number;
  name: string;
  role: 'admin' | 'doctor' | 'receptionist';
  email: string;
  phone: string;
}

export interface CreateAccountData {
  fullName: string;
  username: string;
  password: string;
  role: string;
  email: string;
  phone: string;
}

// Dummy data for accounts
const initialAccounts: Account[] = [
  {
    id: 1,
    name: 'Anjela Depanes',
    role: 'receptionist',
    email: 'anjela.depanes@clinic.com',
    phone: '09123456789'
  },
  {
    id: 2,
    name: 'abcd',
    role: 'receptionist',
    email: 'abcd@clinic.com',
    phone: '09987654321'
  },
  {
    id: 3,
    name: 'John Doe',
    role: 'doctor',
    email: 'dr.johndoe@clinic.com',
    phone: '09111222333'
  },
  {
    id: 4,
    name: 'AJ Admin',
    role: 'admin',
    email: 'admin@clinic.com',
    phone: '09444555666'
  }
];

export const useAccountsViewModel = () => {
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createAccount = useCallback(async (data: CreateAccountData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Validate required fields
      if (!data.fullName || !data.username || !data.password || !data.role || !data.email) {
        throw new Error('All required fields must be filled');
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        throw new Error('Please enter a valid email address');
      }
      
      // Validate phone format (Philippine format)
      if (data.phone && !/^09[0-9]{9}$/.test(data.phone)) {
        throw new Error('Phone number must start with 09 and be 11 digits');
      }
      
      // Check if username already exists
      if (accounts.some(account => account.name.toLowerCase() === data.fullName.toLowerCase())) {
        throw new Error('An account with this name already exists');
      }
      
      // Create new account
      const newAccount: Account = {
        id: Date.now(),
        name: data.fullName,
        role: data.role as 'admin' | 'doctor' | 'receptionist',
        email: data.email,
        phone: data.phone
      };
      
      setAccounts(prev => [...prev, newAccount]);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [accounts]);

  const changeAccountPassword = useCallback(async (accountId: number, newPassword: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // TODO: Implement actual password change logic with API
      console.log('Changing password for account:', accountId);
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change password');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteAccount = useCallback(async (accountId: number): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setAccounts(prev => prev.filter(account => account.id !== accountId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete account');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    accounts,
    isLoading,
    error,
    createAccount,
    changeAccountPassword,
    deleteAccount,
    clearError
  };
};
