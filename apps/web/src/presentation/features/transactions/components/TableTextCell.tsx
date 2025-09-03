import React from 'react';
import { Text, useMantineTheme } from '@mantine/core';

interface TableTextCellProps {
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

export const TableTextCell: React.FC<TableTextCellProps> = ({ 
  children, 
  align = 'left' 
}) => {
  const theme = useMantineTheme();

  return (
    <Text
      style={{
        color: theme.colors.customGray[8],
        fontWeight: 400,
        fontSize: '16px',
        textAlign: align
      }}
    >
      {children}
    </Text>
  );
};