import React from 'react';
import { AppointmentDto } from '@nx-starter/application-shared';
import { AddAppointmentModalContainer } from './AddAppointmentModalContainer';

interface AddAppointmentModalProps {
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

export const AddAppointmentModal: React.FC<AddAppointmentModalProps> = (props) => {
  return <AddAppointmentModalContainer {...props} />;
};
