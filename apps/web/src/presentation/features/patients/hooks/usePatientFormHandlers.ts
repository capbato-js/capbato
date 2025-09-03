import { useCallback } from 'react';
import { UseFormSetValue, UseFormTrigger, UseFormWatch, UseFormClearErrors } from 'react-hook-form';
import { useAddressSelector } from '../../../hooks';
import { formatNameField } from '../utils/patientFormUtils';
import type { CreatePatientCommand } from '@nx-starter/application-shared';
import { PatientFormData } from './usePatientFormState';

interface UsePatientFormHandlersProps {
  setValue: UseFormSetValue<CreatePatientCommand>;
  trigger: UseFormTrigger<CreatePatientCommand>;
  watch: UseFormWatch<CreatePatientCommand>;
  clearErrors: UseFormClearErrors<CreatePatientCommand>;
}

export const usePatientFormHandlers = ({ 
  setValue, 
  trigger, 
  watch, 
  clearErrors 
}: UsePatientFormHandlersProps) => {
  // Address selector hooks
  const patientAddressSelector = useAddressSelector();
  const guardianAddressSelector = useAddressSelector();

  // Patient address handlers
  const handlePatientProvinceChange = useCallback(async (value: string | null) => {
    if (value) {
      const province = patientAddressSelector.provinces.find(p => p.code === value);
      setValue('province', province?.name || value);
      await patientAddressSelector.selectProvince(value);
      setValue('cityMunicipality', '');
      setValue('barangay', '');
    }
  }, [setValue, patientAddressSelector]);

  const handlePatientCityChange = useCallback(async (value: string | null) => {
    if (value) {
      const city = patientAddressSelector.cities.find(c => c.code === value);
      setValue('cityMunicipality', city?.name || value);
      await patientAddressSelector.selectCity(value);
      setValue('barangay', '');
    }
  }, [setValue, patientAddressSelector]);

  const handlePatientBarangayChange = useCallback((value: string | null) => {
    if (value) {
      const barangay = patientAddressSelector.barangays.find(b => b.code === value);
      setValue('barangay', barangay?.name || value);
      patientAddressSelector.selectBarangay(value);
    }
  }, [setValue, patientAddressSelector]);

  // Guardian address handlers
  const handleGuardianProvinceChange = useCallback(async (value: string | null) => {
    if (value) {
      const province = guardianAddressSelector.provinces.find(p => p.code === value);
      setValue('guardianProvince', province?.name || value);
      await guardianAddressSelector.selectProvince(value);
      setValue('guardianCityMunicipality', '');
      setValue('guardianBarangay', '');
    }
  }, [setValue, guardianAddressSelector]);

  const handleGuardianCityChange = useCallback(async (value: string | null) => {
    if (value) {
      const city = guardianAddressSelector.cities.find(c => c.code === value);
      setValue('guardianCityMunicipality', city?.name || value);
      await guardianAddressSelector.selectCity(value);
      setValue('guardianBarangay', '');
    }
  }, [setValue, guardianAddressSelector]);

  const handleGuardianBarangayChange = useCallback((value: string | null) => {
    if (value) {
      const barangay = guardianAddressSelector.barangays.find(b => b.code === value);
      setValue('guardianBarangay', barangay?.name || value);
      guardianAddressSelector.selectBarangay(value);
    }
  }, [setValue, guardianAddressSelector]);

  // Field validation handlers
  const handleFieldBlur = useCallback(async (fieldName: keyof PatientFormData) => {
    await trigger(fieldName);
  }, [trigger]);

  const handleNameFieldBlur = useCallback(async (
    fieldName: 'firstName' | 'lastName' | 'middleName' | 'guardianName'
  ) => {
    const currentValue = watch(fieldName);
    if (currentValue && typeof currentValue === 'string') {
      const formattedValue = formatNameField(currentValue);
      if (formattedValue !== currentValue) {
        setValue(fieldName, formattedValue);
      }
    }
    await trigger(fieldName);
  }, [watch, setValue, trigger]);

  const handleFieldChange = useCallback((fieldName: keyof CreatePatientCommand) => {
    // Clear server errors when user starts typing
    const errors = watch(); // This is a workaround since we can't directly access errors here
    clearErrors(fieldName);
  }, [clearErrors]);

  return {
    // Address selectors
    patientAddressSelector,
    guardianAddressSelector,
    
    // Patient address handlers
    handlePatientProvinceChange,
    handlePatientCityChange,
    handlePatientBarangayChange,
    
    // Guardian address handlers
    handleGuardianProvinceChange,
    handleGuardianCityChange,
    handleGuardianBarangayChange,
    
    // Field handlers
    handleFieldBlur,
    handleNameFieldBlur,
    handleFieldChange
  };
};