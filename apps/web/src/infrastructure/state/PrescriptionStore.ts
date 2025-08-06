import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { subscribeWithSelector } from 'zustand/middleware';
import { container, TOKENS } from '../di/container';
import { Prescription, Medication } from '@nx-starter/domain';
import type { PrescriptionStore } from './PrescriptionStoreInterface';
import type {
  IPrescriptionCommandService,
  IPrescriptionQueryService,
  CreatePrescriptionCommand,
  UpdatePrescriptionCommand,
} from '@nx-starter/application-shared';
import { isExpired } from '../../presentation/features/prescriptions/utils/prescriptionUtils';

export const usePrescriptionStore = create<PrescriptionStore>()(
  subscribeWithSelector(
    devtools(
      immer((set, get) => {
        // Lazy resolve CQRS services - proper separation of concerns
        const getCommandService = () =>
          container.resolve<IPrescriptionCommandService>(TOKENS.PrescriptionCommandService);
        const getQueryService = () =>
          container.resolve<IPrescriptionQueryService>(TOKENS.PrescriptionQueryService);

        return {
          // Initial state
          prescriptions: [],
          filter: 'all',
          status: 'idle',
          error: null,

          // Computed values as functions
          getFilteredPrescriptions() {
            const { prescriptions, filter } = get();
            switch (filter) {
              case 'active':
                return prescriptions.filter((prescription) => prescription.status === 'active');
              case 'completed':
                return prescriptions.filter((prescription) => prescription.status === 'completed');
              case 'discontinued':
                return prescriptions.filter((prescription) => prescription.status === 'discontinued');
              case 'on-hold':
                return prescriptions.filter((prescription) => prescription.status === 'on-hold');
              case 'expired':
                return prescriptions.filter((prescription) => isExpired(prescription));
              default:
                return prescriptions;
            }
          },

          getStats() {
            const { prescriptions } = get();
            return {
              total: prescriptions.length,
              active: prescriptions.filter((prescription) => prescription.status === 'active').length,
              completed: prescriptions.filter((prescription) => prescription.status === 'completed').length,
              discontinued: prescriptions.filter((prescription) => prescription.status === 'discontinued').length,
              onHold: prescriptions.filter((prescription) => prescription.status === 'on-hold').length,
              expired: prescriptions.filter((prescription) => isExpired(prescription)).length,
            };
          },

          getIsLoading() {
            return get().status === 'loading';
          },

          getIsIdle() {
            return get().status === 'idle';
          },

          getHasError() {
            return get().status === 'failed';
          },

          // Actions
          async loadPrescriptions() {
            set((state) => {
              state.status = 'loading';
              state.error = null;
            });

            try {
              const prescriptions = await getQueryService().getAllPrescriptions();
              set((state) => {
                state.prescriptions = prescriptions;
                state.status = 'succeeded';
              });
            } catch (error) {
              set((state) => {
                state.error =
                  error instanceof Error
                    ? error.message
                    : 'Failed to load prescriptions';
                state.status = 'failed';
              });
            }
          },

          async createPrescription(data: CreatePrescriptionCommand) {
            set((state) => {
              state.error = null;
            });

            try {
              const prescription = await getCommandService().createPrescription(data);
              set((state) => {
                state.prescriptions.unshift(prescription);
                state.status = 'succeeded';
              });
            } catch (error) {
              set((state) => {
                state.error =
                  error instanceof Error
                    ? error.message
                    : 'Failed to create prescription';
                state.status = 'failed';
              });
              throw error;
            }
          },

          async updatePrescription(id: string, updates: UpdatePrescriptionCommand) {
            // Optimistic update - create deep copy of prescriptions
            const originalPrescriptions = get().prescriptions.map(
              (prescription) =>
                new Prescription(
                  prescription.patientId,
                  prescription.doctorId,
                  prescription.medications,
                  prescription.prescribedDate,
                  prescription.stringId,
                  prescription.expiryDate,
                  prescription.quantity,
                  prescription.additionalNotes,
                  prescription.status,
                  prescription.createdAt
                )
            );

            set((state) => {
              const index = state.prescriptions.findIndex(
                (prescription) => prescription.stringId === id
              );
              if (index !== -1) {
                // Create a new Prescription entity with the updates instead of mutating
                const currentPrescription = state.prescriptions[index];
                
                // Handle medications update - merge with existing medications if needed
                let updatedMedications = [...currentPrescription.medications];
                if (updates.medications && updates.medications.length > 0) {
                  // Convert update medication objects to Medication entities
                  updatedMedications = updates.medications.map(medUpdate => 
                    new Medication(
                      currentPrescription.stringId || currentPrescription.id?.value.toString() || 'TEMP',
                      medUpdate.medicationName,
                      medUpdate.dosage,
                      medUpdate.instructions,
                      medUpdate.frequency,
                      medUpdate.duration,
                      medUpdate.id
                    )
                  );
                }
                
                state.prescriptions[index] = new Prescription(
                  currentPrescription.patientId,
                  currentPrescription.doctorId,
                  updatedMedications.map(med => 
                    // Convert WritableDraft to regular Medication if needed
                    med instanceof Medication ? med : new Medication(
                      currentPrescription.stringId || currentPrescription.id?.value.toString() || 'TEMP',
                      (med as any).medicationNameValue || (med as any)._medicationName?.value || '',
                      (med as any).dosageValue || (med as any)._dosage?.value || '',
                      (med as any).instructionsValue || (med as any)._instructions?.value || '',
                      (med as any).frequency || '',
                      (med as any).duration || '',
                      (med as any).stringId
                    )
                  ),
                  currentPrescription.prescribedDate,
                  currentPrescription.stringId,
                  updates.expiryDate !== undefined
                    ? (typeof updates.expiryDate === 'string' ? new Date(updates.expiryDate) : updates.expiryDate)
                    : currentPrescription.expiryDate,
                  updates.quantity !== undefined
                    ? updates.quantity
                    : currentPrescription.quantity,
                  updates.additionalNotes !== undefined
                    ? updates.additionalNotes
                    : currentPrescription.additionalNotes,
                  updates.status !== undefined
                    ? updates.status
                    : currentPrescription.status,
                  currentPrescription.createdAt
                );
              }
              state.error = null;
            });

            try {
              const updatedPrescription = await getCommandService().updatePrescription(id, updates);
              set((state) => {
                const index = state.prescriptions.findIndex(
                  (prescription) => prescription.stringId === id
                );
                if (index !== -1) {
                  state.prescriptions[index] = updatedPrescription;
                }
                state.status = 'succeeded';
              });
            } catch (error) {
              // Revert optimistic update
              set((state) => {
                state.prescriptions = originalPrescriptions;
                state.status = 'failed';
                state.error =
                  error instanceof Error
                    ? error.message
                    : 'Failed to update prescription';
              });
              throw error;
            }
          },

          async deletePrescription(id: string) {
            // Optimistic update - create deep copy of prescriptions
            const originalPrescriptions = get().prescriptions.map(
              (prescription) =>
                new Prescription(
                  prescription.patientId,
                  prescription.doctorId,
                  prescription.medications,
                  prescription.prescribedDate,
                  prescription.stringId,
                  prescription.expiryDate,
                  prescription.quantity,
                  prescription.additionalNotes,
                  prescription.status,
                  prescription.createdAt
                )
            );

            set((state) => {
              state.prescriptions = state.prescriptions.filter(
                (prescription) => prescription.stringId !== id
              );
              state.error = null;
            });

            try {
              await getCommandService().deletePrescription(id);
              set((state) => {
                state.status = 'succeeded';
              });
            } catch (error) {
              // Revert optimistic update
              set((state) => {
                state.prescriptions = originalPrescriptions;
                state.status = 'failed';
                state.error =
                  error instanceof Error
                    ? error.message
                    : 'Failed to delete prescription';
              });
              throw error;
            }
          },

          async loadPrescriptionsByPatientId(patientId: string) {
            set((state) => {
              state.status = 'loading';
              state.error = null;
            });

            try {
              const prescriptions = await getQueryService().getPrescriptionsByPatientId(patientId);
              set((state) => {
                state.prescriptions = prescriptions;
                state.status = 'succeeded';
              });
            } catch (error) {
              set((state) => {
                state.error =
                  error instanceof Error
                    ? error.message
                    : 'Failed to load prescriptions by patient ID';
                state.status = 'failed';
              });
            }
          },

          async loadPrescriptionsByDoctorId(doctorId: string) {
            set((state) => {
              state.status = 'loading';
              state.error = null;
            });

            try {
              const prescriptions = await getQueryService().getPrescriptionsByDoctorId(doctorId);
              set((state) => {
                state.prescriptions = prescriptions;
                state.status = 'succeeded';
              });
            } catch (error) {
              set((state) => {
                state.error =
                  error instanceof Error
                    ? error.message
                    : 'Failed to load prescriptions by doctor ID';
                state.status = 'failed';
              });
            }
          },

          async loadActivePrescriptions() {
            set((state) => {
              state.status = 'loading';
              state.error = null;
            });

            try {
              const prescriptions = await getQueryService().getActivePrescriptions();
              set((state) => {
                state.prescriptions = prescriptions;
                state.status = 'succeeded';
              });
            } catch (error) {
              set((state) => {
                state.error =
                  error instanceof Error
                    ? error.message
                    : 'Failed to load active prescriptions';
                state.status = 'failed';
              });
            }
          },

          async loadExpiredPrescriptions() {
            set((state) => {
              state.status = 'loading';
              state.error = null;
            });

            try {
              const prescriptions = await getQueryService().getExpiredPrescriptions();
              set((state) => {
                state.prescriptions = prescriptions;
                state.status = 'succeeded';
              });
            } catch (error) {
              set((state) => {
                state.error =
                  error instanceof Error
                    ? error.message
                    : 'Failed to load expired prescriptions';
                state.status = 'failed';
              });
            }
          },

          setFilter(filter) {
            set((state) => {
              state.filter = filter;
            });
          },

          clearError() {
            set((state) => {
              state.error = null;
              if (state.status === 'failed') {
                state.status = 'idle';
              }
            });
          },
        };
      }),
      {
        name: 'prescription-store',
      }
    )
  )
);