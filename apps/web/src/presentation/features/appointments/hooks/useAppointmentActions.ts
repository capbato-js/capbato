import { AppointmentDto } from '@nx-starter/application-shared';
import { useAppointmentStore } from '../../../../infrastructure/state/AppointmentStore';
import { ConfirmationModalState } from './useModalState';

export const useAppointmentActions = (
  appointments: AppointmentDto[],
  openConfirmationModal: (config: Omit<ConfirmationModalState, 'isOpen'>) => void,
  closeConfirmationModal: () => void,
  openEditModal: (appointment: AppointmentDto, rescheduleMode?: boolean) => void,
  refreshAppointments?: () => void
) => {
  // Use store methods directly to avoid triggering fetchAllAppointments
  const cancelAppointment = useAppointmentStore((state) => state.cancelAppointment);
  const confirmAppointment = useAppointmentStore((state) => state.confirmAppointment);
  const completeAppointment = useAppointmentStore((state) => state.completeAppointment);

  const handleModifyAppointment = (appointmentId: string) => {
    const appointment = appointments.find(apt => apt.id === appointmentId);
    if (appointment) {
      openEditModal(appointment, false);
    }
  };

  const handleCancelAppointment = (appointmentId: string) => {
    const appointment = appointments.find(apt => apt.id === appointmentId);
    const appointmentName = appointment?.patient?.fullName || 'this appointment';

    openConfirmationModal({
      title: 'Cancel Appointment',
      message: `Are you sure you want to cancel the appointment for ${appointmentName}?`,
      confirmText: 'Cancel',
      confirmColor: 'red',
      onConfirm: async () => {
        try {
          await cancelAppointment(appointmentId);
          closeConfirmationModal();
          if (refreshAppointments) {
            refreshAppointments();
          }
        } catch (error) {
          console.error('Failed to cancel appointment:', error);
        }
      },
    });
  };

  const handleReconfirmAppointment = (appointmentId: string) => {
    const appointment = appointments.find(apt => apt.id === appointmentId);
    const appointmentName = appointment?.patient?.fullName || 'this appointment';

    openConfirmationModal({
      title: 'Reconfirm Appointment',
      message: `Reconfirm the appointment for ${appointmentName}?`,
      confirmText: 'Reconfirm',
      confirmColor: 'green',
      onConfirm: async () => {
        const sameSlotAppointments = appointments.filter(apt =>
          apt.appointmentDate === appointment?.appointmentDate &&
          apt.appointmentTime === appointment?.appointmentTime &&
          apt.status === 'confirmed'
        );

        if (sameSlotAppointments.length > 0) {
          closeConfirmationModal();
          if (appointment) {
            openEditModal(appointment, true);
          }
        } else {
          try {
            await confirmAppointment(appointmentId);
            closeConfirmationModal();
            if (refreshAppointments) {
              refreshAppointments();
            }
          } catch (error) {
            console.error('Failed to reconfirm appointment:', error);
          }
        }
      },
    });
  };

  const handleCompleteAppointment = (appointmentId: string) => {
    const appointment = appointments.find(apt => apt.id === appointmentId);
    const appointmentName = appointment?.patient?.fullName || 'this appointment';

    openConfirmationModal({
      title: 'Complete Appointment',
      message: `Mark the appointment for ${appointmentName} as completed?`,
      confirmText: 'Complete',
      confirmColor: 'blue',
      onConfirm: async () => {
        try {
          await completeAppointment(appointmentId);
          closeConfirmationModal();
          if (refreshAppointments) {
            refreshAppointments();
          }
        } catch (error) {
          console.error('Failed to complete appointment:', error);
        }
      },
    });
  };

  return {
    handleModifyAppointment,
    handleCancelAppointment,
    handleReconfirmAppointment,
    handleCompleteAppointment,
  };
};