import React from 'react';
import { LaboratoryTestsTablePresenter } from './LaboratoryTestsTablePresenter';
import { LabTest } from '../types';

interface LaboratoryTestsTableContainerProps {
  labTests: LabTest[];
  isLoading: boolean;
  errorMessage: string | null;
  onViewTest: (test: LabTest) => void;
  onEditTest: (test: LabTest) => void;
  onAddResult: (test: LabTest) => void;
  onCancelTest: (test: LabTest) => void;
}

export const LaboratoryTestsTableContainer: React.FC<LaboratoryTestsTableContainerProps> = (props) => {
  return <LaboratoryTestsTablePresenter {...props} />;
};