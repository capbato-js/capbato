import { useState } from 'react';
import { AppointmentDto } from '@nx-starter/application-shared';

export interface ConfirmationModalState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  confirmText?: string;
  confirmColor?: string;
}

export const useModalState = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentDto | null>(null);
  const [isRescheduleMode, setIsRescheduleMode] = useState(false);
  
  const [confirmationModal, setConfirmationModal] = useState<ConfirmationModalState>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => { /* empty */ },
  });

  const openEditModal = (appointment: AppointmentDto, rescheduleMode = false) => {
    setSelectedAppointment(appointment);
    setIsRescheduleMode(rescheduleMode);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedAppointment(null);
    setIsRescheduleMode(false);
  };

  const openConfirmationModal = (config: Omit<ConfirmationModalState, 'isOpen'>) => {
    setConfirmationModal({
      ...config,
      isOpen: true,
    });
  };

  const closeConfirmationModal = () => {
    setConfirmationModal(prev => ({ ...prev, isOpen: false }));
  };

  return {
    // Edit modal
    isEditModalOpen,
    selectedAppointment,
    isRescheduleMode,
    openEditModal,
    closeEditModal,
    
    // Confirmation modal
    confirmationModal,
    openConfirmationModal,
    closeConfirmationModal,
  };
};