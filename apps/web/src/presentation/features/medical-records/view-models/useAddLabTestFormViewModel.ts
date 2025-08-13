import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateLabRequestCommand } from '@nx-starter/application-shared';
import { useLaboratoryStore } from '../../../../infrastructure/state/LaboratoryStore';

// Type for add lab test form data from the form component
interface AddLabTestFormData {
  patientName: string; // This will be patient ID
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
      
      // Convert to CreateLabRequestCommand format
      const command: CreateLabRequestCommand = {
        patientId: `2025-${Date.now()}`, // Generate temporary ID
        patientName: data.patientName,
        ageGender: data.ageGender,
        requestDate: new Date(data.requestDate),
        others: data.otherTests || '',
        
        // Map selected tests to command fields using the correct test IDs
        cbcWithPlatelet: data.selectedTests.includes('routine_cbc_with_platelet') ? 'Yes' : undefined,
        pregnancyTest: data.selectedTests.includes('routine_pregnancy_test') ? 'Yes' : undefined,
        urinalysis: data.selectedTests.includes('routine_urinalysis') ? 'Yes' : undefined,
        fecalysis: data.selectedTests.includes('routine_fecalysis') ? 'Yes' : undefined,
        occultBloodTest: data.selectedTests.includes('routine_occult_blood_test') ? 'Yes' : undefined,
        hepaBScreening: data.selectedTests.includes('serology_hepatitis_b_screening') ? 'Yes' : undefined,
        hepaAScreening: data.selectedTests.includes('serology_hepatitis_a_screening') ? 'Yes' : undefined,
        hepaCScreening: data.selectedTests.includes('serology_hepatitis_c_screening') ? 'Yes' : undefined,
        hepatitisProfile: data.selectedTests.includes('serology_hepatitis_profile') ? 'Yes' : undefined,
        vdrlRpr: data.selectedTests.includes('serology_vdrl_rpr') ? 'Yes' : undefined,
        crp: data.selectedTests.includes('serology_crp') ? 'Yes' : undefined,
        dengueNs1: data.selectedTests.includes('serology_dengue_ns1') ? 'Yes' : undefined,
        aso: data.selectedTests.includes('serology_aso') ? 'Yes' : undefined,
        raRf: data.selectedTests.includes('serology_ra_rf') ? 'Yes' : undefined,
        tumorMarkers: data.selectedTests.includes('serology_tumor_markers') ? 'Yes' : undefined,
        ca125CeaPsa: data.selectedTests.includes('serology_ca_125') ? 'Yes' : undefined,
        betaHcg: data.selectedTests.includes('serology_beta_hcg') ? 'Yes' : undefined,
        fbs: data.selectedTests.includes('blood_chemistry_fbs') ? 'Yes' : undefined,
        bun: data.selectedTests.includes('blood_chemistry_bun') ? 'Yes' : undefined,
        creatinine: data.selectedTests.includes('blood_chemistry_creatinine') ? 'Yes' : undefined,
        bloodUricAcid: data.selectedTests.includes('blood_chemistry_blood_uric_acid') ? 'Yes' : undefined,
        lipidProfile: data.selectedTests.includes('blood_chemistry_lipid_profile') ? 'Yes' : undefined,
        sgot: data.selectedTests.includes('blood_chemistry_sgot') ? 'Yes' : undefined,
        sgpt: data.selectedTests.includes('blood_chemistry_sgpt') ? 'Yes' : undefined,
        alp: data.selectedTests.includes('blood_chemistry_alkaline_phosphatase') ? 'Yes' : undefined,
        sodiumNa: data.selectedTests.includes('blood_chemistry_sodium') ? 'Yes' : undefined,
        potassiumK: data.selectedTests.includes('blood_chemistry_potassium') ? 'Yes' : undefined,
        hbalc: data.selectedTests.includes('blood_chemistry_hba1c') ? 'Yes' : undefined,
        ecg: data.selectedTests.includes('misc_ecg') ? 'Yes' : undefined,
        t3: data.selectedTests.includes('thyroid_t3') ? 'Yes' : undefined,
        t4: data.selectedTests.includes('thyroid_t4') ? 'Yes' : undefined,
        ft3: data.selectedTests.includes('thyroid_ft3') ? 'Yes' : undefined,
        ft4: data.selectedTests.includes('thyroid_ft4') ? 'Yes' : undefined,
        tsh: data.selectedTests.includes('thyroid_tsh') ? 'Yes' : undefined,
      };
      
      console.log('🔍 Command to be sent:', command);
      
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