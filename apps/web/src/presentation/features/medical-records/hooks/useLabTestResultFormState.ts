import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { generateLabTestSchema, LabTestType } from '../constants/labTestFormConfig';

export type AddLabTestResultFormData = Record<string, string | undefined>;

interface UseLabTestResultFormStateProps {
  testType: LabTestType;
  existingData?: AddLabTestResultFormData;
}

export const useLabTestResultFormState = ({ testType, existingData }: UseLabTestResultFormStateProps) => {
  const schema = generateLabTestSchema(testType);
  
  const formMethods = useForm<AddLabTestResultFormData>({
    resolver: zodResolver(schema),
    defaultValues: existingData || {},
  });

  const { reset } = formMethods;

  // Reset form when existingData changes (for edit mode)
  useEffect(() => {
    if (existingData) {
      console.log('🔄 Resetting form with existing data:', existingData);
      reset(existingData);
    }
  }, [existingData, reset]);

  return formMethods;
};