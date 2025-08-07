import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { subscribeWithSelector } from 'zustand/middleware';
import { container } from '../di/container';
import { TOKENS } from '@nx-starter/application-shared';
import type { PatientStore } from './PatientStoreInterface';
import type { IPatientApiService } from '../api/IPatientApiService';

export const usePatientStore = create<PatientStore>()(
  subscribeWithSelector(
    devtools(
      immer((set, get) => {
        // Lazy resolve API service directly - no need for complex repository pattern for simple display
        const getApiService = () =>
          container.resolve<IPatientApiService>(TOKENS.PatientApiService);

        return {
          // Initial state
          patients: [],
          patientDetails: {},
          status: 'idle',
          patientDetailsStatus: {},
          createPatientStatus: 'idle',
          updatePatientStatus: {},
          error: null,
          patientDetailsErrors: {},
          createPatientError: null,
          updatePatientErrors: {},

          // Computed values as functions
          getIsLoading() {
            return get().status === 'loading';
          },

          getIsIdle() {
            return get().status === 'idle';
          },

          getHasError() {
            return get().status === 'failed';
          },

          getIsLoadingPatientDetails(id: string) {
            return get().patientDetailsStatus[id] === 'loading';
          },

          getIsCreatingPatient() {
            return get().createPatientStatus === 'loading';
          },

          getIsUpdatingPatient(id: string) {
            return get().updatePatientStatus[id] === 'loading';
          },

          getPatientDetailsError(id: string) {
            return get().patientDetailsErrors[id] || null;
          },

          getCreatePatientError() {
            return get().createPatientError;
          },

          getUpdatePatientError(id: string) {
            return get().updatePatientErrors[id];
          },

          getPatientDetails(id: string) {
            return get().patientDetails[id];
          },

          // Actions
          async loadPatients() {
            set((state) => {
              state.status = 'loading';
              state.error = null;
            });

            try {
              const response = await getApiService().getAllPatients();
              set((state) => {
                state.patients = response.data;
                state.status = 'succeeded';
              });
            } catch (error) {
              set((state) => {
                state.error =
                  error instanceof Error
                    ? error.message
                    : 'Failed to load patients';
                state.status = 'failed';
              });
            }
          },

          async loadPatientById(id: string) {
            set((state) => {
              state.patientDetailsStatus[id] = 'loading';
              state.patientDetailsErrors[id] = null;
            });

            try {
              const response = await getApiService().getPatientById(id);
              set((state) => {
                state.patientDetails[id] = response.data;
                state.patientDetailsStatus[id] = 'succeeded';
              });
            } catch (error) {
              set((state) => {
                state.patientDetailsErrors[id] =
                  error instanceof Error
                    ? error.message
                    : `Failed to load patient with ID: ${id}`;
                state.patientDetailsStatus[id] = 'failed';
              });
            }
          },

          async createPatient(command) {
            set((state) => {
              state.createPatientStatus = 'loading';
              state.createPatientError = null;
            });

            try {
              const response = await getApiService().createPatient(command);
              const newPatient = response.data;
              
              set((state) => {
                // Add new patient to the list (optimistic update)
                const newPatientListItem = {
                  id: newPatient.id,
                  patientNumber: newPatient.patientNumber,
                  firstName: newPatient.firstName,
                  lastName: newPatient.lastName,
                  middleName: newPatient.middleName,
                  age: newPatient.age,
                  gender: newPatient.gender,
                  contactNumber: newPatient.contactNumber,
                  address: newPatient.address,
                  dateOfBirth: newPatient.dateOfBirth,
                };
                state.patients.push(newPatientListItem);
                
                // Also cache the full patient details
                state.patientDetails[newPatient.id] = newPatient;
                state.patientDetailsStatus[newPatient.id] = 'succeeded';
                
                state.createPatientStatus = 'succeeded';
              });
              
              return newPatient;
            } catch (error) {
              set((state) => {
                // Preserve the error object for proper classification
                state.createPatientError = error;
                state.createPatientStatus = 'failed';
              });
              return null;
            }
          },

          async updatePatient(command) {
            console.log('🔄 PatientStore.updatePatient called with:', command);
            set((state) => {
              state.updatePatientStatus[command.id] = 'loading';
              state.updatePatientErrors[command.id] = null;
            });

            try {
              console.log('📡 Calling API service updatePatient...');
              const response = await getApiService().updatePatient(command);
              console.log('✅ API response received:', response);
              const updatedPatient = response.data;
              
              set((state) => {
                // Update patient in the list
                const patientIndex = state.patients.findIndex(p => p.id === command.id);
                if (patientIndex !== -1) {
                  const updatedPatientListItem = {
                    id: updatedPatient.id,
                    patientNumber: updatedPatient.patientNumber,
                    firstName: updatedPatient.firstName,
                    lastName: updatedPatient.lastName,
                    middleName: updatedPatient.middleName,
                    age: updatedPatient.age,
                    gender: updatedPatient.gender,
                    contactNumber: updatedPatient.contactNumber,
                    address: updatedPatient.address,
                    dateOfBirth: updatedPatient.dateOfBirth,
                  };
                  state.patients[patientIndex] = updatedPatientListItem;
                }
                
                // Update cached patient details
                state.patientDetails[updatedPatient.id] = updatedPatient;
                state.patientDetailsStatus[updatedPatient.id] = 'succeeded';
                
                state.updatePatientStatus[command.id] = 'succeeded';
              });
              
              return updatedPatient;
            } catch (error) {
              set((state) => {
                // Preserve the error object for proper classification
                state.updatePatientErrors[command.id] = error;
                state.updatePatientStatus[command.id] = 'failed';
              });
              return null;
            }
          },

          clearError() {
            set((state) => {
              state.error = null;
              if (state.status === 'failed') {
                state.status = 'idle';
              }
            });
          },

          clearPatientDetailsError(id: string) {
            set((state) => {
              state.patientDetailsErrors[id] = null;
              if (state.patientDetailsStatus[id] === 'failed') {
                state.patientDetailsStatus[id] = 'idle';
              }
            });
          },

          clearCreatePatientError() {
            set((state) => {
              state.createPatientError = null;
              if (state.createPatientStatus === 'failed') {
                state.createPatientStatus = 'idle';
              }
            });
          },

          clearUpdatePatientError(id: string) {
            set((state) => {
              state.updatePatientErrors[id] = null;
              if (state.updatePatientStatus[id] === 'failed') {
                state.updatePatientStatus[id] = 'idle';
              }
            });
          },
        };
      }),
      {
        name: 'patient-store',
      }
    )
  )
);