import React from 'react';
import { DataTable } from '../../../components/common/DataTable';
import { useLaboratoryTestsTable } from '../hooks/useLaboratoryTestsTable';
import { LabTest } from '../types';

interface LaboratoryTestsTablePresenterProps {
  labTests: LabTest[];
  isLoading: boolean;
  errorMessage: string | null;
  onViewTest: (test: LabTest) => void;
  onEditTest: (test: LabTest) => void;
  onAddResult: (test: LabTest) => void;
  onCancelTest: (test: LabTest) => void;
}

export const LaboratoryTestsTablePresenter: React.FC<LaboratoryTestsTablePresenterProps> = ({
  labTests,
  isLoading,
  errorMessage,
  onViewTest,
  onEditTest,
  onAddResult,
  onCancelTest
}) => {
  const { columns, handleRowClick } = useLaboratoryTestsTable({
    onViewTest,
    onEditTest,
    onAddResult,
    onCancelTest
  });

  return (
    <DataTable
      data={labTests}
      columns={columns}
      searchable={true}
      searchPlaceholder="Search lab tests by name, date, or status..."
      emptyStateMessage={errorMessage ? `Error: ${errorMessage}` : "No lab tests found"}
      useViewportHeight={true}
      bottomPadding={90}
      isLoading={isLoading}
      onRowClick={handleRowClick}
      cursor="pointer"
    />
  );
};