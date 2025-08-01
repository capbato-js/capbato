import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { container } from '../di/container';
import { IDoctorApiService } from '../api/IDoctorApiService';
import { DoctorStoreInterface } from './DoctorStoreInterface';
import { DoctorDto, DoctorSummaryDto, TOKENS } from '@nx-starter/application-shared';

/**
 * Doctor Store Implementation using Zustand
 * Manages doctor state with CQRS pattern and optimistic updates
 */
const useDoctorStore = create<DoctorStoreInterface>()(
  devtools(
    (set) => {
      // Get the API service from the DI container
      const getDoctorApiService = (): IDoctorApiService => {
        return container.resolve<IDoctorApiService>(TOKENS.DoctorApiService);
      };

      return {
        // Initial State
        doctors: [],
        doctorSummaries: [],
        currentDoctor: null,
        isLoading: false,
        error: null,

        // Query Actions
        getAllDoctors: async (activeOnly = true, format: 'full' | 'summary' = 'full') => {
          set({ isLoading: true, error: null });
          
          try {
            const apiService = getDoctorApiService();
            const doctorsData = await apiService.getAllDoctors(activeOnly, format);
            
            if (format === 'summary') {
              set({ 
                doctorSummaries: doctorsData as DoctorSummaryDto[], 
                doctors: [], // Clear full doctors when using summary
                isLoading: false 
              });
            } else {
              set({ 
                doctors: doctorsData as DoctorDto[], 
                doctorSummaries: [], // Clear summaries when using full
                isLoading: false 
              });
            }
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch doctors';
            set({ error: errorMessage, isLoading: false });
            console.error('Error in getAllDoctors:', error);
          }
        },

        getDoctorById: async (id: string) => {
          set({ isLoading: true, error: null });
          
          try {
            const apiService = getDoctorApiService();
            const doctor = await apiService.getDoctorById(id);
            
            set({ 
              currentDoctor: doctor, 
              isLoading: false 
            });
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : `Failed to fetch doctor with ID ${id}`;
            set({ error: errorMessage, isLoading: false });
            console.error('Error in getDoctorById:', error);
          }
        },

        getDoctorByUserId: async (userId: string) => {
          set({ isLoading: true, error: null });
          
          try {
            const apiService = getDoctorApiService();
            const doctor = await apiService.getDoctorByUserId(userId);
            
            set({ 
              currentDoctor: doctor, 
              isLoading: false 
            });
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : `Failed to fetch doctor profile for user ${userId}`;
            set({ error: errorMessage, isLoading: false });
            console.error('Error in getDoctorByUserId:', error);
          }
        },

        getDoctorsBySpecialization: async (specialization: string, activeOnly = true) => {
          set({ isLoading: true, error: null });
          
          try {
            const apiService = getDoctorApiService();
            const doctors = await apiService.getDoctorsBySpecialization(specialization, activeOnly);
            
            set({ 
              doctors, 
              doctorSummaries: [], // Clear summaries when filtering by specialization
              isLoading: false 
            });
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : `Failed to fetch doctors with specialization: ${specialization}`;
            set({ error: errorMessage, isLoading: false });
            console.error('Error in getDoctorsBySpecialization:', error);
          }
        },

        checkDoctorProfileExists: async (userId: string): Promise<boolean> => {
          try {
            const apiService = getDoctorApiService();
            return await apiService.checkDoctorProfileExists(userId);
          } catch (error) {
            console.error('Error in checkDoctorProfileExists:', error);
            return false;
          }
        },

        // State Actions
        clearError: () => {
          set({ error: null });
        },

        clearCurrentDoctor: () => {
          set({ currentDoctor: null });
        },

        setLoading: (loading: boolean) => {
          set({ isLoading: loading });
        },
      };
    },
    {
      name: 'doctor-store',
    }
  )
);

export { useDoctorStore };
