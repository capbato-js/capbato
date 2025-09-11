import { useMemo } from 'react';
import { usePrescriptionListViewModel } from '../../prescriptions/view-models/usePrescriptionListViewModel';
import { transformPrescriptionsForDisplay } from '../utils/prescriptionUtils';

export type DisplayPrescription = {
  id: string;
  patientNumber: string;
  patientName: string;
  patientId: string;
  doctor: string;
  doctorId: string;
  datePrescribed: string;
  medications: string;
  notes: string | undefined;
};

export const usePrescriptionData = () => {
  const prescriptionListViewModel = usePrescriptionListViewModel();

  const displayPrescriptions = useMemo(() => {
    return transformPrescriptionsForDisplay(prescriptionListViewModel.filteredPrescriptions);
  }, [prescriptionListViewModel.filteredPrescriptions]);

  return {
    displayPrescriptions,
    prescriptionListViewModel,
    isLoading: prescriptionListViewModel.isLoading,
    error: prescriptionListViewModel.error,
  };
};