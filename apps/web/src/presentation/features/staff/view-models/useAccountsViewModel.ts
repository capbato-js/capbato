import { useState, useCallback } from 'react';
import { container, TOKENS } from '../../../../infrastructure/di/container';
import { IAuthCommandService, RegisterUserCommand } from '@nx-starter/application-shared';
import { extractErrorMessage } from '../../../../infrastructure/utils/ErrorMapping';

export interface Account {
  id: number;
  firstName: string;
  lastName: string;
  role: 'admin' | 'doctor' | 'receptionist';
  email: string;
  mobile?: string;
}

export interface CreateAccountData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  mobile?: string;
}

// Dummy data for accounts
const initialAccounts: Account[] = [
  {
    id: 1,
    firstName: 'Anjela',
    lastName: 'Depanes',
    role: 'receptionist',
    email: 'anjela.depanes@clinic.com',
    mobile: '09123456789'
  },
  {
    id: 2,
    firstName: 'ABCD',
    lastName: 'User',
    role: 'receptionist',
    email: 'abcd@clinic.com',
    mobile: '09987654321'
  },
  {
    id: 3,
    firstName: 'John',
    lastName: 'Doe',
    role: 'doctor',
    email: 'dr.johndoe@clinic.com',
    mobile: '09111222333'
  },
  {
    id: 4,
    firstName: 'AJ',
    lastName: 'Admin',
    role: 'admin',
    email: 'admin@clinic.com',
    mobile: '09444555666'
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
      // Get the auth command service from the container
      const authCommandService = container.resolve<IAuthCommandService>(TOKENS.AuthCommandService);
      
      // Create the register command
      const registerCommand: RegisterUserCommand = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        role: data.role,
        mobile: data.mobile
      };
      
      // Call the API to create the account
      const result = await authCommandService.register(registerCommand);
      
      // Create new account for local state with generated ID from API
      const newAccount: Account = {
        id: parseInt(result.id, 10), // Convert string ID to number for local state
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role as 'admin' | 'doctor' | 'receptionist',
        email: data.email,
        mobile: data.mobile
      };
      
      setAccounts(prev => [...prev, newAccount]);
      return true;
    } catch (err) {
      const errorMessage = extractErrorMessage(err);
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

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
