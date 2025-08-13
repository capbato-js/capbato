import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMantineTheme } from '@mantine/core';
import { DataTable, DataTableHeader, TableColumn, TableActions } from '../../../components/common/DataTable';
import { MedicalClinicLayout } from '../../../components/layout';
import { LaboratoryResult } from '../types';
import { useLaboratoryStore } from '../../../../infrastructure/state/LaboratoryStore';

export const LaboratoryPage: React.FC = () => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const theme = useMantineTheme();
  const navigate = useNavigate();
  
  // Laboratory store
  const { 
    labRequests, 
    fetchAllLabRequests, 
    loadingStates, 
    errorStates 
  } = useLaboratoryStore();

  // Load laboratory results on component mount
  useEffect(() => {
    fetchAllLabRequests();
  }, [fetchAllLabRequests]);

  // Convert lab requests to legacy format and consolidate by patient
  const laboratoryResults: LaboratoryResult[] = React.useMemo(() => {
    if (!Array.isArray(labRequests)) return [];

    // Group lab requests by patient ID
    const patientGroups = labRequests.reduce((groups, labRequest) => {
      const patientId = labRequest.patient.id;
      if (!groups[patientId]) {
        groups[patientId] = [];
      }
      groups[patientId].push(labRequest);
      return groups;
    }, {} as Record<string, typeof labRequests>);

    // Convert each patient group to a single LaboratoryResult
    return Object.values(patientGroups).map(patientLabRequests => {
      const firstRequest = patientLabRequests[0];
      
      // Aggregate status: "Pending" if any test is pending, otherwise "Completed"
      const hasAnyPending = patientLabRequests.some(req => 
        req.status.toLowerCase() === 'pending'
      );
      const aggregatedStatus: LaboratoryResult['status'] = hasAnyPending ? 'Pending' : 'Completed';

      // Collect all test types for this patient
      const allTestTypes = patientLabRequests.flatMap(req => req.selectedTests).filter(Boolean);
      const uniqueTestTypes = [...new Set(allTestTypes)];
      const testType = uniqueTestTypes.length > 0 
        ? uniqueTestTypes.join(', ')
        : 'Laboratory Tests';

      // Use enhanced patient data when available
      let patientNumber = firstRequest.patient.patientNumber || firstRequest.patient.id;
      let patientName = firstRequest.patient.name;
      
      // If we have firstName and lastName, construct full name
      if (firstRequest.patient.firstName && firstRequest.patient.lastName) {
        patientName = `${firstRequest.patient.firstName} ${firstRequest.patient.lastName}`.trim();
      }
      
      // If patientNumber is not available but we have a proper patient ID format, use it
      if (!firstRequest.patient.patientNumber) {
        // Handle potential data swapping issue in legacy data
        if (/^[a-f0-9-]{32,36}$/i.test(firstRequest.patient.id) && /^[0-9-]+$/.test(firstRequest.patient.name)) {
          // Data appears to be swapped
          patientNumber = firstRequest.patient.name;
          if (!firstRequest.patient.firstName && !firstRequest.patient.lastName) {
            patientName = `Patient ${firstRequest.patient.id.substring(0, 8)}...`; // Use part of ID as fallback name
          }
        }
      }

      return {
        id: firstRequest.patient.id, // Use patient ID as the unique identifier
        patientId: firstRequest.patient.id, // Store the actual patient ID for navigation to tests page
        patientNumber,
        patientName,
        testType: testType,
        datePerformed: new Date(firstRequest.requestDate).toLocaleDateString(),
        status: aggregatedStatus,
        results: aggregatedStatus === 'Completed' ? 'Results available' : undefined
      };
    });
  }, [labRequests]);

  const handleAddTest = () => {
    navigate('/laboratory/new');
  };

  const handleViewResult = (result: LaboratoryResult) => {
    // Navigate to laboratory tests page with patient ID (not lab request ID)
    navigate(`/laboratory/tests/${result.patientId}`);
  };

  const getStatusBadge = (status: LaboratoryResult['status']) => {
    const styles = {
      'Pending': {
        background: theme.colors.orange[1],
        color: theme.colors.orange[9],
        padding: '5px 10px',
        borderRadius: '5px',
        fontWeight: 600,
        fontSize: '16px',
        display: 'inline-block'
      },
      'Completed': {
        background: theme.colors.green[1],
        color: theme.colors.green[9],
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

  // Define columns for the DataTable - matching legacy structure
  const columns: TableColumn<LaboratoryResult>[] = [
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
      render: (value: LaboratoryResult['status']) => getStatusBadge(value)
    }
  ];

  // Define actions for the DataTable
  const actions: TableActions<LaboratoryResult> = {
    buttons: [
      {
        icon: 'fas fa-eye',
        tooltip: 'View Lab Tests',
        onClick: handleViewResult
      }
    ]
  };

  return (
    <MedicalClinicLayout>
      <DataTableHeader 
        title="Laboratory"
        onAddItem={handleAddTest}
        addButtonText="Add Lab Test"
        addButtonIcon="fas fa-flask"
      />
      
      <DataTable
        data={laboratoryResults}
        columns={columns}
        actions={actions}
        searchable={true}
        searchPlaceholder="Search laboratory results by patient or status..."
        emptyStateMessage={loadingStates.fetching ? "Loading laboratory results..." : "No laboratory results found"}
        useViewportHeight={true}
        bottomPadding={90}
      />
      
      {/* Display error if any */}
      {errorStates.fetchError && (
        <div className="text-red-600 text-center mt-4">
          Error loading laboratory results: {errorStates.fetchError}
        </div>
      )}
    </MedicalClinicLayout>
  );
};
