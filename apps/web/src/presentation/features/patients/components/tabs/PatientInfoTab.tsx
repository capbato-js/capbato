import React from 'react';
import { Grid, Text } from '@mantine/core';
import { PatientDetails } from '../../types';
import { PatientInfoCard } from '../PatientInfoCard';
import { InfoRow } from '../InfoRow';
import { formatAddress, formatDateOfBirth } from '../../utils/patientFormatUtils';

interface PatientInfoTabProps {
  patient: PatientDetails;
}

export const PatientInfoTab: React.FC<PatientInfoTabProps> = ({ patient }) => {
  return (
    <Grid style={{ gap: '50px', maxWidth: '100%', margin: 0, padding: '0 20px' }}>
      <Grid.Col span={6}>
        <PatientInfoCard title="Patient Information">
          <InfoRow 
            label="Patient #" 
            value={patient.patientNumber} 
            isRequired={true}
          />
          <InfoRow 
            label="Full Name" 
            value={patient.fullName} 
            isRequired={true}
          />
          <InfoRow 
            label="Gender" 
            value={patient.gender} 
            fallback="Not specified"
          />
          <InfoRow 
            label="Age" 
            value={patient.age} 
            fallback="Not available"
          />
          <InfoRow 
            label="Date of Birth" 
            value={formatDateOfBirth(patient.dateOfBirth)} 
            isRequired={true}
          />
          <InfoRow 
            label="Contact Number" 
            value={patient.phoneNumber} 
            fallback="Not provided"
          />
          <InfoRow 
            label="Address" 
            value={formatAddress(patient.address)} 
            fallback="Not provided"
          />
        </PatientInfoCard>
      </Grid.Col>
      <Grid.Col span={6}>
        <PatientInfoCard title="Guardian Details">
          {patient.guardian ? (
            <>
              <InfoRow 
                label="Full Name" 
                value={patient.guardian.fullName} 
                fallback="Not provided"
              />
              <InfoRow 
                label="Gender" 
                value={patient.guardian.gender} 
                fallback="Not specified"
              />
              <InfoRow 
                label="Relationship" 
                value={patient.guardian.relationship} 
                fallback="Not specified"
              />
              <InfoRow 
                label="Contact Number" 
                value={patient.guardian.contactNumber} 
                fallback="Not provided"
              />
              <InfoRow 
                label="Address" 
                value={patient.guardian.address} 
                fallback="Not provided"
              />
            </>
          ) : (
            <Text style={{ fontSize: '15px', color: '#666', fontStyle: 'italic' }}>
              No guardian assigned to this patient
            </Text>
          )}
        </PatientInfoCard>
      </Grid.Col>
    </Grid>
  );
};