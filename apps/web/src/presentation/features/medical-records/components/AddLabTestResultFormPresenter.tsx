import React from 'react'
import { Box, Stack, Divider } from '@mantine/core'
import { LabResultFormHeader } from './LabResultFormHeader'
import { PatientInfoSection } from './PatientInfoSection'
import { LabTestFieldsGrid } from './LabTestFieldsGrid'
import { ErrorDisplay } from './ErrorDisplay'
import { SignatureSection } from './SignatureSection'
import { FormActionButtons } from './FormActionButtons'
import { getContainerStyles } from '../utils/labTestResultFormUtils'
import type { ADD_LAB_TEST_RESULT_FORM_CONFIG } from '../config/addLabTestResultFormConfig'

interface AddLabTestResultFormPresenterProps {
  config: typeof ADD_LAB_TEST_RESULT_FORM_CONFIG
  testConfig: { title: string }
  leftFields: any[]
  rightFields: any[]
  formMethods: any
  handleFormSubmit: (data: any) => void
  enabledFields?: string[]
  viewMode: boolean
  isLoadingData: boolean
  submitButtonText: string
  patientData?: any
  onCancel?: () => void
  isSubmitting: boolean
  error: string | null
}

export const AddLabTestResultFormPresenter: React.FC<
  AddLabTestResultFormPresenterProps
> = ({
  config,
  testConfig,
  leftFields,
  rightFields,
  formMethods,
  handleFormSubmit,
  enabledFields,
  viewMode,
  isLoadingData,
  submitButtonText,
  patientData,
  onCancel,
  isSubmitting,
  error,
}) => {
  return (
    <Box p="sm" data-id="add-lab" style={getContainerStyles()}>
      <form onSubmit={formMethods.handleSubmit(handleFormSubmit)}>
        <Stack gap="sm">
          <LabResultFormHeader
            clinicName={config.clinic.name}
            address={config.clinic.address}
            phone={config.clinic.phone}
            license={config.clinic.license}
            testTitle={testConfig.title}
            isLoadingData={isLoadingData}
          />

          <PatientInfoSection
            patientData={patientData}
            isLoadingData={isLoadingData}
          />

          <LabTestFieldsGrid
            leftFields={leftFields}
            rightFields={rightFields}
            register={formMethods.register}
            control={formMethods.control}
            enabledFields={enabledFields}
            viewMode={viewMode}
            isLoadingData={isLoadingData}
          />

          <Divider />

          <ErrorDisplay error={error} />

          <SignatureSection
            technologist={config.signatures.technologist}
            pathologist={config.signatures.pathologist}
          />

          <FormActionButtons
            viewMode={viewMode}
            isSubmitting={isSubmitting}
            submitButtonText={submitButtonText}
            onCancel={onCancel}
          />
        </Stack>
      </form>
    </Box>
  )
}
