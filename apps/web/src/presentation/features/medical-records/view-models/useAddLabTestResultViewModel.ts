import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LabTest } from '../types';
import { AddLabTestResultFormData } from '../components/AddLabTestResultForm';
import { LabTestResultTransformer } from '@nx-starter/application-shared';
import { useLaboratoryStore } from '../../../../infrastructure/state/LaboratoryStore';

export interface PatientInfo {
  patientNumber: string;
  patientName: string;
  age?: number;
  sex?: string;
}

export interface AddLabTestResultViewModelReturn {
  // State
  selectedLabTest: LabTest | null;
  patientInfo: PatientInfo | null;
  isLoading: boolean; // For initial data loading
  isSubmitting: boolean; // For form submission
  error: string | null;
  
  // Actions
  handleFormSubmit: (formData: AddLabTestResultFormData) => Promise<void>;
  handleCancel: () => void;
}

export const useAddLabTestResultViewModel = (): AddLabTestResultViewModelReturn => {
  const { patientId, testId } = useParams<{ patientId: string; testId: string }>();
  const navigate = useNavigate();
  
  // State
  const [selectedLabTest, setSelectedLabTest] = useState<LabTest | null>(null);
  const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false); // For initial data loading
  const [isSubmitting, setIsSubmitting] = useState(false); // For form submission
  const [error, setError] = useState<string | null>(null);

  // Laboratory store
  const { 
    fetchLabTestsByPatientId,
    fetchLabRequestByPatientId,
    createLabTestResult,
  } = useLaboratoryStore();

  // Patient store (imported but not used in this implementation)
  // const { 
  //   loadPatientById,
  //   getPatientDetails
  // } = usePatientStore();

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      if (!patientId || !testId) return;
      
      setIsLoading(true);
      setError(null);
      
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

        // Fetch lab tests to find the specific test
        const fetchedLabTests = await fetchLabTestsByPatientId(patientId);
        const foundTest = fetchedLabTests.find(test => test.id === testId);
        
        if (!foundTest) {
          throw new Error('Lab test not found');
        }

        // Convert LabTestDto to LabTest
        const labTest: LabTest = {
          id: foundTest.id || `test-${Date.now()}`,
          testCategory: foundTest.testCategory || 'bloodChemistry',
          tests: foundTest.tests || [],
          testDisplayNames: foundTest.testDisplayNames || [],
          date: foundTest.date || new Date().toISOString(),
          status: foundTest.status || 'Pending',
          results: foundTest.results,
          patientId: foundTest.patientId,
          enabledFields: foundTest.enabledFields || [],
          testName: foundTest.testName
        };

        setSelectedLabTest(labTest);

        // Set patient information
        if (patientData) {
          let age: number | undefined;
          let sex: string | undefined;
          
          if (patientData.ageGender) {
            const ageGenderParts = patientData.ageGender.split('/');
            if (ageGenderParts.length >= 2) {
              age = parseInt(ageGenderParts[0]);
              sex = ageGenderParts[1];
            }
          }
          
          let patientName = patientData.name;
          if (!patientName && patientData.firstName && patientData.lastName) {
            patientName = `${patientData.firstName} ${patientData.lastName}`;
          }
          
          setPatientInfo({
            patientNumber: patientData.patientNumber || patientId,
            patientName: patientName || `Patient ${patientId}`,
            age,
            sex
          });
        } else {
          // Fallback patient info when lab request fails
          setPatientInfo({
            patientNumber: patientId,
            patientName: `Patient ${patientId}`,
            age: undefined,
            sex: undefined
          });
        }

        // This page is only for adding new results, no existing data to fetch

      } catch (error) {
        console.error('❌ Error loading data:', error);
        setError(error instanceof Error ? error.message : 'Failed to load lab test data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [patientId, testId, fetchLabTestsByPatientId, fetchLabRequestByPatientId]);

  const handleFormSubmit = useCallback(async (formData: AddLabTestResultFormData) => {
    if (!selectedLabTest || !patientInfo) {
      setError('Missing required data');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    
    try {
      console.log('🔄 Starting lab test result submission...');
      console.log('📋 Form data received:', formData);

      // Convert formData to Record<string, string> by filtering out undefined values
      const cleanedFormData: Record<string, string> = Object.entries(formData)
        .filter(([, value]) => value !== undefined && value !== '' && value !== null)
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value as string }), {});

      // Transform flat form data to structured API payload
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

      console.log('➕ Creating new lab test result...');
      const createResult = await createLabTestResult(apiPayload);
      const success = !!createResult;
      console.log(success ? '✅ Lab test result created successfully!' : '❌ Failed to create lab test result');

      if (success) {
        // Navigate back to laboratory tests page
        navigate(`/laboratory/tests/${patientId}`);
      } else {
        throw new Error('Failed to create lab test result');
      }
      
    } catch (err) {
      console.error('❌ Error submitting result:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit lab test result');
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedLabTest, patientInfo, createLabTestResult, navigate, patientId]);

  const handleCancel = useCallback(() => {
    navigate(`/laboratory/tests/${patientId}`);
  }, [navigate, patientId]);

  return {
    // State
    selectedLabTest,
    patientInfo,
    isLoading,
    isSubmitting,
    error,
    
    // Actions
    handleFormSubmit,
    handleCancel,
  };
};
