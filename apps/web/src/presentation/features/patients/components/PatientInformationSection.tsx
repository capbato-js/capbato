import React from 'react';
import { Controller } from 'react-hook-form';
import { Select, Stack, Grid, Text, Box, useMantineTheme } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { FormTextInput } from '../../../components/ui/FormTextInput';
import { AddressSelector } from '../../../components/ui/AddressSelector';
import { ImageUpload } from '../../../shared/components/ImageUpload';
import {
  GENDER_OPTIONS,
  FORM_FIELD_CONFIG,
  SECTION_HEADERS,
  SUBSECTION_HEADERS,
  FORM_STYLES,
  getDateInputProps
} from '../config/patientFormConfig';
import { getErrorMessage, calculateAge } from '../utils/patientFormUtils';
import { patientFormTestIds } from '@nx-starter/utils-core';

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
  setValue: any;
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
  handleFieldChange,
  setValue
}) => {
  const theme = useMantineTheme();
  const dateOfBirth = watch('dateOfBirth');
  const photoUrl = watch('photoUrl');

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
        {/* Name Fields and Photo Upload Row */}
        <Grid>
          <Grid.Col span={7}>
            <Stack gap="sm">
              <FormTextInput
                label="Last Name"
                placeholder={FORM_FIELD_CONFIG.placeholders.lastName}
                error={getErrorMessage(errors.lastName)}
                disabled={isLoading}
                required
                data-testid={patientFormTestIds.lastNameInput}
                {...register('lastName', {
                  onBlur: () => handleNameFieldBlur('lastName')
                })}
              />
              <FormTextInput
                label="First Name"
                placeholder={FORM_FIELD_CONFIG.placeholders.firstName}
                error={getErrorMessage(errors.firstName)}
                disabled={isLoading}
                required
                data-testid={patientFormTestIds.firstNameInput}
                {...register('firstName', {
                  onBlur: () => handleNameFieldBlur('firstName')
                })}
              />
              <FormTextInput
                label="Middle Name"
                placeholder={FORM_FIELD_CONFIG.placeholders.middleName}
                error={getErrorMessage(errors.middleName)}
                disabled={isLoading}
                data-testid={patientFormTestIds.middleNameInput}
                {...register('middleName', {
                  onBlur: () => handleNameFieldBlur('middleName')
                })}
              />
            </Stack>
          </Grid.Col>
          <Grid.Col span={5}>
            <Box>
              <Text size="sm" fw={500} mb={4}>
                Patient Photo
              </Text>
              <Controller
                name="photoUrl"
                control={control}
                render={({ field }) => {
                  console.log('🎯 Controller render - current photoUrl value:', field.value);
                  return (
                    <ImageUpload
                      value={field.value || ''}
                      onChange={(url) => {
                        console.log('📝 PatientInformationSection: Received URL from ImageUpload:', url);
                        field.onChange(url);
                        setValue('photoUrl', url, { shouldDirty: true, shouldTouch: true });
                        console.log('✅ PatientInformationSection: Set photoUrl in form');
                      }}
                      disabled={isLoading}
                    />
                  );
                }}
              />
            </Box>
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
                  data-testid={patientFormTestIds.dateOfBirthInput}
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
              data-testid={patientFormTestIds.ageInput}
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
                  data-testid={patientFormTestIds.genderSelect}
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
              data-testid={patientFormTestIds.contactNumberInput}
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
                  data-testid={patientFormTestIds.houseNumberInput}
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
                  data-testid={patientFormTestIds.streetNameInput}
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
                'data-testid': patientFormTestIds.patientProvinceSelect,
              }}
              cityProps={{
                value: patientAddressSelector.selectedCity,
                onChange: handlePatientCityChange,
                error: getErrorMessage(errors.cityMunicipality),
                disabled: isLoading,
                'data-testid': patientFormTestIds.patientCitySelect,
              }}
              barangayProps={{
                value: patientAddressSelector.selectedBarangay,
                onChange: handlePatientBarangayChange,
                error: getErrorMessage(errors.barangay),
                disabled: isLoading,
                'data-testid': patientFormTestIds.patientBarangaySelect,
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