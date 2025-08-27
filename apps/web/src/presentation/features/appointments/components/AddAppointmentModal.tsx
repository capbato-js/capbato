import React, { useRef, useEffect } from 'react';
import { Modal } from '../../../components/common';
import { AddAppointmentForm } from './AddAppointmentForm';
import { useAppointmentFormViewModel } from '../view-models/useAppointmentFormViewModel';
import { AppointmentDto, AddAppointmentFormData } from '@nx-starter/application-shared';

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

export const AddAppointmentModal: React.FC<AddAppointmentModalProps> = ({
  isOpen,
  onClose,
  onAppointmentCreated,
  editMode = false,
  appointment,
  onAppointmentUpdated,
  isRescheduleMode = false,
}) => {
  
  // Store the appointmentId when modal first opens in edit mode
  const appointmentIdRef = useRef<string | undefined>(undefined);
  
  // When modal opens with a valid appointment, store the ID
  useEffect(() => {
    if (isOpen && editMode && appointment?.id) {
      appointmentIdRef.current = appointment.id;
    } else if (!isOpen) {
      // Clear when modal closes
      appointmentIdRef.current = undefined;
    }
  }, [isOpen, editMode, appointment?.id]);
  
  // Use the stable ID from ref, fallback to current prop
  const stableAppointmentId = appointmentIdRef.current || (editMode && appointment?.id ? appointment.id : undefined);
  
  
  const viewModel = useAppointmentFormViewModel(stableAppointmentId);

  const handleSubmit = async (data: AddAppointmentFormData): Promise<boolean> => {
    const success = await viewModel.handleFormSubmit(data);
    
    if (success) {
      onClose();
      
      if (editMode && onAppointmentUpdated) {
        onAppointmentUpdated();
      } else if (onAppointmentCreated) {
        // Note: We don't have the created appointment object from the view model
        // This could be enhanced to return the created appointment
        // For now, we'll trigger a refresh instead
        // onAppointmentCreated(createdAppointment);
      }
    }
    
    return success;
  };

  // Prepare initial data for edit mode
  const initialData = editMode && appointment ? {
    patientId: appointment.patient?.id,
    patientName: appointment.patient?.fullName,
    patientNumber: appointment.patient?.patientNumber,
    reasonForVisit: appointment.reasonForVisit,
    appointmentDate: appointment.appointmentDate,
    appointmentTime: isRescheduleMode ? '' : appointment.appointmentTime, // Clear time in reschedule mode
    doctorId: appointment.doctor?.id,
    doctorName: appointment.doctor ? `Dr. ${appointment.doctor.fullName} - ${appointment.doctor.specialization}` : undefined,
  } : undefined;

  // Determine the modal title
  const getModalTitle = () => {
    if (isRescheduleMode) {
      return "Update Appointment Time";
    }
    return editMode ? "Update Appointment" : "Add New Appointment";
  };

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={getModalTitle()}
    >
      <AddAppointmentForm
        onSubmit={handleSubmit}
        isLoading={viewModel.isLoading}
        error={viewModel.error}
        onClearError={viewModel.clearError}
        editMode={editMode}
        currentAppointmentId={stableAppointmentId}
        initialData={initialData}
        isRescheduleMode={isRescheduleMode}
      />
    </Modal>
  );
};
