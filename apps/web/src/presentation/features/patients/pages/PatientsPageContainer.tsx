import React from 'react';
import { PatientsPagePresenter } from './PatientsPagePresenter';
import { usePatientViewModel } from '../view-models';
import { usePatientsNavigation } from '../hooks/usePatientsNavigation';
import { useOverflowHidden } from '../../../hooks/useOverflowHidden';

export const PatientsPageContainer: React.FC = () => {
  const { patients, isLoading, error, clearError } = usePatientViewModel();
  const { handleAddPatient } = usePatientsNavigation();
  
  useOverflowHidden();

  return (
    <PatientsPagePresenter
      patients={patients}
      isLoading={isLoading}
      error={error}
      onAddPatient={handleAddPatient}
      onClearError={clearError}
    />
  );
};