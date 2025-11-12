import React from 'react';
import { Grid, Text, Box, Group, Stack } from '@mantine/core';
import { PatientDetails } from '../../types';
import { PatientInfoCard } from '../PatientInfoCard';
import { PatientAvatar } from '../PatientAvatar';
import { InfoRow } from '../InfoRow';
import { formatAddress, formatDateOfBirth } from '../../utils/patientFormatUtils';

interface PatientInfoTabProps {
  patient: PatientDetails;
}

export const PatientInfoTab: React.FC<PatientInfoTabProps> = ({ patient }) => {
  console.log('👤 PatientInfoTab: Rendering with patient:', patient);
  console.log('📸 PatientInfoTab: photoUrl:', patient.photoUrl);

  // Extract first and last name from fullName
  const nameParts = patient.fullName?.split(' ') || [];
  const firstName = nameParts[0] || '';
  const lastName = nameParts[nameParts.length - 1] || '';

  console.log('👤 PatientInfoTab: firstName:', firstName, 'lastName:', lastName);

  return (
    <Grid style={{ gap: '50px', maxWidth: '100%', margin: 0, padding: '0 20px' }}>
      <Grid.Col span={6}>
        {/* Patient Information Card with Avatar on the right */}
        <Box style={{ position: 'relative' }}>
          <PatientInfoCard title="Patient Information">
            {/* Avatar positioned in top-right corner */}
            <Box
              style={{
                position: 'absolute',
                top: '60px',
                right: '20px',
              }}
            >
              <PatientAvatar
                photoUrl={patient.photoUrl}
                firstName={firstName}
                lastName={lastName}
                size={120}
              />
            </Box>

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
        </Box>
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