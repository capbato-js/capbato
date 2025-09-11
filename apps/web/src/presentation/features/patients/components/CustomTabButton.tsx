import React from 'react';
import { useMantineTheme } from '@mantine/core';
import { Icon } from '../../../components/common/Icon';

interface CustomTabButtonProps {
  isActive: boolean;
  icon: string;
  children: React.ReactNode;
  onClick: () => void;
}

export const CustomTabButton: React.FC<CustomTabButtonProps> = ({ 
  isActive, 
  icon, 
  children, 
  onClick 
}) => {
  const theme = useMantineTheme();
  
  return (
    <button
      onClick={onClick}
      style={{
        flex: '1 1 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        textAlign: 'center',
        background: isActive ? theme.colors.blue[7] : theme.colors.blue[1],
        color: isActive ? 'white' : theme.colors.blue[9],
        border: `2px solid ${isActive ? theme.colors.blue[7] : theme.colors.blue[1]}`,
        padding: '6px 15px',
        fontWeight: 'bold',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        minWidth: '110px',
        whiteSpace: 'nowrap',
        fontSize: '14px'
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = theme.colors.blue[2];
          e.currentTarget.style.border = `2px solid ${theme.colors.blue[2]}`;
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = theme.colors.blue[1];
          e.currentTarget.style.border = `2px solid ${theme.colors.blue[1]}`;
        }
      }}
    >
      <Icon icon={icon} />
      {children}
    </button>
  );
};