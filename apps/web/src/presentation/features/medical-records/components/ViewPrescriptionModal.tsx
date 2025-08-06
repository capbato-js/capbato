import React from 'react';
import { Modal } from '../../../components/common';
import { 
  Stack, 
  Text, 
  Group, 
  Badge, 
  Divider, 
  Box,
  Paper,
} from '@mantine/core';
import { Icon } from '../../../components/common';
import { Prescription } from '../types';

interface ViewPrescriptionModalProps {
  opened: boolean;
  onClose: () => void;
  prescription: Prescription | null;
}

export const ViewPrescriptionModal: React.FC<ViewPrescriptionModalProps> = ({
  opened,
  onClose,
  prescription,
}) => {
  if (!prescription) {
    return null;
  }

  // Handle both string and array formats for medications
  const medications = Array.isArray(prescription.medications) 
    ? prescription.medications 
    : [{ 
        name: prescription.medications, 
        dosage: '', 
        frequency: '', 
        duration: '', 
        instructions: '' 
      }];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Prescription Details"
      size="lg"
    >
      <Stack gap="lg">
        {/* Header Information */}
        <Paper p="md" style={{ backgroundColor: '#f8f9fa' }}>
          <Group justify="space-between" align="flex-start">
            <Box>
              <Group gap="xs" align="center" mb="xs">
                <Icon icon="fas fa-user" />
                <Text fw={600} size="lg">{prescription.patientName}</Text>
                <Badge variant="light" color="blue">
                  {prescription.patientNumber}
                </Badge>
              </Group>
              <Group gap="xs" align="center">
                <Icon icon="fas fa-user-md" />
                <Text c="dimmed">{prescription.doctor}</Text>
              </Group>
            </Box>
            <Box ta="right">
              <Group gap="xs" align="center" justify="flex-end" mb="xs">
                <Icon icon="fas fa-calendar" />
                <Text fw={500}>Date Prescribed</Text>
              </Group>
              <Text size="lg" fw={600}>
                {formatDate(prescription.datePrescribed)}
              </Text>
            </Box>
          </Group>
        </Paper>

        <Divider />

        {/* Medications */}
        <Box>
          <Group gap="xs" align="center" mb="md">
            <Icon icon="fas fa-pills" />
            <Text fw={600} size="lg">Medications</Text>
          </Group>

          {medications.length > 0 && medications[0].name ? (
            <Stack gap="md">
              {medications.map((medication, index) => (
                <Paper key={index} p="md" withBorder>
                  <Stack gap="sm">
                    <Group justify="space-between" align="flex-start">
                      <Text fw={600} size="lg" c="blue">
                        {medication.name}
                      </Text>
                      {medication.dosage && (
                        <Badge variant="light" size="lg">
                          {medication.dosage}
                        </Badge>
                      )}
                    </Group>

                    {(medication.frequency || medication.duration) && (
                      <Group gap="xl">
                        {medication.frequency && (
                          <Box>
                            <Text size="sm" c="dimmed" fw={500}>Frequency</Text>
                            <Text size="sm">{medication.frequency}</Text>
                          </Box>
                        )}
                        {medication.duration && (
                          <Box>
                            <Text size="sm" c="dimmed" fw={500}>Duration</Text>
                            <Text size="sm">{medication.duration}</Text>
                          </Box>
                        )}
                      </Group>
                    )}

                    {medication.instructions && (
                      <Box>
                        <Text size="sm" c="dimmed" fw={500}>Instructions</Text>
                        <Text size="sm">{medication.instructions}</Text>
                      </Box>
                    )}
                  </Stack>
                </Paper>
              ))}
            </Stack>
          ) : (
            <Paper p="md" withBorder>
              <Text c="dimmed" ta="center">
                No detailed medication information available
              </Text>
            </Paper>
          )}
        </Box>

        {/* Additional Notes */}
        {prescription.notes && (
          <>
            <Divider />
            <Box>
              <Group gap="xs" align="center" mb="sm">
                <Icon icon="fas fa-sticky-note" />
                <Text fw={600}>Additional Notes</Text>
              </Group>
              <Paper p="md" withBorder>
                <Text style={{ whiteSpace: 'pre-wrap' }}>
                  {prescription.notes}
                </Text>
              </Paper>
            </Box>
          </>
        )}
      </Stack>
    </Modal>
  );
};
