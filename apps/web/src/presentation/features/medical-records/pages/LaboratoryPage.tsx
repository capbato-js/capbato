import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMantineTheme } from '@mantine/core';
import { Modal } from '../../../components/common';
import { DataTable, DataTableHeader, TableColumn, TableActions } from '../../../components/common/DataTable';
import { MedicalClinicLayout } from '../../../components/layout';
import { LaboratoryResult } from '../types';
import { AddLabTestForm } from '../components';
import { useLaboratoryStore } from '../../../../infrastructure/state/LaboratoryStore';
import { LabRequestDto, CreateLabRequestCommand } from '@nx-starter/application-shared';

// Convert LabRequestDto to LaboratoryResult for the legacy table
const convertLabRequestToLaboratoryResult = (labRequest: LabRequestDto): LaboratoryResult => {
  // selectedTests is a string array of test names
  const testType = labRequest.selectedTests.length > 0 
    ? labRequest.selectedTests.join(', ')
    : 'Laboratory Tests';

  // Use enhanced patient data when available
  let patientNumber = labRequest.patient.patientNumber || labRequest.patient.id;
  let patientName = labRequest.patient.name;
  
  // If we have firstName and lastName, construct full name
  if (labRequest.patient.firstName && labRequest.patient.lastName) {
    patientName = `${labRequest.patient.firstName} ${labRequest.patient.lastName}`.trim();
  }
  
  // If patientNumber is not available but we have a proper patient ID format, use it
  if (!labRequest.patient.patientNumber) {
    // Handle potential data swapping issue in legacy data
    // If patient.id contains letters/UUIDs and patient.name looks like a number, they might be swapped
    if (/^[a-f0-9-]{32,36}$/i.test(labRequest.patient.id) && /^[0-9-]+$/.test(labRequest.patient.name)) {
      // Data appears to be swapped
      patientNumber = labRequest.patient.name;
      if (!labRequest.patient.firstName && !labRequest.patient.lastName) {
        patientName = `Patient ${labRequest.patient.id.substring(0, 8)}...`; // Use part of ID as fallback name
      }
    }
  }

  // Normalize status to match LaboratoryResult type expectations
  let status: LaboratoryResult['status'] = 'Pending';
  switch (labRequest.status.toLowerCase()) {
    case 'pending':
      status = 'Pending';
      break;
    case 'complete':
    case 'completed':
      status = 'Completed';
      break;
    case 'cancelled':
      status = 'In Progress'; // Map to available status for now
      break;
    default:
      status = 'Pending';
  }

  return {
    id: labRequest.id || `lab-${Date.now()}`, // Lab request ID for table operations
    patientId: labRequest.patient.id, // Store the actual patient ID for navigation to tests page
    patientNumber,
    patientName,
    testType: testType,
    datePerformed: new Date(labRequest.requestDate).toLocaleDateString(),
    status,
    results: status === 'Completed' ? 'Results available' : undefined
  };
};

export const LaboratoryPage: React.FC = () => {
  // Modal state
  const [modalOpened, setModalOpened] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    createLabRequest,
    loadingStates, 
    errorStates 
  } = useLaboratoryStore();

  // Load laboratory results on component mount
  useEffect(() => {
    fetchAllLabRequests();
  }, [fetchAllLabRequests]);

  // Convert lab requests to legacy format
  const laboratoryResults: LaboratoryResult[] = Array.isArray(labRequests) 
    ? labRequests.map(convertLabRequestToLaboratoryResult)
    : [];

  const handleAddTest = () => {
    setModalOpened(true);
    setError(null);
  };

  const handleCloseModal = () => {
    setModalOpened(false);
    setError(null);
  };

  const handleLabTestSubmit = async (data: {
    patientName: string;
    ageGender: string;
    requestDate: string;
    selectedTests: string[];
    otherTests?: string;
  }) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔍 Form data received:', data);
      console.log('🔍 Selected tests:', data.selectedTests);
      
      // Use the real laboratory API through the store
      
      // Convert to CreateLabRequestCommand format
      const command: CreateLabRequestCommand = {
        patientId: `2025-${Date.now()}`, // Generate temporary ID
        patientName: data.patientName,
        ageGender: data.ageGender,
        requestDate: new Date(data.requestDate),
        others: data.otherTests || '',
        
        // Map selected tests to command fields using the correct test IDs
        cbcWithPlatelet: data.selectedTests.includes('cbc') ? 'Yes' : undefined,
        pregnancyTest: data.selectedTests.includes('pregnancy') ? 'Yes' : undefined,
        urinalysis: data.selectedTests.includes('urinalysis') ? 'Yes' : undefined,
        fecalysis: data.selectedTests.includes('fecalysis') ? 'Yes' : undefined,
        occultBloodTest: data.selectedTests.includes('occult_blood') ? 'Yes' : undefined,
        hepaBScreening: data.selectedTests.includes('hepa_b') ? 'Yes' : undefined,
        hepaAScreening: data.selectedTests.includes('hepa_a') ? 'Yes' : undefined,
        hepatitisProfile: data.selectedTests.includes('hepatitis_profile') ? 'Yes' : undefined,
        vdrlRpr: data.selectedTests.includes('vdrl_rpr') ? 'Yes' : undefined,
        dengueNs1: data.selectedTests.includes('dengue_ns1') ? 'Yes' : undefined,
        ca125CeaPsa: data.selectedTests.includes('ca_markers') ? 'Yes' : undefined,
        fbs: data.selectedTests.includes('fbs') ? 'Yes' : undefined,
        bun: data.selectedTests.includes('bun') ? 'Yes' : undefined,
        creatinine: data.selectedTests.includes('creatinine') ? 'Yes' : undefined,
        bloodUricAcid: data.selectedTests.includes('uric_acid') ? 'Yes' : undefined,
        lipidProfile: data.selectedTests.includes('lipid_profile') ? 'Yes' : undefined,
        sgot: data.selectedTests.includes('sgot') ? 'Yes' : undefined,
        sgpt: data.selectedTests.includes('sgpt') ? 'Yes' : undefined,
        alp: data.selectedTests.includes('alp') ? 'Yes' : undefined,
        sodiumNa: data.selectedTests.includes('sodium') ? 'Yes' : undefined,
        potassiumK: data.selectedTests.includes('potassium') ? 'Yes' : undefined,
        hbalc: data.selectedTests.includes('hba1c') ? 'Yes' : undefined,
        ecg: data.selectedTests.includes('ecg') ? 'Yes' : undefined,
        t3: data.selectedTests.includes('t3') ? 'Yes' : undefined,
        t4: data.selectedTests.includes('t4') ? 'Yes' : undefined,
        ft3: data.selectedTests.includes('ft3') ? 'Yes' : undefined,
        ft4: data.selectedTests.includes('ft4') ? 'Yes' : undefined,
        tsh: data.selectedTests.includes('tsh') ? 'Yes' : undefined,
      };
      
      console.log('🔍 Command to be sent:', command);
      
      const success = await createLabRequest(command);
      
      console.log('🔍 Create lab request returned:', success);
      
      if (success) {
        // Close modal on success
        setModalOpened(false);
        
        // Refresh the lab tests list
        await fetchAllLabRequests();
        
        console.log('Lab test request submitted successfully!');
      } else {
        throw new Error('Failed to submit lab test request');
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit lab test request');
    } finally {
      setIsLoading(false);
    }
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

      {/* Add Lab Test Modal */}
      <Modal
        opened={modalOpened}
        onClose={handleCloseModal}
        title=""
        size="xl"
        customStyles={{
          body: {
            padding: '10px 24px 24px', // Reduced top padding to prevent border overlap
          }
        }}
      >
        <AddLabTestForm
          onSubmit={handleLabTestSubmit}
          isLoading={isLoading}
          error={error}
        />
      </Modal>
    </MedicalClinicLayout>
  );
};
