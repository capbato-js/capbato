import { useMemo, useCallback } from 'react';
import { TableColumn } from '../../../components/common/DataTable';
import { createTableColumns, LaboratoryTestsTableHandlers } from '../config/laboratoryTestsTableConfig';
import { getRowClickAction } from '../utils/laboratoryTestsUtils';
import { LabTest } from '../types';

interface UseLaboratoryTestsTableProps {
  onViewTest: (test: LabTest) => void;
  onEditTest: (test: LabTest) => void;
  onAddResult: (test: LabTest) => void;
  onCancelTest: (test: LabTest) => void;
}

export const useLaboratoryTestsTable = ({
  onViewTest,
  onEditTest,
  onAddResult,
  onCancelTest
}: UseLaboratoryTestsTableProps) => {
  const handlers: LaboratoryTestsTableHandlers = {
    onViewTest,
    onEditTest,
    onAddResult,
    onCancelTest
  };

  const columns: TableColumn<LabTest>[] = useMemo(() => 
    createTableColumns(handlers), 
    [handlers.onViewTest, handlers.onEditTest, handlers.onAddResult, handlers.onCancelTest]
  );

  const handleRowClick = useCallback((test: LabTest) => {
    getRowClickAction(test, onViewTest, onAddResult);
  }, [onViewTest, onAddResult]);

  return {
    columns,
    handleRowClick
  };
};