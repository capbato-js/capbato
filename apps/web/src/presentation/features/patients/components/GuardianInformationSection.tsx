import React from 'react';
import { Controller } from 'react-hook-form';
import { Select, Stack, Grid, Text, Box, useMantineTheme } from '@mantine/core';
import { FormTextInput } from '../../../components/ui/FormTextInput';
import { AddressSelector } from '../../../components/ui/AddressSelector';
import { 
  GENDER_OPTIONS, 
  FORM_FIELD_CONFIG, 
  SECTION_HEADERS, 
  SUBSECTION_HEADERS,
  FORM_STYLES
} from '../config/patientFormConfig';
import { getErrorMessage } from '../utils/patientFormUtils';
import { patientFormTestIds } from '@nx-starter/utils-core';

interface GuardianInformationSectionProps {
  control: any;
  register: any;
  errors: any;
  isLoading: boolean;
  guardianAddressSelector: any;
  handleGuardianProvinceChange: (value: string | null) => void;
  handleGuardianCityChange: (value: string | null) => void;
  handleGuardianBarangayChange: (value: string | null) => void;
  handleNameFieldBlur: (fieldName: 'guardianName') => void;
  handleFieldBlur: (fieldName: string) => void;
  handleFieldChange: (fieldName: string) => void;
}

export const GuardianInformationSection: React.FC<GuardianInformationSectionProps> = ({
  control,
  register,
  errors,
  isLoading,
  guardianAddressSelector,
  handleGuardianProvinceChange,
  handleGuardianCityChange,
  handleGuardianBarangayChange,
  handleNameFieldBlur,
  handleFieldBlur,
  handleFieldChange
}) => {
  const theme = useMantineTheme();

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
        {SECTION_HEADERS.guardian}
      </Text>

      <Stack gap="md">
        <FormTextInput
          label="Full Name"
          placeholder={FORM_FIELD_CONFIG.placeholders.guardianName}
          error={getErrorMessage(errors.guardianName)}
          disabled={isLoading}
          data-testid={patientFormTestIds.guardianNameInput}
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
                  placeholder={FORM_FIELD_CONFIG.placeholders.gender}
                  error={fieldState.error?.message}
                  data={GENDER_OPTIONS}
                  disabled={isLoading}
                  data-testid={patientFormTestIds.guardianGenderSelect}
                  onBlur={() => handleFieldBlur('guardianGender')}
                />
              )}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <FormTextInput
              label="Relationship"
              placeholder={FORM_FIELD_CONFIG.placeholders.guardianRelationship}
              error={getErrorMessage(errors.guardianRelationship)}
              disabled={isLoading}
              data-testid={patientFormTestIds.guardianRelationshipInput}
              {...register('guardianRelationship', {
                onBlur: () => handleFieldBlur('guardianRelationship')
              })}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <FormTextInput
              label="Contact Number"
              placeholder={FORM_FIELD_CONFIG.placeholders.guardianContactNumber}
              error={getErrorMessage(errors.guardianContactNumber)}
              maxLength={FORM_FIELD_CONFIG.maxLengths.guardianContactNumber}
              disabled={isLoading}
              data-testid={patientFormTestIds.guardianContactInput}
              {...register('guardianContactNumber', {
                onBlur: () => handleFieldBlur('guardianContactNumber'),
                onChange: () => handleFieldChange('guardianContactNumber')
              })}
            />
          </Grid.Col>
        </Grid>

        {/* Guardian Address Details */}
        <Box>
          <Text fw={600} mb="sm">{SUBSECTION_HEADERS.guardianAddressDetails}</Text>
          <Stack gap="sm">
            <Grid>
              <Grid.Col span={6}>
                <FormTextInput
                  label="House No."
                  placeholder={FORM_FIELD_CONFIG.placeholders.guardianHouseNumber}
                  error={getErrorMessage(errors.guardianHouseNumber)}
                  disabled={isLoading}
                  data-testid={patientFormTestIds.guardianHouseNumberInput}
                  {...register('guardianHouseNumber', {
                    onBlur: () => handleFieldBlur('guardianHouseNumber')
                  })}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <FormTextInput
                  label="Street Name"
                  placeholder={FORM_FIELD_CONFIG.placeholders.guardianStreetName}
                  error={getErrorMessage(errors.guardianStreetName)}
                  disabled={isLoading}
                  data-testid={patientFormTestIds.guardianStreetNameInput}
                  {...register('guardianStreetName', {
                    onBlur: () => handleFieldBlur('guardianStreetName')
                  })}
                />
              </Grid.Col>
            </Grid>
            
            <AddressSelector
              provinceProps={{
                value: guardianAddressSelector.selectedProvince,
                onChange: handleGuardianProvinceChange,
                error: getErrorMessage(errors.guardianProvince),
                disabled: isLoading,
                'data-testid': patientFormTestIds.guardianProvinceSelect,
              }}
              cityProps={{
                value: guardianAddressSelector.selectedCity,
                onChange: handleGuardianCityChange,
                error: getErrorMessage(errors.guardianCityMunicipality),
                disabled: isLoading,
                'data-testid': patientFormTestIds.guardianCitySelect,
              }}
              barangayProps={{
                value: guardianAddressSelector.selectedBarangay,
                onChange: handleGuardianBarangayChange,
                error: getErrorMessage(errors.guardianBarangay),
                disabled: isLoading,
                'data-testid': patientFormTestIds.guardianBarangaySelect,
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
  );
};