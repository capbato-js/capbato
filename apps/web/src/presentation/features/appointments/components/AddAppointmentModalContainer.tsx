import React from 'react';
import { AppointmentDto } from '@nx-starter/application-shared';
import { useAppointmentFormViewModel } from '../view-models/useAppointmentFormViewModel';
import { useAppointmentModalState } from '../hooks/useAppointmentModalState';
import { useAppointmentModalActions } from '../hooks/useAppointmentModalActions';
import { prepareAppointmentInitialData, getAppointmentModalTitle } from '../utils/appointmentFormUtils';
import { AddAppointmentModalPresenter } from './AddAppointmentModalPresenter';

interface AddAppointmentModalContainerProps {
  isOpen: boolean;
  onClose: () => void;
  onAppointmentCreated?: (appointment: AppointmentDto) => void;
  // Edit mode props
  editMode?: boolean;
  appointment?: AppointmentDto | null;
  onAppointmentUpdated?: () => void;
  // Reschedule mode props
  isRescheduleMode?: boolean;
}

export const AddAppointmentModalContainer: React.FC<AddAppointmentModalContainerProps> = ({
  isOpen,
  onClose,
  onAppointmentCreated,
  editMode = false,
  appointment,
  onAppointmentUpdated,
  isRescheduleMode = false,
}) => {
  // Manage stable appointment ID reference
  const { stableAppointmentId } = useAppointmentModalState(
    isOpen,
    editMode,
    appointment?.id
  );
  
  // Get view model for form handling
  const viewModel = useAppointmentFormViewModel(stableAppointmentId);
  
  // Manage modal actions and form submission
  const modalActions = useAppointmentModalActions({
    viewModel,
    onClose,
    editMode,
    onAppointmentCreated,
    onAppointmentUpdated
  });

  // Prepare initial data for edit mode
  const initialData = editMode && appointment 
    ? prepareAppointmentInitialData(appointment, isRescheduleMode)
    : undefined;

  // Get modal title
  const modalTitle = getAppointmentModalTitle(editMode, isRescheduleMode);

  return (
    <AddAppointmentModalPresenter
      isOpen={isOpen}
      onClose={onClose}
      modalTitle={modalTitle}
      onSubmit={modalActions.handleSubmit}
      isLoading={modalActions.isLoading}
      error={modalActions.error}
      onClearError={modalActions.clearError}
      editMode={editMode}
      currentAppointmentId={stableAppointmentId}
      initialData={initialData}
      isRescheduleMode={isRescheduleMode}
    />
  );
};