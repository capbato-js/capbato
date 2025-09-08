import { useEffect } from 'react';
import { useForm, Control, UseFormWatch, UseFormHandleSubmit, FieldErrors } from 'react-hook-form';
import { useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AddPrescriptionFormSchema, type AddPrescriptionFormData } from '@nx-starter/application-shared';
import { Medication } from '../types';

export interface UsePrescriptionFormStateProps {
  editMode?: boolean;
  initialData?: {
    patientId?: string;
    doctorId?: string;
    datePrescribed?: string;
    medications?: Medication[];
    notes?: string;
  };
  onClearError?: () => void;
  error?: string | null;
}

export const usePrescriptionFormState = ({
  editMode = false,
  initialData,
  onClearError,
  error,
}: UsePrescriptionFormStateProps) => {
  // React Hook Form setup
  const form = useForm<AddPrescriptionFormData>({
    resolver: zodResolver(AddPrescriptionFormSchema),
    mode: 'onBlur',
    defaultValues: {
      patientId: initialData?.patientId || '',
      doctorId: initialData?.doctorId || '',
      datePrescribed: initialData?.datePrescribed || new Date().toISOString().split('T')[0],
      medications: initialData?.medications || [{ 
        name: '', 
        dosage: '', 
        frequency: '', 
        duration: '', 
        instructions: '' 
      }],
      notes: initialData?.notes || '',
    },
  });

  const { handleSubmit, control, watch, formState: { errors } } = form;

  // useFieldArray for dynamic medications
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'medications',
  });

  // Watch form values for button state and logic
  const patientId = watch('patientId');
  const doctorId = watch('doctorId');
  const datePrescribed = watch('datePrescribed');
  const medications = watch('medications');

  // Clear errors when form values change
  useEffect(() => {
    if (error && onClearError) {
      onClearError();
    }
  }, [patientId, doctorId, datePrescribed, medications, error, onClearError]);

  const addMedication = () => {
    append({ name: '', dosage: '', frequency: '', duration: '', instructions: '' });
  };

  const removeMedication = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const isFormValid = patientId && doctorId && datePrescribed && 
    medications.some(med => med.name.trim() && med.dosage.trim() && med.frequency.trim() && med.duration.trim());

  return {
    control,
    handleSubmit,
    watch,
    errors,
    fields,
    addMedication,
    removeMedication,
    isFormValid,
    watchedValues: {
      patientId,
      doctorId,
      datePrescribed,
      medications,
    },
  };
};

export type PrescriptionFormControl = Control<AddPrescriptionFormData>;
export type PrescriptionFormWatch = UseFormWatch<AddPrescriptionFormData>;
export type PrescriptionFormHandleSubmit = UseFormHandleSubmit<AddPrescriptionFormData>;
export type PrescriptionFormErrors = FieldErrors<AddPrescriptionFormData>;