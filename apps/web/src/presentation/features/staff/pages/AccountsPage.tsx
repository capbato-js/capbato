import React, { useState } from 'react';
import { 
  Text,
  Alert
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Modal } from '../../../components/common';
import { DataTable, DataTableHeader, TableColumn, TableActions } from '../../../components/common/DataTable';
import { MedicalClinicLayout } from '../../../components/layout';
import { useAccountsViewModel, type CreateAccountData, type Account } from '../view-models/useEnhancedAccountsViewModel';
import { CreateAccountForm, ChangePasswordForm } from '../components';

export const AccountsPage: React.FC = () => {
  const {
    accounts,
    isLoading,
    error,
    fieldErrors,
    createAccount,
    changeAccountPassword,
    clearError,
    clearFieldErrors
  } = useAccountsViewModel();
  
  const [opened, { open, close }] = useDisclosure(false);
  const [passwordModalOpened, { open: openPasswordModal, close: closePasswordModal }] = useDisclosure(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleCreateAccount = async (data: CreateAccountData): Promise<boolean> => {
    const success = await createAccount(data);
    
    if (success) {
      close(); // Close modal
      // Accounts list will refresh automatically via view model
    }
    // Error handling is managed by the view model and displayed via error state
    
    return success;
  };

  const handleChangePassword = (account: Account) => {
    setSelectedAccount(account);
    setPasswordError(null);
    openPasswordModal();
  };

  const handleEditUserDetails = (account: Account) => {
    // TODO: Implement edit user details functionality
    console.log('Edit user details:', account);
  };

  // Transform accounts to include full name for consistency
  const accountsWithFullName = accounts.map(account => ({
    ...account,
    name: `${account.firstName} ${account.lastName}`
  }));

  const actions: TableActions<typeof accountsWithFullName[0]> = {
    buttons: [
      {
        icon: 'fas fa-edit',
        tooltip: 'Update User Details',
        onClick: handleEditUserDetails
      },
      {
        icon: 'fas fa-key',
        tooltip: 'Change Password',
        onClick: handleChangePassword
      }
    ]
  };

  const handlePasswordSubmit = async (newPassword: string) => {
    setPasswordError(null);
    
    if (!selectedAccount) return;
    
    const success = await changeAccountPassword(selectedAccount.id, newPassword);
    
    if (success) {
      closePasswordModal();
      setSelectedAccount(null);
      // Show success message - you might want to use a notification system instead
      // alert('Password changed successfully!');
    } else if (error) {
      setPasswordError(error);
    }
  };

  // Define columns for the DataTable
  const columns: TableColumn<typeof accountsWithFullName[0]>[] = [
    {
      key: 'name',
      header: 'Name',
      width: '25%',
      align: 'left',
      searchable: true
    },
    {
      key: 'role',
      header: 'Role',
      width: '20%',
      align: 'center',
      searchable: true,
      render: (value: string) => (
        <Text style={{ 
          textTransform: 'capitalize',
          fontSize: '16px',
          fontWeight: 400,
          color: 'inherit'
        }}>
          {value}
        </Text>
      )
    },
    {
      key: 'email',
      header: 'Email',
      width: '30%',
      align: 'left',
      searchable: true
    },
    {
      key: 'mobile',
      header: 'Contact Number',
      width: '25%',
      align: 'left',
      searchable: true,
      render: (value: string | undefined) => (
        <Text style={{
          fontSize: '16px',
          fontWeight: 400,
          color: 'inherit'
        }}>
          {value || '-'}
        </Text>
      )
    }
  ];

  const handleCloseModal = () => {
    clearError(); // Clear any view model errors
    clearFieldErrors(); // Clear field-specific errors
    close();
  };

  const handleClosePasswordModal = () => {
    setPasswordError(null);
    setSelectedAccount(null);
    closePasswordModal();
  };

  return (
    <MedicalClinicLayout>
      {error && (
        <Alert
          color="red"
          style={{ marginBottom: '20px' }}
          onClose={clearError}
          withCloseButton
        >
          {error}
        </Alert>
      )}

      <DataTableHeader 
        title="Accounts Management"
        onAddItem={open}
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
      />

      {/* Create Account Modal */}
      <Modal
        opened={opened}
        onClose={handleCloseModal}
        title="Create Account"
      >
        <CreateAccountForm
          onSubmit={handleCreateAccount}
          isLoading={isLoading}
          error={error}
          onClearError={clearError}
          fieldErrors={fieldErrors}
          onClearFieldErrors={clearFieldErrors}
        />
      </Modal>

      {/* Change Password Modal */}
      <Modal
        opened={passwordModalOpened}
        onClose={handleClosePasswordModal}
        title="Change Password"
      >
        {selectedAccount && (
          <ChangePasswordForm
            account={selectedAccount}
            onSubmit={handlePasswordSubmit}
            isLoading={isLoading}
            error={passwordError}
          />
        )}
      </Modal>
    </MedicalClinicLayout>
  );
};