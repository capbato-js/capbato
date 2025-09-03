import React from 'react';
import { useAddLabTestResultViewModel } from '../view-models/useAddLabTestResultViewModel';
import { AddLabTestResultPagePresenter } from './AddLabTestResultPagePresenter';
import { ADD_LAB_TEST_RESULT_PAGE_CONFIG } from '../config/addLabTestResultPageConfig';

export const AddLabTestResultPageContainer: React.FC = () => {
  const viewModel = useAddLabTestResultViewModel();

  return (
    <AddLabTestResultPagePresenter 
      config={ADD_LAB_TEST_RESULT_PAGE_CONFIG}
      viewModel={viewModel}
    />
  );
};