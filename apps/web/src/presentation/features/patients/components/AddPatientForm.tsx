import React from 'react';
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
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { CreatePatientCommandSchema } from '@nx-starter/application-shared';
import { FormTextInput } from '../../../components/ui/FormTextInput';
import { Icon } from '../../../components/common';
import type { CreatePatientCommand } from '@nx-starter/application-shared';

interface AddPatientFormProps {
  onSubmit: (data: CreatePatientCommand) => Promise<boolean>;
  onCancel: () => void;
  isLoading: boolean;
  error?: string | null;
}

/**
 * AddPatientForm component handles the creation of new patient records
 * with comprehensive validation and proper TypeScript typing.
 * Layout matches the legacy UI with two-column design.
 */
export const AddPatientForm: React.FC<AddPatientFormProps> = ({
  onSubmit,
  onCancel,
  isLoading,
  error
}) => {
  // React Hook Form setup
  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm<CreatePatientCommand>({
    resolver: zodResolver(CreatePatientCommandSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      middleName: '',
      dateOfBirth: '',
      gender: undefined,
      contactNumber: '',
      houseNumber: '',
      streetName: '',
      province: '',
      cityMunicipality: '',
      barangay: '',
      guardianName: '',
      guardianGender: undefined,
      guardianRelationship: '',
      guardianContactNumber: '',
      guardianHouseNumber: '',
      guardianStreetName: '',
      guardianProvince: '',
      guardianCityMunicipality: '',
      guardianBarangay: '',
    },
  });

  // Watch form values for button state
  const firstName = watch('firstName');
  const lastName = watch('lastName');
  const dateOfBirth = watch('dateOfBirth');
  const gender = watch('gender');
  const contactNumber = watch('contactNumber');

  // Check if required form fields are empty
  const isFormEmpty = !firstName?.trim() || 
                     !lastName?.trim() || 
                     !dateOfBirth?.trim() || 
                     !gender?.trim() ||
                     !contactNumber?.trim();

  const handleFormSubmit = handleSubmit(async (data) => {
    const success = await onSubmit(data as unknown as CreatePatientCommand);
    if (success) {
      reset(); // Reset form after successful submission
    }
  });

  return (
    <form onSubmit={handleFormSubmit} noValidate>
      <Stack gap="lg">
        {error && (
          <Alert color="red" style={{ marginBottom: '20px' }}>
            {error}
          </Alert>
        )}

        <Grid>
          {/* Patient's Information - Left Column */}
          <Grid.Col span={6}>
            <Box>
              <Text
                size="lg"
                fw={700}
                c="#004f6e"
                mb="md"
                style={{
                  borderBottom: '2px solid #4db6ac',
                  paddingBottom: '8px'
                }}
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
                      error={errors.lastName}
                      disabled={isLoading}
                      required
                      {...register('lastName')}
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <FormTextInput
                      label="First Name"
                      placeholder="Enter first name"
                      error={errors.firstName}
                      disabled={isLoading}
                      required
                      {...register('firstName')}
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <FormTextInput
                      label="Middle Name"
                      placeholder="Enter middle name"
                      error={errors.middleName}
                      disabled={isLoading}
                      {...register('middleName')}
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
                          placeholder="mm/dd/yyyy"
                          error={fieldState.error?.message}
                          disabled={isLoading}
                          required
                          valueFormat="MM/DD/YYYY"
                          rightSection={<Icon icon="fas fa-calendar" size={14} />}
                          style={{ width: '100%' }}
                        />
                      )}
                    />
                  </Grid.Col>
                  <Grid.Col span={2}>
                    <FormTextInput
                      label="Age"
                      placeholder="Calculated"
                      disabled
                      value="Auto"
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
                        />
                      )}
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <FormTextInput
                      label="Contact Number"
                      placeholder="09278479061"
                      error={errors.contactNumber}
                      maxLength={11}
                      disabled={isLoading}
                      required
                      {...register('contactNumber')}
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
                          error={errors.houseNumber}
                          disabled={isLoading}
                          {...register('houseNumber')}
                        />
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <FormTextInput
                          label="Street Name"
                          placeholder="e.g., Rizal Street"
                          error={errors.streetName}
                          disabled={isLoading}
                          {...register('streetName')}
                        />
                      </Grid.Col>
                    </Grid>
                    <Grid>
                      <Grid.Col span={6}>
                        <FormTextInput
                          label="Province"
                          placeholder="Select Province"
                          error={errors.province}
                          disabled={isLoading}
                          {...register('province')}
                        />
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <FormTextInput
                          label="City/Municipality"
                          placeholder="Select province first"
                          error={errors.cityMunicipality}
                          disabled={isLoading}
                          {...register('cityMunicipality')}
                        />
                      </Grid.Col>
                    </Grid>
                    <FormTextInput
                      label="Barangay"
                      placeholder="Select city first"
                      error={errors.barangay}
                      disabled={isLoading}
                      {...register('barangay')}
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
                c="#004f6e"
                mb="md"
                style={{
                  borderBottom: '2px solid #4db6ac',
                  paddingBottom: '8px'
                }}
              >
                GUARDIAN INFORMATION
              </Text>

              <Stack gap="md">
                <FormTextInput
                  label="Full Name"
                  placeholder="Enter guardian full name"
                  error={errors.guardianName}
                  disabled={isLoading}
                  {...register('guardianName')}
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
                        />
                      )}
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <FormTextInput
                      label="Relationship"
                      placeholder="e.g., Mother, Father"
                      error={errors.guardianRelationship}
                      disabled={isLoading}
                      {...register('guardianRelationship')}
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <FormTextInput
                      label="Contact Number"
                      placeholder="09278479061"
                      error={errors.guardianContactNumber}
                      maxLength={11}
                      disabled={isLoading}
                      {...register('guardianContactNumber')}
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
                          error={errors.guardianHouseNumber}
                          disabled={isLoading}
                          {...register('guardianHouseNumber')}
                        />
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <FormTextInput
                          label="Street Name"
                          placeholder="e.g., Rizal Street"
                          error={errors.guardianStreetName}
                          disabled={isLoading}
                          {...register('guardianStreetName')}
                        />
                      </Grid.Col>
                    </Grid>
                    <Grid>
                      <Grid.Col span={6}>
                        <FormTextInput
                          label="Province"
                          placeholder="Select Province"
                          error={errors.guardianProvince}
                          disabled={isLoading}
                          {...register('guardianProvince')}
                        />
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <FormTextInput
                          label="City/Municipality"
                          placeholder="Select province first"
                          error={errors.guardianCityMunicipality}
                          disabled={isLoading}
                          {...register('guardianCityMunicipality')}
                        />
                      </Grid.Col>
                    </Grid>
                    <FormTextInput
                      label="Barangay"
                      placeholder="Select city first"
                      error={errors.guardianBarangay}
                      disabled={isLoading}
                      {...register('guardianBarangay')}
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
            type="submit"
            disabled={isFormEmpty || isLoading}
            loading={isLoading}
            color="#17A589"
          >
            <Icon icon="fas fa-save" style={{ marginRight: '4px' }} />
            {isLoading ? 'Submitting...' : 'Submit'}
          </Button>
        </Box>
      </Stack>
    </form>
  );
};