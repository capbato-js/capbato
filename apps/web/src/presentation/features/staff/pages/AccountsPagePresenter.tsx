import React from 'react';
import { Alert } from '@mantine/core';
import { Modal } from '../../../components/common';
import { DataTable, DataTableHeader } from '../../../components/common/DataTable';
import { MedicalClinicLayout } from '../../../components/layout';
import { CreateAccountForm, ChangePasswordForm, UpdateUserDetailsForm } from '../components';
import { getAccountsTableColumns, getAccountsTableActions } from '../config/accountsTableConfig';
import type { Account, CreateAccountData } from '../view-models/useEnhancedAccountsViewModel';
import { UpdateUserDetailsCommand, DoctorDto } from '@nx-starter/application-shared';

type AccountWithFullName = Account & { name: string };

interface AccountsPagePresenterProps {
  // Data
  accountsWithFullName: AccountWithFullName[];
  isLoading: boolean;
  error: string | null;
  fieldErrors: Record<string, string>;
  
  // Modal state
  opened: boolean;
  updateModalOpened: boolean;
  passwordModalOpened: boolean;
  selectedAccount: Account | null;
  doctorDetails: DoctorDto | null;
  passwordError: string | null;
  
  // Actions
  onOpenCreateModal: () => void;
  onCloseCreateModal: () => void;
  onCloseUpdateModal: () => void;
  onClosePasswordModal: () => void;
  onCreateAccount: (data: CreateAccountData) => Promise<boolean>;
  onEditUserDetails: (account: Account) => Promise<void>;
  onUpdateUserDetails: (data: UpdateUserDetailsCommand) => Promise<boolean>;
  onChangePassword: (account: Account) => void;
  onPasswordSubmit: (newPassword: string) => Promise<void>;
  
  // Error handling
  onClearError: () => void;
  onClearFieldErrors: () => void;
}

export const AccountsPagePresenter: React.FC<AccountsPagePresenterProps> = ({
  accountsWithFullName,
  isLoading,
  error,
  fieldErrors,
  opened,
  updateModalOpened,
  passwordModalOpened,
  selectedAccount,
  doctorDetails,
  passwordError,
  onOpenCreateModal,
  onCloseCreateModal,
  onCloseUpdateModal,
  onClosePasswordModal,
  onCreateAccount,
  onEditUserDetails,
  onUpdateUserDetails,
  onChangePassword,
  onPasswordSubmit,
  onClearError,
  onClearFieldErrors,
}) => {
  const columns = getAccountsTableColumns();
  const actions = getAccountsTableActions({
    onEdit: onEditUserDetails,
    onChangePassword: onChangePassword,
  });

  return (
    <MedicalClinicLayout>
      {error && (
        <Alert
          color="red"
          style={{ marginBottom: '20px' }}
          onClose={onClearError}
          withCloseButton
        >
          {error}
        </Alert>
      )}

      <DataTableHeader 
        title="Accounts Management"
        onAddItem={onOpenCreateModal}
        addButtonText="Create Account"
        addButtonIcon="fas fa-user-plus"
      />

      <DataTable
        data={accountsWithFullName}
        columns={columns}
        actions={actions}
        searchable={true}
        searchPlaceholder="Search accounts by name, role, email, or contact number..."
        emptyStateMessage="No accounts found"
        isLoading={isLoading}
        useViewportHeight={true}
        bottomPadding={90}
      />

      {/* Create Account Modal */}
      <Modal
        opened={opened}
        onClose={onCloseCreateModal}
        title="Create Account"
      >
        <CreateAccountForm
          onSubmit={onCreateAccount}
          isLoading={isLoading}
          error={error}
          onClearError={onClearError}
          fieldErrors={fieldErrors}
          onClearFieldErrors={onClearFieldErrors}
        />
      </Modal>

      {/* Update User Details Modal */}
      <Modal
        opened={updateModalOpened}
        onClose={onCloseUpdateModal}
        title="Update User Details"
      >
        {selectedAccount && (
          <UpdateUserDetailsForm
            userData={{
              id: selectedAccount.id,
              firstName: selectedAccount.firstName,
              lastName: selectedAccount.lastName,
              email: selectedAccount.email,
              mobile: selectedAccount.mobile || '',
              role: selectedAccount.role,
              specialization: doctorDetails?.specialization || selectedAccount.specialization,
              licenseNumber: doctorDetails?.licenseNumber || selectedAccount.licenseNumber,
              experienceYears: doctorDetails?.yearsOfExperience || selectedAccount.experienceYears,
              schedulePattern: doctorDetails?.schedulePattern || selectedAccount.schedulePattern,
            }}
            onSubmit={onUpdateUserDetails}
            isLoading={isLoading}
            error={error}
            onClearError={onClearError}
            fieldErrors={fieldErrors}
            onClearFieldErrors={onClearFieldErrors}
          />
        )}
      </Modal>

      {/* Change Password Modal */}
      <Modal
        opened={passwordModalOpened}
        onClose={onClosePasswordModal}
        title="Change Password"
      >
        {selectedAccount && (
          <ChangePasswordForm
            account={selectedAccount}
            onSubmit={onPasswordSubmit}
            isLoading={isLoading}
            error={passwordError}
          />
        )}
      </Modal>
    </MedicalClinicLayout>
  );
};