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
          error: null,
          patientDetailsErrors: {},
          createPatientError: null,

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

          getPatientDetailsError(id: string) {
            return get().patientDetailsErrors[id] || null;
          },

          getCreatePatientError() {
            return get().createPatientError;
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
        };
      }),
      {
        name: 'patient-store',
      }
    )
  )
);