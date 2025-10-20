import React, { useMemo, useCallback } from 'react';
import { Box, Text, Alert, Skeleton, useMantineTheme } from '@mantine/core';
import { usePatientPrescriptions } from '../../view-models';
import { PrescriptionsTable } from '../../components';
import { usePrescriptionStore } from '../../../../../infrastructure/state/PrescriptionStore';
import { usePermissions } from '../../../../../infrastructure/auth/useRBAC';
import { usePrescriptionModalState } from '../../../medical-records/hooks/usePrescriptionModalState';
import { AddPrescriptionModal, ViewPrescriptionModal, DeletePrescriptionModal } from '../../../medical-records/components';
import { Prescription } from '@nx-starter/domain';

interface PrescriptionsTabProps {
  patientId: string;
}

export const PrescriptionsTab: React.FC<PrescriptionsTabProps> = ({ patientId }) => {
  const theme = useMantineTheme();
  const { prescriptions, isLoading, error } = usePatientPrescriptions(patientId);
  const prescriptionStore = usePrescriptionStore();
  const { canCreatePrescriptions } = usePermissions();
  const modalState = usePrescriptionModalState();

  // Get domain prescriptions from the store
  const domainPrescriptions = useMemo(() => {
    return prescriptionStore.prescriptions.filter(p => p.patientId === patientId);
  }, [prescriptionStore.prescriptions, patientId]);

  // Action handlers
  const handleViewPrescription = useCallback((prescriptionId: string) => {
    const prescription = domainPrescriptions.find(p => p.id?.value === prescriptionId);
    if (prescription) {
      const uiPrescription = transformDomainToUIPrescriptionForModal(prescription);
      modalState.openViewModal(uiPrescription);
    }
  }, [domainPrescriptions, modalState]);

  const handleEditPrescription = useCallback((prescriptionId: string) => {
    const prescription = domainPrescriptions.find(p => p.id?.value === prescriptionId);
    if (prescription) {
      const uiPrescription = transformDomainToUIPrescriptionForModal(prescription);
      modalState.openEditModal(uiPrescription);
    }
  }, [domainPrescriptions, modalState]);

  const handleDeletePrescription = useCallback((prescriptionId: string) => {
    const prescription = domainPrescriptions.find(p => p.id?.value === prescriptionId);
    if (prescription) {
      const uiPrescription = transformDomainToUIPrescriptionForModal(prescription);
      modalState.openDeleteModal(uiPrescription);
    }
  }, [domainPrescriptions, modalState]);

  const handlePrescriptionUpdated = useCallback(() => {
    prescriptionStore.loadPrescriptionsByPatientId(patientId);
    modalState.closeEditModal();
  }, [prescriptionStore, patientId, modalState]);

  const handleConfirmDelete = useCallback(async () => {
    if (!modalState.selectedPrescription?.id) return;

    try {
      await prescriptionStore.deletePrescription(modalState.selectedPrescription.id);
      await prescriptionStore.loadPrescriptionsByPatientId(patientId);
      modalState.closeDeleteModal();
    } catch (error) {
      console.error('Failed to delete prescription:', error);
    }
  }, [modalState.selectedPrescription, prescriptionStore, patientId, modalState]);

  const titleStyle = {
    color: theme.colors.blue[9],
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '20px',
    marginTop: 0,
    borderBottom: `2px solid ${theme.colors.blue[9]}`,
    paddingBottom: '8px'
  };

  if (isLoading) {
    return (
      <Box style={{ padding: '0 20px' }}>
        <Text style={titleStyle}>
          Prescriptions
        </Text>
        <Skeleton height={200} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box style={{ padding: '0 20px' }}>
        <Text style={titleStyle}>
          Prescriptions
        </Text>
        <Alert color="red" title="Error loading prescriptions">
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box style={{ padding: '0 20px' }}>
      <Text style={titleStyle}>
        Prescriptions
      </Text>
      <PrescriptionsTable
        prescriptions={prescriptions}
        onViewPrescription={handleViewPrescription}
        onEditPrescription={canCreatePrescriptions ? handleEditPrescription : undefined}
        onDeletePrescription={canCreatePrescriptions ? handleDeletePrescription : undefined}
      />

      {/* Edit Modal - Only show for users who can create prescriptions */}
      {canCreatePrescriptions && (
        <AddPrescriptionModal
          opened={modalState.editModalOpen}
          onClose={modalState.closeEditModal}
          editMode={true}
          prescription={modalState.selectedPrescription}
          onPrescriptionUpdated={handlePrescriptionUpdated}
        />
      )}

      {/* View Modal */}
      <ViewPrescriptionModal
        opened={modalState.viewModalOpen}
        onClose={modalState.closeViewModal}
        prescription={modalState.selectedPrescription}
      />

      {/* Delete/Discontinue Modal - Only show for users who can create prescriptions */}
      {canCreatePrescriptions && (
        <DeletePrescriptionModal
          opened={modalState.deleteModalOpen}
          onClose={modalState.closeDeleteModal}
          prescription={modalState.selectedPrescription}
          onConfirm={handleConfirmDelete}
        />
      )}
    </Box>
  );
};

// Helper to transform domain prescription to UI prescription for modals
function transformDomainToUIPrescriptionForModal(prescription: Prescription): any {
  // Transform medications array
  const medications = prescription.medications?.map(med => ({
    name: med.medicationNameValue || '',
    dosage: med.dosageValue || '',
    frequency: med.frequency || '',
    duration: med.duration || '',
    instructions: med.instructionsValue || '',
  })) || [{
    name: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: '',
  }];

  // Type assertion to access populated data
  const prescriptionWithPopulatedData = prescription as any;

  return {
    id: prescription.id?.value || '',
    patientId: prescription.patientId || '',
    patientNumber: prescriptionWithPopulatedData._populatedPatient?.patientNumber || '',
    patientName: prescriptionWithPopulatedData._populatedPatient?.name ||
                 `${prescriptionWithPopulatedData._populatedPatient?.firstName || ''} ${prescriptionWithPopulatedData._populatedPatient?.lastName || ''}`.trim() || '',
    doctorId: prescription.doctorId || '',
    doctor: prescriptionWithPopulatedData._populatedDoctor?.fullName ||
            `${prescriptionWithPopulatedData._populatedDoctor?.firstName || ''} ${prescriptionWithPopulatedData._populatedDoctor?.lastName || ''}`.trim() || '',
    datePrescribed: prescription.prescribedDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
    medications: medications,
    notes: prescription.notes || '',
  };
}