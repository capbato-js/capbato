import React from 'react';
import { MedicalClinicLayout } from '../../../components/layout';
import { PatientsTable } from '../components';
import { ErrorAlert } from '../components/ErrorAlert';
import { Patient } from '../types';

interface PatientsPagePresenterProps {
  patients: Patient[];
  isLoading: boolean;
  error: string | null;
  onAddPatient: () => void;
  onClearError: () => void;
}

export const PatientsPagePresenter: React.FC<PatientsPagePresenterProps> = ({
  patients,
  isLoading,
  error,
  onAddPatient,
  onClearError
}) => {
  return (
    <MedicalClinicLayout>
      <ErrorAlert error={error} onClose={onClearError} />
      
      <PatientsTable
        patients={patients}
        onAddPatient={onAddPatient}
        isLoading={isLoading}
      />
    </MedicalClinicLayout>
  );
};