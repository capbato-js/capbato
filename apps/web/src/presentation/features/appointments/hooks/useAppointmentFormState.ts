import { useState, useCallback } from 'react';

/**
 * Interface for patient state management
 */
interface PatientState {
  selectedPatientNumber: string;
  setSelectedPatientNumber: (patientNumber: string) => void;
  handlePatientChange: (
    patientId: string, 
    patients: Array<{ value: string; label: string; patientNumber: string }>,
    setValue: (name: string, value: string) => void
  ) => void;
}

/**
 * Custom hook to manage form state for patient selection and related data
 */
export const useAppointmentFormState = (): PatientState => {
  const [selectedPatientNumber, setSelectedPatientNumber] = useState<string>('');

  const handlePatientChange = useCallback((
    patientId: string,
    patients: Array<{ value: string; label: string; patientNumber: string }>,
    setValue: (name: string, value: string) => void
  ) => {
    const selectedPatient = patients.find(p => p.value === patientId);
    if (selectedPatient) {
      setSelectedPatientNumber(selectedPatient.patientNumber);
      setValue('patientName', patientId);
    }
  }, []);

  return {
    selectedPatientNumber,
    setSelectedPatientNumber,
    handlePatientChange
  };
};