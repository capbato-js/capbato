import React from 'react';
import { Box, Alert, Button } from '@mantine/core';
import { MedicalClinicLayout } from '../../../components/layout';
import { PatientsTable } from '../components';
import { usePatientViewModel } from '../view-models';

export const PatientsPage: React.FC = () => {
  const { patients, isLoading, error, clearError } = usePatientViewModel();

  const handleAddPatient = () => {
    console.log('Add new patient');
    // TODO: Open add patient modal or navigate to add page
  };

  return (
    <MedicalClinicLayout>
      <Box
        style={{
          background: 'white',
          borderRadius: '15px',
          padding: '30px',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
          minHeight: 'calc(100vh - 140px)',
          position: 'relative'
        }}
      >
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
      </Box>
    </MedicalClinicLayout>
  );
};
