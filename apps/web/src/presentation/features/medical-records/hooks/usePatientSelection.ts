import { useState, useMemo } from 'react';
import { UseFormSetValue } from 'react-hook-form';
import type { AddLabTestFormData } from './useLabTestFormState';
import { usePatientsWithTodayAppointments } from './usePatientsWithTodayAppointments';

interface UsePatientSelectionProps {
  setValue: UseFormSetValue<AddLabTestFormData>;
  patients: Array<{
    value: string;
    label: string;
    patientNumber: string;
    age: number;
    gender: string
  }>;
}

export const usePatientSelection = ({ setValue, patients }: UsePatientSelectionProps) => {
  const [selectedPatientNumber, setSelectedPatientNumber] = useState<string>('');
  const [selectedPatientAgeGender, setSelectedPatientAgeGender] = useState<string>('');

  // Get patients with appointments today
  const {
    filterPatientsWithAppointmentsToday,
    hasAnyPatientsWithAppointmentsToday,
    isLoading: isLoadingAppointments
  } = usePatientsWithTodayAppointments();

  // Filter patients to only show those with appointments today
  const filteredPatients = useMemo(() => {
    return filterPatientsWithAppointmentsToday(patients);
  }, [patients, filterPatientsWithAppointmentsToday]);

  // Handle patient selection to show patient number and auto-populate age/gender
  const handlePatientChange = (patientId: string) => {
    const selectedPatient = filteredPatients.find(p => p.value === patientId);
    if (selectedPatient) {
      setSelectedPatientNumber(selectedPatient.patientNumber);
      const ageGenderString = `${selectedPatient.age}/${selectedPatient.gender.charAt(0).toUpperCase()}`;
      setSelectedPatientAgeGender(ageGenderString);
      setValue('patientName', patientId);
      setValue('ageGender', ageGenderString);
    }
  };

  return {
    selectedPatientNumber,
    selectedPatientAgeGender,
    handlePatientChange,
    filteredPatients,
    hasAnyPatientsWithAppointmentsToday,
    isLoadingAppointments,
  };
};