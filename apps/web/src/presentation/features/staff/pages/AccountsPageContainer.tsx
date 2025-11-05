import React, { useEffect } from 'react';
import { useAccountsViewModel, Account } from '../view-models/useEnhancedAccountsViewModel';
import { useAccountModalState } from '../hooks/useAccountModalState';
import { useAccountActions } from '../hooks/useAccountActions';
import { transformAccountsWithFullName } from '../utils/accountTransformUtils';
import { AccountsPagePresenter } from './AccountsPagePresenter';
import { useOverflowHidden } from '../../../hooks/useOverflowHidden';

export const AccountsPageContainer: React.FC = () => {
  const {
    accounts,
    isLoading,
    error,
    fieldErrors,
    createAccount,
    updateAccount,
    changeAccountPassword,
    deactivateAccount,
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

  useOverflowHidden();

  const accountsWithFullName = transformAccountsWithFullName(accounts);

  const handleDeactivateAccount = (account: Account) => {
    modalState.handleOpenDeactivateModal(account);
  };

  const handleDeactivateSubmit = async () => {
    if (!modalState.selectedAccount) return;

    const success = await deactivateAccount(
      modalState.selectedAccount.id,
      `${modalState.selectedAccount.firstName} ${modalState.selectedAccount.lastName}`
    );

    if (success) {
      modalState.handleCloseDeactivateModal();
    }
  };

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
      deactivateModalOpened={modalState.deactivateModalOpened}
      selectedAccount={modalState.selectedAccount}
      doctorDetails={modalState.doctorDetails}
      passwordError={modalState.passwordError}

      // Actions
      onOpenCreateModal={modalState.handleOpenCreateModal}
      onCloseCreateModal={() => modalState.handleCloseCreateModal(clearError, clearFieldErrors)}
      onCloseUpdateModal={() => modalState.handleCloseUpdateModal(clearError, clearFieldErrors)}
      onClosePasswordModal={modalState.handleClosePasswordModal}
      onCloseDeactivateModal={modalState.handleCloseDeactivateModal}
      onCreateAccount={actions.handleCreateAccount}
      onEditUserDetails={actions.handleEditUserDetails}
      onUpdateUserDetails={actions.handleUpdateUserDetails}
      onChangePassword={actions.handleChangePassword}
      onDeactivateAccount={handleDeactivateAccount}
      onPasswordSubmit={(newPassword: string) => actions.handlePasswordSubmit(modalState.selectedAccount, newPassword)}
      onDeactivateSubmit={handleDeactivateSubmit}

      // Error handling
      onClearError={clearError}
      onClearFieldErrors={clearFieldErrors}
    />
  );
};