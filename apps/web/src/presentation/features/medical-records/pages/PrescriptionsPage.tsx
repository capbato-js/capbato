import React, { useState, useEffect } from 'react';
import { DataTable, DataTableHeader, TableColumn, TableActions } from '../../../components/common/DataTable';
import { MedicalClinicLayout } from '../../../components/layout';
import { Prescription } from '../types';
import { AddPrescriptionModal } from '../components/AddPrescriptionModal';
import { ViewPrescriptionModal } from '../components/ViewPrescriptionModal';
import { DeletePrescriptionModal } from '../components/DeletePrescriptionModal';
import { usePrescriptionListViewModel } from '../../prescriptions/view-models/usePrescriptionListViewModel';
import { usePrescriptionStore } from '../../../../infrastructure/state/PrescriptionStore';

// Type for the display prescription with grouped medications
type DisplayPrescription = {
  id: string;
  patientNumber: string;
  patientName: string;
  patientId: string;
  doctor: string;
  doctorId: string;
  datePrescribed: string;
  medications: string;
  notes: string | undefined;
};

export const PrescriptionsPage: React.FC = () => {
  const prescriptionListViewModel = usePrescriptionListViewModel();
  const prescriptionStore = usePrescriptionStore();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleAddPrescription = () => {
    setSelectedPrescription(null);
    setAddModalOpen(true);
  };

  const handleViewPrescription = (prescription: Prescription | DisplayPrescription) => {
    // If this is a grouped prescription from the table, we need to find the actual prescriptions
    if ('id' in prescription && prescription.id.includes(',')) {
      // This is a grouped prescription - get the actual prescriptions for this group
      const prescriptionIds = prescription.id.split(',');
      const groupedPrescriptions = prescriptionListViewModel.filteredPrescriptions.filter(p => 
        prescriptionIds.includes(p.stringId || '')
      );
      
      // Create a combined prescription object with all the medications
      const firstPrescription = groupedPrescriptions[0];
      
      // Type assertion to access populated data that may be attached to the domain object
      const prescriptionWithData = firstPrescription as unknown as {
        _populatedPatient?: {
          patientNumber: string;
          fullName: string;
        };
        _populatedDoctor?: {
          fullName: string;
        };
      };
      
      const combinedPrescription: Prescription = {
        id: prescription.id,
        patientNumber: prescriptionWithData._populatedPatient?.patientNumber || `P${firstPrescription.patientId.slice(-3)}`,
        patientName: prescriptionWithData._populatedPatient?.fullName || `Patient ${firstPrescription.patientId.slice(-4)}`,
        patientId: firstPrescription.patientId,
        doctor: prescriptionWithData._populatedDoctor?.fullName || `Dr. ${firstPrescription.doctorId.slice(-4)}`,
        doctorId: firstPrescription.doctorId,
        datePrescribed: firstPrescription.prescribedDate.toISOString().split('T')[0],
        medications: groupedPrescriptions.map(p => ({
          id: p.stringId || '',
          name: p.medicationNameValue,
          dosage: p.dosageValue,
          frequency: p.frequency,
          duration: p.duration,
          instructions: p.instructionsValue
        })),
        notes: firstPrescription.additionalNotes || ''
      };
      
      setSelectedPrescription(combinedPrescription);
    } else {
      // For display prescriptions from the table, find the corresponding raw domain prescription(s)
      const displayPrescription = prescription as DisplayPrescription;
      
      // If this is a single prescription, find the domain prescription by ID
      const domainPrescription = prescriptionListViewModel.filteredPrescriptions.find(p => 
        p.stringId === displayPrescription.id
      );
      
      if (domainPrescription) {
        // Transform domain prescription to UI format with populated data
        const prescriptionWithData = domainPrescription as unknown as {
          _populatedPatient?: {
            patientNumber: string;
            fullName: string;
          };
          _populatedDoctor?: {
            fullName: string;
          };
        };
        
        const transformedPrescription: Prescription = {
          id: domainPrescription.stringId || '',
          patientNumber: prescriptionWithData._populatedPatient?.patientNumber || displayPrescription.patientNumber,
          patientName: prescriptionWithData._populatedPatient?.fullName || displayPrescription.patientName,
          patientId: domainPrescription.patientId,
          doctor: prescriptionWithData._populatedDoctor?.fullName || displayPrescription.doctor,
          doctorId: domainPrescription.doctorId,
          datePrescribed: domainPrescription.prescribedDate.toISOString().split('T')[0],
          medications: domainPrescription.medications.map(med => ({
            id: med.stringId || '',
            name: med.medicationNameValue,
            medicationName: med.medicationNameValue, // Include both for compatibility
            dosage: med.dosageValue,
            frequency: med.frequency,
            duration: med.duration,
            instructions: med.instructionsValue
          })),
          notes: domainPrescription.additionalNotes || ''
        };
        
        setSelectedPrescription(transformedPrescription);
      } else {
        // Fallback - this shouldn't happen but handle gracefully
        console.warn('Could not find domain prescription for display prescription:', displayPrescription);
        setSelectedPrescription(prescription as Prescription);
      }
    }
    setViewModalOpen(true);
  };

  const handleEditPrescription = (prescription: DisplayPrescription) => {
    // For grouped prescriptions, we can't edit directly since they represent multiple prescriptions
    if (prescription.id.includes(',')) {
      console.warn('Cannot edit grouped prescriptions. Please edit individual prescriptions.');
      return;
    }
    
    // Find the actual prescription object from the domain
    const actualPrescription = prescriptionListViewModel.filteredPrescriptions.find(p => 
      p.stringId === prescription.id
    );
    
    if (actualPrescription) {
      // Transform domain prescription to UI format with populated data (same logic as handleViewPrescription)
      const prescriptionWithData = actualPrescription as unknown as {
        _populatedPatient?: {
          patientNumber: string;
          fullName: string;
        };
        _populatedDoctor?: {
          fullName: string;
        };
      };
      
      const transformedPrescription: Prescription = {
        id: actualPrescription.stringId || '',
        patientNumber: prescriptionWithData._populatedPatient?.patientNumber || prescription.patientNumber,
        patientName: prescriptionWithData._populatedPatient?.fullName || prescription.patientName,
        patientId: actualPrescription.patientId,
        doctor: prescriptionWithData._populatedDoctor?.fullName || prescription.doctor,
        doctorId: actualPrescription.doctorId,
        datePrescribed: actualPrescription.prescribedDate.toISOString().split('T')[0],
        medications: actualPrescription.medications.map(med => ({
          id: med.stringId || '',
          name: med.medicationNameValue,
          medicationName: med.medicationNameValue, // Include both for compatibility
          dosage: med.dosageValue,
          frequency: med.frequency,
          duration: med.duration,
          instructions: med.instructionsValue
        })),
        notes: actualPrescription.additionalNotes || ''
      };
      
      setSelectedPrescription(transformedPrescription);
      setEditModalOpen(true);
    }
  };

  const handleDeletePrescription = (prescription: DisplayPrescription) => {
    // For grouped prescriptions, we can't delete directly since they represent multiple prescriptions
    if (prescription.id.includes(',')) {
      console.warn('Cannot delete grouped prescriptions. Please delete individual prescriptions.');
      return;
    }
    
    // Find the actual prescription object from the domain
    const actualPrescription = prescriptionListViewModel.filteredPrescriptions.find(p => 
      p.stringId === prescription.id
    );
    
    if (actualPrescription) {
      // Transform domain prescription to UI format with populated data (same logic as handleViewPrescription)
      const prescriptionWithData = actualPrescription as unknown as {
        _populatedPatient?: {
          patientNumber: string;
          fullName: string;
        };
        _populatedDoctor?: {
          fullName: string;
        };
      };
      
      const transformedPrescription: Prescription = {
        id: actualPrescription.stringId || '',
        patientNumber: prescriptionWithData._populatedPatient?.patientNumber || prescription.patientNumber,
        patientName: prescriptionWithData._populatedPatient?.fullName || prescription.patientName,
        patientId: actualPrescription.patientId,
        doctor: prescriptionWithData._populatedDoctor?.fullName || prescription.doctor,
        doctorId: actualPrescription.doctorId,
        datePrescribed: actualPrescription.prescribedDate.toISOString().split('T')[0],
        medications: actualPrescription.medications.map(med => ({
          id: med.stringId || '',
          name: med.medicationNameValue,
          medicationName: med.medicationNameValue, // Include both for compatibility
          dosage: med.dosageValue,
          frequency: med.frequency,
          duration: med.duration,
          instructions: med.instructionsValue
        })),
        notes: actualPrescription.additionalNotes || ''
      };
      
      setSelectedPrescription(transformedPrescription);
      setDeleteModalOpen(true);
    }
  };

  const handlePrescriptionCreated = (newPrescription: Prescription) => {
    console.log('Prescription created successfully:', newPrescription);
    // Refresh the list to get the latest data from the API
    prescriptionListViewModel.refreshPrescriptions();
  };

  const handlePrescriptionUpdated = () => {
    console.log('Prescription updated successfully');
    setEditModalOpen(false);
    setSelectedPrescription(null);
    // Refresh the list to get the latest data from the API
    prescriptionListViewModel.refreshPrescriptions();
  };

  const handleConfirmDelete = async () => {
    if (!selectedPrescription?.id) return;

    try {
      // Find the prescription in the list using the ID from the transformed prescription
      const foundPrescription = prescriptionListViewModel.prescriptions.find(p => p.stringId === selectedPrescription.id);
      if (!foundPrescription || !foundPrescription.stringId) {
        console.error('Prescription not found for deletion:', selectedPrescription.id);
        return;
      }

      // Use the store directly to delete the prescription
      await prescriptionStore.deletePrescription(foundPrescription.stringId);
      
      console.log('Prescription deleted successfully:', selectedPrescription.id);
      
      setDeleteModalOpen(false);
      setSelectedPrescription(null);
      
      // Refresh the list to get the latest data from the API
      prescriptionListViewModel.refreshPrescriptions();
    } catch (error) {
      console.error('Failed to delete prescription:', error);
      // TODO: Show error notification to user
    }
  };

  const actions: TableActions<DisplayPrescription> = {
    buttons: [
      {
        icon: 'fas fa-eye',
        tooltip: 'View Prescription Details',
        onClick: handleViewPrescription
      },
      {
        icon: 'fas fa-edit',
        tooltip: 'Update Prescription',
        onClick: handleEditPrescription
      },
      {
        icon: 'fas fa-trash',
        tooltip: 'Delete Prescription',
        onClick: handleDeletePrescription
      }
    ]
  };

  // Convert domain prescriptions to display format for the table
  const displayPrescriptions = (() => {
    // Group prescriptions by patient, doctor, and date to combine medications
    const groupedPrescriptions = new Map<string, {
      prescriptions: typeof prescriptionListViewModel.filteredPrescriptions;
      medications: string[];
    }>();

    prescriptionListViewModel.filteredPrescriptions.forEach(prescription => {
      const datePrescribed = prescription.prescribedDate.toISOString().split('T')[0];

      // Create a unique key for grouping
      const groupKey = `${prescription.patientId}-${prescription.doctorId}-${datePrescribed}`;

      if (!groupedPrescriptions.has(groupKey)) {
        groupedPrescriptions.set(groupKey, {
          prescriptions: [],
          medications: []
        });
      }

      const group = groupedPrescriptions.get(groupKey);
      if (group) {
        group.prescriptions.push(prescription);
        // Extract all medication names from the medications array
        prescription.medications.forEach(medication => {
          group.medications.push(medication.medicationNameValue);
        });
      }
    });

    // Convert grouped prescriptions to display format
    return Array.from(groupedPrescriptions.entries()).map(([, group]) => {
      const firstPrescription = group.prescriptions[0];
      const prescriptionWithData = firstPrescription as unknown as {
        _populatedPatient?: {
          patientNumber: string;
          fullName: string;
        };
        _populatedDoctor?: {
          fullName: string;
        };
      };

      return {
        id: group.prescriptions.map(p => p.stringId || '').join(','), // Combine IDs for actions
        patientNumber: prescriptionWithData._populatedPatient?.patientNumber || `P${firstPrescription.patientId.slice(-3)}`,
        patientName: prescriptionWithData._populatedPatient?.fullName || `Patient ${firstPrescription.patientId.slice(-4)}`,
        patientId: firstPrescription.patientId,
        doctor: prescriptionWithData._populatedDoctor?.fullName || `Dr. ${firstPrescription.doctorId.slice(-4)}`,
        doctorId: firstPrescription.doctorId,
        datePrescribed: firstPrescription.prescribedDate.toISOString().split('T')[0],
        medications: group.medications.join(', '), // Combine all medications with commas
        notes: firstPrescription.additionalNotes,
      };
    });
  })();

  // Define columns for the DataTable with enhanced medication display
  const columns: TableColumn<Prescription>[] = [
    {
      key: 'patientNumber',
      header: 'Patient #',
      width: '15%',
      align: 'center',
      searchable: true
    },
    {
      key: 'patientName',
      header: "Patient's Name",
      width: '20%',
      align: 'left',
      searchable: true
    },
    {
      key: 'doctor',
      header: "Doctor's Name",
      width: '18%',
      align: 'left',
      searchable: true
    },
    {
      key: 'datePrescribed',
      header: 'Date Prescribed',
      width: '15%',
      align: 'center',
      searchable: true,
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    {
      key: 'medications',
      header: 'Medications',
      width: '32%',
      align: 'left',
      searchable: true,
      render: (value: string | Array<{ name: string }>) => {
        if (Array.isArray(value)) {
          return value.map(med => med.name).join(', ');
        }
        return value;
      }
    }
  ];

  return (
    <MedicalClinicLayout>
      <DataTableHeader 
        title="Prescriptions"
        onAddItem={handleAddPrescription}
        addButtonText="Add Prescription"
        addButtonIcon="fas fa-pills"
      />
      
      <DataTable
        data={displayPrescriptions}
        columns={columns}
        actions={actions}
        onRowClick={handleViewPrescription}
        searchable={true}
        searchPlaceholder="Search prescriptions by patient, doctor, or medications..."
        emptyStateMessage={
          prescriptionListViewModel.isLoading 
            ? "Loading prescriptions..." 
            : prescriptionListViewModel.error 
              ? `Error: ${prescriptionListViewModel.error}`
              : "No prescriptions found"
        }
        cursor="pointer"
        useViewportHeight={true}
        bottomPadding={90}
      />

      {/* Add Prescription Modal */}
      <AddPrescriptionModal
        opened={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onPrescriptionCreated={handlePrescriptionCreated}
      />

      {/* Edit Prescription Modal */}
      <AddPrescriptionModal
        opened={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedPrescription(null);
        }}
        editMode={true}
        prescription={selectedPrescription}
        onPrescriptionUpdated={handlePrescriptionUpdated}
      />

      {/* View Prescription Modal */}
      <ViewPrescriptionModal
        opened={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedPrescription(null);
        }}
        prescription={selectedPrescription}
      />

      {/* Delete Prescription Modal */}
      <DeletePrescriptionModal
        opened={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedPrescription(null);
        }}
        prescription={selectedPrescription}
        onConfirm={handleConfirmDelete}
        isLoading={prescriptionListViewModel.isLoading}
      />
    </MedicalClinicLayout>
  );
};
