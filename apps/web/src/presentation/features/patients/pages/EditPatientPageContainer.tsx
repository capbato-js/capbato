import React from 'react';
import { EditPatientPagePresenter } from './EditPatientPagePresenter';
import { useEditPatientFormViewModel } from '../view-models/useEditPatientFormViewModel';

export const EditPatientPageContainer: React.FC = () => {
  const viewModel = useEditPatientFormViewModel();

  return (
    <EditPatientPagePresenter
      isLoadingPatient={viewModel.isLoadingPatient}
      patientNotFound={viewModel.patientNotFound}
      initialData={viewModel.initialData}
      onFormSubmit={viewModel.handleFormSubmit}
      onCancel={viewModel.handleCancel}
      isLoading={viewModel.isLoading}
      error={viewModel.error}
    />
  );
};