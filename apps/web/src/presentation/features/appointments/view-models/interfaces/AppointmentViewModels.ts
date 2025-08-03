import { AppointmentDto, AddAppointmentFormData } from '@nx-starter/application-shared';

/**
 * View model interface for appointment form operations
 */
export interface IAppointmentFormViewModel {
  // State
  isLoading: boolean;
  error: string | null;
  
  // Actions
  handleFormSubmit: (data: AddAppointmentFormData) => Promise<boolean>;
  
  clearError: () => void;
}

/**
 * View model interface for appointment list operations
 */
export interface IAppointmentListViewModel {
  // State
  appointments: AppointmentDto[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadAppointments: () => Promise<void>;
  confirmAppointment: (id: string) => Promise<void>;
  cancelAppointment: (id: string) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
  clearError: () => void;
}

/**
 * View model interface for individual appointment item operations
 */
export interface IAppointmentItemViewModel {
  // State
  isLoading: boolean;
  error: string | null;
  
  // Actions
  handleConfirm: (id: string) => Promise<void>;
  handleCancel: (id: string) => Promise<void>;
  handleDelete: (id: string) => Promise<void>;
  handleEdit: (id: string, data: {
    patientId?: string;
    reasonForVisit?: string;
    appointmentDate?: string;
    appointmentTime?: string;
    doctorId?: string;
    status?: 'confirmed' | 'cancelled' | 'completed';
  }) => Promise<void>;
  
  clearError: () => void;
}

/**
 * View model interface for appointment page operations
 */
export interface IAppointmentPageViewModel {
  // State
  appointments: AppointmentDto[];
  isLoading: boolean;
  error: string | null;
  isAddModalOpen: boolean;
  
  // Actions
  loadAppointments: () => Promise<void>;
  openAddModal: () => void;
  closeAddModal: () => void;
  handleAppointmentCreated: (appointment: AppointmentDto) => void;
  clearError: () => void;
}
