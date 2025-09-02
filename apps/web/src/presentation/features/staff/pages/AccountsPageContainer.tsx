import React, { useEffect } from 'react';
import { useAccountsViewModel } from '../view-models/useEnhancedAccountsViewModel';
import { useAccountModalState } from '../hooks/useAccountModalState';
import { useAccountActions } from '../hooks/useAccountActions';
import { transformAccountsWithFullName } from '../utils/accountTransformUtils';
import { AccountsPagePresenter } from './AccountsPagePresenter';

export const AccountsPageContainer: React.FC = () => {
  const {
    accounts,
    isLoading,
    error,
    fieldErrors,
    createAccount,
    updateAccount,
    changeAccountPassword,
    clearError,
    clearFieldErrors,
    getDoctorDetails
  } = useAccountsViewModel();

  const modalState = useAccountModalState();

  const actions = useAccountActions(
    createAccount,
    updateAccount,
    changeAccountPassword,
    getDoctorDetails,
    error,
    {
      handleCloseCreateModal: modalState.handleCloseCreateModal,
      handleCloseUpdateModal: modalState.handleCloseUpdateModal,
      handleClosePasswordModal: modalState.handleClosePasswordModal,
      handleOpenUpdateModal: modalState.handleOpenUpdateModal,
      handleOpenPasswordModal: modalState.handleOpenPasswordModal,
      clearSelectedAccountDelayed: modalState.clearSelectedAccountDelayed,
      setPasswordError: modalState.setPasswordError,
    },
    clearError,
    clearFieldErrors
  );

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const accountsWithFullName = transformAccountsWithFullName(accounts);

  return (
    <AccountsPagePresenter
      // Data
      accountsWithFullName={accountsWithFullName}
      isLoading={isLoading}
      error={error}
      fieldErrors={fieldErrors}
      
      // Modal state
      opened={modalState.opened}
      updateModalOpened={modalState.updateModalOpened}
      passwordModalOpened={modalState.passwordModalOpened}
      selectedAccount={modalState.selectedAccount}
      doctorDetails={modalState.doctorDetails}
      passwordError={modalState.passwordError}
      
      // Actions
      onOpenCreateModal={modalState.handleOpenCreateModal}
      onCloseCreateModal={() => modalState.handleCloseCreateModal(clearError, clearFieldErrors)}
      onCloseUpdateModal={() => modalState.handleCloseUpdateModal(clearError, clearFieldErrors)}
      onClosePasswordModal={modalState.handleClosePasswordModal}
      onCreateAccount={actions.handleCreateAccount}
      onEditUserDetails={actions.handleEditUserDetails}
      onUpdateUserDetails={actions.handleUpdateUserDetails}
      onChangePassword={actions.handleChangePassword}
      onPasswordSubmit={(newPassword: string) => actions.handlePasswordSubmit(modalState.selectedAccount, newPassword)}
      
      // Error handling
      onClearError={clearError}
      onClearFieldErrors={clearFieldErrors}
    />
  );
};