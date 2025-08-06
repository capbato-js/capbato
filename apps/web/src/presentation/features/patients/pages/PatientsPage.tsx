import React, { useEffect } from 'react';
import { Alert } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { MedicalClinicLayout } from '../../../components/layout';
import { PatientsTable } from '../components';
import { usePatientViewModel } from '../view-models';

export const PatientsPage: React.FC = () => {
  const navigate = useNavigate();
  const { patients, isLoading, error, clearError } = usePatientViewModel();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleAddPatient = () => {
    navigate('/patients/new');
  };

  return (
    <MedicalClinicLayout>
      {/* No boxing - content flows naturally */}
      {error && (
        <Alert 
          color="red" 
            title="Error"
            mb="md"
            withCloseButton
            onClose={clearError}
          >
            {error}
          </Alert>
        )}
        
        <PatientsTable
          patients={patients}
          onAddPatient={handleAddPatient}
          isLoading={isLoading}
        />
    </MedicalClinicLayout>
  );
};
