import React from 'react';
import { Modal } from '../../../components/common';
import { 
  Text, 
  Group, 
  Button,
  Stack,
  Alert,
  Badge,
} from '@mantine/core';
import { Icon } from '../../../components/common';
import { Prescription } from '../types';

interface DeletePrescriptionModalProps {
  opened: boolean;
  onClose: () => void;
  prescription: Prescription | null;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const DeletePrescriptionModal: React.FC<DeletePrescriptionModalProps> = ({
  opened,
  onClose,
  prescription,
  onConfirm,
  isLoading = false,
}) => {
  if (!prescription) {
    return null;
  }

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Delete Prescription"
      size="md"
    >
      <Stack gap="md">
        <Alert
          variant="light"
          color="red"
          icon={<Icon icon="fas fa-exclamation-triangle" />}
          title="Warning"
        >
          This action cannot be undone. The prescription will be permanently deleted.
        </Alert>

        <Text>
          Are you sure you want to delete the following prescription?
        </Text>

        <Stack gap="sm" p="md" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <Group>
            <Text fw={500}>Patient:</Text>
            <Text>{prescription.patientName}</Text>
            <Badge variant="light" color="blue">
              {prescription.patientNumber}
            </Badge>
          </Group>
          <Group>
            <Text fw={500}>Doctor:</Text>
            <Text>{prescription.doctor}</Text>
          </Group>
          <Group>
            <Text fw={500}>Date:</Text>
            <Text>{new Date(prescription.datePrescribed).toLocaleDateString()}</Text>
          </Group>
          <Group>
            <Text fw={500}>Medications:</Text>
            <Text>
              {Array.isArray(prescription.medications) 
                ? prescription.medications.map(m => m.name).join(', ')
                : prescription.medications
              }
            </Text>
          </Group>
        </Stack>

        <Group justify="flex-end" gap="sm">
          <Button
            variant="light"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            color="red"
            onClick={handleConfirm}
            loading={isLoading}
            leftSection={<Icon icon="fas fa-trash" />}
          >
            Delete Prescription
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};
