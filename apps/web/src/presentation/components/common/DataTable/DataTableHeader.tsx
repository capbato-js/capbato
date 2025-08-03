import React from 'react';
import { Box, Button, Title, useMantineTheme } from '@mantine/core';
import { Icon } from '../Icon';

export interface DataTableHeaderProps {
  title: string;
  onAddItem?: () => void;
  addButtonText?: string;
  addButtonIcon?: string;
}

export const DataTableHeader: React.FC<DataTableHeaderProps> = ({
  title,
  onAddItem,
  addButtonText = 'Add New',
  addButtonIcon = 'fas fa-plus'
}) => {
  const theme = useMantineTheme();
  return (
    <Box
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '25px',
        position: 'relative'
      }}
    >
      <Title
        order={1}
        style={{
          color: theme.colors.customGray[8],
          fontSize: '28px',
          fontWeight: 'bold',
          margin: 0,
          flexGrow: 1,
          textAlign: 'center'
        }}
      >
        {title}
      </Title>
      {onAddItem && (
        <Button
          onClick={onAddItem}
          leftSection={<Icon icon={addButtonIcon} />}
          style={{
            position: 'absolute',
            right: 0,
          }}
        >
          {addButtonText}
        </Button>
      )}
    </Box>
  );
};
