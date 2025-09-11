import { useCallback } from 'react';
import { AddAppointmentFormData, AppointmentDto } from '@nx-starter/application-shared';

interface UseAppointmentModalActionsProps {
  viewModel: {
    handleFormSubmit: (data: AddAppointmentFormData) => Promise<boolean>;
    isLoading: boolean;
    error: string | null;
    clearError: () => void;
  };
  onClose: () => void;
  editMode?: boolean;
  onAppointmentCreated?: (appointment: AppointmentDto) => void;
  onAppointmentUpdated?: () => void;
}

/**
 * Custom hook to manage appointment modal actions and form submission
 */
export const useAppointmentModalActions = ({
  viewModel,
  onClose,
  editMode = false,
  onAppointmentCreated,
  onAppointmentUpdated
}: UseAppointmentModalActionsProps) => {
  
  const handleSubmit = useCallback(async (data: AddAppointmentFormData): Promise<boolean> => {
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
  }, [viewModel, onClose, editMode, onAppointmentCreated, onAppointmentUpdated]);

  return {
    handleSubmit,
    isLoading: viewModel.isLoading,
    error: viewModel.error,
    clearError: viewModel.clearError
  };
};