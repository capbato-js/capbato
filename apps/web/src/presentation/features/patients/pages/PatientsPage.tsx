import React, { useState } from 'react';
import { Box } from '@mantine/core';
import { MedicalClinicLayout } from '../../../components/layout';
import { PatientsTable } from '../components';
import { Patient } from '../types';
import { mockPatients } from '../../../data/mockPatients';

export const PatientsPage: React.FC = () => {
  const [patients] = useState<Patient[]>(mockPatients);

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
          minHeight: 'calc(100vh - 140px)'
        }}
      >
        <PatientsTable
          patients={patients}
          onAddPatient={handleAddPatient}
        />
      </Box>
    </MedicalClinicLayout>
  );
};
