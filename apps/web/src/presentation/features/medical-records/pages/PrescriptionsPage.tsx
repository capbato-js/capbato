import React, { useState } from 'react';
import { DataTable, DataTableHeader, TableColumn, TableActions } from '../../../components/common/DataTable';
import { MedicalClinicLayout } from '../../../components/layout';
import { Prescription } from '../types';
import { AddPrescriptionModal } from '../components/AddPrescriptionModal';
import { ViewPrescriptionModal } from '../components/ViewPrescriptionModal';
import { DeletePrescriptionModal } from '../components/DeletePrescriptionModal';

// Enhanced dummy data for prescriptions with both formats
const initialPrescriptions: Prescription[] = [
  {
    id: '1',
    patientNumber: 'P001',
    patientName: 'John Doe',
    patientId: 'patient_001',
    doctor: 'Dr. Smith',
    doctorId: 'doctor_001',
    datePrescribed: '2025-07-28',
    medications: [
      {
        id: '1',
        name: 'Amoxicillin',
        dosage: '500mg',
        frequency: 'Every 8 hours',
        duration: '7 days',
        instructions: 'Take with food'
      },
      {
        id: '2',
        name: 'Paracetamol',
        dosage: '500mg',
        frequency: 'Every 6 hours',
        duration: '5 days',
        instructions: 'For pain relief'
      }
    ],
    notes: 'Patient has history of penicillin allergy - confirmed safe to use Amoxicillin'
  },
  {
    id: '2',
    patientNumber: 'P002',
    patientName: 'Jane Smith',
    patientId: 'patient_002',
    doctor: 'Dr. Johnson',
    doctorId: 'doctor_002',
    datePrescribed: '2025-07-27',
    medications: [
      {
        id: '3',
        name: 'Ibuprofen',
        dosage: '400mg',
        frequency: 'Every 8 hours',
        duration: '5 days',
        instructions: 'Take after meals'
      },
      {
        id: '4',
        name: 'Cetirizine',
        dosage: '10mg',
        frequency: 'Once daily',
        duration: '7 days',
        instructions: 'For allergic reactions'
      }
    ],
    notes: 'Patient experiencing seasonal allergies'
  },
  {
    id: '3',
    patientNumber: 'P003',
    patientName: 'Mike Wilson',
    patientId: 'patient_003',
    doctor: 'Dr. Brown',
    doctorId: 'doctor_003',
    datePrescribed: '2025-07-26',
    medications: 'Metformin 850mg, Lisinopril 10mg', // Legacy string format
    notes: 'Continue monitoring blood pressure and glucose levels'
  },
  {
    id: '4',
    patientNumber: 'P004',
    patientName: 'Sarah Davis',
    patientId: 'patient_004',
    doctor: 'Dr. Garcia',
    doctorId: 'doctor_004',
    datePrescribed: '2025-07-25',
    medications: [
      {
        id: '5',
        name: 'Omeprazole',
        dosage: '20mg',
        frequency: 'Once daily',
        duration: '14 days',
        instructions: 'Take before breakfast'
      },
      {
        id: '6',
        name: 'Simvastatin',
        dosage: '40mg',
        frequency: 'Once daily',
        duration: 'Ongoing',
        instructions: 'Take at bedtime'
      }
    ],
    notes: 'GERD treatment and cholesterol management'
  }
];

export const PrescriptionsPage: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(initialPrescriptions);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddPrescription = () => {
    setSelectedPrescription(null);
    setAddModalOpen(true);
  };

  const handleViewPrescription = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setViewModalOpen(true);
  };

  const handleEditPrescription = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setEditModalOpen(true);
  };

  const handleDeletePrescription = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setDeleteModalOpen(true);
  };

  const handlePrescriptionCreated = (newPrescription: Prescription) => {
    setPrescriptions(prev => [newPrescription, ...prev]);
    console.log('Prescription created successfully:', newPrescription);
  };

  const handlePrescriptionUpdated = () => {
    // In a real app, this would refetch data or update the specific prescription
    console.log('Prescription updated successfully');
    setEditModalOpen(false);
    setSelectedPrescription(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedPrescription) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPrescriptions(prev => 
        prev.filter(p => p.id !== selectedPrescription.id)
      );
      
      console.log('Prescription deleted successfully:', selectedPrescription.id);
      
      setDeleteModalOpen(false);
      setSelectedPrescription(null);
    } catch {
      console.error('Failed to delete prescription');
    } finally {
      setIsLoading(false);
    }
  };

  const actions: TableActions<Prescription> = {
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
        data={prescriptions}
        columns={columns}
        actions={actions}
        onRowClick={handleViewPrescription}
        searchable={true}
        searchPlaceholder="Search prescriptions by patient, doctor, or medications..."
        emptyStateMessage="No prescriptions found"
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
        isLoading={isLoading}
      />
    </MedicalClinicLayout>
  );
};
