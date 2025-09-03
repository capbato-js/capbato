import React from 'react';
import { useEditLabTestResultViewModel } from '../view-models/useEditLabTestResultViewModel';
import { EditLabTestResultPagePresenter } from './EditLabTestResultPagePresenter';
import { EDIT_LAB_TEST_RESULT_PAGE_CONFIG } from '../config/editLabTestResultPageConfig';

export const EditLabTestResultPageContainer: React.FC = () => {
  const viewModel = useEditLabTestResultViewModel();

  return (
    <EditLabTestResultPagePresenter 
      config={EDIT_LAB_TEST_RESULT_PAGE_CONFIG}
      viewModel={viewModel}
    />
  );
};