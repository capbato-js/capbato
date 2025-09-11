import React from 'react';
import { useParams } from 'react-router-dom';
import { usePatientDetailsData } from '../hooks/usePatientDetailsData';
import { usePatientDetailsNavigation } from '../hooks/usePatientDetailsNavigation';
import { PatientDetailsPagePresenter } from './PatientDetailsPagePresenter';

export const PatientDetailsPageContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { patient, isLoading, error, hasError, clearError } = usePatientDetailsData(id);
  const { activeTab, handleGoBack, handleTabChange } = usePatientDetailsNavigation();

  return (
    <PatientDetailsPagePresenter
      // Data
      patient={patient}
      isLoading={isLoading}
      error={error}
      hasError={hasError}
      patientId={id}
      
      // Navigation
      activeTab={activeTab}
      onGoBack={handleGoBack}
      onTabChange={handleTabChange}
      onClearError={clearError}
    />
  );
};