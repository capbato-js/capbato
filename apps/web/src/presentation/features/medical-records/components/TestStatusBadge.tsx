import React from 'react';
import { useMantineTheme } from '@mantine/core';
import { LabTest } from '../types';

interface TestStatusBadgeProps {
  status: LabTest['status'];
}

export const TestStatusBadge: React.FC<TestStatusBadgeProps> = ({ status }) => {
  const theme = useMantineTheme();

  const styles = {
    'Completed': {
      background: theme.colors.green[1],
      color: theme.colors.green[9],
      padding: '5px 10px',
      borderRadius: '5px',
      fontWeight: 600,
      fontSize: '16px',
      display: 'inline-block'
    },
    'Confirmed': {
      background: theme.colors.green[1],
      color: theme.colors.green[9],
      padding: '5px 10px',
      borderRadius: '5px',
      fontWeight: 600,
      fontSize: '16px',
      display: 'inline-block'
    },
    'Pending': {
      background: theme.colors.orange[1],
      color: theme.colors.orange[9],
      padding: '5px 10px',
      borderRadius: '5px',
      fontWeight: 600,
      fontSize: '16px',
      display: 'inline-block'
    },
    'In Progress': {
      background: theme.colors.blue[1],
      color: theme.colors.blue[9],
      padding: '5px 10px',
      borderRadius: '5px',
      fontWeight: 600,
      fontSize: '16px',
      display: 'inline-block'
    },
    'Cancelled': {
      background: theme.colors.red[1],
      color: theme.colors.red[9],
      padding: '5px 10px',
      borderRadius: '5px',
      fontWeight: 600,
      fontSize: '16px',
      display: 'inline-block'
    }
  };

  const defaultStyle = {
    background: theme.colors.gray[1],
    color: theme.colors.gray[9],
    padding: '5px 10px',
    borderRadius: '5px',
    fontWeight: 600,
    fontSize: '16px',
    display: 'inline-block'
  };

  return (
    <span style={styles[status] || defaultStyle}>
      {status}
    </span>
  );
};