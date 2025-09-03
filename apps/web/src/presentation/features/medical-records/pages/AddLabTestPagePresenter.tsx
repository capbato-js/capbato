import React from 'react';
import { MedicalClinicLayout } from '../../../components/layout';
import { AddLabTestForm } from '../components';
import { PageHeader } from '../components/PageHeader';
import type { ADD_LAB_TEST_PAGE_CONFIG } from '../config/addLabTestPageConfig';

interface AddLabTestPagePresenterProps {
  config: typeof ADD_LAB_TEST_PAGE_CONFIG;
  viewModel: {
    handleCancel: () => void;
    handleFormSubmit: any;
    isLoading: boolean;
    error: any;
  };
}

export const AddLabTestPagePresenter: React.FC<AddLabTestPagePresenterProps> = ({ 
  config, 
  viewModel 
}) => {
  return (
    <MedicalClinicLayout>
      <PageHeader
        title={config.page.title}
        backButtonText={config.page.backButtonText}
        onBackClick={viewModel.handleCancel}
      />

      <AddLabTestForm
        onSubmit={viewModel.handleFormSubmit}
        isLoading={viewModel.isLoading}
        error={viewModel.error}
      />
    </MedicalClinicLayout>
  );
};