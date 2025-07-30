import React, { useState } from 'react';
import { 
  Box, 
  Title, 
  Button, 
  Group, 
  Table, 
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
import { MedicalClinicLayout } from '../../../components/layout';
import { useAccountsViewModel, type CreateAccountData } from '../view-models/useAccountsViewModel';

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

  const tableRows = accounts.map((account) => (
    <Table.Tr key={account.id}>
      <Table.Td 
        style={{ 
          textAlign: 'left', 
          paddingLeft: '20px',
          padding: '14px',
          borderBottom: '1px solid #ddd',
          borderRight: '1px solid #ddd',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}
      >
        {account.name}
      </Table.Td>
      <Table.Td 
        style={{ 
          textAlign: 'center',
          padding: '14px',
          borderBottom: '1px solid #ddd',
          borderRight: '1px solid #ddd',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}
      >
        {account.role}
      </Table.Td>
      <Table.Td 
        style={{ 
          textAlign: 'center',
          padding: '14px',
          borderBottom: '1px solid #ddd',
          borderRight: 'none',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}
      >
        <Button
          size="xs"
          onClick={() => handleChangePermissions(account.id)}
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
      </Table.Td>
    </Table.Tr>
  ));

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

        <Group justify="space-between" align="center" mb="xl">
          <Box style={{ flex: 1, textAlign: 'center' }}>
            <Title 
              order={1}
              style={{
                color: '#0b4f6c',
                fontSize: '28px',
                fontWeight: 'bold',
                margin: 0
              }}
            >
              Accounts Management
            </Title>
          </Box>
          <Button
            onClick={open}
            disabled={isLoading}
            style={{
              backgroundColor: '#4db6ac',
              border: 'none',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: 'bold',
              padding: '10px 20px',
              boxShadow: '0 4px 8px rgba(77, 182, 172, 0.3)',
              transition: 'background-color 0.3s ease, transform 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = '#3ba69c';
                e.currentTarget.style.transform = 'scale(1.05)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = '#4db6ac';
                e.currentTarget.style.transform = 'scale(1)';
              }
            }}
          >
            <Icon icon="fas fa-user-plus" style={{ marginRight: '8px' }} />
            Create Account
          </Button>
        </Group>

        {isLoading && accounts.length === 0 ? (
          <Box style={{ textAlign: 'center', padding: '50px' }}>
            <Loader size="lg" />
            <Text style={{ marginTop: '20px' }}>Loading accounts...</Text>
          </Box>
        ) : (
          <Table
            style={{
              backgroundColor: 'white',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
              borderRadius: '12px',
              overflow: 'hidden'
            }}
          >
            <Table.Thead>
              <Table.Tr
                style={{
                  backgroundColor: '#dbeeff'
                }}
              >
                <Table.Th
                  style={{
                    color: '#0047ab',
                    fontWeight: 600,
                    textAlign: 'left',
                    paddingLeft: '20px',
                    padding: '14px',
                    borderBottom: '1px solid #ddd',
                    borderRight: '1px solid #ddd'
                  }}
                >
                  Name
                </Table.Th>
                <Table.Th
                  style={{
                    color: '#0047ab',
                    fontWeight: 600,
                    textAlign: 'center',
                    padding: '14px',
                    borderBottom: '1px solid #ddd',
                    borderRight: '1px solid #ddd'
                  }}
                >
                  Role
                </Table.Th>
                <Table.Th
                  style={{
                    color: '#0047ab',
                    fontWeight: 600,
                    textAlign: 'center',
                    padding: '14px',
                    borderBottom: '1px solid #ddd',
                    borderRight: 'none'
                  }}
                >
                  Action
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {tableRows}
            </Table.Tbody>
          </Table>
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
            style={{
              backgroundColor: '#4db6ac',
              border: 'none',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: 'bold',
              width: '100%',
              marginTop: '10px'
            }}
            disabled={!formData.fullName || !formData.username || !formData.password || !formData.role || !formData.email}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </Stack>
      </Modal>
    </MedicalClinicLayout>
  );
};