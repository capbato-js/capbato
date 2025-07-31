import React, { useState } from 'react';
import { 
  Box, 
  Button,
  Modal,
  TextInput,
  Select,
  Stack,
  Text,
  Alert,
  Loader 
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Icon } from '../../../components/common';
import { DataTable, DataTableHeader, TableColumn } from '../../../components/common/DataTable';
import { MedicalClinicLayout } from '../../../components/layout';
import { useAccountsViewModel, type CreateAccountData, type Account } from '../view-models/useAccountsViewModel';

export const AccountsPage: React.FC = () => {
  const {
    accounts,
    isLoading,
    error,
    createAccount,
    changeAccountPermissions,
    clearError
  } = useAccountsViewModel();
  
  const [opened, { open, close }] = useDisclosure(false);
  const [formData, setFormData] = useState<CreateAccountData>({
    fullName: '',
    username: '',
    password: '',
    role: '',
    email: '',
    phone: ''
  });
  const [formError, setFormError] = useState<string | null>(null);

  const handleCreateAccount = async () => {
    setFormError(null);
    
    const success = await createAccount(formData);
    
    if (success) {
      // Reset form and close modal
      setFormData({
        fullName: '',
        username: '',
        password: '',
        role: '',
        email: '',
        phone: ''
      });
      close();
    } else if (error) {
      setFormError(error);
    }
  };

  const handleChangePermissions = async (accountId: number) => {
    await changeAccountPermissions(accountId);
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
      render: (value: any, record: Account) => (
        <Button
          size="xs"
          onClick={() => handleChangePermissions(record.id)}
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
          <Icon icon="fas fa-cog" style={{ marginRight: '4px' }} />
          Change Permissions
        </Button>
      )
    }
  ];

  const handleCloseModal = () => {
    setFormData({
      fullName: '',
      username: '',
      password: '',
      role: '',
      email: '',
      phone: ''
    });
    setFormError(null);
    close();
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
        title={
          <Text
            style={{
              color: '#0b4f6c',
              fontSize: '20px',
              fontWeight: 'bold',
              textAlign: 'center',
              width: '100%'
            }}
          >
            Create Account
          </Text>
        }
        centered
        size="sm"
        styles={{
          content: {
            borderRadius: '16px',
            padding: '32px 24px'
          },
          header: {
            borderBottom: 'none',
            paddingBottom: 0
          },
          close: {
            color: '#888',
            fontSize: '22px'
          }
        }}
      >
        <Stack gap="md">
          {formError && (
            <Alert color="red" style={{ marginBottom: '10px' }}>
              {formError}
            </Alert>
          )}

          <TextInput
            label="Full Name"
            placeholder="Enter full name"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            required
            disabled={isLoading}
          />
          
          <TextInput
            label="Username"
            placeholder="Enter username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
            disabled={isLoading}
          />
          
          <TextInput
            label="Password"
            type="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            disabled={isLoading}
          />
          
          <Select
            label="Role"
            placeholder="Select role"
            value={formData.role}
            onChange={(value) => setFormData({ ...formData, role: value || '' })}
            data={[
              { value: 'admin', label: 'Admin' },
              { value: 'receptionist', label: 'Receptionist' },
              { value: 'doctor', label: 'Doctor' }
            ]}
            required
            disabled={isLoading}
          />
          
          <TextInput
            label="Email"
            type="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            disabled={isLoading}
          />
          
          <TextInput
            label="Phone"
            placeholder="09XXXXXXXXX"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            maxLength={11}
            disabled={isLoading}
          />
          
          <Button
            onClick={handleCreateAccount}
            loading={isLoading}
            fullWidth
            mt="md"
            disabled={!formData.fullName || !formData.username || !formData.password || !formData.role || !formData.email}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </Stack>
      </Modal>
    </MedicalClinicLayout>
  );
};