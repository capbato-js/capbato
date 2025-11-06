import React, { useRef, useEffect, useState } from 'react';
import { usePrescriptionData } from '../../hooks/usePrescriptionData';
import { usePrescriptionModalState } from '../../hooks/usePrescriptionModalState';
import { usePrescriptionActions } from '../../hooks/usePrescriptionActions';
import { usePermissions } from '../../../../../infrastructure/auth/useRBAC';
import { PrescriptionsPagePresenter } from './PrescriptionsPagePresenter';
import { useOverflowHidden } from '../../../../hooks/useOverflowHidden';
import { usePrintPrescription, formatPatientAddress } from '../../utils/prescriptionPrintUtils';
import { usePatientStore } from '../../../../../infrastructure/state/PatientStore';

export const PrescriptionsPageContainer: React.FC = () => {
  const { displayPrescriptions, prescriptionListViewModel, isLoading, error } = usePrescriptionData();
  const modalState = usePrescriptionModalState();
  const { canCreatePrescriptions } = usePermissions();

  // Print functionality
  const printRef = useRef<HTMLDivElement>(null);
  const [patientAge, setPatientAge] = useState<number>(0);
  const [patientSex, setPatientSex] = useState<string>('');
  const [patientAddress, setPatientAddress] = useState<string>('');
  const { loadPatientById, getPatientDetails } = usePatientStore();
  const handlePrint = usePrintPrescription(printRef, modalState.selectedPrescription?.patientName);
  
  const actions = usePrescriptionActions(
    prescriptionListViewModel.filteredPrescriptions,
    prescriptionListViewModel,
    {
      openViewModal: modalState.openViewModal,
      openEditModal: modalState.openEditModal,
      openDeleteModal: modalState.openDeleteModal,
    }
  );

  // Fetch patient details when view modal opens
  useEffect(() => {
    const fetchPatientDetails = async () => {
      if (!modalState.viewModalOpen || !modalState.selectedPrescription?.patientId) {
        return;
      }

      try {
        await loadPatientById(modalState.selectedPrescription.patientId);
        const patientDetails = getPatientDetails(modalState.selectedPrescription.patientId);

        if (patientDetails) {
          setPatientAge(patientDetails.age || 0);
          setPatientSex(patientDetails.gender || '');
          setPatientAddress(formatPatientAddress(patientDetails.address));
        }
      } catch (error) {
        console.error('Failed to fetch patient details for print:', error);
        setPatientAge(0);
        setPatientSex('');
        setPatientAddress('');
      }
    };

    fetchPatientDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalState.viewModalOpen, modalState.selectedPrescription?.patientId]);

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

      // Permissions
      canCreatePrescriptions={canCreatePrescriptions}

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

      // Print props
      onPrint={handlePrint}
      printRef={printRef}
      patientAge={patientAge}
      patientSex={patientSex}
      patientAddress={patientAddress}
    />
  );
};