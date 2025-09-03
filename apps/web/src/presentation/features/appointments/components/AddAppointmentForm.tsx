import React from 'react';
import { AddAppointmentFormData } from '@nx-starter/application-shared';
import { AddAppointmentFormContainer } from './AddAppointmentFormContainer';

export interface AddAppointmentFormProps {
  onSubmit: (data: AddAppointmentFormData) => Promise<boolean>;
  isLoading: boolean;
  error?: string | null;
  onClearError?: () => void;
  // Edit mode props
  editMode?: boolean;
  currentAppointmentId?: string;
  initialData?: {
    patientId?: string;
    patientName?: string;
    patientNumber?: string;
    reasonForVisit?: string;
    appointmentDate?: string;
    appointmentTime?: string;
    doctorId?: string;
    doctorName?: string;
  };
  // Reschedule mode props
  isRescheduleMode?: boolean;
}

/**
 * AddAppointmentForm component handles the creation and editing of appointments
 * with form validation and proper TypeScript typing.
 * 
 * Features:
 * - Real patient data from backend
 * - Schedule-aware doctor assignment that follows Doctor Schedule Calendar logic
 * - Considers doctor schedule patterns (MWF, TTH) and override schedules from API
 * - Patient number display
 * - Edit mode support for modifying existing appointments
 */
export const AddAppointmentForm: React.FC<AddAppointmentFormProps> = (props) => {
  return <AddAppointmentFormContainer {...props} />;
};
