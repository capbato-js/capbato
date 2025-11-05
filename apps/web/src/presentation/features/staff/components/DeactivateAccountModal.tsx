import React, { useState, useEffect } from 'react';
import { Button, Group, Text, Stack, Box, Paper, Divider, ThemeIcon, TextInput } from '@mantine/core';
import { Modal } from '../../../components/common/Modal';
import { Icon } from '../../../components/common/Icon';

interface DeactivateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
  userEmail: string;
  isLoading?: boolean;
}

export const DeactivateAccountModal: React.FC<DeactivateAccountModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  userName,
  userEmail,
  isLoading = false,
}) => {
  const [confirmText, setConfirmText] = useState('');
  const [error, setError] = useState('');

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setConfirmText('');
      setError('');
    }
  }, [isOpen]);

  const handleConfirm = () => {
    if (confirmText.toLowerCase() !== 'deactivate') {
      setError('Please type "deactivate" to confirm');
      return;
    }
    setError('');
    onConfirm();
  };

  const handleTextChange = (value: string) => {
    setConfirmText(value);
    if (error) {
      setError('');
    }
  };

  const isConfirmDisabled = confirmText.toLowerCase() !== 'deactivate' || isLoading;

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={null}
      size="md"
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
        {/* Header with warning styling */}
        <Paper
          p="xl"
          style={{
            backgroundColor: '#FFF5F5',
            borderBottom: '1px solid #FED7D7',
            textAlign: 'center',
            margin: 0,
            borderRadius: '16px 16px 0 0'
          }}
        >
          <Stack gap="md" align="center">
            <ThemeIcon
              size={64}
              radius="xl"
              color="red"
              variant="light"
              style={{
                backgroundColor: 'white',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                fontSize: '32px'
              }}
            >
              <Icon icon="fas fa-user-slash" size="32px" color="#E94B3C" />
            </ThemeIcon>
            <Text
              size="xl"
              fw={700}
              c="dark.8"
              style={{ lineHeight: 1.2 }}
            >
              Deactivate Account
            </Text>
          </Stack>
        </Paper>

        {/* Content */}
        <Box p="xl">
          <Stack gap="lg">
            <Box>
              <Text
                size="md"
                c="gray.7"
                ta="center"
                style={{
                  lineHeight: 1.5,
                  marginBottom: '1rem'
                }}
              >
                Are you sure you want to deactivate the account for:
              </Text>
              <Paper
                p="md"
                withBorder
                style={{
                  backgroundColor: '#F8F9FA',
                  borderColor: '#DEE2E6',
                  textAlign: 'center'
                }}
              >
                <Text size="lg" fw={600} c="dark.8">
                  {userName}
                </Text>
                <Text size="sm" c="gray.6">
                  {userEmail}
                </Text>
              </Paper>
            </Box>

            <Box>
              <Text
                size="sm"
                c="red.7"
                fw={500}
                mb="xs"
              >
                <Icon icon="fas fa-exclamation-triangle" size="14px" style={{ marginRight: '6px' }} />
                This user will no longer have access to the system.
              </Text>
              <Text size="sm" c="gray.7" mb="md">
                To proceed, type <Text component="span" fw={700} c="dark">"deactivate"</Text> below:
              </Text>
              <TextInput
                placeholder='Type "deactivate" to confirm'
                value={confirmText}
                onChange={(e) => handleTextChange(e.currentTarget.value)}
                error={error}
                disabled={isLoading}
                size="md"
                styles={{
                  input: {
                    fontFamily: 'monospace',
                  }
                }}
              />
            </Box>
          </Stack>

          <Divider my="xl" color="gray.2" />

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
              Cancel
            </Button>

            <Button
              variant="filled"
              color="red"
              onClick={handleConfirm}
              loading={isLoading}
              disabled={isConfirmDisabled}
              leftSection={!isLoading ? <Icon icon="fas fa-user-slash" size="16px" /> : undefined}
              size="md"
              style={{
                minWidth: '160px',
                fontWeight: 600,
              }}
            >
              Deactivate Account
            </Button>
          </Group>
        </Box>
      </Box>
    </Modal>
  );
};
