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
import { useLaboratoryStore } from '../../../../infrastructure/state/LaboratoryStore';
import { usePatientStore } from '../../../../infrastructure/state/PatientStore';

export const LaboratoryTestsPage: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>(); // Now correctly receives the patient ID
  const navigate = useNavigate();
  const theme = useMantineTheme();
  
  // Modal state
  const [addResultModalOpened, setAddResultModalOpened] = useState(false);
  const [viewResultModalOpened, setViewResultModalOpened] = useState(false);
  const [selectedLabTest, setSelectedLabTest] = useState<LabTest | null>(null);
  const [bloodChemistryData, setBloodChemistryData] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Lab tests data state
  const [labTests, setLabTests] = useState<LabTest[]>([]);
  const [patientInfo, setPatientInfo] = useState<{
    patientNumber: string;
    patientName: string;
    age?: number;
    sex?: string;
  } | null>(null);

  // Laboratory store
  const { 
    fetchLabTestsByPatientId,
    fetchLabRequestByPatientId,
    createBloodChemistry,
    fetchBloodChemistryByPatientId,
    loadingStates, 
    errorStates 
  } = useLaboratoryStore();

  // Patient store  
  const { 
    loadPatientById,
    getPatientDetails
  } = usePatientStore();

  // Fetch lab tests from API
  useEffect(() => {
    const fetchLabTests = async () => {
      if (!patientId) return;
      
      try {
        console.log('🧪 Fetching lab data for patient:', patientId);
        
        // First, try to fetch lab request to get patient information
        let patientData = null;
        try {
          const labRequest = await fetchLabRequestByPatientId(patientId);
          if (labRequest) {
            console.log('📋 Retrieved lab request with patient info:', labRequest);
            patientData = labRequest.patient;
          }
        } catch (requestError) {
          console.warn('⚠️ Could not fetch lab request for patient info:', requestError);
        }
        
        // Then fetch lab tests
        const fetchedLabTests = await fetchLabTestsByPatientId(patientId);
        console.log('✅ Received lab tests from store:', fetchedLabTests);
        
        // Convert LabTestDto[] to LabTest[] (they should be compatible)
        const convertedLabTests: LabTest[] = fetchedLabTests.map((dto, index) => {
          console.log(`🔍 Processing lab test ${index}:`, {
            id: dto.id,
            testCategory: dto.testCategory,
            tests: dto.tests,
            testDisplayNames: dto.testDisplayNames,
            testName: dto.testName,
            date: dto.date,
            status: dto.status
          });
          
          const converted = {
            id: dto.id || `test-${Date.now()}`,
            testCategory: dto.testCategory || 'BLOOD_CHEMISTRY',
            tests: dto.tests || [],
            testDisplayNames: dto.testDisplayNames || [],
            date: dto.date || new Date().toISOString(),
            status: dto.status || 'Pending',
            results: dto.results,
            patientId: dto.patientId,
            testName: dto.testName
          };
          
          console.log(`🔄 Converted lab test ${index}:`, converted);
          return converted;
        });
        
        console.log('📋 Final converted lab tests:', convertedLabTests);
        setLabTests(convertedLabTests);
        
        // Set patient information from lab request data or fallback
        if (patientData) {
          // Extract age and sex from ageGender field (e.g., "35/M" or "28/F")
          let age: number | undefined;
          let sex: string | undefined;
          
          if (patientData.ageGender) {
            const ageGenderParts = patientData.ageGender.split('/');
            if (ageGenderParts.length >= 2) {
              age = parseInt(ageGenderParts[0]);
              sex = ageGenderParts[1];
            }
          }
          
          // Use proper patient name
          let patientName = patientData.name;
          if (!patientName && patientData.firstName && patientData.lastName) {
            patientName = `${patientData.firstName} ${patientData.lastName}`.trim();
          }
          
          setPatientInfo({
            patientNumber: patientData.patientNumber || patientData.id,
            patientName: patientName || `Patient ${patientData.id}`,
            age,
            sex
          });
        } else {
          // Fallback if no lab request data available - fetch patient details directly
          console.log('🔄 Lab request failed, attempting to fetch patient details directly...');
          try {
            await loadPatientById(patientId);
            const patientDetails = getPatientDetails(patientId);
            
            if (patientDetails) {
              console.log('✅ Retrieved patient details from Patient API:', patientDetails);
              setPatientInfo({
                patientNumber: patientDetails.patientNumber,
                patientName: `${patientDetails.firstName} ${patientDetails.lastName}`.trim(),
                age: patientDetails.age,
                sex: patientDetails.gender
              });
            } else {
              // Final fallback if both APIs fail
              console.warn('⚠️ Both lab request and patient APIs failed, using UUID fallback');
              setPatientInfo({
                patientNumber: patientId,
                patientName: `Patient ${patientId}`,
                age: undefined,
                sex: undefined
              });
            }
          } catch (patientError) {
            console.error('❌ Error fetching patient details:', patientError);
            // Final fallback if both APIs fail
            setPatientInfo({
              patientNumber: patientId,
              patientName: `Patient ${patientId}`,
              age: undefined,
              sex: undefined
            });
          }
        }
        
      } catch (err) {
        console.error('❌ Error fetching lab tests:', err);
        // Error handling is now managed by the store
      }
    };

    fetchLabTests();
  }, [patientId, fetchLabTestsByPatientId, fetchLabRequestByPatientId, loadPatientById, getPatientDetails]);


  const handleBackToLaboratory = () => {
    navigate('/laboratory');
  };

  const handleViewTest = async (test: LabTest) => {
    console.log('View test:', test);
    setSelectedLabTest(test);
    
    // Fetch blood chemistry data if it's a blood chemistry test
    if (test.testCategory === 'BLOOD_CHEMISTRY' && patientId) {
      try {
        const bloodChemistryResults = await fetchBloodChemistryByPatientId(patientId);
        
        // Find the blood chemistry result that matches this lab test ID
        const matchingResult = bloodChemistryResults.find(result => 
          result.labRequestId === test.id
        );
        
        if (matchingResult && matchingResult.results) {
          // Convert BloodChemistryDto results to form data format (string values)
          const formData: Record<string, string> = {};
          Object.entries(matchingResult.results).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              formData[key] = value.toString();
            }
          });
          setBloodChemistryData(formData);
        } else {
          setBloodChemistryData({});
        }
      } catch (error) {
        console.error('Error fetching blood chemistry data:', error);
        setBloodChemistryData({});
      }
    }
    
    setViewResultModalOpened(true);
  };

  const handleEditTest = (test: LabTest) => {
    console.log('Edit test:', test);
    // TODO: Implement edit test functionality
  };

  const handleAddResult = (test: LabTest) => {
    console.log('🧪 Add Result clicked for test:', test);
    console.log('🧪 Test category:', test.testCategory);
    console.log('🧪 Specific tests to enable:', test.tests);
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
      console.log('🔬 Submitting lab test results:', data);
      
      if (!patientId || !selectedLabTest || !patientInfo) {
        throw new Error('Missing required patient information or selected lab test');
      }

      // Check if this is a blood chemistry test by looking at the selected tests
      const isBloodChemistryTest = selectedLabTest.testName.toLowerCase().includes('blood chemistry') ||
                                   selectedLabTest.selectedTests.some(test => 
                                     ['fbs', 'bun', 'creatinine', 'uric_acid', 'cholesterol', 'triglycerides', 'hdl', 'ldl', 'sgot', 'sgpt']
                                       .includes(test.toLowerCase())
                                   );

      if (isBloodChemistryTest) {
        // Convert form data to blood chemistry command
        const bloodChemistryCommand = {
          labRequestId: selectedLabTest.id, // Include the lab request ID to link the results
          patientId: patientId, // Include patient ID for proper identification
          patientName: patientInfo.patientName,
          age: patientInfo.age || 0,
          sex: patientInfo.sex || 'Unknown',
          dateTaken: new Date().toISOString(),
          
          // Map form field IDs to blood chemistry command properties
          fbs: data.fbs ? parseFloat(data.fbs) : undefined,
          bun: data.bun ? parseFloat(data.bun) : undefined,
          creatinine: data.creatinine ? parseFloat(data.creatinine) : undefined,
          uricAcid: (data.uricAcid || data.blood_uric_acid) ? parseFloat(data.uricAcid || data.blood_uric_acid || '0') : undefined,
          cholesterol: data.cholesterol ? parseFloat(data.cholesterol) : undefined,
          triglycerides: data.triglycerides ? parseFloat(data.triglycerides) : undefined,
          hdl: data.hdl ? parseFloat(data.hdl) : undefined,
          ldl: data.ldl ? parseFloat(data.ldl) : undefined,
          vldl: data.vldl ? parseFloat(data.vldl) : undefined,
          sodium: (data.sodium || data.sodiumNa) ? parseFloat(data.sodium || data.sodiumNa || '0') : undefined,
          potassium: (data.potassium || data.potassiumK) ? parseFloat(data.potassium || data.potassiumK || '0') : undefined,
          chloride: data.chloride ? parseFloat(data.chloride) : undefined,
          calcium: data.calcium ? parseFloat(data.calcium) : undefined,
          sgot: data.sgot ? parseFloat(data.sgot) : undefined,
          sgpt: data.sgpt ? parseFloat(data.sgpt) : undefined,
          rbs: data.rbs ? parseFloat(data.rbs) : undefined,
          alkPhosphatase: (data.alkPhosphatase || data.alp) ? parseFloat(data.alkPhosphatase || data.alp || '0') : undefined,
          totalProtein: (data.totalProtein || data.total_protein) ? parseFloat(data.totalProtein || data.total_protein || '0') : undefined,
          albumin: data.albumin ? parseFloat(data.albumin) : undefined,
          globulin: data.globulin ? parseFloat(data.globulin) : undefined,
          agRatio: (data.agRatio || data.ag_ratio) ? parseFloat(data.agRatio || data.ag_ratio || '0') : undefined,
          totalBilirubin: (data.totalBilirubin || data.total_bilirubin) ? parseFloat(data.totalBilirubin || data.total_bilirubin || '0') : undefined,
          directBilirubin: (data.directBilirubin || data.direct_bilirubin) ? parseFloat(data.directBilirubin || data.direct_bilirubin || '0') : undefined,
          indirectBilirubin: (data.indirectBilirubin || data.indirect_bilirubin) ? parseFloat(data.indirectBilirubin || data.indirect_bilirubin || '0') : undefined,
          ionisedCalcium: (data.ionisedCalcium || data.ionised_calcium) ? parseFloat(data.ionisedCalcium || data.ionised_calcium || '0') : undefined,
          magnesium: data.magnesium ? parseFloat(data.magnesium) : undefined,
          hbalc: data.hbalc ? parseFloat(data.hbalc) : undefined,
          ogtt30min: (data.ogtt30min || data.ogtt_30min) ? parseFloat(data.ogtt30min || data.ogtt_30min || '0') : undefined,
          ogtt1hr: (data.ogtt1hr || data.ogtt_1hr) ? parseFloat(data.ogtt1hr || data.ogtt_1hr || '0') : undefined,
          ogtt2hr: (data.ogtt2hr || data.ogtt_2hr) ? parseFloat(data.ogtt2hr || data.ogtt_2hr || '0') : undefined,
          ppbs2hr: (data.ppbs2hr || data.ppbs_2hr) ? parseFloat(data.ppbs2hr || data.ppbs_2hr || '0') : undefined,
          inorPhosphorus: (data.inorPhosphorus || data.inorg_phosphorus) ? parseFloat(data.inorPhosphorus || data.inorg_phosphorus || '0') : undefined,
        };

        console.log('🧪 Creating blood chemistry with command:', bloodChemistryCommand);

        // Call the blood chemistry API
        const success = await createBloodChemistry(bloodChemistryCommand);
        
        if (!success) {
          throw new Error('Failed to create blood chemistry results');
        }

        console.log('✅ Blood chemistry results submitted successfully!');
      } else {
        // For other lab tests, use the legacy simulation approach
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('✅ Other lab test results submitted successfully!');
      }
      
      // Update the specific lab test status to "Complete" 
      setLabTests(prevTests => 
        prevTests.map(test => 
          test.id === selectedLabTest.id 
            ? { ...test, status: 'Complete', results: 'Available' }
            : test
        )
      );
      
      // Close modal on success
      setAddResultModalOpened(false);
      setSelectedLabTest(null);
      
    } catch (err) {
      console.error('❌ Error submitting lab test results:', err);
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
    console.log('🧪 formatTestDisplayName called with test:', {
      id: test.id,
      testName: test.testName,
      testCategory: test.testCategory,
      tests: test.tests,
      testDisplayNames: test.testDisplayNames
    });
    
    // Priority 1: Use testName if available (already formatted from API)
    if (test.testName && test.testName.trim() !== '') {
      console.log('✅ Using testName:', test.testName);
      return test.testName;
    }
    
    // Priority 2: Use testDisplayNames if available, otherwise fall back to tests
    if (test.testDisplayNames && test.testDisplayNames.length > 0) {
      const categoryDisplayName = test.testCategory?.replace('_', ' ') || 'Test';
      const result = `${categoryDisplayName}: ${test.testDisplayNames.join(', ')}`;
      console.log('✅ Using testDisplayNames:', result);
      return result;
    }
    
    // Priority 3: Construct from testCategory and tests array
    if (test.tests && test.tests.length > 0) {
      const categoryDisplayName = test.testCategory?.replace('_', ' ') || 'Test';
      const result = `${categoryDisplayName}: ${test.tests.join(', ')}`;
      console.log('✅ Using tests array:', result);
      return result;
    }
    
    // Final fallback
    const result = test.testCategory?.replace('_', ' ') || 'Test: N/A';
    console.log('⚠️ Using final fallback:', result);
    return result;
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
      render: (_value: string | undefined, record: LabTest) => {
        console.log('📊 Table render called for record:', record);
        const result = formatTestDisplayName(record);
        console.log('📊 Table render result:', result);
        return result;
      }
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
      
      {/* Debug: Log current labTests state before rendering table */}
      {console.log('📊 Rendering DataTable with labTests:', labTests)}
      
      <DataTable
        data={labTests}
        columns={columns}
        searchable={true}
        searchPlaceholder="Search lab tests by name, date, or status..."
        emptyStateMessage={errorStates.fetchError ? `Error: ${errorStates.fetchError}` : "No lab tests found"}
        useViewportHeight={true}
        bottomPadding={90}
        isLoading={loadingStates.fetching}
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
              enabledFields={selectedLabTest.tests} // Pass the specific tests that should be enabled
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

      {/* View Result Modal */}
      {selectedLabTest && viewResultModalOpened && patientInfo && (
        <Modal
          opened={viewResultModalOpened}
          onClose={() => setViewResultModalOpened(false)}
          title="View Lab Test Result"
          size="xl"
          customStyles={{
            body: {
              padding: '0 24px 24px',
            }
          }}
        >
          <AddLabTestResultForm
              testType={selectedLabTest.testCategory}
              viewMode={true} // Enable view-only mode
              enabledFields={selectedLabTest.tests} // Show the specific tests
              existingData={bloodChemistryData} // Use fetched blood chemistry data
              patientData={{
                patientNumber: patientInfo.patientNumber,
                patientName: patientInfo.patientName,
                age: patientInfo.age || 0,
                sex: patientInfo.sex || ''
              }}
              onSubmit={() => { /* No-op for view mode */ }}
              onCancel={() => setViewResultModalOpened(false)}
            />
        </Modal>
      )}
    </MedicalClinicLayout>
  );
};