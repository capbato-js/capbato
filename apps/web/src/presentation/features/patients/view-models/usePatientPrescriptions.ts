import { useEffect, useState } from 'react';
import { usePrescriptionStore } from '../../../../infrastructure/state/PrescriptionStore';
import { Prescription } from '@nx-starter/domain';
import { BasePrescription } from '../../../components/common';

/**
 * Hook to manage patient-specific prescriptions
 */
export const usePatientPrescriptions = (patientId: string | undefined) => {
  const prescriptionStore = usePrescriptionStore();
  const [patientPrescriptions, setPatientPrescriptions] = useState<BasePrescription[]>([]);

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
    // Filter prescriptions for this specific patient and map to BasePrescription format
    const allPrescriptions = prescriptionStore.prescriptions;
    const filtered = allPrescriptions
      .filter(prescription => prescription.patientId === patientId)
      .map(mapDomainPrescriptionToBase);
    
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
 * Maps domain Prescription to BasePrescription for table display
 */
function mapDomainPrescriptionToBase(prescription: Prescription): BasePrescription {
  // Get the first medication for backward compatibility with single medication display
  const primaryMedication = prescription.medications?.[0];
  
  // Type assertion to access populated data that may be attached to the domain object
  const prescriptionWithData = prescription as unknown as {
    _populatedDoctor?: {
      fullName: string;
      firstName: string;
      lastName: string;
    };
  };
  
  return {
    id: prescription.id?.value || '',
    medicationName: primaryMedication?.medicationNameValue || 'N/A',
    dosage: primaryMedication?.dosageValue || 'N/A',
    instructions: primaryMedication?.instructionsValue || 'N/A',
    frequency: primaryMedication?.frequency || 'N/A',
    duration: primaryMedication?.duration || 'N/A',
    prescribedDate: prescription.prescribedDate.toISOString().split('T')[0],
    expiryDate: prescription.expiryDate?.toISOString().split('T')[0],
    doctor: prescriptionWithData._populatedDoctor?.fullName || 
            prescriptionWithData._populatedDoctor?.firstName + ' ' + prescriptionWithData._populatedDoctor?.lastName || 
            'TBD', // Display doctor name or fallback
    status: prescription.status || 'active', // Default to 'active' if status is undefined
  };
}