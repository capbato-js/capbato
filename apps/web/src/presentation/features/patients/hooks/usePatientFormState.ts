import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreatePatientCommandSchema, UpdatePatientCommandSchema } from '@nx-starter/application-shared';
import type { CreatePatientCommand, UpdatePatientCommand } from '@nx-starter/application-shared';

// Form data type that matches the schema input before transformation
export type PatientFormData = Omit<CreatePatientCommand, 'contactNumber' | 'guardianContactNumber'> & {
  id?: string; // Include id for update mode
  contactNumber: string;
  guardianContactNumber: string | undefined;
};

interface UsePatientFormStateProps {
  mode: 'create' | 'update';
  initialData?: Partial<PatientFormData>;
}

export const usePatientFormState = ({ mode, initialData }: UsePatientFormStateProps) => {
  const isUpdateMode = mode === 'update';
  const validationSchema = isUpdateMode ? UpdatePatientCommandSchema : CreatePatientCommandSchema;

  const form = useForm<CreatePatientCommand | UpdatePatientCommand>({
    resolver: zodResolver(validationSchema) as any,
    mode: 'onBlur',
    defaultValues: {
      firstName: initialData?.firstName || '',
      lastName: initialData?.lastName || '',
      middleName: initialData?.middleName || '',
      dateOfBirth: initialData?.dateOfBirth || '',
      gender: initialData?.gender || undefined,
      contactNumber: initialData?.contactNumber || '',
      houseNumber: initialData?.houseNumber || '',
      streetName: initialData?.streetName || '',
      province: initialData?.province || '',
      cityMunicipality: initialData?.cityMunicipality || '',
      barangay: initialData?.barangay || '',
      guardianName: initialData?.guardianName || '',
      guardianGender: initialData?.guardianGender || undefined,
      guardianRelationship: initialData?.guardianRelationship || '',
      guardianContactNumber: initialData?.guardianContactNumber || '',
      guardianHouseNumber: initialData?.guardianHouseNumber || '',
      guardianStreetName: initialData?.guardianStreetName || '',
      guardianProvince: initialData?.guardianProvince || '',
      guardianCityMunicipality: initialData?.guardianCityMunicipality || '',
      guardianBarangay: initialData?.guardianBarangay || '',
    },
  });

  return {
    ...form,
    isUpdateMode
  };
};