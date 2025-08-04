import React from 'react';
import { Button, Group, Text, Stack, Box, Paper, Divider, ThemeIcon } from '@mantine/core';
import { Modal } from '../Modal';
import { Icon } from '../Icon';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: string;
  isLoading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Yes',
  cancelText = 'No',
  confirmColor = 'red',
  isLoading = false,
}) => {
  const handleConfirm = () => {
    onConfirm();
  };

  // Determine icon character and colors based on action type
  const getActionDetails = () => {
    if (confirmColor === 'red') {
      return {
        iconChar: '⚠️',
        iconColor: '#E94B3C',
        backgroundColor: '#FFF5F5',
        borderColor: '#FED7D7'
      };
    } else if (confirmColor === 'green') {
      return {
        iconChar: '🔄',
        iconColor: '#7ED321', 
        backgroundColor: '#F0FFF4',
        borderColor: '#C6F6D5'
      };
    } else {
      return {
        iconChar: '❓',
        iconColor: '#4A90E2',
        backgroundColor: '#F7FAFC',
        borderColor: '#BEE3F8'
      };
    }
  };

  const actionDetails = getActionDetails();

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={null} // We'll use custom header
      size="sm"
      centered
      withCloseButton={false}
      customStyles={{
        content: {
          borderRadius: '16px',
          overflow: 'hidden',
          padding: 0,
        },
        body: {
          padding: 0,
        }
      }}
    >
      <Box>
        {/* Header with background color and icon */}
        <Paper
          p="xl"
          style={{
            backgroundColor: actionDetails.backgroundColor,
            borderBottom: `1px solid ${actionDetails.borderColor}`,
            textAlign: 'center',
            margin: 0,
            borderRadius: '16px 16px 0 0'
          }}
        >
          <Stack gap="md" align="center">
            <ThemeIcon
              size={64}
              radius="xl"
              color={confirmColor}
              variant="light"
              style={{
                backgroundColor: 'white',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                fontSize: '32px'
              }}
            >
              {actionDetails.iconChar}
            </ThemeIcon>
            <Text 
              size="xl" 
              fw={700} 
              c="dark.8"
              style={{ lineHeight: 1.2 }}
            >
              {title}
            </Text>
          </Stack>
        </Paper>

        {/* Content */}
        <Box p="xl">
          <Text 
            size="md" 
            c="gray.7"
            ta="center"
            style={{ 
              lineHeight: 1.5,
              marginBottom: '2rem'
            }}
          >
            {message}
          </Text>
          
          <Divider mb="xl" color="gray.2" />
          
          <Group justify="center" gap="md">
            <Button
              variant="light"
              color="gray"
              onClick={onClose}
              disabled={isLoading}
              leftSection={<Icon icon="fas fa-times" size="16px" />}
              size="md"
              style={{ 
                minWidth: '120px',
                fontWeight: 500,
              }}
            >
              {cancelText}
            </Button>
            
            <Button
              variant="filled"
              color={confirmColor}
              onClick={handleConfirm}
              loading={isLoading}
              leftSection={!isLoading ? <Icon icon="fas fa-check" size="16px" /> : undefined}
              size="md"
              style={{ 
                minWidth: '120px',
                fontWeight: 600,
              }}
            >
              {confirmText}
            </Button>
          </Group>
        </Box>
      </Box>
    </Modal>
  );
};
