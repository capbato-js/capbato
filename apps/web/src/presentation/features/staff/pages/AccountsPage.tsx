import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Box, 
  Button,
  TextInput,
  Select,
  Stack,
  Text,
  Alert,
  Loader 
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { RegisterUserCommandSchema } from '@nx-starter/application-shared';
import { Icon, Modal } from '../../../components/common';
import { DataTable, DataTableHeader, TableColumn } from '../../../components/common/DataTable';
import { MedicalClinicLayout } from '../../../components/layout';
import { useAccountsViewModel, type CreateAccountData, type Account } from '../view-models/useAccountsViewModel';

export const AccountsPage: React.FC = () => {
  const {
    accounts,
    isLoading,
    error,
    createAccount,
    changeAccountPassword,
    clearError
  } = useAccountsViewModel();
  
  const [opened, { open, close }] = useDisclosure(false);
  const [passwordModalOpened, { open: openPasswordModal, close: closePasswordModal }] = useDisclosure(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // React Hook Form setup for create account
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CreateAccountData>({
    resolver: zodResolver(RegisterUserCommandSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: '',
      mobile: '',
    },
  });

  const onSubmit = handleSubmit(async (data: CreateAccountData) => {
    const success = await createAccount(data);
    
    if (success) {
      reset(); // Reset form
      close(); // Close modal
      // Accounts list will refresh automatically via view model
    }
    // Error handling is managed by the view model and displayed via error state
  });

  const handleChangePassword = (account: Account) => {
    setSelectedAccount(account);
    setPasswordData({ newPassword: '', confirmPassword: '' });
    setPasswordError(null);
    openPasswordModal();
  };

  const handlePasswordSubmit = async () => {
    setPasswordError(null);
    
    if (!selectedAccount) return;
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }
    
    const success = await changeAccountPassword(selectedAccount.id, passwordData.newPassword);
    
    if (success) {
      closePasswordModal();
      setPasswordData({ newPassword: '', confirmPassword: '' });
      setSelectedAccount(null);
      // Show success message - you might want to use a notification system instead
      alert('Password changed successfully!');
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
      render: (value: number, record: Account) => (
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
    reset(); // Reset form using React Hook Form
    clearError(); // Clear any view model errors
    close();
  };

  const handleClosePasswordModal = () => {
    setPasswordData({ newPassword: '', confirmPassword: '' });
    setPasswordError(null);
    setSelectedAccount(null);
    closePasswordModal();
  };

  return (
    <MedicalClinicLayout>
      <Box
        style={{
          background: 'white',
          borderRadius: '16px',
          padding: '30px 24px 24px 24px',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
          minHeight: '300px',
          marginBottom: '24px'
        }}
      >
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

        {isLoading && accounts.length === 0 ? (
          <Box style={{ textAlign: 'center', padding: '50px' }}>
            <Loader size="lg" />
            <Text style={{ marginTop: '20px' }}>Loading accounts...</Text>
          </Box>
        ) : (
          <DataTable
            data={accounts}
            columns={columns}
            searchable={true}
            searchPlaceholder="Search accounts by name or role..."
            emptyStateMessage="No accounts found"
            isLoading={isLoading && accounts.length === 0}
          />
        )}
      </Box>

      {/* Create Account Modal */}
      <Modal
        opened={opened}
        onClose={handleCloseModal}
        title="Create Account"
      >
        <form onSubmit={onSubmit} noValidate>
          <Stack gap="md">
            <TextInput
            label="First Name"
            placeholder="Enter first name"
            error={errors.firstName?.message}
            disabled={isLoading}
            required
            {...register('firstName')}
          />
          
          <TextInput
            label="Last Name"
            placeholder="Enter last name"
            error={errors.lastName?.message}
            disabled={isLoading}
            required
            {...register('lastName')}
          />
          
          <TextInput
            label="Email"
            type="email"
            placeholder="Enter email"
            error={errors.email?.message}
            disabled={isLoading}
            required
            {...register('email')}
          />
          
          <TextInput
            label="Password"
            type="password"
            placeholder="Enter password"
            error={errors.password?.message}
            disabled={isLoading}
            required
            {...register('password')}
          />
          
          <Controller
            name="role"
            control={control}
            render={({ field, fieldState }) => (
              <Select
                label="Role"
                placeholder="Select role"
                error={fieldState.error?.message}
                data={[
                  { value: 'admin', label: 'Admin' },
                  { value: 'receptionist', label: 'Receptionist' },
                  { value: 'doctor', label: 'Doctor' }
                ]}
                disabled={isLoading}
                required
                {...field}
              />
            )}
          />
          
          <TextInput
            label="Mobile Number"
            placeholder="09XXXXXXXXX"
            error={errors.mobile?.message}
            maxLength={11}
            disabled={isLoading}
            {...register('mobile')}
          />
          
          <Button
            type="submit"
            loading={isLoading}
            fullWidth
            mt="md"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </Stack>
        </form>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        opened={passwordModalOpened}
        onClose={handleClosePasswordModal}
        title="Change Password"
      >
        <form onSubmit={(e) => { e.preventDefault(); handlePasswordSubmit(); }} noValidate>
          <Stack gap="md">
            {passwordError && (
              <Alert color="red" style={{ marginBottom: '10px' }}>
                {passwordError}
              </Alert>
            )}

            <Text style={{ marginBottom: '10px', color: '#666' }}>
              New Password for <strong style={{ color: '#1976d2' }}>{selectedAccount?.firstName} {selectedAccount?.lastName}</strong>
            </Text>

            <TextInput
              label="New Password"
              type="password"
              placeholder="Enter new password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              disabled={isLoading}
              required
            />
            
            <TextInput
              label="Confirm Password"
              type="password"
              placeholder="Confirm new password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              disabled={isLoading}
              required
            />
            
            <Button
              type="submit"
              loading={isLoading}
              fullWidth
              mt="md"
              disabled={!passwordData.newPassword || !passwordData.confirmPassword}
            >
              <Icon icon="fas fa-key" style={{ marginRight: '4px' }} />
              {isLoading ? 'Changing Password...' : 'Change Password'}
            </Button>
          </Stack>
        </form>
      </Modal>
    </MedicalClinicLayout>
  );
};