import React from 'react';
import { Modal } from '../../../components/common';
import { Stack, Divider, Button, Group } from '@mantine/core';
import { IconPrinter } from '@tabler/icons-react';
import { Prescription } from '../types';
import { NormalizedMedication } from '../utils/viewPrescriptionUtils';
import { PrescriptionHeader } from './PrescriptionHeader';
import { MedicationsSection } from './MedicationsSection';
import { PrescriptionNotesSection } from './PrescriptionNotesSection';

interface ViewPrescriptionModalPresenterProps {
  opened: boolean;
  onClose: () => void;
  prescription: Prescription;
  medications: NormalizedMedication[];
  onPrint: () => void;
}

export const ViewPrescriptionModalPresenter: React.FC<ViewPrescriptionModalPresenterProps> = ({
  opened,
  onClose,
  prescription,
  medications,
  onPrint,
}) => {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Prescription Details"
      size="lg"
    >
      <Stack gap="lg">
        {/* Header Information */}
        <PrescriptionHeader
          patientName={prescription.patientName}
          patientNumber={prescription.patientNumber}
          doctor={prescription.doctor}
          datePrescribed={prescription.datePrescribed}
        />

        <Divider />

        {/* Medications */}
        <MedicationsSection medications={medications} />

        {/* Additional Notes */}
        <PrescriptionNotesSection notes={prescription.notes} />

        {/* Action Buttons */}
        <Group justify="flex-end" mt="md">
          <Button
            variant="filled"
            leftSection={<IconPrinter size={20} />}
            onClick={onPrint}
          >
            Print Prescription
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};