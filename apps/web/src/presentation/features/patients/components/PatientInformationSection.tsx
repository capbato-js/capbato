import React from 'react';
import { Controller } from 'react-hook-form';
import { Select, Stack, Grid, Text, Box, useMantineTheme } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { FormTextInput } from '../../../components/ui/FormTextInput';
import { AddressSelector } from '../../../components/ui/AddressSelector';
import { 
  GENDER_OPTIONS, 
  FORM_FIELD_CONFIG, 
  SECTION_HEADERS, 
  SUBSECTION_HEADERS,
  FORM_STYLES,
  getDateInputProps 
} from '../config/patientFormConfig';
import { getErrorMessage, calculateAge } from '../utils/patientFormUtils';

interface PatientInformationSectionProps {
  control: any;
  register: any;
  watch: any;
  errors: any;
  isLoading: boolean;
  patientAddressSelector: any;
  handlePatientProvinceChange: (value: string | null) => void;
  handlePatientCityChange: (value: string | null) => void;
  handlePatientBarangayChange: (value: string | null) => void;
  handleNameFieldBlur: (fieldName: 'firstName' | 'lastName' | 'middleName') => void;
  handleFieldBlur: (fieldName: string) => void;
  handleFieldChange: (fieldName: string) => void;
}

export const PatientInformationSection: React.FC<PatientInformationSectionProps> = ({
  control,
  register,
  watch,
  errors,
  isLoading,
  patientAddressSelector,
  handlePatientProvinceChange,
  handlePatientCityChange,
  handlePatientBarangayChange,
  handleNameFieldBlur,
  handleFieldBlur,
  handleFieldChange
}) => {
  const theme = useMantineTheme();
  const dateOfBirth = watch('dateOfBirth');
  
  const computedAge = calculateAge(dateOfBirth);
  const ageDisplayValue = computedAge !== null ? computedAge.toString() : '';

  return (
    <Box>
      <Text
        {...FORM_STYLES.sectionHeader}
        style={{
          color: theme.colors.blue[9],
          borderBottom: `2px solid ${theme.colors.blue[9]}`,
          paddingBottom: FORM_STYLES.sectionHeader.paddingBottom
        }}
        mb="md"
      >
        {SECTION_HEADERS.patient}
      </Text>

      <Stack gap="md">
        {/* Name Fields Row */}
        <Grid>
          <Grid.Col span={4}>
            <FormTextInput
              label="Last Name"
              placeholder={FORM_FIELD_CONFIG.placeholders.lastName}
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
              placeholder={FORM_FIELD_CONFIG.placeholders.firstName}
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
              placeholder={FORM_FIELD_CONFIG.placeholders.middleName}
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
                  {...getDateInputProps()}
                  label="Date of Birth"
                  placeholder={FORM_FIELD_CONFIG.placeholders.dateOfBirth}
                  error={fieldState.error?.message}
                  disabled={isLoading}
                  required
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
                  placeholder={FORM_FIELD_CONFIG.placeholders.gender}
                  error={fieldState.error?.message}
                  data={GENDER_OPTIONS}
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
              placeholder={FORM_FIELD_CONFIG.placeholders.contactNumber}
              error={getErrorMessage(errors.contactNumber)}
              maxLength={FORM_FIELD_CONFIG.maxLengths.contactNumber}
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
          <Text fw={600} mb="sm">{SUBSECTION_HEADERS.addressDetails}</Text>
          <Stack gap="sm">
            <Grid>
              <Grid.Col span={6}>
                <FormTextInput
                  label="House No."
                  placeholder={FORM_FIELD_CONFIG.placeholders.houseNumber}
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
                  placeholder={FORM_FIELD_CONFIG.placeholders.streetName}
                  error={getErrorMessage(errors.streetName)}
                  disabled={isLoading}
                  {...register('streetName', {
                    onBlur: () => handleFieldBlur('streetName')
                  })}
                />
              </Grid.Col>
            </Grid>
            
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
  );
};