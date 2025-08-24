import React, { useMemo, useCallback } from 'react';
import { useMantineTheme } from '@mantine/core';
import { DataTable, TableColumn } from '../../../components/common/DataTable';
import { TableActionButtons, ActionButtonConfig } from '../../../components/common/TableActionButtons';
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

export const LaboratoryTestsTable: React.FC<LaboratoryTestsTableProps> = ({
  labTests,
  isLoading,
  errorMessage,
  onViewTest,
  onEditTest,
  onAddResult,
  onCancelTest
}) => {
  const theme = useMantineTheme();

  const formatTestDisplayName = useCallback((test: LabTest): string => {
    console.log('🧪 formatTestDisplayName called with test:', {
      id: test.id,
      testName: test.testName,
      testCategory: test.testCategory,
      tests: test.tests,
      testDisplayNames: test.testDisplayNames
    });

    // Priority 1: Use testName if available (already formatted from API)
    if (test.testName && test.testName.trim() !== '') {
      console.log('✅ Using testName:', test.testName);
      return test.testName;
    }
    
    // Priority 2: Use testDisplayNames if available, otherwise fall back to tests
    if (test.testDisplayNames && test.testDisplayNames.length > 0) {
      const categoryDisplayName = test.testCategory?.replace('_', ' ') || 'Test';
      const result = `${categoryDisplayName}: ${test.testDisplayNames.join(', ')}`;
      console.log('✅ Using testDisplayNames:', result);
      return result;
    }
    
    // Priority 3: Construct from testCategory and tests array
    if (test.tests && test.tests.length > 0) {
      const categoryDisplayName = test.testCategory?.replace('_', ' ') || 'Test';
      const result = `${categoryDisplayName}: ${test.tests.join(', ')}`;
      console.log('✅ Using tests array:', result);
      return result;
    }
    
    // Final fallback
    const result = test.testCategory?.replace('_', ' ') || 'Test: N/A';
    console.log('⚠️ Using final fallback:', result);
    return result;
  }, []);  const getStatusBadge = useCallback((status: LabTest['status']) => {
    const styles = {
      'Completed': {
        background: theme.colors.green[1],
        color: theme.colors.green[9],
        padding: '5px 10px',
        borderRadius: '5px',
        fontWeight: 600,
        fontSize: '16px',
        display: 'inline-block'
      },
      'Confirmed': {
        background: theme.colors.green[1],
        color: theme.colors.green[9],
        padding: '5px 10px',
        borderRadius: '5px',
        fontWeight: 600,
        fontSize: '16px',
        display: 'inline-block'
      },
      'Pending': {
        background: theme.colors.orange[1],
        color: theme.colors.orange[9],
        padding: '5px 10px',
        borderRadius: '5px',
        fontWeight: 600,
        fontSize: '16px',
        display: 'inline-block'
      },
      'In Progress': {
        background: theme.colors.blue[1],
        color: theme.colors.blue[9],
        padding: '5px 10px',
        borderRadius: '5px',
        fontWeight: 600,
        fontSize: '16px',
        display: 'inline-block'
      },
      'Cancelled': {
        background: theme.colors.red[1],
        color: theme.colors.red[9],
        padding: '5px 10px',
        borderRadius: '5px',
        fontWeight: 600,
        fontSize: '16px',
        display: 'inline-block'
      }
    };

    const defaultStyle = {
      background: theme.colors.gray[1],
      color: theme.colors.gray[9],
      padding: '5px 10px',
      borderRadius: '5px',
      fontWeight: 600,
      fontSize: '16px',
      display: 'inline-block'
    };

    return (
      <span style={styles[status] || defaultStyle}>
        {status}
      </span>
    );
  }, [theme]);

  const getActionButtons = useCallback((test: LabTest): ActionButtonConfig[] => {
    if (test.status === 'Confirmed' || test.status === 'Completed') {
      return [
        {
          icon: 'fas fa-eye',
          tooltip: 'View Result',
          onClick: () => onViewTest(test)
        },
        {
          icon: 'fas fa-edit',
          tooltip: 'Update Result',
          onClick: () => onEditTest(test)
        }
      ];
    } else if (test.status === 'Pending') {
      return [
        {
          icon: 'fas fa-plus',
          tooltip: 'Add Result',
          onClick: () => onAddResult(test)
        },
        {
          icon: 'fas fa-times',
          tooltip: 'Cancel Lab Test',
          onClick: () => onCancelTest(test)
        }
      ];
    }
    return [];
  }, [onViewTest, onEditTest, onAddResult, onCancelTest]);

  const getResultsContent = useCallback((test: LabTest) => {
    const actions = getActionButtons(test);
    if (actions.length > 0) {
      return <TableActionButtons actions={actions} />;
    }
    return null;
  }, [getActionButtons]);

  // Define columns for the DataTable - memoized to prevent infinite re-renders
  const columns: TableColumn<LabTest>[] = useMemo(() => [
    {
      key: 'testName',
      header: 'Lab Test',
      width: '35%',
      align: 'left',
      searchable: true,
      render: (_value: string | undefined, record: LabTest) => {
        console.log('📊 Table render called for record:', record);
        const result = formatTestDisplayName(record);
        console.log('📊 Table render result:', result);
        return result;
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
      render: (value: LabTest['status']) => getStatusBadge(value)
    },
    {
      key: 'actions',
      header: 'Results',
      width: '25%',
      align: 'center',
      render: (_value: string | undefined, record: LabTest) => getResultsContent(record)
    }
  ], [formatTestDisplayName, getStatusBadge, getResultsContent]);

  const handleRowClick = useCallback((test: LabTest) => {
    // Check if the test has results to view, otherwise show add result
    if (test.status === 'Confirmed' || test.status === 'Completed') {
      onViewTest(test);
    } else if (test.status === 'Pending') {
      onAddResult(test);
    }
    // Don't do anything for cancelled tests
  }, [onViewTest, onAddResult]);

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
