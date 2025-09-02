import React from 'react';
import { Text } from '@mantine/core';
import { TableColumn, TableActions } from '../../../components/common/DataTable';
import type { Account } from '../view-models/useEnhancedAccountsViewModel';

type AccountWithFullName = Account & { name: string };

export const getAccountsTableColumns = (): TableColumn<AccountWithFullName>[] => [
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

export const getAccountsTableActions = (handlers: {
  onEdit: (account: AccountWithFullName) => void;
  onChangePassword: (account: AccountWithFullName) => void;
}): TableActions<AccountWithFullName> => ({
  buttons: [
    {
      icon: 'fas fa-edit',
      tooltip: 'Update User Details',
      onClick: handlers.onEdit
    },
    {
      icon: 'fas fa-key',
      tooltip: 'Change Password',
      onClick: handlers.onChangePassword
    }
  ]
});