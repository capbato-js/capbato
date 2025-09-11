import { useCallback } from 'react';
import type { CreateAccountData, UpdateAccountData, Account } from '../view-models/useEnhancedAccountsViewModel';
import { UpdateUserDetailsCommand } from '@nx-starter/application-shared';
import { transformUpdateCommand } from '../utils/accountTransformUtils';

export const useAccountActions = (
  createAccount: (data: CreateAccountData) => Promise<boolean>,
  updateAccount: (data: UpdateAccountData) => Promise<boolean>,
  changeAccountPassword: (id: string, newPassword: string) => Promise<boolean>,
  getDoctorDetails: (accountId: string) => Promise<any>,
  error: string | null,
  modalActions: {
    handleCloseCreateModal: (clearError: () => void, clearFieldErrors: () => void) => void;
    handleCloseUpdateModal: (clearError: () => void, clearFieldErrors: () => void) => void;
    handleClosePasswordModal: () => void;
    handleOpenUpdateModal: (account: Account, details?: any) => void;
    handleOpenPasswordModal: (account: Account) => void;
    clearSelectedAccountDelayed: () => void;
    setPasswordError: (error: string | null) => void;
  },
  clearError: () => void,
  clearFieldErrors: () => void
) => {
  const handleCreateAccount = useCallback(async (data: CreateAccountData): Promise<boolean> => {
    const success = await createAccount(data);
    
    if (success) {
      modalActions.handleCloseCreateModal(clearError, clearFieldErrors);
    }
    
    return success;
  }, [createAccount, modalActions, clearError, clearFieldErrors]);

  const handleEditUserDetails = useCallback(async (account: Account) => {
    let doctorDetails = null;
    
    if (account.role === 'doctor') {
      try {
        doctorDetails = await getDoctorDetails(account.id);
      } catch (error) {
        console.warn('Could not fetch doctor details:', error);
      }
    }
    
    modalActions.handleOpenUpdateModal(account, doctorDetails);
  }, [getDoctorDetails, modalActions]);

  const handleUpdateUserDetails = useCallback(async (data: UpdateUserDetailsCommand): Promise<boolean> => {
    const updateAccountData = transformUpdateCommand(data);
    const success = await updateAccount(updateAccountData);
    
    if (success) {
      modalActions.handleCloseUpdateModal(clearError, clearFieldErrors);
    }
    
    return success;
  }, [updateAccount, modalActions, clearError, clearFieldErrors]);

  const handleChangePassword = useCallback((account: Account) => {
    modalActions.handleOpenPasswordModal(account);
  }, [modalActions]);

  const handlePasswordSubmit = useCallback(async (selectedAccount: Account | null, newPassword: string) => {
    modalActions.setPasswordError(null);
    
    if (!selectedAccount) return;
    
    const success = await changeAccountPassword(selectedAccount.id, newPassword);
    
    if (success) {
      modalActions.handleClosePasswordModal();
    } else if (error) {
      modalActions.setPasswordError(error);
    }
  }, [changeAccountPassword, error, modalActions]);

  return {
    handleCreateAccount,
    handleEditUserDetails,
    handleUpdateUserDetails,
    handleChangePassword,
    handlePasswordSubmit,
  };
};