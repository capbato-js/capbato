import React from 'react';
import { TableColumn } from '../../../components/common/DataTable';
import { TableActionButtons, ActionButtonConfig } from '../../../components/common/TableActionButtons';
import { TestStatusBadge } from '../components/TestStatusBadge';
import { formatTestDisplayName } from '../utils/laboratoryTestsUtils';
import { LabTest } from '../types';

export interface LaboratoryTestsTableHandlers {
  onViewTest: (test: LabTest) => void;
  onEditTest: (test: LabTest) => void;
  onAddResult: (test: LabTest) => void;
  onCancelTest: (test: LabTest) => void;
}

export const getActionButtonsConfig = (
  test: LabTest,
  handlers: LaboratoryTestsTableHandlers
): ActionButtonConfig[] => {
  if (test.status === 'Confirmed' || test.status === 'Completed') {
    return [
      {
        icon: 'fas fa-eye',
        tooltip: 'View Result',
        onClick: () => handlers.onViewTest(test)
      },
      {
        icon: 'fas fa-edit',
        tooltip: 'Update Result',
        onClick: () => handlers.onEditTest(test)
      }
    ];
  } else if (test.status === 'Pending') {
    return [
      {
        icon: 'fas fa-plus',
        tooltip: 'Add Result',
        onClick: () => handlers.onAddResult(test)
      },
      {
        icon: 'fas fa-times',
        tooltip: 'Cancel Lab Test',
        onClick: () => handlers.onCancelTest(test)
      }
    ];
  }
  return [];
};

export const createTableColumns = (handlers: LaboratoryTestsTableHandlers): TableColumn<LabTest>[] => [
  {
    key: 'testName',
    header: 'Lab Test',
    width: '35%',
    align: 'left',
    searchable: true,
    render: (_value: string | undefined, record: LabTest) => {
      return formatTestDisplayName(record);
    }
  },
  {
    key: 'date',
    header: 'Date',
    width: '20%',
    align: 'center',
    searchable: true
  },
  {
    key: 'status',
    header: 'Status',
    width: '20%',
    align: 'center',
    searchable: true,
    render: (value: LabTest['status']) => <TestStatusBadge status={value} />
  },
  {
    key: 'actions',
    header: 'Results',
    width: '25%',
    align: 'center',
    render: (_value: string | undefined, record: LabTest) => {
      const actions = getActionButtonsConfig(record, handlers);
      return actions.length > 0 ? <TableActionButtons actions={actions} /> : null;
    }
  }
];