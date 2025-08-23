import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LabTest } from '../types';
import { AddLabTestResultFormData } from '../components/AddLabTestResultForm';
import { LabTestResultTransformer } from '@nx-starter/application-shared';
import { useLaboratoryStore } from '../../../../infrastructure/state/LaboratoryStore';
import { usePatientStore } from '../../../../infrastructure/state/PatientStore';

export interface PatientInfo {
  patientNumber: string;
  patientName: string;
  age?: number;
  sex?: string;
}

export interface LaboratoryTestsViewModelReturn {
  // State
  labTests: LabTest[];
  patientInfo: PatientInfo | null;
  selectedLabTest: LabTest | null;
  bloodChemistryData: Record<string, string>;
  isLoading: boolean;
  error: string | null;
  
  // Modal state
  addResultModalOpened: boolean;
  viewResultModalOpened: boolean;
  
  // Actions
  handleBackToLaboratory: () => void;
  handleViewTest: (test: LabTest) => Promise<void>;
  handleEditTest: () => void;
  handleAddResult: (test: LabTest) => void;
  handleCancelTest: (test: LabTest) => void;
  handleCloseModal: () => void;
  handleSubmitResult: (formData: AddLabTestResultFormData) => Promise<void>;
  setViewResultModalOpened: (opened: boolean) => void;
  
  // Store states
  loadingStates: {
    creating: boolean;
    fetching: boolean;
    updating: boolean;
  };
  errorStates: {
    createError: string | null;
    fetchError: string | null;
    updateError: string | null;
  };
}

export const useLaboratoryTestsViewModel = (): LaboratoryTestsViewModelReturn => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  
  // Modal state
  const [addResultModalOpened, setAddResultModalOpened] = useState(false);
  const [viewResultModalOpened, setViewResultModalOpened] = useState(false);
  const [selectedLabTest, setSelectedLabTest] = useState<LabTest | null>(null);
  const [bloodChemistryData, setBloodChemistryData] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Lab tests data state
  const [labTests, setLabTests] = useState<LabTest[]>([]);
  const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null);

  // Laboratory store
  const { 
    fetchLabTestsByPatientId,
    fetchLabRequestByPatientId,
    fetchLabTestResultByLabRequestId,
    createLabTestResult,
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
        // First, try to fetch lab request to get patient information
        let patientData = null;
        try {
          const labRequest = await fetchLabRequestByPatientId(patientId);
          if (labRequest) {
            patientData = labRequest.patient;
          }
        } catch (requestError) {
          console.warn('⚠️ Could not fetch lab request for patient info:', requestError);
        }
        
        // Then fetch lab tests
        const fetchedLabTests = await fetchLabTestsByPatientId(patientId);
        
        // Convert LabTestDto[] to LabTest[] - backend now provides enabledFields
        const convertedLabTests: LabTest[] = fetchedLabTests.map((dto) => {
          const converted: LabTest = {
            id: dto.id || `test-${Date.now()}`,
            testCategory: dto.testCategory || 'bloodChemistry', // Use backend category directly
            tests: dto.tests || [], // Use backend-provided tests directly
            testDisplayNames: dto.testDisplayNames || [],
            date: dto.date || new Date().toISOString(),
            status: dto.status || 'Pending',
            results: dto.results,
            patientId: dto.patientId,
            enabledFields: dto.enabledFields || [], // Backend-provided field enabling
            testName: dto.testName
          };
          
          return converted;
        });
        
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
          try {
            await loadPatientById(patientId);
            const patientDetails = getPatientDetails(patientId);
            
            if (patientDetails) {
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
    try {
      setSelectedLabTest(test);
      setError(null);
      
      console.log('🔍 Viewing test result for lab request ID:', test.id, 'category:', test.testCategory);
      
      // Fetch the actual lab test result data using the lab request ID
      // test.id is actually the lab request ID, we need to get the lab test result by lab request ID
      const resultData = await fetchLabTestResultByLabRequestId(test.id);
      
      if (resultData) {
        console.log('✅ Lab test result data fetched:', resultData);
        
        // Transform structured data to flat form data for display
        const formData = LabTestResultTransformer.transformApiResultToFormData(
          resultData, 
          test.testCategory
        );
        
        console.log('🔄 Transformed form data for display:', formData);
        
        // Set the form data based on the test category
        setBloodChemistryData(formData);
        
        setViewResultModalOpened(true);
      } else {
        console.warn('⚠️ No result data found for test ID:', test.id);
        setError('No test results found for this test');
        
        // Still open modal but with empty data
        setBloodChemistryData({});
        setViewResultModalOpened(true);
      }
    } catch (error) {
      console.error('❌ Error viewing test result:', error);
      setError('Failed to load test results');
      
      // Open modal with empty data in case of error
      setBloodChemistryData({});
      setViewResultModalOpened(true);
    }
  };

  const handleEditTest = () => {
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

  const handleSubmitResult = async (formData: AddLabTestResultFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!patientId || !selectedLabTest || !patientInfo) {
        throw new Error('Missing required patient information or selected lab test');
      }

      console.log('🔄 Starting lab test result submission...');
      console.log('📋 Form data received:', formData);
      console.log('🧪 Test category:', selectedLabTest.testCategory);
      console.log('📊 Enabled fields:', selectedLabTest.enabledFields);

      // Convert formData to Record<string, string> by filtering out undefined values
      const cleanedFormData: Record<string, string> = Object.entries(formData)
        .filter(([, value]) => value !== undefined && value !== '' && value !== null)
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value as string }), {});

      // Transform flat form data to structured API payload using our transformer
      const apiPayload = LabTestResultTransformer.transformFormDataToApiPayload(
        cleanedFormData,
        selectedLabTest.testCategory,
        selectedLabTest.id, // This is the labRequestId
        new Date(), // Current timestamp for dateTested
        'Lab test results submitted' // Default remarks
      );

      console.log('✨ Transformed API payload:', apiPayload);

      // Validate the transformed data before submission
      const validationErrors = LabTestResultTransformer.validateFormData(
        cleanedFormData,
        selectedLabTest.enabledFields || [],
        selectedLabTest.testCategory
      );

      if (validationErrors.length > 0) {
        throw new Error(`Validation errors: ${validationErrors.join(', ')}`);
      }

      console.log('✅ Validation passed, submitting to API...');

      // Call the API with our transformed payload
      const success = await createLabTestResult(apiPayload);

      if (!success) {
        throw new Error('Failed to submit lab test results');
      }

      console.log('🎉 Lab test results submitted successfully!');
      
      // Update the specific lab test status to "Completed" 
      setLabTests(prevTests => 
        prevTests.map(test => 
          test.id === selectedLabTest.id 
            ? { ...test, status: 'Completed', results: 'Available' }
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

  return {
    // State
    labTests,
    patientInfo,
    selectedLabTest,
    bloodChemistryData,
    isLoading,
    error,
    
    // Modal state
    addResultModalOpened,
    viewResultModalOpened,
    
    // Actions
    handleBackToLaboratory,
    handleViewTest,
    handleEditTest,
    handleAddResult,
    handleCancelTest,
    handleCloseModal,
    handleSubmitResult,
    setViewResultModalOpened,
    
    // Store states
    loadingStates,
    errorStates,
  };
};
