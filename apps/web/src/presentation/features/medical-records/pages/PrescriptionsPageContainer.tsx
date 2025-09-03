import React, { useEffect } from 'react';
import { usePrescriptionData } from '../hooks/usePrescriptionData';
import { usePrescriptionModalState } from '../hooks/usePrescriptionModalState';
import { usePrescriptionActions } from '../hooks/usePrescriptionActions';
import { PrescriptionsPagePresenter } from './PrescriptionsPagePresenter';
import { useOverflowHidden } from '../../../hooks/useOverflowHidden';

export const PrescriptionsPageContainer: React.FC = () => {
  const { displayPrescriptions, prescriptionListViewModel, isLoading, error } = usePrescriptionData();
  const modalState = usePrescriptionModalState();
  
  const actions = usePrescriptionActions(
    prescriptionListViewModel.filteredPrescriptions,
    prescriptionListViewModel,
    {
      openViewModal: modalState.openViewModal,
      openEditModal: modalState.openEditModal,
      openDeleteModal: modalState.openDeleteModal,
    }
  );

  useOverflowHidden();

  const handleConfirmDelete = async () => {
    const success = await actions.handleConfirmDelete(modalState.selectedPrescription);
    if (success) {
      modalState.closeDeleteModal();
    }
  };

  return (
    <PrescriptionsPagePresenter
      // Data
      displayPrescriptions={displayPrescriptions}
      isLoading={isLoading}
      error={error}
      
      // Modal state
      addModalOpen={modalState.addModalOpen}
      editModalOpen={modalState.editModalOpen}
      viewModalOpen={modalState.viewModalOpen}
      deleteModalOpen={modalState.deleteModalOpen}
      selectedPrescription={modalState.selectedPrescription}
      
      // Actions
      onAddPrescription={modalState.openAddModal}
      onViewPrescription={actions.handleViewPrescription}
      onEditPrescription={actions.handleEditPrescription}
      onDeletePrescription={actions.handleDeletePrescription}
      
      // Modal actions
      onCloseAddModal={modalState.closeAddModal}
      onCloseEditModal={modalState.closeEditModal}
      onCloseViewModal={modalState.closeViewModal}
      onCloseDeleteModal={modalState.closeDeleteModal}
      
      // CRUD callbacks
      onPrescriptionCreated={actions.handlePrescriptionCreated}
      onPrescriptionUpdated={actions.handlePrescriptionUpdated}
      onConfirmDelete={handleConfirmDelete}
    />
  );
};