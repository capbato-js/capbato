import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Title, Group, Box, useMantineTheme, Button } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { DataTable, TableColumn } from '../../../components/common/DataTable';
import { TableActionButtons, ActionButtonConfig } from '../../../components/common/TableActionButtons';
import { Modal } from '../../../components/common';
import { MedicalClinicLayout } from '../../../components/layout';
import { LabTest } from '../types';
import { AddLabTestResultForm, AddLabTestResultFormData } from '../components';

export const LaboratoryTestsPage: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const theme = useMantineTheme();
  
  // Modal state
  const [addResultModalOpened, setAddResultModalOpened] = useState(false);
  const [selectedLabTest, setSelectedLabTest] = useState<LabTest | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Lab tests data state
  const [labTests, setLabTests] = useState<LabTest[]>([]);
  const [labTestsLoading, setLabTestsLoading] = useState(true);
  const [labTestsError, setLabTestsError] = useState<string | null>(null);
  
  const [patientInfo, setPatientInfo] = useState<{
    patientNumber: string;
    patientName: string;
    age?: number;
    sex?: string;
  } | null>(null);

  // Fetch lab tests from API
  useEffect(() => {
    const fetchLabTests = async () => {
      if (!patientId) return;
      
      setLabTestsLoading(true);
      setLabTestsError(null);
      
      try {
        // TODO: Replace with actual API call once lab service is integrated
        // For now, simulate API response with the diverse test data
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate loading
        
        const mockLabTests: LabTest[] = [
          // Blood Chemistry Tests
          { 
            id: '1', 
            testCategory: 'BLOOD_CHEMISTRY',
            tests: ['fbs', 'bun'],
            testDisplayNames: ['FBS', 'BUN'],
            date: 'Jun 30, 2025', 
            status: 'Confirmed', 
            results: 'Available',
            testName: 'BLOOD CHEMISTRY: FBS, BUN' // Legacy compatibility
          },
          { 
            id: '2', 
            testCategory: 'BLOOD_CHEMISTRY',
            tests: ['fbs'],
            testDisplayNames: ['FBS'],
            date: 'Jul 1, 2025', 
            status: 'Pending',
            testName: 'BLOOD CHEMISTRY: FBS' // Legacy compatibility
          },
          { 
            id: '3', 
            testCategory: 'BLOOD_CHEMISTRY',
            tests: ['lipidProfile'],
            testDisplayNames: ['Lipid Profile'],
            date: 'Jul 2, 2025', 
            status: 'Complete', 
            results: 'Available',
            testName: 'BLOOD CHEMISTRY: Lipid Profile' // Legacy compatibility
          },
          { 
            id: '4', 
            testCategory: 'BLOOD_CHEMISTRY',
            tests: ['hbalc', 'sgot', 'sgpt'],
            testDisplayNames: ['HBA1C', 'SGOT', 'SGPT'],
            date: 'Jul 3, 2025', 
            status: 'In Progress',
            testName: 'BLOOD CHEMISTRY: HBA1C, SGOT, SGPT' // Legacy compatibility
          },
          
          // Urinalysis Tests  
          { 
            id: '5', 
            testCategory: 'URINALYSIS',
            tests: ['urinalysis'],
            testDisplayNames: ['URINALYSIS'],
            date: 'Jun 28, 2025', 
            status: 'Pending',
            testName: 'URINALYSIS' // Legacy compatibility
          },
          { 
            id: '6', 
            testCategory: 'URINALYSIS',
            tests: ['urinalysis', 'urine_color', 'protein_urine'],
            testDisplayNames: ['URINALYSIS', 'Color', 'Protein'],
            date: 'Jun 29, 2025', 
            status: 'Confirmed', 
            results: 'Available',
            testName: 'URINALYSIS: Complete Panel' // Legacy compatibility
          },
          
          // Fecalysis Tests
          { 
            id: '7', 
            testCategory: 'FECALYSIS',
            tests: ['fecalysis'],
            testDisplayNames: ['FECALYSIS'],
            date: 'Jul 4, 2025', 
            status: 'Pending',
            testName: 'FECALYSIS' // Legacy compatibility
          },
          { 
            id: '8', 
            testCategory: 'FECALYSIS',
            tests: ['fecalysis', 'fecal_color', 'parasites'],
            testDisplayNames: ['FECALYSIS', 'Color', 'Parasites'],
            date: 'Jul 5, 2025', 
            status: 'Complete', 
            results: 'Available',
            testName: 'FECALYSIS: Comprehensive' // Legacy compatibility
          },
          
          // Other Tests
          { 
            id: '9', 
            testCategory: 'CBC',
            tests: ['cbcWithPlatelet'],
            testDisplayNames: ['CBC with Platelet'],
            date: 'Jul 6, 2025', 
            status: 'Confirmed', 
            results: 'Available',
            testName: 'CBC: CBC with Platelet' // Legacy compatibility
          },
          { 
            id: '10', 
            testCategory: 'BLOOD_CHEMISTRY', // Fallback for unknown tests
            tests: ['pregnancyTest'],
            testDisplayNames: ['Pregnancy Test'],
            date: 'Jul 7, 2025', 
            status: 'Complete', 
            results: 'Available',
            testName: 'BLOOD CHEMISTRY: Pregnancy Test' // Legacy compatibility
          }
        ];
        
        setLabTests(mockLabTests);
      } catch (err) {
        setLabTestsError(err instanceof Error ? err.message : 'Failed to fetch lab tests');
      } finally {
        setLabTestsLoading(false);
      }
    };

    fetchLabTests();
  }, [patientId]);

  // Mock patient info - this would come from API
  useEffect(() => {
    // In real implementation, fetch patient info based on patientId
    setPatientInfo({
      patientNumber: '2025-R3',
      patientName: 'Raj Va Riego',
      age: 12,
      sex: 'FEMALE'
    });
  }, [patientId]);

  const handleBackToLaboratory = () => {
    navigate('/laboratory');
  };

  const handleViewTest = (test: LabTest) => {
    console.log('View test:', test);
    // TODO: Implement view test functionality
  };

  const handleEditTest = (test: LabTest) => {
    console.log('Edit test:', test);
    // TODO: Implement edit test functionality
  };

  const handleAddResult = (test: LabTest) => {
    setSelectedLabTest(test);
    setAddResultModalOpened(true);
    setError(null);
  };

  const handleCloseModal = () => {
    setAddResultModalOpened(false);
    setSelectedLabTest(null);
    setError(null);
  };

  const handleSubmitResult = async (data: AddLabTestResultFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // TODO: Implement API call to save lab test results
      console.log('Submitting lab test results:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Close modal on success
      setAddResultModalOpened(false);
      setSelectedLabTest(null);
      
      console.log('Lab test results submitted successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit lab test results');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelTest = (test: LabTest) => {
    console.log('Cancel test:', test);
    // TODO: Implement cancel test functionality
  };

  // Helper function to format test display name from new structure
  const formatTestDisplayName = (test: LabTest): string => {
    // Use testDisplayNames if available, otherwise fall back to testName
    if (test.testDisplayNames && test.testDisplayNames.length > 0) {
      const categoryDisplayName = test.testCategory.replace('_', ' ');
      return `${categoryDisplayName}: ${test.testDisplayNames.join(', ')}`;
    }
    // Fallback to legacy testName for backward compatibility
    return test.testName || `${test.testCategory.replace('_', ' ')}: ${test.tests.join(', ')}`;
  };

  const getStatusBadge = (status: LabTest['status']) => {
    const styles = {
      'Complete': {
        background: theme.colors.green[1],
        color: theme.colors.green[9],
        padding: '5px 10px',
        borderRadius: '5px',
        fontWeight: 600,
        fontSize: '16px',
        display: 'inline-block'
      },
      'Confirmed': {
        background: theme.colors.green[1],
        color: theme.colors.green[9],
        padding: '5px 10px',
        borderRadius: '5px',
        fontWeight: 600,
        fontSize: '16px',
        display: 'inline-block'
      },
      'Pending': {
        background: theme.colors.orange[1],
        color: theme.colors.orange[9],
        padding: '5px 10px',
        borderRadius: '5px',
        fontWeight: 600,
        fontSize: '16px',
        display: 'inline-block'
      },
      'In Progress': {
        background: theme.colors.blue[1],
        color: theme.colors.blue[9],
        padding: '5px 10px',
        borderRadius: '5px',
        fontWeight: 600,
        fontSize: '16px',
        display: 'inline-block'
      }
    };

    const defaultStyle = {
      background: theme.colors.gray[1],
      color: theme.colors.gray[9],
      padding: '5px 10px',
      borderRadius: '5px',
      fontWeight: 600,
      fontSize: '16px',
      display: 'inline-block'
    };

    return (
      <span style={styles[status] || defaultStyle}>
        {status}
      </span>
    );
  };

  const getActionButtons = (test: LabTest): ActionButtonConfig[] => {
    if (test.status === 'Confirmed' || test.status === 'Complete') {
      return [
        {
          icon: 'fas fa-eye',
          tooltip: 'View Result',
          onClick: () => handleViewTest(test)
        },
        {
          icon: 'fas fa-edit',
          tooltip: 'Update Result',
          onClick: () => handleEditTest(test)
        }
      ];
    } else if (test.status === 'Pending') {
      return [
        {
          icon: 'fas fa-plus',
          tooltip: 'Add Result',
          onClick: () => handleAddResult(test)
        },
        {
          icon: 'fas fa-times',
          tooltip: 'Cancel Lab Test',
          onClick: () => handleCancelTest(test)
        }
      ];
    }
    return [];
  };

  const getResultsContent = (test: LabTest) => {
    const actions = getActionButtons(test);
    if (actions.length > 0) {
      return <TableActionButtons actions={actions} />;
    }
    return null;
  };

  // Define columns for the DataTable
  const columns: TableColumn<LabTest>[] = [
    {
      key: 'testName',
      header: 'Lab Test',
      width: '35%',
      align: 'left',
      searchable: true,
      render: (test: LabTest) => formatTestDisplayName(test)
    },
    {
      key: 'date',
      header: 'Date',
      width: '20%',
      align: 'center',
      searchable: true
    },
    {
      key: 'status',
      header: 'Status',
      width: '20%',
      align: 'center',
      searchable: true,
      render: (value: LabTest['status']) => getStatusBadge(value)
    },
    {
      key: 'actions',
      header: 'Results',
      width: '25%',
      align: 'center',
      render: (_value: string | undefined, record: LabTest) => getResultsContent(record)
    }
  ];

  return (
    <MedicalClinicLayout>
      {/* Header with Back Button and Patient Info */}
      <Box
        style={{
          marginBottom: '30px',
          paddingBottom: '20px',
          borderBottom: `2px solid ${theme.colors.gray[3]}`
        }}
      >
        <Group align="center" gap="lg" mb="md">
          <Button
            variant="filled"
            color="gray"
            leftSection={<IconArrowLeft size={16} />}
            onClick={handleBackToLaboratory}
            size="sm"
            style={{
              fontSize: '14px'
            }}
          >
            Back to Laboratory
          </Button>
          <Title
            order={2}
            style={{
              fontSize: '32px',
              fontWeight: 700,
              color: '#0F0F0F',
              margin: 0
            }}
          >
            Lab Tests
          </Title>
        </Group>
        
        {/* Patient Information */}
        {patientInfo && (
          <Box
            style={{
              backgroundColor: theme.colors.blue[0],
              padding: '15px 20px',
              borderRadius: '8px',
              marginTop: '15px'
            }}
          >
            <Group gap="xl">
              <div>
                <strong>Patient #:</strong> {patientInfo.patientNumber}
              </div>
              <div>
                <strong>Patient's Name:</strong> {patientInfo.patientName}
              </div>
            </Group>
          </Box>
        )}
      </Box>
      
      <DataTable
        data={labTests}
        columns={columns}
        searchable={true}
        searchPlaceholder="Search lab tests by name, date, or status..."
        emptyStateMessage={labTestsError ? `Error: ${labTestsError}` : "No lab tests found"}
        useViewportHeight={true}
        bottomPadding={90}
        isLoading={labTestsLoading}
      />

      {/* Add Lab Test Result Modal */}
      {selectedLabTest && patientInfo && (
        <Modal
          opened={addResultModalOpened}
          onClose={handleCloseModal}
          title=""
          size="xl"
          customStyles={{
            body: {
              padding: '0 24px 24px',
            }
          }}
        >
          <AddLabTestResultForm
              testType={selectedLabTest.testCategory}
              patientData={{
                patientNumber: patientInfo.patientNumber,
                patientName: patientInfo.patientName,
                age: patientInfo.age || 0,
                sex: patientInfo.sex || ''
              }}
              onSubmit={handleSubmitResult}
              isLoading={isLoading}
              error={error}
            />
        </Modal>
      )}
    </MedicalClinicLayout>
  );
};