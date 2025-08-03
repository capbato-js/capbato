import React, { useState } from 'react';
import { 
  Button,
  Text,
  Alert
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Icon, Modal } from '../../../components/common';
import { DataTable, DataTableHeader, TableColumn } from '../../../components/common/DataTable';
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
  const columns: TableColumn<Account>[] = [
    {
      key: 'name',
      header: 'Name',
      width: '40%',
      align: 'left',
      searchable: true
    },
    {
      key: 'role',
      header: 'Role',
      width: '30%',
      align: 'center',
      searchable: true,
      render: (value: string) => (
        <Text style={{ textTransform: 'capitalize' }}>
          {value}
        </Text>
      )
    },
    {
      key: 'id',
      header: 'Action',
      width: '30%',
      align: 'center',
      searchable: false,
      render: (value: string, record: Account) => (
        <Button
          size="xs"
          onClick={() => handleChangePassword(record)}
          disabled={isLoading}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '6px 12px',
            fontSize: '12px',
            fontWeight: 'normal'
          }}
        >
          <Icon icon="fas fa-key" style={{ marginRight: '4px' }} />
          Change Password
        </Button>
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
        data={accounts.map(account => ({
          ...account,
          name: `${account.firstName} ${account.lastName}`
        }))}
        columns={columns}
        searchable={true}
        searchPlaceholder="Search accounts by name or role..."
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