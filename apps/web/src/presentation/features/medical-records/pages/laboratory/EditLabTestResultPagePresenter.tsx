import React from 'react';
import { MedicalClinicLayout } from '../../../../components/layout';
import { AddLabTestResultForm } from '../../components';
import { UrinalysisReportView } from '../../components/urinalysis-report/UrinalysisReportView';
import { BloodChemistryReportView } from '../../components/blood-chemistry-report/BloodChemistryReportView';
import { FecalysisReportView } from '../../components/fecalysis-report/FecalysisReportView';
import { PageHeader } from '../../components/PageHeader';
import type { EDIT_LAB_TEST_RESULT_PAGE_CONFIG } from '../../config/editLabTestResultPageConfig';

interface EditLabTestResultPagePresenterProps {
  config: typeof EDIT_LAB_TEST_RESULT_PAGE_CONFIG;
  viewModel: {
    selectedLabTest?: {
      testCategory: string;
      enabledFields: string[];
    };
    bloodChemistryData?: any;
    patientInfo?: {
      patientNumber: string;
      patientName: string;
      age: number;
      sex: string;
    };
    isLoading: boolean;
    isSubmitting: boolean;
    error: any;
    handleCancel: () => void;
    handleFormSubmit: any;
  };
}

export const EditLabTestResultPagePresenter: React.FC<EditLabTestResultPagePresenterProps> = ({
  config,
  viewModel
}) => {
  const testCategory = viewModel.selectedLabTest?.testCategory?.toLowerCase();
  const isUrinalysis = testCategory === 'urinalysis';
  const isBloodChemistry = testCategory === 'bloodchemistry' || testCategory === 'blood chemistry';
  const isFecalysis = testCategory === 'fecalysis';

  const formProps = {
    testType: viewModel.selectedLabTest?.testCategory,
    enabledFields: viewModel.selectedLabTest?.enabledFields || [],
    existingData: viewModel.bloodChemistryData,
    isLoadingData: viewModel.isLoading,
    submitButtonText: config.page.submitButtonText,
    patientData: {
      patientNumber: viewModel.patientInfo?.patientNumber || '',
      patientName: viewModel.patientInfo?.patientName || '',
      age: viewModel.patientInfo?.age || 0,
      sex: viewModel.patientInfo?.sex || ''
    },
    onSubmit: viewModel.handleFormSubmit,
    onCancel: viewModel.handleCancel,
    isSubmitting: viewModel.isSubmitting,
    error: viewModel.error
  };

  const reportProps = {
    patientData: {
      patientNumber: viewModel.patientInfo?.patientNumber || '',
      patientName: viewModel.patientInfo?.patientName || '',
      age: viewModel.patientInfo?.age || 0,
      sex: viewModel.patientInfo?.sex || '',
      dateRequested: new Date().toLocaleDateString()
    },
    labData: formProps.existingData,
    editable: true,
    enabledFields: formProps.enabledFields,
    onSubmit: formProps.onSubmit,
    onCancel: formProps.onCancel,
    isSubmitting: formProps.isSubmitting,
    error: formProps.error,
    submitButtonText: formProps.submitButtonText
  };

  return (
    <MedicalClinicLayout>
      <PageHeader
        title={config.page.title}
        backButtonText={config.page.backButtonText}
        onBackClick={viewModel.handleCancel}
      />

      {isUrinalysis ? (
        <UrinalysisReportView {...reportProps} />
      ) : isBloodChemistry ? (
        <BloodChemistryReportView {...reportProps} />
      ) : isFecalysis ? (
        <FecalysisReportView {...reportProps} />
      ) : (
        <AddLabTestResultForm {...formProps} />
      )}
    </MedicalClinicLayout>
  );
};