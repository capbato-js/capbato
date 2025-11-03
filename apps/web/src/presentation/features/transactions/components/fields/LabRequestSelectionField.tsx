import React from 'react';
import { Box, Text, Loader } from '@mantine/core';
import { FormSelect } from '../../../../components/ui/FormSelect';

interface LabRequestOption {
  value: string;
  label: string;
  testCount: number;
  requestDate: string;
}

interface LabRequestSelectionFieldProps {
  labRequests: LabRequestOption[];
  selectedLabRequestId: string | null;
  isLoadingLabRequests: boolean;
  isLoadingLabItems: boolean;
  onLabRequestSelect: (labRequestId: string | null) => void;
  patientId: string;
}

export const LabRequestSelectionField: React.FC<LabRequestSelectionFieldProps> = ({
  labRequests,
  selectedLabRequestId,
  isLoadingLabRequests,
  isLoadingLabItems,
  onLabRequestSelect,
  patientId,
}) => {
  // Only show if patient is selected
  if (!patientId) {
    return null;
  }

  // Show loading state
  if (isLoadingLabRequests) {
    return (
      <Box>
        <Text size="sm" fw={500} mb={4}>Lab Request (Optional)</Text>
        <Box style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Loader size="sm" />
          <Text size="sm" c="dimmed">Loading lab requests...</Text>
        </Box>
      </Box>
    );
  }

  // Don't show if no lab requests available
  if (labRequests.length === 0) {
    return null;
  }

  return (
    <Box>
      <FormSelect
        label="Lab Request (Optional)"
        placeholder="Select a lab request to auto-populate items"
        data={labRequests}
        value={selectedLabRequestId ?? undefined}
        onChange={onLabRequestSelect}
        searchable
        clearable
        disabled={isLoadingLabItems}
        required={false}
      />
      {isLoadingLabItems && (
        <Box style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
          <Loader size="sm" />
          <Text size="sm" c="dimmed">Loading lab test items...</Text>
        </Box>
      )}
      {selectedLabRequestId && !isLoadingLabItems && (
        <Text size="sm" c="dimmed" mt={4}>
          Items from this lab request have been added below. You can edit or remove them as needed.
        </Text>
      )}
    </Box>
  );
};
