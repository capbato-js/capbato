import React from 'react';
import { useViewLabTestResultViewModel } from '../../view-models/useViewLabTestResultViewModel';
import {
  isUrinalysisTest,
  isBloodChemistryTest,
  isFecalysisTest,
  isEcgTest,
  isSerologyTest,
  isDengueTest,
  isCoagulationTest,
  isHematologyTest,
  preparePatientData,
} from '../../utils/viewLabTestResultUtils';
import { ViewLabTestResultPagePresenter } from './ViewLabTestResultPagePresenter';

export const ViewLabTestResultPageContainer: React.FC = () => {
  const viewModel = useViewLabTestResultViewModel();

  // Prepare data for components
  const patientData = preparePatientData(viewModel.patientInfo);
  const isUrinalysis = isUrinalysisTest(viewModel.selectedLabTest?.testCategory);
  const isBloodChemistry = isBloodChemistryTest(viewModel.selectedLabTest?.testCategory);
  const isFecalysis = isFecalysisTest(viewModel.selectedLabTest?.testCategory);
  const isEcg = isEcgTest(viewModel.selectedLabTest?.testCategory);
  const isSerology = isSerologyTest(viewModel.selectedLabTest?.testCategory);
  const isDengue = isDengueTest(viewModel.selectedLabTest?.testCategory);
  const isCoagulation = isCoagulationTest(viewModel.selectedLabTest?.testCategory);
  const isHematology = isHematologyTest(viewModel.selectedLabTest?.testCategory);

  return (
    <ViewLabTestResultPagePresenter
      isUrinalysisTest={isUrinalysis}
      isBloodChemistryTest={isBloodChemistry}
      isFecalysisTest={isFecalysis}
      isEcgTest={isEcg}
      isSerologyTest={isSerology}
      isDengueTest={isDengue}
      isCoagulationTest={isCoagulation}
      isHematologyTest={isHematology}
      patientData={patientData}
      labData={viewModel.bloodChemistryData}
      selectedLabTest={viewModel.selectedLabTest}
      isLoading={viewModel.isLoading}
      error={viewModel.error}
      onBack={viewModel.handleBack}
    />
  );
};