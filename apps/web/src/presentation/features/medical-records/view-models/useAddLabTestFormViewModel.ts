import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateLabRequestCommand } from '@nx-starter/application-shared';
import { useLaboratoryStore } from '../../../../infrastructure/state/LaboratoryStore';

// Type for add lab test form data from the form component
interface AddLabTestFormData {
  patientName: string; // Contains the selected patient ID
  ageGender: string;
  requestDate: string;
  selectedTests: string[];
  otherTests?: string;
}

/**
 * Add Lab Test Form View Model Interface
 * Defines the contract for the Add Lab Test form presentation logic
 */
export interface IAddLabTestFormViewModel {
  // State
  isLoading: boolean;
  error: string | null;
  
  // Actions
  handleFormSubmit: (data: AddLabTestFormData) => Promise<void>;
  handleCancel: () => void;
}

/**
 * Add Lab Test Form View Model Implementation
 * Handles presentation logic for creating new lab test requests
 * Coordinates between form submission and state management
 * 
 * Following MVVM pattern:
 * - View Model handles presentation logic
 * - Coordinates with application/infrastructure layers
 * - Manages form-specific state and navigation
 * - Provides clean interface for React components
 */
export const useAddLabTestFormViewModel = (): IAddLabTestFormViewModel => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get laboratory store actions
  const { createLabRequest, fetchAllLabRequests } = useLaboratoryStore();
  
  /**
   * Handle form submission
   * Processes the lab test request creation and handles success/error states
   */
  const handleFormSubmit = useCallback(async (data: AddLabTestFormData): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔍 Form data received:', data);
      console.log('🔍 Selected tests:', data.selectedTests);
      
      // Convert to CreateLabRequestCommand format with grouped structure
      const command: CreateLabRequestCommand = {
        patientId: data.patientName, // Use the selected patient ID from the form
        requestDate: new Date(data.requestDate), // Convert string to Date object
      };
      
      // Build routine tests object - only include if any routine tests are selected
      const routineTests = {
        cbcWithPlatelet: data.selectedTests.includes('routine_cbc_with_platelet'),
        pregnancyTest: data.selectedTests.includes('routine_pregnancy_test'),
        urinalysis: data.selectedTests.includes('routine_urinalysis'),
        fecalysis: data.selectedTests.includes('routine_fecalysis'),
        occultBloodTest: data.selectedTests.includes('routine_occult_blood_test'),
      };
      const hasRoutineTests = Object.values(routineTests).some(test => test);
      if (hasRoutineTests) {
        // Include only the tests that are true
        const selectedRoutineTests = Object.fromEntries(
          Object.entries(routineTests).filter(([, value]) => value)
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        command.routine = selectedRoutineTests as any;
      }
      
      // Build serology tests object - only include if any serology tests are selected
      const serologyTests = {
        hepatitisBScreening: data.selectedTests.includes('serology_hepatitis_b_screening'),
        hepatitisAScreening: data.selectedTests.includes('serology_hepatitis_a_screening'),
        hepatitisCScreening: data.selectedTests.includes('serology_hepatitis_c_screening'),
        hepatitisProfile: data.selectedTests.includes('serology_hepatitis_profile'),
        vdrlRpr: data.selectedTests.includes('serology_vdrl_rpr'),
        crp: data.selectedTests.includes('serology_crp'),
        dengueNs1: data.selectedTests.includes('serology_dengue_ns1'),
        aso: data.selectedTests.includes('serology_aso'),
        crf: data.selectedTests.includes('serology_crf'),
        raRf: data.selectedTests.includes('serology_ra_rf'),
        tumorMarkers: data.selectedTests.includes('serology_tumor_markers'),
        ca125: data.selectedTests.includes('serology_ca_125'),
        cea: data.selectedTests.includes('serology_cea'),
        psa: data.selectedTests.includes('serology_psa'),
        betaHcg: data.selectedTests.includes('serology_beta_hcg'),
      };
      const hasSerologyTests = Object.values(serologyTests).some(test => test);
      if (hasSerologyTests) {
        const selectedSerologyTests = Object.fromEntries(
          Object.entries(serologyTests).filter(([, value]) => value)
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        command.serology = selectedSerologyTests as any;
      }
      
      // Build blood chemistry tests object - only include if any blood chemistry tests are selected
      const bloodChemistryTests = {
        fbs: data.selectedTests.includes('blood_chemistry_fbs'),
        bun: data.selectedTests.includes('blood_chemistry_bun'),
        creatinine: data.selectedTests.includes('blood_chemistry_creatinine'),
        bloodUricAcid: data.selectedTests.includes('blood_chemistry_blood_uric_acid'),
        lipidProfile: data.selectedTests.includes('blood_chemistry_lipid_profile'),
        sgot: data.selectedTests.includes('blood_chemistry_sgot'),
        sgpt: data.selectedTests.includes('blood_chemistry_sgpt'),
        alkalinePhosphatase: data.selectedTests.includes('blood_chemistry_alkaline_phosphatase'),
        sodium: data.selectedTests.includes('blood_chemistry_sodium'),
        potassium: data.selectedTests.includes('blood_chemistry_potassium'),
        hba1c: data.selectedTests.includes('blood_chemistry_hba1c'),
      };
      const hasBloodChemistryTests = Object.values(bloodChemistryTests).some(test => test);
      if (hasBloodChemistryTests) {
        const selectedBloodChemistryTests = Object.fromEntries(
          Object.entries(bloodChemistryTests).filter(([, value]) => value)
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        command.bloodChemistry = selectedBloodChemistryTests as any;
      }
      
      // Build miscellaneous tests object - only include if any miscellaneous tests are selected
      const miscellaneousTests = {
        ecg: data.selectedTests.includes('misc_ecg'),
      };
      const hasMiscellaneousTests = Object.values(miscellaneousTests).some(test => test);
      if (hasMiscellaneousTests) {
        const selectedMiscellaneousTests = Object.fromEntries(
          Object.entries(miscellaneousTests).filter(([, value]) => value)
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        command.miscellaneous = selectedMiscellaneousTests as any;
      }
      
      // Build thyroid tests object - only include if any thyroid tests are selected
      const thyroidTests = {
        t3: data.selectedTests.includes('thyroid_t3'),
        t4: data.selectedTests.includes('thyroid_t4'),
        ft3: data.selectedTests.includes('thyroid_ft3'),
        ft4: data.selectedTests.includes('thyroid_ft4'),
        tsh: data.selectedTests.includes('thyroid_tsh'),
      };
      const hasThyroidTests = Object.values(thyroidTests).some(test => test);
      if (hasThyroidTests) {
        const selectedThyroidTests = Object.fromEntries(
          Object.entries(thyroidTests).filter(([, value]) => value)
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        command.thyroid = selectedThyroidTests as any;
      }
      
      // Optional fields
      if (data.otherTests?.trim()) {
        command.others = data.otherTests;
      }
      
      console.log('🔍 New grouped command to be sent:', command);
      
      const success = await createLabRequest(command);
      
      console.log('🔍 Create lab request returned:', success);
      
      if (success) {
        // Success - navigate back to laboratory list
        navigate('/laboratory');
        
        // Refresh the lab tests list
        await fetchAllLabRequests();
        
        console.log('Lab test request submitted successfully!');
      } else {
        throw new Error('Failed to submit lab test request');
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit lab test request');
    } finally {
      setIsLoading(false);
    }
  }, [createLabRequest, fetchAllLabRequests, navigate]);
  
  /**
   * Handle form cancellation
   * Navigates back to laboratory list without saving
   */
  const handleCancel = useCallback(() => {
    navigate('/laboratory');
  }, [navigate]);
  
  return {
    // State
    isLoading,
    error,
    
    // Actions
    handleFormSubmit,
    handleCancel,
  };
};