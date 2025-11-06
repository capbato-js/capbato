import React from 'react';
import { Modal } from '../../../../components/common';
import { Box, Button, Group, Text } from '@mantine/core';
import { IconPrinter } from '@tabler/icons-react';
import { CLINIC_INFO, DOCTOR_SIGNATURE } from '../../config/prescriptionPrintConfig';
import { getPrescriptionPrintStyles } from '../../utils/prescriptionPrintStyles';
import { formatPrescriptionDate } from '../../utils/prescriptionPrintUtils';

interface Medication {
  name?: string;
  medicationName?: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

interface PrintPrescriptionModalPresenterProps {
  opened: boolean;
  onClose: () => void;
  onPrint: () => void;
  printRef: React.RefObject<HTMLDivElement>;
  patientName: string;
  patientAddress: string;
  age: number;
  sex: string;
  date: string;
  medications: Medication[];
}

export const PrintPrescriptionModalPresenter: React.FC<PrintPrescriptionModalPresenterProps> = ({
  opened,
  onClose,
  onPrint,
  printRef,
  patientName,
  patientAddress,
  age,
  sex,
  date,
  medications,
}) => {
  const styles = getPrescriptionPrintStyles();

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Print Prescription"
      size="xl"
    >
      <Box>
        {/* Print Preview Area */}
        <Box
          ref={printRef}
          style={styles.printContainer}
          className="printArea"
        >
          {/* Clinic Header */}
          <Box style={styles.clinicHeader}>
            <Text style={styles.doctorNameHeader}>{CLINIC_INFO.doctorName}</Text>
            <Text style={styles.specialty}>{CLINIC_INFO.specialty}</Text>
            <Text style={styles.clinicName}>{CLINIC_INFO.clinicName}</Text>
            <Text style={styles.address}>{CLINIC_INFO.address}</Text>
            <Text style={styles.address}>{CLINIC_INFO.cityAddress}</Text>
            <Text style={styles.hours}>{CLINIC_INFO.schedule}</Text>
            <Text style={styles.contact}>{CLINIC_INFO.phone}</Text>
            <Text style={styles.contact}>{CLINIC_INFO.hoursNote}</Text>
          </Box>

          {/* Divider */}
          <Box style={styles.divider} />

          {/* Patient Info Row 1: Name and Age/Sex */}
          <Box style={styles.infoRow}>
            <Text style={styles.infoField}>{patientName}</Text>
            <Group gap="xs">
              <Text style={styles.infoField}>{age}</Text>
              <Text style={styles.infoField}>{sex}</Text>
            </Group>
          </Box>

          {/* Patient Info Row 2: Address and Date */}
          <Box style={styles.infoRow}>
            <Text style={{ ...styles.infoField, flex: 1, maxWidth: '70%', wordWrap: 'break-word' }}>{patientAddress}</Text>
            <Text style={{ ...styles.infoField, flex: '0 0 auto', marginLeft: '20px' }}>{formatPrescriptionDate(date)}</Text>
          </Box>

          {/* Patient Details with Rx Image and Medications */}
          <Box style={styles.patientDetails}>
            {/* Rx Logo Image */}
            <Box style={styles.rxImageContainer}>
              <img
                src="/rx-pharmacy-logo.jpeg"
                alt="Rx"
                style={styles.rxImage}
              />
            </Box>

            {/* Medications List */}
            <Box style={styles.medicationsList}>
              {medications.map((medication, index) => {
                const medName = medication.medicationName || medication.name || '';
                const medKey = `${medName}-${index}`;
                const dosageText = medication.dosage ? ` ${medication.dosage}` : '';
                const instructionText = medication.instructions ||
                  `${medication.frequency}${medication.duration ? ` --- ${medication.duration}` : ''}`;

                return (
                  <Box key={medKey} style={styles.medicationItem}>
                    <Box style={styles.medicationDetails}>
                      <Text style={styles.medicationName}>
                        {medName}{dosageText}
                      </Text>
                      <Text style={styles.medicationInstructions}>
                        {instructionText}
                      </Text>
                    </Box>
                    <Text style={styles.medicationQuantity}>#_____</Text>
                  </Box>
                );
              })}
            </Box>
          </Box>

          {/* Footer with Follow-up and Signature */}
          <Box style={styles.footer}>
            <Text style={styles.followUp}>See you on __________</Text>
            <Box style={styles.signatureSection}>
              <Text style={styles.doctorName}>{DOCTOR_SIGNATURE.name}</Text>
              <Text style={styles.licenseInfo}>{DOCTOR_SIGNATURE.licenseNumber}</Text>
              <Text style={styles.licenseInfo}>PTR No. {DOCTOR_SIGNATURE.ptrNumber}</Text>
            </Box>
          </Box>
        </Box>

        {/* Action Buttons - Hidden when printing */}
        <Group justify="center" mt="xl" className="noPrint">
          <Button
            variant="filled"
            leftSection={<IconPrinter size={20} />}
            onClick={onPrint}
          >
            Print Prescription
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </Group>
      </Box>

      {/* Print-specific styles */}
      <style>{`
        @media print {
          .noPrint {
            display: none !important;
          }
          .printArea {
            display: block !important;
          }
          body {
            margin: 0;
            padding: 0;
          }
          @page {
            margin: 0.5in;
          }
        }
      `}</style>
    </Modal>
  );
};
