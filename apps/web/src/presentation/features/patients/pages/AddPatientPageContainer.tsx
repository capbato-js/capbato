import React from 'react';
import { AddPatientPagePresenter } from './AddPatientPagePresenter';
import { useAddPatientFormViewModel } from '../view-models/useAddPatientFormViewModel';

export const AddPatientPageContainer: React.FC = () => {
  const viewModel = useAddPatientFormViewModel();

  return (
    <AddPatientPagePresenter
      onFormSubmit={viewModel.handleFormSubmit}
      onCancel={viewModel.handleCancel}
      isLoading={viewModel.isLoading}
      error={viewModel.error}
    />
  );
};