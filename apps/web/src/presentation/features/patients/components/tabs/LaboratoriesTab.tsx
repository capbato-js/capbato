import React, { useEffect, useMemo, useState } from 'react';
import { Box, Text, useMantineTheme } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { LaboratoryTestsTable, LaboratoryTestsModals } from '../../../medical-records/components';
import { LabTest } from '../../../medical-records/types';
import { useLaboratoryStore } from '../../../../../infrastructure/state/LaboratoryStore';

interface LaboratoriesTabProps {
  patientId: string;
}

export const LaboratoriesTab: React.FC<LaboratoriesTabProps> = ({ patientId }) => {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const laboratoryStore = useLaboratoryStore();

  // Local state for cancel confirmation modal
  const [cancelConfirmationModalOpened, setCancelConfirmationModalOpened] = useState(false);
  const [testToCancel, setTestToCancel] = useState<LabTest | null>(null);

  // Fetch lab tests on mount
  useEffect(() => {
    const fetchData = async () => {
      if (!patientId) {
        return;
      }

      try {
        await laboratoryStore.fetchLabTestsByPatientId(patientId);
      } catch {
        // Error handling
      }
    };

    fetchData();
  }, [patientId]);

  // Convert LabTestDto[] to LabTest[]
  const labTests: LabTest[] = useMemo(() => {
    return laboratoryStore.labTests.map((dto, index) => ({
      id: dto.id || `test-${patientId}-${index}`,
      testCategory: dto.testCategory || 'bloodChemistry',
      tests: dto.tests || [],
      testDisplayNames: dto.testDisplayNames || [],
      date: dto.date || new Date().toISOString(),
      status: dto.status || 'Pending',
      results: dto.results,
      patientId: dto.patientId,
      enabledFields: dto.enabledFields || [],
      testName: dto.testName
    }));
  }, [laboratoryStore.labTests, patientId]);

  // Navigation handlers
  const handleViewTest = (labTest: LabTest) => {
    navigate(`/laboratory/tests/${patientId}/view-result/${labTest.id}?returnTo=patient&returnTab=laboratories`, {
      state: { labTest }
    });
  };

  const handleEditTest = (labTest: LabTest) => {
    navigate(`/laboratory/tests/${patientId}/edit-result/${labTest.id}?returnTo=patient&returnTab=laboratories`, {
      state: { labTest }
    });
  };

  const handleAddResult = (labTest: LabTest) => {
    navigate(`/laboratory/tests/${patientId}/add-result/${labTest.id}?returnTo=patient&returnTab=laboratories`, {
      state: { labTest }
    });
  };

  // Cancel confirmation handlers
  const handleCancelTest = (labTest: LabTest) => {
    setTestToCancel(labTest);
    setCancelConfirmationModalOpened(true);
  };

  const handleConfirmCancel = async () => {
    if (testToCancel && patientId) {
      try {
        await laboratoryStore.cancelLabRequest(testToCancel.id);

        // Reload lab tests to reflect the cancellation
        await laboratoryStore.fetchLabTestsByPatientId(patientId);
      } catch {
        // Handle cancellation error silently
      } finally {
        handleCloseCancelConfirmation();
      }
    }
  };

  const handleCloseCancelConfirmation = () => {
    setCancelConfirmationModalOpened(false);
    setTestToCancel(null);
  };

  return (
    <Box style={{ padding: '0 20px' }}>
      <Text
        style={{
          color: theme.colors.blue[9],
          fontSize: '20px',
          fontWeight: 'bold',
          marginBottom: '20px',
          marginTop: 0,
          borderBottom: `2px solid ${theme.colors.blue[9]}`,
          paddingBottom: '8px'
        }}
      >
        Laboratory Requests
      </Text>

      <LaboratoryTestsTable
        labTests={labTests}
        isLoading={laboratoryStore.loadingStates.fetching}
        errorMessage={laboratoryStore.errorStates.fetchError}
        onViewTest={handleViewTest}
        onEditTest={handleEditTest}
        onAddResult={handleAddResult}
        onCancelTest={handleCancelTest}
      />

      <LaboratoryTestsModals
        cancelConfirmationModalOpened={cancelConfirmationModalOpened}
        onCloseCancelConfirmation={handleCloseCancelConfirmation}
        onConfirmCancel={handleConfirmCancel}
        testToCancel={testToCancel}
        patientInfo={null}
        isLoading={laboratoryStore.loadingStates.fetching}
        error={laboratoryStore.errorStates.fetchError}
      />
    </Box>
  );
};