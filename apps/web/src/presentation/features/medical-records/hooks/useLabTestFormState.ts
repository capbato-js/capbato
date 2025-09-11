import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AddLabTestFormSchema } from '@nx-starter/application-shared';

// Type for add lab test form
export interface AddLabTestFormData {
  patientName: string;
  ageGender: string;
  requestDate: string;
  selectedTests: string[];
  otherTests?: string;
}

export const useLabTestFormState = () => {
  const formMethods = useForm<AddLabTestFormData>({
    resolver: zodResolver(AddLabTestFormSchema),
    mode: 'onBlur',
    defaultValues: {
      patientName: '',
      ageGender: '',
      requestDate: new Date().toISOString().split('T')[0],
      selectedTests: [],
      otherTests: '',
    },
  });

  const { watch } = formMethods;
  
  // Watch form values for validation
  const patientName = watch('patientName');
  const ageGender = watch('ageGender');
  const requestDate = watch('requestDate');

  return {
    ...formMethods,
    patientName,
    ageGender,
    requestDate,
  };
};