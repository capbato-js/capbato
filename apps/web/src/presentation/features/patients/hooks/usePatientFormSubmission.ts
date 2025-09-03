import { useCallback } from 'react';
import { UseFormWatch, UseFormReset } from 'react-hook-form';
import type { CreatePatientCommand, UpdatePatientCommand } from '@nx-starter/application-shared';
import { PatientFormData } from './usePatientFormState';

interface UsePatientFormSubmissionProps {
  mode: 'create' | 'update';
  initialData?: Partial<PatientFormData>;
  onSubmit: (data: CreatePatientCommand | UpdatePatientCommand) => Promise<boolean>;
  watch: UseFormWatch<CreatePatientCommand | UpdatePatientCommand>;
  reset: UseFormReset<CreatePatientCommand | UpdatePatientCommand>;
}

export const usePatientFormSubmission = ({ 
  mode, 
  initialData, 
  onSubmit, 
  watch, 
  reset 
}: UsePatientFormSubmissionProps) => {
  const isUpdateMode = mode === 'update';

  const handleDirectSubmit = useCallback(async () => {
    
    const formData = watch();
    
    try {
      let submitData: CreatePatientCommand | UpdatePatientCommand;
      
      if (isUpdateMode && initialData?.id) {
        submitData = {
          ...formData,
          id: initialData.id
        } as UpdatePatientCommand;
      } else {
        submitData = formData as CreatePatientCommand;
      }
      
      const result = await onSubmit(submitData);
      
      if (result && !isUpdateMode) {
        reset();
      }
      
      return result;
    } catch (error) {
      console.error('🖱️ Submit error:', error);
      throw error;
    }
  }, [watch, onSubmit, isUpdateMode, initialData?.id, reset]);

  const handleFormSubmit = useCallback(async (data: CreatePatientCommand | UpdatePatientCommand) => {
    
    try {
      let submitData: CreatePatientCommand | UpdatePatientCommand;
      
      if (isUpdateMode && initialData?.id) {
        submitData = {
          ...data,
          id: initialData.id
        } as UpdatePatientCommand;
      } else {
        submitData = data as CreatePatientCommand;
      }
      
      const success = await onSubmit(submitData);
      
      if (success && !isUpdateMode) {
        reset();
      }
      
      return success;
    } catch (error) {
      console.error('📝 Error in handleFormSubmit:', error);
      throw error;
    }
  }, [onSubmit, mode, isUpdateMode, initialData?.id, reset]);

  return {
    handleDirectSubmit,
    handleFormSubmit
  };
};