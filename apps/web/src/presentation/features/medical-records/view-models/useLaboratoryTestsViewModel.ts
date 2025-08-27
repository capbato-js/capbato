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
  const { patientId } = useParams<{ patientId: string; labRequestId?: string }>();
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
      if (!patientId) {
        return;
      }
      
      try {
        // Fetch lab tests and patient details
        await laboratoryStore.fetchLabTestsByPatientId(patientId);
        await patientStore.loadPatientById(patientId);
        
        const patientDetails = patientStore.getPatientDetails(patientId);
        
        if (patientDetails) {
          const patientInfo = {
            id: patientDetails.id,
            fullName: `${patientDetails.firstName} ${patientDetails.lastName}`.trim(),
            patientNumber: patientDetails.patientNumber,
            patientName: `${patientDetails.firstName} ${patientDetails.lastName}`.trim(),
            age: patientDetails.age,
            sex: patientDetails.gender,
            gender: patientDetails.gender,
            dateOfBirth: patientDetails.dateOfBirth || '1990-01-01'
          };
          
          setPatientInfo(patientInfo);
        }
        
      } catch {
        // Error handling for lab tests fetch or patient fetch
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
    navigate(`/laboratory/tests/${patientId}/view-result/${labTest.id}`, {
      state: { labTest }
    });
  };

  const handleEditTest = (labTest: LabTest) => {
    navigate(`/laboratory/tests/${patientId}/edit-result/${labTest.id}`, {
      state: { labTest }
    });
  };

  const handleAddResult = (labTest: LabTest) => {
    navigate(`/laboratory/tests/${patientId}/add-result/${labTest.id}`, {
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
