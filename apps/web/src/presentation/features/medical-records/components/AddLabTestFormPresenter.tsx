import React from 'react';
import { Stack, Alert, Box, TextInput } from '@mantine/core';
import { LabFormHeader } from './LabFormHeader';
import { PatientInformationSection } from './PatientInformationSection';
import { TestSelectionGrid } from './TestSelectionGrid';
import { TotalPriceDisplay } from './TotalPriceDisplay';
import { LabFormSubmitButton } from './LabFormSubmitButton';
import type { ADD_LAB_TEST_FORM_CONFIG } from '../config/addLabTestFormConfig';

interface AddLabTestFormPresenterProps {
  config: typeof ADD_LAB_TEST_FORM_CONFIG;
  formState: any;
  patientData: any;
  testSelection: any;
  patientSelection: any;
  onFormSubmit: () => void;
  isLoading: boolean;
  error?: string | null;
}

const alertStyles = {
  marginBottom: '10px'
};

export const AddLabTestFormPresenter: React.FC<AddLabTestFormPresenterProps> = ({
  config,
  formState,
  patientData,
  testSelection,
  patientSelection,
  onFormSubmit,
  isLoading,
  error,
}) => {
  const isFormEmpty = testSelection.isFormEmpty(
    formState.patientName,
    formState.ageGender,
    formState.requestDate
  );

  return (
    <form onSubmit={onFormSubmit} noValidate>
      <Stack gap="lg">
        {error && (
          <Alert color="red" style={alertStyles}>
            {error}
          </Alert>
        )}

        <LabFormHeader
          clinicName={config.clinic.name}
          address={config.clinic.address}
          contact={config.clinic.contact}
        />

        <PatientInformationSection
          control={formState.control}
          register={formState.register}
          errors={formState.formState.errors}
          patients={patientSelection.filteredPatients}
          selectedPatientNumber={patientSelection.selectedPatientNumber}
          selectedPatientAgeGender={patientSelection.selectedPatientAgeGender}
          onPatientChange={patientSelection.handlePatientChange}
          isLoading={isLoading}
          isPatientLoading={patientData.isLoading}
          hasAnyPatientsWithAppointmentsToday={patientSelection.hasAnyPatientsWithAppointmentsToday}
          isLoadingAppointments={patientSelection.isLoadingAppointments}
        />

        <TestSelectionGrid
          selectedTests={testSelection.selectedTests}
          onTestSelection={testSelection.handleTestSelection}
          isLoading={isLoading}
        />

        <Box>
          <TextInput
            {...formState.register('otherTests')}
            label={config.form.labels.otherTests}
            placeholder={config.form.placeholders.otherTests}
            disabled={isLoading}
          />
        </Box>

        {formState.formState.errors.selectedTests && (
          <Alert color="red" mt="sm">
            {formState.formState.errors.selectedTests.message}
          </Alert>
        )}

        <TotalPriceDisplay selectedTests={testSelection.selectedTests} />

        <LabFormSubmitButton
          isFormEmpty={isFormEmpty}
          isLoading={isLoading}
        />
      </Stack>
    </form>
  );
};