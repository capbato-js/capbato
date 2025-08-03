import React from 'react';
import { Box, ActionIcon, Tooltip, useMantineTheme } from '@mantine/core';

export interface ActionButtonConfig {
  icon: string;
  tooltip: string;
  onClick: () => void;
}

interface TableActionButtonsProps {
  actions: ActionButtonConfig[];
}

export const TableActionButtons: React.FC<TableActionButtonsProps> = ({ actions }) => {
  const theme = useMantineTheme();

  return (
    <Box
      style={{
        display: 'flex',
        gap: '4px',
        justifyContent: 'center'
      }}
    >
      {actions.map((action, index) => (
        <Tooltip key={index} label={action.tooltip} withArrow position="top">
          <ActionIcon
            variant="subtle"
            color="gray"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              action.onClick();
            }}
            style={{
              color: theme.colors.customGray[5],
              transition: 'all 0.15s ease',
              minWidth: '28px',
              minHeight: '28px'
            }}
            styles={{
              root: {
                '&:hover': {
                  backgroundColor: theme.colors.customGray[1],
                  color: theme.colors.customGray[8]
                }
              }
            }}
          >
            <i className={action.icon} style={{ fontSize: '16px' }} />
          </ActionIcon>
        </Tooltip>
      ))}
    </Box>
  );
};