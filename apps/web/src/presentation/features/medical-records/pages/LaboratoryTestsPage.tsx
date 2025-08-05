import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Title, Group, Box, useMantineTheme, Button } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { DataTable, TableColumn } from '../../../components/common/DataTable';
import { TableActionButtons, ActionButtonConfig } from '../../../components/common/TableActionButtons';
import { MedicalClinicLayout } from '../../../components/layout';
import { LabTest } from '../types';

export const LaboratoryTestsPage: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const [patientInfo, setPatientInfo] = useState<{
    patientNumber: string;
    patientName: string;
  } | null>(null);

  // Mock data based on the image - this would come from API
  const mockLabTests: LabTest[] = [
    {
      id: '1',
      testName: 'BLOOD CHEMISTRY: FBS, BUN',
      date: 'Jun 30, 2025',
      status: 'Confirmed',
      results: 'Available'
    },
    {
      id: '2',
      testName: 'BLOOD CHEMISTRY: FBS',
      date: 'Jul 1, 2025',
      status: 'Pending'
    }
  ];

  // Mock patient info - this would come from API
  useEffect(() => {
    // In real implementation, fetch patient info based on patientId
    setPatientInfo({
      patientNumber: '2025-R3',
      patientName: 'Raj Va Riego'
    });
  }, [patientId]);

  const handleBackToLaboratory = () => {
    navigate('/laboratory');
  };

  const handleViewTest = (test: LabTest) => {
    console.log('View test:', test);
    // TODO: Implement view test functionality
  };

  const handleEditTest = (test: LabTest) => {
    console.log('Edit test:', test);
    // TODO: Implement edit test functionality
  };

  const handleAddResult = (test: LabTest) => {
    console.log('Add result for test:', test);
    // TODO: Implement add result functionality
  };

  const handleCancelTest = (test: LabTest) => {
    console.log('Cancel test:', test);
    // TODO: Implement cancel test functionality
  };

  const getStatusBadge = (status: LabTest['status']) => {
    const styles = {
      'Complete': {
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
  };

  const getActionButtons = (test: LabTest): ActionButtonConfig[] => {
    if (test.status === 'Confirmed' || test.status === 'Complete') {
      return [
        {
          icon: 'fas fa-eye',
          tooltip: 'View',
          onClick: () => handleViewTest(test)
        },
        {
          icon: 'fas fa-edit',
          tooltip: 'Edit',
          onClick: () => handleEditTest(test)
        }
      ];
    } else if (test.status === 'Pending') {
      return [
        {
          icon: 'fas fa-plus',
          tooltip: 'Add Result',
          onClick: () => handleAddResult(test)
        },
        {
          icon: 'fas fa-times',
          tooltip: 'Cancel',
          onClick: () => handleCancelTest(test)
        }
      ];
    }
    return [];
  };

  const getResultsContent = (test: LabTest) => {
    const actions = getActionButtons(test);
    if (actions.length > 0) {
      return <TableActionButtons actions={actions} />;
    }
    return null;
  };

  // Define columns for the DataTable
  const columns: TableColumn<LabTest>[] = [
    {
      key: 'testName',
      header: 'Lab Test',
      width: '35%',
      align: 'left',
      searchable: true
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
  ];

  return (
    <MedicalClinicLayout>
      {/* Header with Back Button and Patient Info */}
      <Box
        style={{
          marginBottom: '30px',
          paddingBottom: '20px',
          borderBottom: `2px solid ${theme.colors.gray[3]}`
        }}
      >
        <Group align="center" gap="lg" mb="md">
          <Button
            variant="filled"
            color="gray"
            leftSection={<IconArrowLeft size={16} />}
            onClick={handleBackToLaboratory}
            size="sm"
            style={{
              fontSize: '14px'
            }}
          >
            Back to Laboratory
          </Button>
          <Title
            order={2}
            style={{
              fontSize: '32px',
              fontWeight: 700,
              color: '#0F0F0F',
              margin: 0
            }}
          >
            Lab Tests
          </Title>
        </Group>
        
        {/* Patient Information */}
        {patientInfo && (
          <Box
            style={{
              backgroundColor: theme.colors.blue[0],
              padding: '15px 20px',
              borderRadius: '8px',
              marginTop: '15px'
            }}
          >
            <Group gap="xl">
              <div>
                <strong>Patient #:</strong> {patientInfo.patientNumber}
              </div>
              <div>
                <strong>Patient's Name:</strong> {patientInfo.patientName}
              </div>
            </Group>
          </Box>
        )}
      </Box>
      
      <DataTable
        data={mockLabTests}
        columns={columns}
        searchable={true}
        searchPlaceholder="Search lab tests by name, date, or status..."
        emptyStateMessage="No lab tests found"
        useViewportHeight={true}
        bottomPadding={90}
      />
    </MedicalClinicLayout>
  );
};
