import React, { useEffect } from 'react';
import { AddPrescriptionFormData } from '@nx-starter/application-shared';
import { usePrescriptionFormData } from '../hooks/usePrescriptionFormData';
import { usePrescriptionFormState } from '../hooks/usePrescriptionFormState';
import { processFormSubmission } from '../utils/prescriptionFormUtils';
import { AddPrescriptionFormPresenter } from './AddPrescriptionFormPresenter';
import { Medication } from '../types';

export interface AddPrescriptionFormContainerProps {
  onSubmit: (data: AddPrescriptionFormData) => Promise<boolean>;
  isLoading: boolean;
  error?: string | null;
  onClearError?: () => void;
  // Edit mode props
  editMode?: boolean;
  initialData?: {
    patientId?: string;
    patientName?: string;
    patientNumber?: string;
    doctorId?: string;
    doctorName?: string;
    datePrescribed?: string;
    medications?: Medication[];
    notes?: string;
  };
}

export const AddPrescriptionFormContainer: React.FC<AddPrescriptionFormContainerProps> = ({
  onSubmit,
  isLoading,
  error,
  onClearError,
  editMode = false,
  initialData,
}) => {
  // Get patient/doctor data
  const {
    patients,
    doctors,
    selectedPatientNumber,
    updateSelectedPatientNumber,
  } = usePrescriptionFormData();

  // Get form state
  const {
    control,
    handleSubmit,
    errors,
    fields,
    addMedication,
    removeMedication,
    isFormValid,
    watchedValues: { patientId },
  } = usePrescriptionFormState({
    editMode,
    initialData,
    onClearError,
    error,
  });

  // Update patient number when patient changes
  useEffect(() => {
    updateSelectedPatientNumber(patientId);
  }, [patientId, updateSelectedPatientNumber]);

  const handleFormSubmit = async (data: AddPrescriptionFormData) => {
    return await processFormSubmission(data, onSubmit);
  };

  return (
    <AddPrescriptionFormPresenter
      control={control}
      handleSubmit={handleSubmit}
      errors={errors}
      fields={fields}
      patients={patients}
      doctors={doctors}
      selectedPatientNumber={selectedPatientNumber}
      addMedication={addMedication}
      removeMedication={removeMedication}
      onFormSubmit={handleFormSubmit}
      isLoading={isLoading}
      error={error}
      isFormValid={isFormValid}
      editMode={editMode}
    />
  );
};