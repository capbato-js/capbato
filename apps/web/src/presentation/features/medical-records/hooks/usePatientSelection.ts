import { useState } from 'react';
import { UseFormSetValue } from 'react-hook-form';
import type { AddLabTestFormData } from './useLabTestFormState';

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

  // Handle patient selection to show patient number and auto-populate age/gender
  const handlePatientChange = (patientId: string) => {
    const selectedPatient = patients.find(p => p.value === patientId);
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
  };
};