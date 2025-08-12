import React, { useState, useEffect } from 'react';
import { 
  Text,
  Alert
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Modal } from '../../../components/common';
import { DataTable, DataTableHeader, TableColumn, TableActions } from '../../../components/common/DataTable';
import { MedicalClinicLayout } from '../../../components/layout';
import { useAccountsViewModel, type CreateAccountData, type UpdateAccountData, type Account } from '../view-models/useEnhancedAccountsViewModel';
import { CreateAccountForm, ChangePasswordForm, UpdateUserDetailsForm } from '../components';
import { UpdateUserDetailsFormData, DoctorDto } from '@nx-starter/application-shared';

export const AccountsPage: React.FC = () => {
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

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);
  
  const [opened, { open, close }] = useDisclosure(false);
  const [updateModalOpened, { open: openUpdateModal, close: closeUpdateModal }] = useDisclosure(false);
  const [passwordModalOpened, { open: openPasswordModal, close: closePasswordModal }] = useDisclosure(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [doctorDetails, setDoctorDetails] = useState<DoctorDto | null>(null);
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

  const handleEditUserDetails = async (account: Account) => {
    setSelectedAccount(account);
    setDoctorDetails(null); // Reset doctor details
    
    // If the account is a doctor, fetch their doctor profile details
    if (account.role === 'doctor') {
      try {
        const details = await getDoctorDetails(account.id);
        setDoctorDetails(details);
      } catch (error) {
        console.warn('Could not fetch doctor details:', error);
        // Continue opening the modal even if doctor details fetch fails
        setDoctorDetails(null);
      }
    }
    
    openUpdateModal();
  };

  const handleUpdateUserDetails = async (data: UpdateAccountData): Promise<boolean> => {
    const success = await updateAccount(data);
    
    if (success) {
      closeUpdateModal(); // Close modal
      setSelectedAccount(null);
      // Accounts list will refresh automatically via view model
    }
    // Error handling is managed by the view model and displayed via error state
    
    return success;
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

  const handleCloseUpdateModal = () => {
    clearError(); // Clear any view model errors
    clearFieldErrors(); // Clear field-specific errors
    setSelectedAccount(null);
    setDoctorDetails(null); // Clear doctor details
    closeUpdateModal();
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
        useViewportHeight={true}
        bottomPadding={90}
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

      {/* Update User Details Modal */}
      <Modal
        opened={updateModalOpened}
        onClose={handleCloseUpdateModal}
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
            onSubmit={handleUpdateUserDetails}
            isLoading={isLoading}
            error={error}
            onClearError={clearError}
            fieldErrors={fieldErrors}
            onClearFieldErrors={clearFieldErrors}
          />
        )}
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