import React from 'react';
import { Modal as MantineModal, useMantineTheme } from '@mantine/core';
import { CustomModalProps } from './types';

export const Modal: React.FC<CustomModalProps> = ({
  opened,
  onClose,
  title,
  children,
  size = 'md',
  withCloseButton = true,
  centered = true,
  customStyles = {},
  className,
  ...rest
}) => {
  const theme = useMantineTheme();
  // Default styles matching the existing modals in AccountsPage
  const defaultStyles = {
    content: {
      borderRadius: '15px',
      // padding: '0',
      ...customStyles.content,
    },
    header: {
      ...customStyles.header,
    },
    title: {
      color: theme.colors.customGray[8],
      fontSize: '20px',
      fontWeight: 'bold',
      textAlign: 'center' as const,
      width: '100%',
      margin: 0,
      ...customStyles.title,
    },
    close: {
      color: theme.colors.customGray[7],
      fontSize: '22px',
      ...customStyles.close,
    },
    body: {
      padding: '0 24px 24px',
      ...customStyles.body,
    }
  };

  return (
    <MantineModal
      opened={opened}
      onClose={onClose}
      title={title}
      size={size}
      centered={centered}
      withCloseButton={withCloseButton}
      styles={defaultStyles}
      className={className}
      {...rest}
    >
      {children}
    </MantineModal>
  );
};
