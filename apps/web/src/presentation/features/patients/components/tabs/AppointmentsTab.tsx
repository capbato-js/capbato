import React from 'react';
import { Box, Text, Alert, Skeleton, useMantineTheme } from '@mantine/core';
import { usePatientAppointments } from '../../view-models';
import { BaseAppointmentsTable, ConfirmationModal } from '../../../../components/common';
import { AddAppointmentModal } from '../../../appointments/components';
import { useModalState } from '../../../appointments/hooks/useModalState';
import { useAppointmentActions } from '../../../appointments/hooks/useAppointmentActions';
import { useAppointmentStore } from '../../../../../infrastructure/state/AppointmentStore';

interface AppointmentsTabProps {
  patientId: string;
}

export const AppointmentsTab: React.FC<AppointmentsTabProps> = ({ patientId }) => {
  const theme = useMantineTheme();
  const { appointments, isLoading, error } = usePatientAppointments(patientId);
  const modalState = useModalState();

  // Get appointments directly from the store (already filtered by patient ID via usePatientAppointments)
  const appointmentDtos = useAppointmentStore((state) => state.appointments);
  const fetchAppointmentsByPatientId = useAppointmentStore((state) => state.fetchAppointmentsByPatientId);

  const actions = useAppointmentActions(
    appointmentDtos,
    modalState.openConfirmationModal,
    modalState.closeConfirmationModal,
    modalState.openEditModal
  );

  const handleAppointmentUpdated = () => {
    // Reload appointments for this patient
    fetchAppointmentsByPatientId(patientId);
    modalState.closeEditModal();
  };

  const config = {
    showActions: true,
    showContactColumn: false,
    showDateColumn: true,
    showPatientColumns: false,
    compactMode: false,
    useViewportHeight: false,
    emptyStateMessage: "No appointments found for this patient"
  };

  const callbacks = {
    onModifyAppointment: actions.handleModifyAppointment,
    onCancelAppointment: actions.handleCancelAppointment,
    onReconfirmAppointment: actions.handleReconfirmAppointment,
    onCompleteAppointment: actions.handleCompleteAppointment,
  };

  return (
    <Box style={{ padding: '0 20px' }}>
      <Text
        style={{
          color: theme.colors.blue[9],
          fontSize: '20px',
          fontWeight: 'bold',
          marginBottom: '20px',
          marginTop: 0,
          borderBottom: `2px solid ${theme.colors.blue[9]}`,
          paddingBottom: '8px'
        }}
      >
        Appointments
      </Text>

      {isLoading && (
        <Box style={{ padding: '20px' }}>
          <Skeleton height={50} />
          <Skeleton height={50} mt="md" />
          <Skeleton height={50} mt="md" />
        </Box>
      )}

      {error && (
        <Alert color="red" style={{ marginBottom: '20px' }}>
          {error}
        </Alert>
      )}

      {!isLoading && !error && (
        <BaseAppointmentsTable
          appointments={appointments}
          config={config}
          callbacks={callbacks}
        />
      )}

      {/* Edit Modal */}
      <AddAppointmentModal
        isOpen={modalState.isEditModalOpen}
        onClose={modalState.closeEditModal}
        editMode={true}
        appointment={modalState.selectedAppointment}
        isRescheduleMode={modalState.isRescheduleMode}
        onAppointmentUpdated={handleAppointmentUpdated}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalState.confirmationModal.isOpen}
        onClose={modalState.closeConfirmationModal}
        onConfirm={modalState.confirmationModal.onConfirm}
        title={modalState.confirmationModal.title}
        message={modalState.confirmationModal.message}
        confirmText={modalState.confirmationModal.confirmText}
        confirmColor={modalState.confirmationModal.confirmColor}
        isLoading={isLoading}
      />
    </Box>
  );
};