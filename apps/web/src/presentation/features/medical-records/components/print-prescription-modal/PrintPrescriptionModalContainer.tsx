import React, { useRef, useEffect, useState } from 'react';
import { Prescription } from '../../types';
import { PrintPrescriptionModalPresenter } from './PrintPrescriptionModalPresenter';
import { usePrintPrescription, formatPatientAddress } from '../../utils/prescriptionPrintUtils';
import { usePatientStore } from '../../../../../infrastructure/state/PatientStore';

interface PrintPrescriptionModalContainerProps {
  opened: boolean;
  onClose: () => void;
  prescription: Prescription | null;
}

export const PrintPrescriptionModalContainer: React.FC<PrintPrescriptionModalContainerProps> = ({
  opened,
  onClose,
  prescription,
}) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [patientAge, setPatientAge] = useState<number>(0);
  const [patientSex, setPatientSex] = useState<string>('');
  const [patientAddress, setPatientAddress] = useState<string>('');

  const { loadPatientById, getPatientDetails } = usePatientStore();

  // Print handler
  const handlePrint = usePrintPrescription(printRef, prescription?.patientName);

  // Fetch patient details when modal opens
  useEffect(() => {
    const fetchPatientDetails = async () => {
      if (!prescription?.patientId || !opened) {
        return;
      }

      try {
        await loadPatientById(prescription.patientId);
        const patientDetails = getPatientDetails(prescription.patientId);

        if (patientDetails) {
          setPatientAge(patientDetails.age || 0);
          setPatientSex(patientDetails.gender || '');
          setPatientAddress(formatPatientAddress(patientDetails.address));
        }
      } catch (error) {
        console.error('Failed to fetch patient details:', error);
        // Use fallback values
        setPatientAge(0);
        setPatientSex('');
        setPatientAddress('');
      }
    };

    fetchPatientDetails();
  }, [prescription?.patientId, opened, loadPatientById, getPatientDetails]);

  if (!prescription) {
    return null;
  }

  // Normalize medications to array
  const medications = Array.isArray(prescription.medications)
    ? prescription.medications
    : [];

  return (
    <PrintPrescriptionModalPresenter
      opened={opened}
      onClose={onClose}
      onPrint={handlePrint}
      printRef={printRef}
      patientName={prescription.patientName}
      patientAddress={patientAddress}
      age={patientAge}
      sex={patientSex}
      date={prescription.datePrescribed}
      medications={medications}
    />
  );
};
