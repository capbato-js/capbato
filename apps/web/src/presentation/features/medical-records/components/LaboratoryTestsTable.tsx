import React from 'react';
import { LaboratoryTestsTableContainer } from './LaboratoryTestsTableContainer';
import { LabTest } from '../types';

interface LaboratoryTestsTableProps {
  labTests: LabTest[];
  isLoading: boolean;
  errorMessage: string | null;
  onViewTest: (test: LabTest) => void;
  onEditTest: (test: LabTest) => void;
  onAddResult: (test: LabTest) => void;
  onCancelTest: (test: LabTest) => void;
}

export const LaboratoryTestsTable: React.FC<LaboratoryTestsTableProps> = (props) => {
  return <LaboratoryTestsTableContainer {...props} />;
};
