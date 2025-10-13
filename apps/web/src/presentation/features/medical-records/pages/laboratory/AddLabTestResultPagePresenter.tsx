import React from 'react';
import { MedicalClinicLayout } from '../../../../components/layout';
import { AddLabTestResultForm } from '../../components';
import { UrinalysisReportView } from '../../components/urinalysis-report/UrinalysisReportView';
import { BloodChemistryReportView } from '../../components/blood-chemistry-report/BloodChemistryReportView';
import { FecalysisReportView } from '../../components/fecalysis-report/FecalysisReportView';
import { EcgReportView } from '../../components/ecg-report/EcgReportView';
import { SerologyReportView } from '../../components/serology-report/SerologyReportView';
import { DengueReportView } from '../../components/dengue-report/DengueReportView';
import { CoagulationReportView } from '../../components/coagulation-report/CoagulationReportView';
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
  const isFecalysis = testCategory === 'fecalysis';
  const isEcg = testCategory === 'ecg' || testCategory === 'electrocardiogram';
  const isSerology = testCategory === 'serology' || testCategory === 'serology & immunology';
  const isDengue = testCategory === 'dengue' || testCategory === 'dengue test' || testCategory === 'dengue duo';
  const isCoagulation = testCategory === 'coagulation' || testCategory === 'coagulation studies' || testCategory === 'pt ptt';

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
      ) : isFecalysis ? (
        <FecalysisReportView {...reportProps} />
      ) : isEcg ? (
        <EcgReportView {...reportProps} />
      ) : isSerology ? (
        <SerologyReportView {...reportProps} />
      ) : isDengue ? (
        <DengueReportView {...reportProps} />
      ) : isCoagulation ? (
        <CoagulationReportView {...reportProps} />
      ) : (
        <AddLabTestResultForm {...formProps} />
      )}
    </MedicalClinicLayout>
  );
};