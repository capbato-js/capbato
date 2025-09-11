import React from 'react';
import { useMantineTheme } from '@mantine/core';
import { LaboratoryResult } from '../types';

interface LaboratoryStatusBadgeProps {
  status: LaboratoryResult['status'];
}

export const LaboratoryStatusBadge: React.FC<LaboratoryStatusBadgeProps> = ({ status }) => {
  const theme = useMantineTheme();

  const styles = {
    'Pending': {
      background: theme.colors.orange[1],
      color: theme.colors.orange[9],
      padding: '5px 10px',
      borderRadius: '5px',
      fontWeight: 600,
      fontSize: '16px',
      display: 'inline-block'
    },
    'Completed': {
      background: theme.colors.green[1],
      color: theme.colors.green[9],
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