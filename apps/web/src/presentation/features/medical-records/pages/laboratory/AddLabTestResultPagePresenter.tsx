import React from 'react';
import { MedicalClinicLayout } from '../../../../components/layout';
import { AddLabTestResultForm } from '../../components';
import { UrinalysisReportView } from '../../components/urinalysis-report/UrinalysisReportView';
import { BloodChemistryReportView } from '../../components/blood-chemistry-report/BloodChemistryReportView';
import { PageHeader } from '../../components/PageHeader';
import type { ADD_LAB_TEST_RESULT_PAGE_CONFIG } from '../../config/addLabTestResultPageConfig';

interface AddLabTestResultPagePresenterProps {
  config: typeof ADD_LAB_TEST_RESULT_PAGE_CONFIG;
  viewModel: {
    selectedLabTest?: {
      testCategory: string;
      enabledFields: string[];
    };
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

export const AddLabTestResultPagePresenter: React.FC<AddLabTestResultPagePresenterProps> = ({
  config,
  viewModel
}) => {
  const testCategory = viewModel.selectedLabTest?.testCategory?.toLowerCase();
  const isUrinalysis = testCategory === 'urinalysis';
  const isBloodChemistry = testCategory === 'bloodchemistry' || testCategory === 'blood chemistry';

  const formProps = {
    testType: viewModel.selectedLabTest?.testCategory,
    enabledFields: viewModel.selectedLabTest?.enabledFields || [],
    existingData: undefined,
    isLoadingData: viewModel.isLoading,
    submitButtonText: "Submit Result",
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
      ) : (
        <AddLabTestResultForm {...formProps} />
      )}
    </MedicalClinicLayout>
  );
};