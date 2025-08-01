import { useEffect, useState, useCallback } from 'react';
import { useUserStore } from '../../../../infrastructure/state/UserStore';
import { container, TOKENS } from '../../../../infrastructure/di/container';
import { IAuthCommandService, RegisterUserCommand, UserDto } from '@nx-starter/application-shared';
import { extractErrorMessage } from '../../../../infrastructure/utils/ErrorMapping';

// Local Account interface for the view layer
export interface Account {
  id: string; // Changed from number to string to match API
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

/**
 * Enhanced Accounts View Model Interface
 * Contract between view model and views
 */
export interface IAccountsViewModel {
  // State
  accounts: Account[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadAccounts: () => Promise<void>;
  createAccount: (data: CreateAccountData) => Promise<boolean>;
  changeAccountPassword: (accountId: string, newPassword: string) => Promise<boolean>;
  deleteAccount: (accountId: string) => Promise<void>;
  clearError: () => void;
  refreshAccounts: () => Promise<void>;
}

/**
 * Enhanced Accounts View Model Implementation
 * Handles presentation logic and coordinates with application services
 */
export const useAccountsViewModel = (): IAccountsViewModel => {
  const { users, isLoading: storeLoading, error: storeError, fetchUsers, clearError: clearStoreError } = useUserStore();
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Transform UserDto to Account for the view layer
  const transformUserToAccount = useCallback((user: UserDto): Account => ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role as 'admin' | 'doctor' | 'receptionist',
    email: user.email,
    mobile: user.mobile,
  }), []);

  // Convert users to accounts for the view
  const accounts: Account[] = users.map(transformUserToAccount);

  // Combined loading state
  const isLoading = storeLoading || localLoading;

  // Combined error state (prefer local error over store error)
  const error = localError || storeError;

  // Load accounts on mount
  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = useCallback(async () => {
    clearLocalError();
    await fetchUsers();
  }, [fetchUsers]);

  const refreshAccounts = useCallback(async () => {
    await loadAccounts();
  }, [loadAccounts]);

  const createAccount = useCallback(async (data: CreateAccountData): Promise<boolean> => {
    setLocalLoading(true);
    setLocalError(null);
    
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
      await authCommandService.register(registerCommand);
      
      // Refresh the accounts list to show the new account
      await refreshAccounts();
      
      return true;
    } catch (err) {
      const errorMessage = extractErrorMessage(err);
      setLocalError(errorMessage);
      return false;
    } finally {
      setLocalLoading(false);
    }
  }, [refreshAccounts]);

  const changeAccountPassword = useCallback(async (accountId: string, newPassword: string): Promise<boolean> => {
    setLocalLoading(true);
    setLocalError(null);
    
    try {
      // TODO: Implement actual password change logic with API
      // For now, simulate the operation
      await new Promise(resolve => setTimeout(resolve, 300));
      
      console.log('Changing password for account:', accountId, newPassword);
      
      return true;
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Failed to change password');
      return false;
    } finally {
      setLocalLoading(false);
    }
  }, []);

  const deleteAccount = useCallback(async (accountId: string): Promise<void> => {
    setLocalLoading(true);
    setLocalError(null);
    
    try {
      // TODO: Implement actual delete logic with API
      // For now, simulate the operation
      await new Promise(resolve => setTimeout(resolve, 300));
      
      console.log('Deleting account:', accountId);
      
      // Refresh accounts after deletion
      await refreshAccounts();
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Failed to delete account');
    } finally {
      setLocalLoading(false);
    }
  }, [refreshAccounts]);

  const clearLocalError = useCallback(() => {
    setLocalError(null);
  }, []);

  const clearError = useCallback(() => {
    clearLocalError();
    clearStoreError();
  }, [clearStoreError]);

  return {
    accounts,
    isLoading,
    error,
    loadAccounts,
    createAccount,
    changeAccountPassword,
    deleteAccount,
    clearError,
    refreshAccounts,
  };
};
