import React from 'react';
import { DataTable, DataTableHeader } from '../../../../components/common/DataTable';
import { MedicalClinicLayout } from '../../../../components/layout';
import { Prescription } from '../../types';
import { DisplayPrescription } from '../../hooks/usePrescriptionData';
import { AddPrescriptionModal } from '../../components/AddPrescriptionModal';
import { ViewPrescriptionModal } from '../../components/ViewPrescriptionModal';
import { DeletePrescriptionModal } from '../../components/DeletePrescriptionModal';
import { getPrescriptionTableColumns, getPrescriptionTableActions } from '../../config/prescriptionTableConfig';

interface PrescriptionsPagePresenterProps {
  // Data
  displayPrescriptions: DisplayPrescription[];
  isLoading: boolean;
  error: string | null;
  
  // Modal state
  addModalOpen: boolean;
  editModalOpen: boolean;
  viewModalOpen: boolean;
  deleteModalOpen: boolean;
  selectedPrescription: Prescription | null;
  
  // Actions
  onAddPrescription: () => void;
  onViewPrescription: (prescription: Prescription | DisplayPrescription) => void;
  onEditPrescription: (prescription: DisplayPrescription) => void;
  onDeletePrescription: (prescription: DisplayPrescription) => void;
  
  // Modal actions
  onCloseAddModal: () => void;
  onCloseEditModal: () => void;
  onCloseViewModal: () => void;
  onCloseDeleteModal: () => void;
  
  // CRUD callbacks
  onPrescriptionCreated: (prescription: Prescription) => void;
  onPrescriptionUpdated: () => void;
  onConfirmDelete: () => Promise<void>;
}

export const PrescriptionsPagePresenter: React.FC<PrescriptionsPagePresenterProps> = ({
  displayPrescriptions,
  isLoading,
  error,
  addModalOpen,
  editModalOpen,
  viewModalOpen,
  deleteModalOpen,
  selectedPrescription,
  onAddPrescription,
  onViewPrescription,
  onEditPrescription,
  onDeletePrescription,
  onCloseAddModal,
  onCloseEditModal,
  onCloseViewModal,
  onCloseDeleteModal,
  onPrescriptionCreated,
  onPrescriptionUpdated,
  onConfirmDelete,
}) => {
  const columns = getPrescriptionTableColumns();
  const actions = getPrescriptionTableActions({
    onView: onViewPrescription,
    onEdit: onEditPrescription,
    onDelete: onDeletePrescription,
  });

  return (
    <MedicalClinicLayout>
      <DataTableHeader 
        title="Prescriptions"
        onAddItem={onAddPrescription}
        addButtonText="Add Prescription"
        addButtonIcon="fas fa-pills"
      />
      
      <DataTable
        data={displayPrescriptions}
        columns={columns}
        actions={actions}
        onRowClick={onViewPrescription}
        searchable={true}
        searchPlaceholder="Search prescriptions by patient, doctor, or medications..."
        emptyStateMessage={
          isLoading 
            ? "Loading prescriptions..." 
            : error 
              ? `Error: ${error}`
              : "No prescriptions found"
        }
        cursor="pointer"
        useViewportHeight={true}
        bottomPadding={90}
      />

      <AddPrescriptionModal
        opened={addModalOpen}
        onClose={onCloseAddModal}
        onPrescriptionCreated={onPrescriptionCreated}
      />

      <AddPrescriptionModal
        opened={editModalOpen}
        onClose={onCloseEditModal}
        editMode={true}
        prescription={selectedPrescription}
        onPrescriptionUpdated={onPrescriptionUpdated}
      />

      <ViewPrescriptionModal
        opened={viewModalOpen}
        onClose={onCloseViewModal}
        prescription={selectedPrescription}
      />

      <DeletePrescriptionModal
        opened={deleteModalOpen}
        onClose={onCloseDeleteModal}
        prescription={selectedPrescription}
        onConfirm={onConfirmDelete}
        isLoading={isLoading}
      />
    </MedicalClinicLayout>
  );
};