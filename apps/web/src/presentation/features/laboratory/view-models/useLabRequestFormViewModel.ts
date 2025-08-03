import { useCallback } from 'react';
import { ILabRequestFormViewModel } from './interfaces/LaboratoryViewModels';
import { useLaboratoryStore } from '../../../../infrastructure/state/LaboratoryStore';
import { CreateLabRequestCommand } from '@nx-starter/application-shared';
import { LabRequestFormData } from '../types/FormTypes';

/**
 * View Model for Lab Request Form
 * Handles form submission and state management
 */
export const useLabRequestFormViewModel = (): ILabRequestFormViewModel => {
  const { 
    createLabRequest, 
    loadingStates, 
    errorStates, 
    clearErrors 
  } = useLaboratoryStore();

  const isSubmitting = loadingStates.creating;
  const submitError = errorStates.createError;

  /**
   * Convert form data to CreateLabRequestCommand
   */
  const convertFormDataToCommand = (formData: LabRequestFormData): CreateLabRequestCommand => {
    // Convert selected tests boolean values to strings for the API
    const testFields: Record<string, string | undefined> = {};
    
    Object.entries(formData.selectedTests).forEach(([key, isSelected]) => {
      if (isSelected) {
        testFields[key] = 'Yes'; // or appropriate test value
      }
    });

    return {
      patientId: formData.patient_id,
      patientName: formData.patient_name,
      ageGender: formData.age_gender,
      requestDate: new Date(formData.request_date),
      others: formData.others,
      
      // Basic Tests
      cbcWithPlatelet: testFields.cbc_with_platelet,
      pregnancyTest: testFields.pregnancy_test,
      urinalysis: testFields.urinalysis,
      fecalysis: testFields.fecalysis,
      occultBloodTest: testFields.occult_blood_test,
      
      // Hepatitis Tests
      hepaBScreening: testFields.hepa_b_screening,
      hepaAScreening: testFields.hepa_a_screening,
      hepatitisProfile: testFields.hepatitis_profile,
      
      // STD Tests
      vdrlRpr: testFields.vdrl_rpr,
      
      // Other Tests
      dengueNs1: testFields.dengue_ns1,
      ca125CeaPsa: testFields.ca_125_cea_psa,
      
      // Blood Chemistry Tests
      fbs: testFields.fbs,
      bun: testFields.bun,
      creatinine: testFields.creatinine,
      bloodUricAcid: testFields.blood_uric_acid,
      lipidProfile: testFields.lipid_profile,
      sgot: testFields.sgot,
      sgpt: testFields.sgpt,
      alp: testFields.alp,
      sodiumNa: testFields.sodium_na,
      potassiumK: testFields.potassium_k,
      hbalc: testFields.hbalc,
      
      // Other Tests
      ecg: testFields.ecg,
      t3: testFields.t3,
      t4: testFields.t4,
      ft3: testFields.ft3,
      ft4: testFields.ft4,
      tsh: testFields.tsh,
    };
  };

  const handleFormSubmit = useCallback(async (formData: CreateLabRequestCommand | LabRequestFormData): Promise<boolean> => {
    try {
      // Check if we need to convert form data
      let command: CreateLabRequestCommand;
      
      if ('selectedTests' in formData) {
        // It's LabRequestFormData, convert it
        command = convertFormDataToCommand(formData as LabRequestFormData);
      } else {
        // It's already CreateLabRequestCommand
        command = formData as CreateLabRequestCommand;
      }

      const success = await createLabRequest(command);
      return success;
    } catch (error) {
      console.error('Error submitting lab request form:', error);
      return false;
    }
  }, [createLabRequest]);

  const clearError = useCallback(() => {
    clearErrors();
  }, [clearErrors]);

  return {
    isSubmitting,
    submitError,
    handleFormSubmit,
    clearError,
  };
};