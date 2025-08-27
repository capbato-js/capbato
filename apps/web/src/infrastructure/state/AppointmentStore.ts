import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { AppointmentDto } from '@nx-starter/application-shared';
import { container } from 'tsyringe';
import { AppointmentApiService } from '../api/AppointmentApiService';

interface AppointmentState {
  // State
  appointments: AppointmentDto[];
  isLoading: boolean;
  error: string | null;
  
  // Command Operations
  createAppointment: (data: {
    patientId: string;
    reasonForVisit: string;
    appointmentDate: string;
    appointmentTime: string;
    doctorId: string;
    status?: 'confirmed' | 'cancelled' | 'completed';
  }) => Promise<AppointmentDto>;
  
  updateAppointment: (id: string, data: {
    patientId?: string;
    reasonForVisit?: string;
    appointmentDate?: string;
    appointmentTime?: string;
    doctorId?: string;
    status?: 'confirmed' | 'cancelled' | 'completed';
  }) => Promise<void>;
  
  deleteAppointment: (id: string) => Promise<void>;
  confirmAppointment: (id: string) => Promise<void>;
  cancelAppointment: (id: string) => Promise<void>;
  completeAppointment: (id: string) => Promise<void>;
  reconfirmAppointment: (id: string) => Promise<void>;
  
  // Query Operations
  fetchAllAppointments: () => Promise<void>;
  fetchTodayConfirmedAppointments: () => Promise<void>;
  fetchAppointmentsByPatientId: (patientId: string) => Promise<void>;
  getAppointmentsByDate: (date: string) => AppointmentDto[];
  getAppointmentById: (id: string) => Promise<AppointmentDto>;
  
  // Utility Actions
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

/**
 * Zustand store for appointment state management following CQRS pattern
 * Separates command and query operations with proper error handling
 */
export const useAppointmentStore = create<AppointmentState>()(
  devtools(
    (set, get) => {
      // Lazy resolve API service to avoid DI container timing issues
      const getApiService = () => container.resolve(AppointmentApiService);
      return {
        // Initial State
        appointments: [],
        isLoading: false,
        error: null,

        // Command Operations
        createAppointment: async (data) => {
          set({ isLoading: true, error: null });
          
          try {
            const newAppointment = await getApiService().createAppointment(data);
            
            // Optimistic update - add to store immediately
            set((state) => ({
              appointments: [...state.appointments, newAppointment],
              isLoading: false,
            }));
            
            return newAppointment;
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to create appointment';
            set({ 
              error: errorMessage, 
              isLoading: false 
            });
            throw error;
          }
        },

        updateAppointment: async (id, data) => {
          set({ isLoading: true, error: null });
          
          try {
            await getApiService().updateAppointment(id, data);
            
            // Optimistic update - update in store immediately
            set((state) => ({
              appointments: state.appointments.map(apt => 
                apt.id === id ? { ...apt, ...data, updatedAt: new Date().toISOString() } : apt
              ),
              isLoading: false,
            }));
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to update appointment';
            set({ 
              error: errorMessage, 
              isLoading: false 
            });
            throw error;
          }
        },

        deleteAppointment: async (id) => {
          set({ isLoading: true, error: null });
          
          try {
            await getApiService().deleteAppointment(id);
            
            // Optimistic update - remove from store immediately
            set((state) => ({
              appointments: state.appointments.filter(apt => apt.id !== id),
              isLoading: false,
            }));
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to delete appointment';
            set({ 
              error: errorMessage, 
              isLoading: false 
            });
            throw error;
          }
        },

        confirmAppointment: async (id) => {
          set({ isLoading: true, error: null });
          
          try {
            await getApiService().confirmAppointment(id);
            
            // Optimistic update - update status immediately
            set((state) => ({
              appointments: state.appointments.map(apt => 
                apt.id === id ? { ...apt, status: 'confirmed', updatedAt: new Date().toISOString() } : apt
              ),
              isLoading: false,
            }));
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to confirm appointment';
            set({ 
              error: errorMessage, 
              isLoading: false 
            });
            throw error;
          }
        },

        cancelAppointment: async (id) => {
          set({ isLoading: true, error: null });
          
          try {
            await getApiService().cancelAppointment(id);
            
            // Optimistic update - update status immediately
            set((state) => ({
              appointments: state.appointments.map(apt => 
                apt.id === id ? { ...apt, status: 'cancelled', updatedAt: new Date().toISOString() } : apt
              ),
              isLoading: false,
            }));
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to cancel appointment';
            set({ 
              error: errorMessage, 
              isLoading: false 
            });
            throw error;
          }
        },

        completeAppointment: async (id) => {
          set({ isLoading: true, error: null });
          
          try {
            await getApiService().completeAppointment(id);
            
            // Optimistic update - update status immediately
            set((state) => ({
              appointments: state.appointments.map(apt => 
                apt.id === id ? { ...apt, status: 'completed', updatedAt: new Date().toISOString() } : apt
              ),
              isLoading: false,
            }));
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to complete appointment';
            set({ 
              error: errorMessage, 
              isLoading: false 
            });
            throw error;
          }
        },

        reconfirmAppointment: async (id) => {
          set({ isLoading: true, error: null });
          
          try {
            await getApiService().reconfirmAppointment(id);
            
            // Optimistic update - update status immediately
            set((state) => ({
              appointments: state.appointments.map(apt => 
                apt.id === id ? { ...apt, status: 'confirmed', updatedAt: new Date().toISOString() } : apt
              ),
              isLoading: false,
            }));
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to reconfirm appointment';
            set({ 
              error: errorMessage, 
              isLoading: false 
            });
            throw error;
          }
        },

        // Query Operations
        fetchAllAppointments: async () => {
          set({ isLoading: true, error: null });
          
          try {
            const appointments = await getApiService().getAllAppointments();
            set({ 
              appointments, 
              isLoading: false 
            });
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch appointments';
            set({ 
              error: errorMessage, 
              isLoading: false,
              appointments: [] 
            });
          }
        },

        fetchTodayConfirmedAppointments: async () => {
          set({ isLoading: true, error: null });
          
          try {
            const appointments = await getApiService().getTodayConfirmedAppointments();
            set({ 
              appointments, 
              isLoading: false 
            });
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch today\'s confirmed appointments';
            set({ 
              error: errorMessage, 
              isLoading: false,
              appointments: [] 
            });
          }
        },

        fetchAppointmentsByPatientId: async (patientId: string) => {
          set({ isLoading: true, error: null });
          
          try {
            const appointments = await getApiService().getAppointmentsByPatientId(patientId);
            // Replace appointments with patient-specific ones for now
            // In a more sophisticated implementation, you might want to store these separately
            set({ 
              appointments, 
              isLoading: false 
            });
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch patient appointments';
            set({ 
              error: errorMessage, 
              isLoading: false,
              appointments: [] 
            });
          }
        },

        getAppointmentsByDate: (date: string) => {
          const { appointments } = get();
          return appointments.filter(appointment => appointment.appointmentDate === date);
        },

        getAppointmentById: async (id) => {
          set({ isLoading: true, error: null });
          
          try {
            const appointment = await getApiService().getAppointmentById(id);
            set({ isLoading: false });
            return appointment;
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch appointment';
            set({ 
              error: errorMessage, 
              isLoading: false 
            });
            throw error;
          }
        },

        // Utility Actions
        clearError: () => set({ error: null }),
        
        setLoading: (loading: boolean) => set({ isLoading: loading }),
      };
    },
    {
      name: 'appointment-store',
    }
  )
);
