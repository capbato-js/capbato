import React from 'react';
import { Box, Text } from '@mantine/core';
import { FORM_MESSAGES } from '../config/appointmentFormConfig';

interface DoctorAssignmentDisplayProps {
  assignedDoctor: string;
}

export const DoctorAssignmentDisplay: React.FC<DoctorAssignmentDisplayProps> = ({
  assignedDoctor
}) => {
  if (!assignedDoctor) return null;

  const isError = assignedDoctor.startsWith('Error');
  const isNoDoctor = assignedDoctor === 'No doctor assigned';
  const hasIssue = isError || isNoDoctor;

  return (
    <Box>
      <Text 
        size="sm" 
        c={isError ? 'red' : isNoDoctor ? 'orange' : 'dimmed'} 
        mt={4}
      >
        {hasIssue ? '⚠️ ' : ''}
        Assigned Doctor: {assignedDoctor}
      </Text>
      {hasIssue && (
        <Text size="xs" c="dimmed" mt={2}>
          {isNoDoctor 
            ? FORM_MESSAGES.DOCTOR_ASSIGNMENT.NO_DOCTOR
            : FORM_MESSAGES.DOCTOR_ASSIGNMENT.ERROR
          }
        </Text>
      )}
    </Box>
  );
};