import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Select,
  Stack,
  Grid,
  Text,
  Alert,
  Box,
  useMantineTheme,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { CreatePatientCommandSchema, UpdatePatientCommandSchema } from '@nx-starter/application-shared';
import { FormTextInput } from '../../../components/ui/FormTextInput';
import { AddressSelector } from '../../../components/ui/AddressSelector';
import { useAddressSelector } from '../../../hooks';
import { Icon } from '../../../components/common';
import { NameFormattingService } from '@nx-starter/domain';
import type { CreatePatientCommand, UpdatePatientCommand } from '@nx-starter/application-shared';
import { classifyError, formatFieldErrorMessage } from '../utils/errorClassification';

// Form data type that matches the schema input before transformation
type PatientFormData = Omit<CreatePatientCommand, 'contactNumber' | 'guardianContactNumber'> & {
  id?: string; // Include id for update mode
  contactNumber: string;
  guardianContactNumber: string | undefined;
};

// Helper function to safely extract error message
const getErrorMessage = (error: unknown): string | undefined => {
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object' && 'message' in error) {
    return (error as { message: string }).message;
  }
  return undefined;
};

interface PatientFormProps {
  mode: 'create' | 'update';
  initialData?: Partial<PatientFormData>;
  onSubmit: (data: CreatePatientCommand | UpdatePatientCommand) => Promise<boolean>;
  onCancel: () => void;
  isLoading: boolean;
  error?: unknown; // Changed to handle both string and structured errors
}

/**
 * PatientForm component handles both creation and updating of patient records
 * with comprehensive validation and proper TypeScript typing.
 * Layout matches the legacy UI with two-column design.
 * 
 * Validation Features:
 * - Uses onSubmit mode to avoid aggressive validation while typing
 * - Implements onBlur validation for all fields (required and optional)
 * - Required fields: firstName, lastName, dateOfBirth, gender, contactNumber
 * - Optional fields with validation: guardianContactNumber (phone format), 
 *   address fields (length limits), guardian info (conditional validation)
 * - Validation only triggers on blur, providing non-aggressive UX
 */
export const PatientForm: React.FC<PatientFormProps> = ({
  mode,
  initialData,
  onSubmit,
  onCancel,
  isLoading,
  error
}) => {
  const theme = useMantineTheme();
  // React Hook Form setup
  const isUpdateMode = mode === 'update';
  const validationSchema = isUpdateMode ? UpdatePatientCommandSchema : CreatePatientCommandSchema;

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    trigger,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<CreatePatientCommand | UpdatePatientCommand>({
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
      guardianContactNumber: initialData?.guardianContactNumber || '', // Set as empty string instead of undefined
      guardianHouseNumber: initialData?.guardianHouseNumber || '',
      guardianStreetName: initialData?.guardianStreetName || '',
      guardianProvince: initialData?.guardianProvince || '',
      guardianCityMunicipality: initialData?.guardianCityMunicipality || '',
      guardianBarangay: initialData?.guardianBarangay || '',
    },
  });

  // Address selector hooks for patient address
  const patientAddressSelector = useAddressSelector();
  
  // Address selector hooks for guardian address
  const guardianAddressSelector = useAddressSelector();

  // Error classification state
  const [generalError, setGeneralError] = React.useState<string | null>(null);

  // Handle error classification and display
  useEffect(() => {
    if (!error) {
      setGeneralError(null);
      return;
    }

    const classification = classifyError(error);
    
    if (classification.type === 'field' && classification.fieldError) {
      // Clear general error and set field error
      setGeneralError(null);
      const { field, message } = classification.fieldError;
      const formattedMessage = formatFieldErrorMessage(field, message);
      
      setError(field as keyof CreatePatientCommand, {
        type: 'server',
        message: formattedMessage
      });
    } else {
      // Clear any field errors and set general error
      clearErrors();
      setGeneralError(classification.generalMessage || 'An unexpected error occurred');
    }
  }, [error, setError, clearErrors]);

  // Handle patient address changes
  const handlePatientProvinceChange = async (value: string | null) => {
    if (value) {
      // Find the province name by its code and store the name instead of code
      const province = patientAddressSelector.provinces.find(p => p.code === value);
      setValue('province', province?.name || value);
      await patientAddressSelector.selectProvince(value);
      // Clear dependent fields
      setValue('cityMunicipality', '');
      setValue('barangay', '');
    }
  };

  const handlePatientCityChange = async (value: string | null) => {
    if (value) {
      // Find the city name by its code and store the name instead of code
      const city = patientAddressSelector.cities.find(c => c.code === value);
      setValue('cityMunicipality', city?.name || value);
      await patientAddressSelector.selectCity(value);
      // Clear dependent field
      setValue('barangay', '');
    }
  };

  const handlePatientBarangayChange = (value: string | null) => {
    if (value) {
      // Find the barangay name by its code and store the name instead of code
      const barangay = patientAddressSelector.barangays.find(b => b.code === value);
      setValue('barangay', barangay?.name || value);
      patientAddressSelector.selectBarangay(value);
    }
  };

  // Handle guardian address changes
  const handleGuardianProvinceChange = async (value: string | null) => {
    if (value) {
      // Find the province name by its code and store the name instead of code
      const province = guardianAddressSelector.provinces.find(p => p.code === value);
      setValue('guardianProvince', province?.name || value);
      await guardianAddressSelector.selectProvince(value);
      // Clear dependent fields
      setValue('guardianCityMunicipality', '');
      setValue('guardianBarangay', '');
    }
  };

  const handleGuardianCityChange = async (value: string | null) => {
    if (value) {
      // Find the city name by its code and store the name instead of code
      const city = guardianAddressSelector.cities.find(c => c.code === value);
      setValue('guardianCityMunicipality', city?.name || value);
      await guardianAddressSelector.selectCity(value);
      // Clear dependent field
      setValue('guardianBarangay', '');
    }
  };

  const handleGuardianBarangayChange = (value: string | null) => {
    if (value) {
      // Find the barangay name by its code and store the name instead of code
      const barangay = guardianAddressSelector.barangays.find(b => b.code === value);
      setValue('guardianBarangay', barangay?.name || value);
      guardianAddressSelector.selectBarangay(value);
    }
  };

  // Watch form values for button state
  const firstName = watch('firstName');
  const lastName = watch('lastName');
  const dateOfBirth = watch('dateOfBirth');
  const gender = watch('gender');
  const contactNumber = watch('contactNumber');

  // Calculate age from date of birth
  const calculateAge = (birthDate: string): number | null => {
    if (!birthDate) return null;
    
    const birth = new Date(birthDate);
    const today = new Date();
    
    // Check if birth date is valid
    if (isNaN(birth.getTime()) || birth > today) return null;
    
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    // Adjust age if birthday hasn't occurred this year
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age >= 0 ? age : null;
  };

  // Compute age based on date of birth
  const computedAge = calculateAge(dateOfBirth);
  const ageDisplayValue = computedAge !== null ? computedAge.toString() : '';

  // Check if required form fields are empty
  // For update mode, allow partial updates
  const isFormEmpty = isUpdateMode ? 
    false : // Allow updates even with empty fields  
    (!firstName?.trim() || 
     !lastName?.trim() || 
     !dateOfBirth?.trim() || 
     !gender?.trim() ||
     !contactNumber?.trim());

  // Debug logging for button state
  console.log('🔍 Form state debug:', {
    isUpdateMode,
    isFormEmpty,
    isLoading,
    buttonDisabled: isFormEmpty || isLoading,
    firstName: firstName?.trim(),
    lastName: lastName?.trim(),
    dateOfBirth: dateOfBirth?.trim(),
    gender: gender?.trim(),
    contactNumber: contactNumber?.trim(),
    formErrors: errors,
    hasErrors: Object.keys(errors).length > 0
  });

  // Handle field blur validation for optional fields with validation rules
  const handleFieldBlur = async (fieldName: keyof CreatePatientFormData) => {
    await trigger(fieldName);
  };

  // Handle name field formatting on blur
  const handleNameFieldBlur = async (fieldName: 'firstName' | 'lastName' | 'middleName' | 'guardianName') => {
    const currentValue = watch(fieldName);
    if (currentValue && typeof currentValue === 'string') {
      const formattedValue = NameFormattingService.formatToProperCase(currentValue);
      if (formattedValue !== currentValue) {
        setValue(fieldName, formattedValue);
      }
    }
    await trigger(fieldName);
  };

  // Clear field error when user starts typing
  const handleFieldChange = (fieldName: keyof CreatePatientCommand) => {
    if (errors[fieldName]?.type === 'server') {
      clearErrors(fieldName);
    }
  };

  const handleFormSubmit = handleSubmit(async (data) => {
    console.log('📝 PatientForm.handleFormSubmit called');
    console.log('📝 Form data:', data);
    console.log('📝 Mode:', mode, 'isUpdateMode:', isUpdateMode);
    console.log('📝 Initial data ID:', initialData?.id);
    
    try {
      let submitData: CreatePatientCommand | UpdatePatientCommand;
      
      if (isUpdateMode && initialData?.id) {
        // For update mode, include the ID
        submitData = {
          ...data,
          id: initialData.id
        } as UpdatePatientCommand;
        console.log('📝 Prepared UPDATE data:', submitData);
      } else {
        // For create mode, exclude ID
        submitData = data as CreatePatientCommand;
        console.log('📝 Prepared CREATE data:', submitData);
      }
      
      console.log('📝 Calling onSubmit with data...');
      const success = await onSubmit(submitData);
      console.log('📝 onSubmit result:', success);
      if (success && !isUpdateMode) {
        reset(); // Only reset form after successful creation, not update
      }
    } catch (error) {
      console.error('📝 Error in handleFormSubmit:', error);
    }
  }, (errors) => {
    console.error('📝 Form validation errors:', errors);
  });

  return (
    <form onSubmit={handleFormSubmit} noValidate>
      <Stack gap="lg">
        {generalError && (
          <Alert color="red" style={{ marginBottom: '20px' }}>
            {generalError}
          </Alert>
        )}

        <Grid>
          {/* Patient's Information - Left Column */}
          <Grid.Col span={6}>
            <Box>
              <Text
                size="lg"
                fw={700}
                style={{
                  color: theme.colors.blue[9],
                  borderBottom: `2px solid ${theme.colors.blue[9]}`,
                  paddingBottom: '8px'
                }}
                mb="md"
              >
                PATIENT'S INFORMATION
              </Text>

              <Stack gap="md">
                {/* Name Fields Row */}
                <Grid>
                                    <Grid.Col span={4}>
                    <FormTextInput
                      label="Last Name"
                      placeholder="Enter last name"
                      error={getErrorMessage(errors.lastName)}
                      disabled={isLoading}
                      required
                      {...register('lastName', {
                        onBlur: () => handleNameFieldBlur('lastName')
                      })}
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <FormTextInput
                      label="First Name"
                      placeholder="Enter first name"
                      error={getErrorMessage(errors.firstName)}
                      disabled={isLoading}
                      required
                      {...register('firstName', {
                        onBlur: () => handleNameFieldBlur('firstName')
                      })}
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <FormTextInput
                      label="Middle Name"
                      placeholder="Enter middle name"
                      error={getErrorMessage(errors.middleName)}
                      disabled={isLoading}
                      {...register('middleName', {
                        onBlur: () => handleNameFieldBlur('middleName')
                      })}
                    />
                  </Grid.Col>
                </Grid>

                {/* Details Row */}
                <Grid>
                  <Grid.Col span={3}>
                    <Controller
                      name="dateOfBirth"
                      control={control}
                      render={({ field, fieldState }) => (
                        <DateInput
                          {...field}
                          label="Date of Birth"
                          placeholder="Enter date"
                          error={fieldState.error?.message}
                          disabled={isLoading}
                          required
                          valueFormat="MMM D, YYYY"
                          leftSection={<Icon icon="fas fa-calendar" size={14} />}
                          style={{ width: '100%' }}
                          onBlur={() => handleFieldBlur('dateOfBirth')}
                        />
                      )}
                    />
                  </Grid.Col>
                  <Grid.Col span={2}>
                    <FormTextInput
                      label="Age"
                      placeholder=""
                      disabled
                      value={ageDisplayValue}
                    />
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <Controller
                      name="gender"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Select
                          {...field}
                          label="Gender"
                          placeholder="Select"
                          error={fieldState.error?.message}
                          data={[
                            { value: 'Male', label: 'Male' },
                            { value: 'Female', label: 'Female' }
                          ]}
                          disabled={isLoading}
                          required
                          onBlur={() => handleFieldBlur('gender')}
                        />
                      )}
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <FormTextInput
                      label="Contact Number"
                      placeholder="09123456789"
                      error={getErrorMessage(errors.contactNumber)}
                      maxLength={11}
                      disabled={isLoading}
                      required
                      {...register('contactNumber', {
                        onBlur: () => handleFieldBlur('contactNumber'),
                        onChange: () => handleFieldChange('contactNumber')
                      })}
                    />
                  </Grid.Col>
                </Grid>

                {/* Address Details */}
                <Box>
                  <Text fw={600} mb="sm">Address Details:</Text>
                  <Stack gap="sm">
                    <Grid>
                      <Grid.Col span={6}>
                        <FormTextInput
                          label="House No."
                          placeholder="e.g., 123"
                          error={getErrorMessage(errors.houseNumber)}
                          disabled={isLoading}
                          {...register('houseNumber', {
                            onBlur: () => handleFieldBlur('houseNumber')
                          })}
                        />
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <FormTextInput
                          label="Street Name"
                          placeholder="e.g., Rizal Street"
                          error={getErrorMessage(errors.streetName)}
                          disabled={isLoading}
                          {...register('streetName', {
                            onBlur: () => handleFieldBlur('streetName')
                          })}
                        />
                      </Grid.Col>
                    </Grid>
                    
                    {/* Address Selector Component */}
                    <AddressSelector
                      provinceProps={{
                        value: patientAddressSelector.selectedProvince,
                        onChange: handlePatientProvinceChange,
                        error: getErrorMessage(errors.province),
                        disabled: isLoading,
                      }}
                      cityProps={{
                        value: patientAddressSelector.selectedCity,
                        onChange: handlePatientCityChange,
                        error: getErrorMessage(errors.cityMunicipality),
                        disabled: isLoading,
                      }}
                      barangayProps={{
                        value: patientAddressSelector.selectedBarangay,
                        onChange: handlePatientBarangayChange,
                        error: getErrorMessage(errors.barangay),
                        disabled: isLoading,
                      }}
                      addressData={{
                        provinces: patientAddressSelector.provinces,
                        cities: patientAddressSelector.cities,
                        barangays: patientAddressSelector.barangays,
                        isLoadingProvinces: patientAddressSelector.isLoadingProvinces,
                        isLoadingCities: patientAddressSelector.isLoadingCities,
                        isLoadingBarangays: patientAddressSelector.isLoadingBarangays,
                        error: patientAddressSelector.error,
                      }}
                    />
                  </Stack>
                </Box>
              </Stack>
            </Box>
          </Grid.Col>

          {/* Guardian Information - Right Column */}
          <Grid.Col span={6}>
            <Box>
              <Text
                size="lg"
                fw={700}
                style={{
                  color: theme.colors.blue[9],
                  borderBottom: `2px solid ${theme.colors.blue[9]}`,
                  paddingBottom: '8px'
                }}
                mb="md"
              >
                GUARDIAN INFORMATION
              </Text>

              <Stack gap="md">
                <FormTextInput
                  label="Full Name"
                  placeholder="Enter guardian full name"
                  error={getErrorMessage(errors.guardianName)}
                  disabled={isLoading}
                  {...register('guardianName', {
                    onBlur: () => handleNameFieldBlur('guardianName')
                  })}
                />

                <Grid>
                  <Grid.Col span={4}>
                    <Controller
                      name="guardianGender"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Select
                          {...field}
                          label="Gender"
                          placeholder="Select"
                          error={fieldState.error?.message}
                          data={[
                            { value: 'Male', label: 'Male' },
                            { value: 'Female', label: 'Female' }
                          ]}
                          disabled={isLoading}
                          onBlur={() => handleFieldBlur('guardianGender')}
                        />
                      )}
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <FormTextInput
                      label="Relationship"
                      placeholder="e.g., Mother, Father"
                      error={getErrorMessage(errors.guardianRelationship)}
                      disabled={isLoading}
                      {...register('guardianRelationship', {
                        onBlur: () => handleFieldBlur('guardianRelationship')
                      })}
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <FormTextInput
                      label="Contact Number"
                      placeholder="09123456789"
                      error={getErrorMessage(errors.guardianContactNumber)}
                      maxLength={11}
                      disabled={isLoading}
                      {...register('guardianContactNumber', {
                        onBlur: () => handleFieldBlur('guardianContactNumber'),
                        onChange: () => handleFieldChange('guardianContactNumber')
                      })}
                    />
                  </Grid.Col>
                </Grid>

                {/* Guardian Address Details */}
                <Box>
                  <Text fw={600} mb="sm">Guardian Address Details:</Text>
                  <Stack gap="sm">
                    <Grid>
                      <Grid.Col span={6}>
                        <FormTextInput
                          label="House No."
                          placeholder="e.g., 123"
                          error={getErrorMessage(errors.guardianHouseNumber)}
                          disabled={isLoading}
                          {...register('guardianHouseNumber', {
                            onBlur: () => handleFieldBlur('guardianHouseNumber')
                          })}
                        />
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <FormTextInput
                          label="Street Name"
                          placeholder="e.g., Rizal Street"
                          error={getErrorMessage(errors.guardianStreetName)}
                          disabled={isLoading}
                          {...register('guardianStreetName', {
                            onBlur: () => handleFieldBlur('guardianStreetName')
                          })}
                        />
                      </Grid.Col>
                    </Grid>
                    
                    {/* Guardian Address Selector Component */}
                    <AddressSelector
                      provinceProps={{
                        value: guardianAddressSelector.selectedProvince,
                        onChange: handleGuardianProvinceChange,
                        error: getErrorMessage(errors.guardianProvince),
                        disabled: isLoading,
                      }}
                      cityProps={{
                        value: guardianAddressSelector.selectedCity,
                        onChange: handleGuardianCityChange,
                        error: getErrorMessage(errors.guardianCityMunicipality),
                        disabled: isLoading,
                      }}
                      barangayProps={{
                        value: guardianAddressSelector.selectedBarangay,
                        onChange: handleGuardianBarangayChange,
                        error: getErrorMessage(errors.guardianBarangay),
                        disabled: isLoading,
                      }}
                      addressData={{
                        provinces: guardianAddressSelector.provinces,
                        cities: guardianAddressSelector.cities,
                        barangays: guardianAddressSelector.barangays,
                        isLoadingProvinces: guardianAddressSelector.isLoadingProvinces,
                        isLoadingCities: guardianAddressSelector.isLoadingCities,
                        isLoadingBarangays: guardianAddressSelector.isLoadingBarangays,
                        error: guardianAddressSelector.error,
                      }}
                    />
                  </Stack>
                </Box>
              </Stack>
            </Box>
          </Grid.Col>
        </Grid>

        {/* Form Actions */}
        <Box
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '15px',
            paddingTop: '20px',
            borderTop: '1px solid #e9ecef',
            marginTop: '20px'
          }}
        >
          <Button
            variant="filled"
            color="gray"
            onClick={onCancel}
            disabled={isLoading}
          >
            <Icon icon="fas fa-times" style={{ marginRight: '4px' }} />
            Cancel
          </Button>
          <Button
            type="button"
            disabled={isFormEmpty || isLoading}
            loading={isLoading}
            onClick={async () => {
              console.log('🖱️ Submit button clicked!');
              console.log('🖱️ Button disabled?', isFormEmpty || isLoading);
              
              // Get current form data and submit directly
              const formData = watch();
              console.log('🖱️ Current form data:', formData);
              
              if (isUpdateMode && initialData?.id) {
                const submitData = {
                  ...formData,
                  id: initialData.id
                } as UpdatePatientCommand;
                console.log('🖱️ Submit data prepared:', submitData);
                try {
                  const result = await onSubmit(submitData);
                  console.log('🖱️ Submit result:', result);
                  if (result && !isUpdateMode) {
                    reset();
                  }
                } catch (error) {
                  console.error('🖱️ Submit error:', error);
                }
              } else {
                // Create mode
                const submitData = formData as CreatePatientCommand;
                try {
                  const result = await onSubmit(submitData);
                  console.log('🖱️ Submit result:', result);
                  if (result && !isUpdateMode) {
                    reset();
                  }
                } catch (error) {
                  console.error('🖱️ Submit error:', error);
                }
              }
            }}
          >
            <Icon icon="fas fa-save" style={{ marginRight: '4px' }} />
            {isLoading ? 'Submitting...' : 'Submit'}
          </Button>
        </Box>
      </Stack>
    </form>
  );
};