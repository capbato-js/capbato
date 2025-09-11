import React from 'react';
import { TableColumn, TableActions } from '../../../components/common/DataTable';
import { LaboratoryResult } from '../types';
import { LaboratoryStatusBadge } from '../components/LaboratoryStatusBadge';

export const getLaboratoryTableColumns = (): TableColumn<LaboratoryResult>[] => [
  {
    key: 'patientNumber',
    header: 'Patient #',
    width: '30%',
    align: 'center',
    searchable: true
  },
  {
    key: 'patientName',
    header: 'Patient\'s Name',
    width: '45%',
    align: 'left',
    searchable: true
  },
  {
    key: 'status',
    header: 'Status',
    width: '25%',
    align: 'center',
    searchable: true,
    render: (value: LaboratoryResult['status']) => <LaboratoryStatusBadge status={value} />
  }
];

export const getLaboratoryTableActions = (
  onViewResult: (result: LaboratoryResult) => void
): TableActions<LaboratoryResult> => ({
  buttons: [
    {
      icon: 'fas fa-eye',
      tooltip: 'View Lab Tests',
      onClick: onViewResult
    }
  ]
});