import React from 'react';
import { Button, Group, Text } from '@mantine/core';
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

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      centered
    >
      <div style={{ padding: '0 24px 24px' }}>
        <Text size="md" mb="lg" ta="center">
          {message}
        </Text>
        
        <Group justify="center" gap="md">
          <Button
            variant="filled"
            color={confirmColor}
            onClick={handleConfirm}
            loading={isLoading}
            leftSection={<Icon icon="fas fa-check" size={14} />}
            style={{ minWidth: '80px' }}
          >
            {confirmText}
          </Button>
          
          <Button
            variant="outline"
            color="gray"
            onClick={onClose}
            disabled={isLoading}
            leftSection={<Icon icon="fas fa-times" size={14} />}
            style={{ minWidth: '80px' }}
          >
            {cancelText}
          </Button>
        </Group>
      </div>
    </Modal>
  );
};
