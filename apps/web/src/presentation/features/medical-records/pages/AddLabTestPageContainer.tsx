import React from 'react';
import { useAddLabTestFormViewModel } from '../view-models/useAddLabTestFormViewModel';
import { AddLabTestPagePresenter } from './AddLabTestPagePresenter';
import { ADD_LAB_TEST_PAGE_CONFIG } from '../config/addLabTestPageConfig';

export const AddLabTestPageContainer: React.FC = () => {
  const viewModel = useAddLabTestFormViewModel();

  return (
    <AddLabTestPagePresenter 
      config={ADD_LAB_TEST_PAGE_CONFIG}
      viewModel={viewModel}
    />
  );
};