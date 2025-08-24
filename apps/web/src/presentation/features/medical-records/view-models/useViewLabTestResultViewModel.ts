import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LabTest } from '../types';
import { LabTestResultTransformer } from '@nx-starter/application-shared';
import { useLaboratoryStore } from '../../../../infrastructure/state/LaboratoryStore';

export interface PatientInfo {
  patientNumber: string;
  patientName: string;
  age?: number;
  sex?: string;
}

export interface ViewLabTestResultViewModelReturn {
  // State
  selectedLabTest: LabTest | null;
  patientInfo: PatientInfo | null;
  bloodChemistryData: Record<string, string>;
  isLoading: boolean; // For initial data loading
  error: string | null;
  
  // Actions
  handleBack: () => void;
}

export const useViewLabTestResultViewModel = (): ViewLabTestResultViewModelReturn => {
  const { patientId, testId } = useParams<{ patientId: string; testId: string }>();
  const navigate = useNavigate();
  
  // State
  const [selectedLabTest, setSelectedLabTest] = useState<LabTest | null>(null);
  const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null);
  const [bloodChemistryData, setBloodChemistryData] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Laboratory store
  const { 
    fetchLabTestsByPatientId,
    fetchLabRequestByPatientId,
    fetchLabTestResultByLabRequestId,
  } = useLaboratoryStore();

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

        // Fetch existing result data for viewing
        try {
          const existingResult = await fetchLabTestResultByLabRequestId(testId);
          if (existingResult) {
            const formData = LabTestResultTransformer.transformApiResultToFormData(
              existingResult,
              labTest.testCategory
            );
            setBloodChemistryData(formData);
          } else {
            setError('No test results found for this test');
          }
        } catch {
          setError('No test results available to view');
        }

      } catch (error) {
        console.error('❌ Error loading data:', error);
        setError(error instanceof Error ? error.message : 'Failed to load lab test data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [patientId, testId, fetchLabTestsByPatientId, fetchLabRequestByPatientId, fetchLabTestResultByLabRequestId]);

  const handleBack = useCallback(() => {
    navigate(`/laboratory/tests/${patientId}`);
  }, [navigate, patientId]);

  return {
    // State
    selectedLabTest,
    patientInfo,
    bloodChemistryData,
    isLoading,
    error,
    
    // Actions
    handleBack,
  };
};
