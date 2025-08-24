import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LabTest } from '../types';
import { useLaboratoryStore } from '../../../../infrastructure/state/LaboratoryStore';
import { usePatientStore } from '../../../../infrastructure/state/PatientStore';

export interface PatientInfo {
  id: string;
  fullName: string;
  patientNumber?: string;
  patientName?: string;
  email?: string;
  phoneNumber?: string;
  dateOfBirth: string;
  gender: string;
  address?: string;
  age?: number;
  sex?: string;
}

export interface LaboratoryTestsViewModelReturn {
  // State
  labTests: LabTest[];
  patientInfo: PatientInfo | null;
  isLoading: boolean;
  error: string | null;
  
  // Cancel confirmation modal state
  cancelConfirmationModalOpened: boolean;
  testToCancel: LabTest | null;
  
  // Actions
  handleBackToLaboratory: () => void;
  handleViewTest: (labTest: LabTest) => void;
  handleEditTest: (labTest: LabTest) => void;
  handleAddResult: (labTest: LabTest) => void;
  handleCancelTest: (labTest: LabTest) => void;
  handleConfirmCancel: () => void;
  handleCloseCancelConfirmation: () => void;
  
  // Store states
  errorStates: {
    fetchError: string | null;
  };
}

export const useLaboratoryTestsViewModel = (): LaboratoryTestsViewModelReturn => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const laboratoryStore = useLaboratoryStore();
  const patientStore = usePatientStore();

  // Local state
  const [cancelConfirmationModalOpened, setCancelConfirmationModalOpened] = useState(false);
  const [testToCancel, setTestToCancel] = useState<LabTest | null>(null);
  const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null);

  // Load data on mount
  useEffect(() => {
    const fetchData = async () => {
      if (!patientId) return;
      
      console.log('🔍 Loading lab tests for patient:', patientId);
      
      try {
        // Fetch lab tests
        await laboratoryStore.fetchLabTestsByPatientId(patientId);
        
        // Try to fetch patient information from lab request
        try {
          const labRequest = await laboratoryStore.fetchLabRequestByPatientId(patientId);
          if (labRequest && labRequest.patient) {
            const patient = labRequest.patient;
            
            // Extract age and sex from ageGender field (e.g., "35/M" or "28/F")
            let age: number | undefined;
            let sex: string | undefined;
            
            if (patient.ageGender) {
              const ageGenderParts = patient.ageGender.split('/');
              if (ageGenderParts.length >= 2) {
                age = parseInt(ageGenderParts[0]);
                sex = ageGenderParts[1];
              }
            }
            
            // Use proper patient name
            let patientName = patient.name;
            if (!patientName && patient.firstName && patient.lastName) {
              patientName = `${patient.firstName} ${patient.lastName}`.trim();
            }
            
            setPatientInfo({
              id: patient.id,
              fullName: patientName || `Patient ${patient.id}`,
              patientNumber: patient.patientNumber || patient.id,
              patientName: patientName || `Patient ${patient.id}`,
              age,
              sex,
              gender: sex || 'Unknown',
              dateOfBirth: '1990-01-01' // Default if not available from lab request
            });
          }
        } catch (requestError) {
          console.warn('⚠️ Could not fetch lab request for patient info:', requestError);
          
          // Fallback to direct patient fetch
          try {
            await patientStore.loadPatientById(patientId);
            const patientDetails = patientStore.getPatientDetails(patientId);
            
            if (patientDetails) {
              setPatientInfo({
                id: patientDetails.id,
                fullName: `${patientDetails.firstName} ${patientDetails.lastName}`.trim(),
                patientNumber: patientDetails.patientNumber,
                patientName: `${patientDetails.firstName} ${patientDetails.lastName}`.trim(),
                age: patientDetails.age,
                sex: patientDetails.gender,
                gender: patientDetails.gender,
                dateOfBirth: patientDetails.dateOfBirth || '1990-01-01'
              });
            }
          } catch (patientError) {
            console.error('❌ Error fetching patient details:', patientError);
            // Final fallback
            setPatientInfo({
              id: patientId,
              fullName: `Patient ${patientId}`,
              patientNumber: patientId,
              patientName: `Patient ${patientId}`,
              dateOfBirth: '1990-01-01',
              gender: 'Unknown'
            });
          }
        }
        
      } catch (error) {
        console.error('❌ Error fetching lab tests:', error);
      }
    };

    fetchData();
  }, [patientId]); // Only depend on patientId, not store objects

  // Convert LabTestDto[] to LabTest[] - memoized to prevent infinite re-renders
  const labTests: LabTest[] = useMemo(() => {
    return laboratoryStore.labTests.map((dto, index) => ({
      id: dto.id || `test-${patientId}-${index}`, // Use stable ID based on position and patient
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
  }, [laboratoryStore.labTests, patientId]); // Only recalculate when store data or patientId changes

  // Navigation handlers
  const handleBackToLaboratory = () => {
    navigate('/laboratory');
  };

  const handleViewTest = (labTest: LabTest) => {
    console.log('👁️ Viewing lab test:', labTest);
    navigate(`/laboratory/tests/${patientId}/view-result/${labTest.id}`, {
      state: { labTest }
    });
  };

  const handleEditTest = (labTest: LabTest) => {
    console.log('✏️ Editing lab test:', labTest);
    navigate(`/laboratory/tests/${patientId}/edit-result/${labTest.id}`);
  };

  const handleAddResult = (labTest: LabTest) => {
    console.log('➕ Adding result for lab test:', labTest);
    navigate(`/laboratory/tests/${patientId}/add-result/${labTest.id}`);
  };

  // Cancel confirmation handlers
  const handleCancelTest = (labTest: LabTest) => {
    console.log('❌ Initiating cancel for lab test:', labTest);
    setTestToCancel(labTest);
    setCancelConfirmationModalOpened(true);
  };

  const handleConfirmCancel = async () => {
    if (testToCancel && patientId) {
      console.log('✅ Confirming cancel for lab test:', testToCancel.id);
      try {
        await laboratoryStore.cancelLabRequest(testToCancel.id);
        console.log('🎉 Lab test cancelled successfully');
        
        // Reload lab tests to reflect the cancellation
        await laboratoryStore.fetchLabTestsByPatientId(patientId);
      } catch (error) {
        console.error('❌ Failed to cancel lab test:', error);
      } finally {
        handleCloseCancelConfirmation();
      }
    }
  };

  const handleCloseCancelConfirmation = () => {
    setCancelConfirmationModalOpened(false);
    setTestToCancel(null);
  };

  return {
    // State
    labTests,
    patientInfo,
    isLoading: laboratoryStore.loadingStates.fetching,
    error: laboratoryStore.errorStates.fetchError,
    
    // Cancel confirmation modal state
    cancelConfirmationModalOpened,
    testToCancel,
    
    // Actions
    handleBackToLaboratory,
    handleViewTest,
    handleEditTest,
    handleAddResult,
    handleCancelTest,
    handleConfirmCancel,
    handleCloseCancelConfirmation,
    
    // Store states
    errorStates: {
      fetchError: laboratoryStore.errorStates.fetchError,
    },
  };
};
