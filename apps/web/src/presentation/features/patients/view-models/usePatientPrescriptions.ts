import { useEffect, useState } from 'react';
import { usePrescriptionStore } from '../../../../infrastructure/state/PrescriptionStore';
import { Prescription } from '@nx-starter/domain';

// Define the prescription display format to match the main prescriptions page
interface PrescriptionDisplay {
  id: string;
  patientNumber: string;
  patientName: string;
  doctor: string;
  datePrescribed: string;
  medications: Array<{ name: string }>;
}

/**
 * Hook to manage patient-specific prescriptions
 */
export const usePatientPrescriptions = (patientId: string | undefined) => {
  const prescriptionStore = usePrescriptionStore();
  const [patientPrescriptions, setPatientPrescriptions] = useState<PrescriptionDisplay[]>([]);

  useEffect(() => {
    const loadData = async () => {
      if (!patientId) {
        setPatientPrescriptions([]);
        return;
      }

      try {
        await prescriptionStore.loadPrescriptionsByPatientId(patientId);
      } catch (error) {
        console.error('Failed to load patient prescriptions:', error);
      }
    };

    loadData();
  }, [patientId]);

  useEffect(() => {
    // Filter prescriptions for this specific patient and map to PrescriptionDisplay format
    const allPrescriptions = prescriptionStore.prescriptions;
    const filtered = allPrescriptions
      .filter(prescription => prescription.patientId === patientId)
      .map(mapDomainPrescriptionToDisplay);

    setPatientPrescriptions(filtered);
  }, [prescriptionStore.prescriptions, patientId]);

  return {
    prescriptions: patientPrescriptions,
    isLoading: prescriptionStore.getIsLoading(),
    error: prescriptionStore.error,
    hasError: prescriptionStore.getHasError(),
    clearError: prescriptionStore.clearError,
  };
};

/**
 * Maps domain Prescription to PrescriptionDisplay for table display
 * Matches the format used in the main prescriptions page
 */
function mapDomainPrescriptionToDisplay(prescription: Prescription): PrescriptionDisplay {
  // Type assertion to access populated data that may be attached to the domain object
  const prescriptionWithData = prescription as unknown as {
    _populatedDoctor?: {
      fullName: string;
      firstName: string;
      lastName: string;
    };
    _populatedPatient?: {
      patientNumber: string;
      name: string;
      firstName: string;
      lastName: string;
    };
  };

  // Get doctor name
  const doctorName = prescriptionWithData._populatedDoctor?.fullName ||
    (prescriptionWithData._populatedDoctor?.firstName && prescriptionWithData._populatedDoctor?.lastName
      ? `${prescriptionWithData._populatedDoctor.firstName} ${prescriptionWithData._populatedDoctor.lastName}`.trim()
      : 'TBD');

  // Get patient info
  const patientNumber = prescriptionWithData._populatedPatient?.patientNumber || 'N/A';
  const patientName = prescriptionWithData._populatedPatient?.name ||
    (prescriptionWithData._populatedPatient?.firstName && prescriptionWithData._populatedPatient?.lastName
      ? `${prescriptionWithData._populatedPatient.firstName} ${prescriptionWithData._populatedPatient.lastName}`.trim()
      : 'N/A');

  // Map medications
  const medications = prescription.medications?.map(med => ({
    name: med.medicationNameValue || 'N/A'
  })) || [];

  return {
    id: prescription.id?.value || '',
    patientNumber,
    patientName,
    doctor: doctorName,
    datePrescribed: prescription.prescribedDate.toISOString().split('T')[0],
    medications,
  };
}