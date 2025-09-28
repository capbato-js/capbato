import React from 'react';
import { useViewLabTestResultViewModel } from '../../view-models/useViewLabTestResultViewModel';
import {
  isUrinalysisTest,
  isBloodChemistryTest,
  preparePatientData,
} from '../../utils/viewLabTestResultUtils';
import { ViewLabTestResultPagePresenter } from './ViewLabTestResultPagePresenter';

export const ViewLabTestResultPageContainer: React.FC = () => {
  const viewModel = useViewLabTestResultViewModel();

  // Prepare data for components
  const patientData = preparePatientData(viewModel.patientInfo);
  const isUrinalysis = isUrinalysisTest(viewModel.selectedLabTest?.testCategory);
  const isBloodChemistry = isBloodChemistryTest(viewModel.selectedLabTest?.testCategory);

  return (
    <ViewLabTestResultPagePresenter
      isUrinalysisTest={isUrinalysis}
      isBloodChemistryTest={isBloodChemistry}
      patientData={patientData}
      labData={viewModel.bloodChemistryData}
      selectedLabTest={viewModel.selectedLabTest}
      isLoading={viewModel.isLoading}
      error={viewModel.error}
      onBack={viewModel.handleBack}
    />
  );
};