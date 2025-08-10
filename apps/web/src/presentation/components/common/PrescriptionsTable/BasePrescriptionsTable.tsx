import React from 'react';
import { DataTable, TableColumn } from '../DataTable';
import { TableActionButtons, ActionButtonConfig } from '../TableActionButtons';
import { useMantineTheme } from '@mantine/core';

export interface BasePrescription {
  id: string;
  patientNumber?: string;
  patientName?: string;
  medicationName: string;
  dosage: string;
  instructions: string;
  frequency: string;
  duration: string;
  prescribedDate: string;
  expiryDate?: string;
  doctor?: string;
  status?: 'active' | 'completed' | 'discontinued' | 'on-hold'; // Made optional to handle undefined cases
}

export interface PrescriptionsTableConfig {
  showActions?: boolean;
  showPatientInfo?: boolean;
  showDoctorColumn?: boolean;
  compactMode?: boolean;
  useViewportHeight?: boolean;
  bottomPadding?: number;
  emptyStateMessage?: string;
}

export interface PrescriptionsTableCallbacks {
  onModifyPrescription?: (prescriptionId: string) => void;
  onDiscontinuePrescription?: (prescriptionId: string) => void;
  onCompletePrescription?: (prescriptionId: string) => void;
  onReactivatePrescription?: (prescriptionId: string) => void;
}

interface BasePrescriptionsTableProps {
  prescriptions: BasePrescription[];
  config?: PrescriptionsTableConfig;
  callbacks?: PrescriptionsTableCallbacks;
}

export const BasePrescriptionsTable: React.FC<BasePrescriptionsTableProps> = ({
  prescriptions,
  config = {},
  callbacks = {},
}) => {
  const theme = useMantineTheme();

  const {
    showActions = true,
    showPatientInfo = false,
    showDoctorColumn = false,
    compactMode = false,
    useViewportHeight = false,
    bottomPadding = 90,
    emptyStateMessage = "No prescriptions found"
  } = config;

  const {
    onModifyPrescription,
    onDiscontinuePrescription,
    onCompletePrescription,
    onReactivatePrescription,
  } = callbacks;

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const getStatusBadge = (status: BasePrescription['status']) => {
    // Handle undefined/null status
    if (!status) {
      return (
        <span style={{
          background: theme.colors.gray[1],
          color: theme.colors.gray[9],
          padding: compactMode ? '3px 8px' : '5px 10px',
          borderRadius: '5px',
          fontWeight: 'bold',
          display: 'inline-block',
          fontSize: compactMode ? '12px' : '14px'
        }}>
          Unknown
        </span>
      );
    }

    const styles = {
      active: {
        background: theme.colors.green[1],
        color: theme.colors.green[9],
        padding: compactMode ? '3px 8px' : '5px 10px',
        borderRadius: '5px',
        fontWeight: 'bold',
        display: 'inline-block',
        fontSize: compactMode ? '12px' : '14px'
      },
      completed: {
        background: theme.colors.tableBlue[1],
        color: theme.colors.tableBlue[9], 
        padding: compactMode ? '3px 8px' : '5px 10px',
        borderRadius: '5px',
        fontWeight: 'bold',
        display: 'inline-block',
        fontSize: compactMode ? '12px' : '14px'
      },
      discontinued: {
        background: theme.colors.red[1],
        color: theme.colors.red[9],
        padding: compactMode ? '3px 8px' : '5px 10px',
        borderRadius: '5px',
        fontWeight: 'bold',
        display: 'inline-block',
        fontSize: compactMode ? '12px' : '14px'
      },
      'on-hold': {
        background: theme.colors.yellow[1],
        color: theme.colors.yellow[9],
        padding: compactMode ? '3px 8px' : '5px 10px',
        borderRadius: '5px',
        fontWeight: 'bold',
        display: 'inline-block',
        fontSize: compactMode ? '12px' : '14px'
      }
    };

    return (
      <span style={styles[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getActionButtons = (prescription: BasePrescription): ActionButtonConfig[] => {
    const buttons: ActionButtonConfig[] = [];

    if (onModifyPrescription) {
      buttons.push({
        icon: 'fas fa-edit',
        tooltip: 'Edit Prescription',
        onClick: () => onModifyPrescription(prescription.id),
      });
    }

    // Status-specific actions
    if (prescription.status === 'active') {
      if (onCompletePrescription) {
        buttons.push({
          icon: 'fas fa-check',
          tooltip: 'Complete Prescription',
          onClick: () => onCompletePrescription(prescription.id),
        });
      }
      if (onDiscontinuePrescription) {
        buttons.push({
          icon: 'fas fa-times',
          tooltip: 'Discontinue Prescription',
          onClick: () => onDiscontinuePrescription(prescription.id),
        });
      }
    } else if ((prescription.status === 'discontinued' || prescription.status === 'on-hold') && onReactivatePrescription) {
      buttons.push({
        icon: 'fas fa-redo',
        tooltip: 'Reactivate Prescription',
        onClick: () => onReactivatePrescription(prescription.id),
      });
    }

    return buttons;
  };

  const buildColumns = (): TableColumn<BasePrescription>[] => {
    const columns: TableColumn<BasePrescription>[] = [];

    // Patient info columns (only if enabled)
    if (showPatientInfo) {
      columns.push(
        {
          key: 'patientNumber',
          header: 'Patient #',
          render: (value) => value || 'N/A',
          width: compactMode ? '80px' : '100px',
          align: 'center'
        },
        {
          key: 'patientName',
          header: 'Patient Name',
          render: (value) => value || 'N/A',
          width: compactMode ? '120px' : '150px'
        }
      );
    }

    // Core prescription columns
    columns.push(
      {
        key: 'medicationName',
        header: 'Medication',
        render: (value) => value,
        width: compactMode ? '120px' : '150px'
      },
      {
        key: 'dosage',
        header: 'Dosage',
        render: (value) => value,
        width: compactMode ? '80px' : '100px',
        align: 'center'
      },
      {
        key: 'frequency',
        header: 'Frequency',
        render: (value) => value,
        width: compactMode ? '100px' : '120px',
        align: 'center'
      },
      {
        key: 'duration',
        header: 'Duration',
        render: (value) => value,
        width: compactMode ? '80px' : '100px',
        align: 'center'
      },
      {
        key: 'prescribedDate',
        header: 'Prescribed',
        render: (value) => formatDate(value),
        width: compactMode ? '90px' : '110px',
        align: 'center'
      }
    );

    // Optional expiry date column
    if (prescriptions.some(p => p.expiryDate)) {
      columns.push({
        key: 'expiryDate',
        header: 'Expires',
        render: (value) => formatDate(value),
        width: compactMode ? '90px' : '110px',
        align: 'center'
      });
    }

    // Optional doctor column
    if (showDoctorColumn) {
      columns.push({
        key: 'doctor',
        header: 'Doctor',
        render: (value) => value || 'N/A',
        width: compactMode ? '100px' : '120px'
      });
    }

    // Status column
    columns.push({
      key: 'status',
      header: 'Status',
      render: (value) => getStatusBadge(value),
      width: compactMode ? '90px' : '110px',
      align: 'center'
    });

    // Actions column
    if (showActions) {
      columns.push({
        key: 'actions',
        header: 'Actions',
        render: (_, prescription) => (
          <TableActionButtons
            actions={getActionButtons(prescription)}
          />
        ),
        width: compactMode ? '120px' : '140px',
        align: 'center'
      });
    }

    return columns;
  };

  return (
    <DataTable
      data={prescriptions}
      columns={buildColumns()}
      emptyStateMessage={emptyStateMessage}
      useViewportHeight={useViewportHeight}
      bottomPadding={bottomPadding}
    />
  );
};