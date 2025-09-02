import React from 'react';
import { DataTable, DataTableHeader } from '../../../components/common/DataTable';
import { MedicalClinicLayout } from '../../../components/layout';
import { LaboratoryResult } from '../types';
import { getLaboratoryTableColumns, getLaboratoryTableActions } from '../config/laboratoryTableConfig';

interface LaboratoryPagePresenterProps {
  laboratoryResults: LaboratoryResult[];
  loadingStates: {
    fetching: boolean;
  };
  errorStates: {
    fetchError: string | null;
  };
  onAddTest: () => void;
  onViewResult: (result: LaboratoryResult) => void;
}

export const LaboratoryPagePresenter: React.FC<LaboratoryPagePresenterProps> = ({
  laboratoryResults,
  loadingStates,
  errorStates,
  onAddTest,
  onViewResult,
}) => {
  const columns = getLaboratoryTableColumns();
  const actions = getLaboratoryTableActions(onViewResult);

  return (
    <MedicalClinicLayout>
      <DataTableHeader 
        title="Laboratory"
        onAddItem={onAddTest}
        addButtonText="Add Lab Test"
        addButtonIcon="fas fa-flask"
      />
      
      <DataTable
        data={laboratoryResults}
        columns={columns}
        actions={actions}
        onRowClick={onViewResult}
        cursor="pointer"
        searchable={true}
        searchPlaceholder="Search laboratory results by patient or status..."
        emptyStateMessage={loadingStates.fetching ? "Loading laboratory results..." : "No laboratory results found"}
        useViewportHeight={true}
        bottomPadding={90}
      />
      
      {errorStates.fetchError && (
        <div className="text-red-600 text-center mt-4">
          Error loading laboratory results: {errorStates.fetchError}
        </div>
      )}
    </MedicalClinicLayout>
  );
};