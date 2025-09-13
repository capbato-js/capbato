import React from 'react';
import { Alert, Stack, Grid } from '@mantine/core';
import { PatientInformationSection } from './PatientInformationSection';
import { GuardianInformationSection } from './GuardianInformationSection';
import { PatientFormActions } from './PatientFormActions';
import { FORM_STYLES } from '../config/patientFormConfig';
import { PatientFormData } from '../hooks/usePatientFormState';
import { patientFormTestIds } from '@nx-starter/utils-core';
import type { CreatePatientCommand, UpdatePatientCommand } from '@nx-starter/application-shared';

interface PatientFormPresenterProps {
  mode: 'create' | 'update';
  initialData?: Partial<PatientFormData>;
  onCancel: () => void;
  isLoading: boolean;
  generalError: string | null;
  form: {
    register: any;
    handleSubmit: any;
    control: any;
    watch: any;
    errors: any;
  };
  handlers: {
    patientAddressSelector: any;
    guardianAddressSelector: any;
    handlePatientProvinceChange: (value: string | null) => void;
    handlePatientCityChange: (value: string | null) => void;
    handlePatientBarangayChange: (value: string | null) => void;
    handleGuardianProvinceChange: (value: string | null) => void;
    handleGuardianCityChange: (value: string | null) => void;
    handleGuardianBarangayChange: (value: string | null) => void;
    handleNameFieldBlur: (fieldName: any) => void;
    handleFieldBlur: (fieldName: string) => void;
    handleFieldChange: (fieldName: string) => void;
  };
  submission: {
    handleDirectSubmit: () => Promise<boolean>;
    handleFormSubmit: (data: CreatePatientCommand | UpdatePatientCommand) => Promise<boolean>;
  };
  formState: {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    gender?: string;
    contactNumber?: string;
  };
  isFormEmpty: boolean;
}

export const PatientFormPresenter: React.FC<PatientFormPresenterProps> = ({
  generalError,
  form,
  handlers,
  submission,
  onCancel,
  isLoading,
  formState,
  isFormEmpty
}) => {
  return (
    <form onSubmit={form.handleSubmit(submission.handleFormSubmit)} noValidate data-testid={patientFormTestIds.form}>
      <Stack gap="lg">
        {generalError && (
          <Alert color="red" style={FORM_STYLES.alertStyle}>
            {generalError}
          </Alert>
        )}

        <Grid>
          {/* Patient's Information - Left Column */}
          <Grid.Col span={6}>
            <PatientInformationSection
              control={form.control}
              register={form.register}
              watch={form.watch}
              errors={form.errors}
              isLoading={isLoading}
              patientAddressSelector={handlers.patientAddressSelector}
              handlePatientProvinceChange={handlers.handlePatientProvinceChange}
              handlePatientCityChange={handlers.handlePatientCityChange}
              handlePatientBarangayChange={handlers.handlePatientBarangayChange}
              handleNameFieldBlur={handlers.handleNameFieldBlur}
              handleFieldBlur={handlers.handleFieldBlur}
              handleFieldChange={handlers.handleFieldChange}
            />
          </Grid.Col>

          {/* Guardian Information - Right Column */}
          <Grid.Col span={6}>
            <GuardianInformationSection
              control={form.control}
              register={form.register}
              errors={form.errors}
              isLoading={isLoading}
              guardianAddressSelector={handlers.guardianAddressSelector}
              handleGuardianProvinceChange={handlers.handleGuardianProvinceChange}
              handleGuardianCityChange={handlers.handleGuardianCityChange}
              handleGuardianBarangayChange={handlers.handleGuardianBarangayChange}
              handleNameFieldBlur={handlers.handleNameFieldBlur}
              handleFieldBlur={handlers.handleFieldBlur}
              handleFieldChange={handlers.handleFieldChange}
            />
          </Grid.Col>
        </Grid>

        {/* Form Actions */}
        <PatientFormActions
          onCancel={onCancel}
          onSubmit={submission.handleDirectSubmit}
          isLoading={isLoading}
          isFormEmpty={isFormEmpty}
        />
      </Stack>
    </form>
  );
};