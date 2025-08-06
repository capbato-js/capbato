import { create } from 'zustand';
import { 
  CreateLabRequestCommand,
  LabRequestDto,
  LabTestDto,
  BloodChemistryDto,
  CreateBloodChemistryCommand,
  TOKENS
} from '@nx-starter/application-shared';
import { container } from 'tsyringe';
import { ILaboratoryApiService } from '../api/ILaboratoryApiService';

interface LoadingStates {
  creating: boolean;
  fetching: boolean;
  updating: boolean;
}

interface ErrorStates {
  createError: string | null;
  fetchError: string | null;
  updateError: string | null;
}

interface LaboratoryStore {
  // State
  labRequests: LabRequestDto[];
  completedLabRequests: LabRequestDto[];
  labTests: LabTestDto[];
  bloodChemistryResults: BloodChemistryDto[];
  loadingStates: LoadingStates;
  errorStates: ErrorStates;

  // Actions
  createLabRequest: (command: CreateLabRequestCommand) => Promise<boolean>;
  fetchAllLabRequests: () => Promise<void>;
  fetchCompletedLabRequests: () => Promise<void>;
  fetchLabRequestByPatientId: (patientId: string) => Promise<LabRequestDto | null>;
  fetchLabRequestById: (labRequestId: string) => Promise<LabRequestDto | null>;
  fetchLabTestsByPatientId: (patientId: string) => Promise<LabTestDto[]>;
  updateLabRequestResults: (
    patientId: string, 
    requestDate: string, 
    results: Record<string, string>
  ) => Promise<boolean>;
  createBloodChemistry: (command: CreateBloodChemistryCommand) => Promise<boolean>;
  clearErrors: () => void;
  reset: () => void;
}

const initialState = {
  labRequests: [],
  completedLabRequests: [],
  labTests: [],
  bloodChemistryResults: [],
  loadingStates: {
    creating: false,
    fetching: false,
    updating: false,
  },
  errorStates: {
    createError: null,
    fetchError: null,
    updateError: null,
  },
};

export const useLaboratoryStore = create<LaboratoryStore>((set, get) => {
  // Lazy resolve API service
  const getLaboratoryApiService = () =>
    container.resolve<ILaboratoryApiService>(TOKENS.LaboratoryApiService);

  return {
    ...initialState,

    createLabRequest: async (command: CreateLabRequestCommand): Promise<boolean> => {
      console.log('🚀 Starting createLabRequest function');
      
      set(state => ({
        ...state,
        loadingStates: { ...state.loadingStates, creating: true },
        errorStates: { ...state.errorStates, createError: null }
      }));

      try {
        const laboratoryApiService = getLaboratoryApiService();
        const response = await laboratoryApiService.createLabRequest(command);
        
        console.log('🔍 Store received create response:', response);
        console.log('🔍 Response success:', response.success);
        console.log('🔍 Response data:', response.data);
        
        if (response.success && response.data) {
          console.log('✅ Adding lab request to store:', response.data);
          
          try {
            // Add to lab requests list (optimistic update)
            set(state => {
              console.log('🔍 Current state.labRequests:', state.labRequests);
              console.log('🔍 Is array?', Array.isArray(state.labRequests));
              console.log('🔍 Type of labRequests:', typeof state.labRequests);
              
              // Ensure labRequests is always an array
              const currentLabRequests = Array.isArray(state.labRequests) ? state.labRequests : [];
              return {
                ...state,
                labRequests: [response.data, ...currentLabRequests],
                loadingStates: { ...state.loadingStates, creating: false }
              };
            });
            console.log('🎯 State updated successfully');
          } catch (stateError) {
            console.error('❌ Error updating state:', stateError);
            throw stateError;
          }
          
          console.log('🎯 About to return true from createLabRequest');
          return true;
        }
        
        console.log('❌ Response not successful or missing data');
        console.log('🔍 About to return false from createLabRequest - response condition failed');
        // Handle API response failure
        const errorMessage = response.message || 'Failed to create lab request';
        set(state => ({
          ...state,
          loadingStates: { ...state.loadingStates, creating: false },
          errorStates: { ...state.errorStates, createError: errorMessage }
        }));
        return false;
      } catch (error) {
        console.log('🔍 Caught exception in createLabRequest:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        set(state => ({
          ...state,
          loadingStates: { ...state.loadingStates, creating: false },
          errorStates: { ...state.errorStates, createError: errorMessage }
        }));
        console.log('🔍 About to return false from createLabRequest - exception caught');
        return false;
      }
    },

    fetchAllLabRequests: async (): Promise<void> => {
      set(state => ({
        ...state,
        loadingStates: { ...state.loadingStates, fetching: true },
        errorStates: { ...state.errorStates, fetchError: null }
      }));

      try {
        const laboratoryApiService = getLaboratoryApiService();
        const response = await laboratoryApiService.getAllLabRequests();
        
        console.log('🔍 Store received response:', response);
        
        if (response.success && response.data) {
          console.log('✅ Setting lab requests in store:', response.data?.length || 0, 'items');
          set(state => ({
            ...state,
            labRequests: response.data || [],
            loadingStates: { ...state.loadingStates, fetching: false }
          }));
        } else {
          console.error('❌ API response not successful:', response);
          const errorMessage = response.message || 'Failed to fetch lab requests';
          set(state => ({
            ...state,
            labRequests: [],
            loadingStates: { ...state.loadingStates, fetching: false },
            errorStates: { ...state.errorStates, fetchError: errorMessage }
          }));
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        set(state => ({
          ...state,
          loadingStates: { ...state.loadingStates, fetching: false },
          errorStates: { ...state.errorStates, fetchError: errorMessage }
        }));
      }
    },

    fetchCompletedLabRequests: async (): Promise<void> => {
      set(state => ({
        ...state,
        loadingStates: { ...state.loadingStates, fetching: true },
        errorStates: { ...state.errorStates, fetchError: null }
      }));

      try {
        const laboratoryApiService = getLaboratoryApiService();
        const response = await laboratoryApiService.getCompletedLabRequests();
        
        if (response.success) {
          set(state => ({
            ...state,
            completedLabRequests: response.data,
            loadingStates: { ...state.loadingStates, fetching: false }
          }));
        } else {
          throw new Error('Failed to fetch completed lab requests');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        set(state => ({
          ...state,
          loadingStates: { ...state.loadingStates, fetching: false },
          errorStates: { ...state.errorStates, fetchError: errorMessage }
        }));
      }
    },

    fetchLabRequestByPatientId: async (patientId: string): Promise<LabRequestDto | null> => {
      set(state => ({
        ...state,
        loadingStates: { ...state.loadingStates, fetching: true },
        errorStates: { ...state.errorStates, fetchError: null }
      }));

      try {
        const laboratoryApiService = getLaboratoryApiService();
        const response = await laboratoryApiService.getLabRequestByPatientId(patientId);
        
        if (response.success && response.data) {
          set(state => ({
            ...state,
            loadingStates: { ...state.loadingStates, fetching: false }
          }));
          return response.data;
        } else {
          throw new Error(`Failed to fetch lab request for patient: ${patientId}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        set(state => ({
          ...state,
          loadingStates: { ...state.loadingStates, fetching: false },
          errorStates: { ...state.errorStates, fetchError: errorMessage }
        }));
        return null;
      }
    },

    fetchLabRequestById: async (labRequestId: string): Promise<LabRequestDto | null> => {
      set(state => ({
        ...state,
        loadingStates: { ...state.loadingStates, fetching: true },
        errorStates: { ...state.errorStates, fetchError: null }
      }));

      try {
        const laboratoryApiService = getLaboratoryApiService();
        const response = await laboratoryApiService.getLabRequestById(labRequestId);
        
        if (response.success && response.data) {
          set(state => ({
            ...state,
            loadingStates: { ...state.loadingStates, fetching: false }
          }));
          return response.data;
        } else {
          throw new Error(`Failed to fetch lab request with ID: ${labRequestId}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        set(state => ({
          ...state,
          loadingStates: { ...state.loadingStates, fetching: false },
          errorStates: { ...state.errorStates, fetchError: errorMessage }
        }));
        return null;
      }
    },

    fetchLabTestsByPatientId: async (patientId: string): Promise<LabTestDto[]> => {
      set(state => ({
        ...state,
        loadingStates: { ...state.loadingStates, fetching: true },
        errorStates: { ...state.errorStates, fetchError: null }
      }));

      try {
        const laboratoryApiService = getLaboratoryApiService();
        const response = await laboratoryApiService.getLabTestsByPatientId(patientId);
        
        console.log('🧪 Store received lab tests response:', response);
        
        if (response.success && response.data) {
          console.log('✅ Setting lab tests in store:', response.data?.length || 0, 'tests');
          set(state => ({
            ...state,
            labTests: response.data || [],
            loadingStates: { ...state.loadingStates, fetching: false }
          }));
          return response.data || [];
        } else {
          console.error('❌ API response not successful:', response);
          const errorMessage = response.message || 'Failed to fetch lab tests';
          set(state => ({
            ...state,
            labTests: [],
            loadingStates: { ...state.loadingStates, fetching: false },
            errorStates: { ...state.errorStates, fetchError: errorMessage }
          }));
          return [];
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error('❌ Error fetching lab tests:', error);
        set(state => ({
          ...state,
          labTests: [],
          loadingStates: { ...state.loadingStates, fetching: false },
          errorStates: { ...state.errorStates, fetchError: errorMessage }
        }));
        return [];
      }
    },

    updateLabRequestResults: async (
      patientId: string, 
      requestDate: string, 
      results: Record<string, string>
    ): Promise<boolean> => {
      set(state => ({
        ...state,
        loadingStates: { ...state.loadingStates, updating: true },
        errorStates: { ...state.errorStates, updateError: null }
      }));

      try {
        const laboratoryApiService = getLaboratoryApiService();
        const response = await laboratoryApiService.updateLabRequestResults(patientId, requestDate, results);
        
        if (response.success) {
          // Refresh lab requests after update
          await get().fetchAllLabRequests();
          set(state => ({
            ...state,
            loadingStates: { ...state.loadingStates, updating: false }
          }));
          return true;
        }
        
        throw new Error('Failed to update lab request results');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        set(state => ({
          ...state,
          loadingStates: { ...state.loadingStates, updating: false },
          errorStates: { ...state.errorStates, updateError: errorMessage }
        }));
        return false;
      }
    },

    createBloodChemistry: async (command: CreateBloodChemistryCommand): Promise<boolean> => {
      set(state => ({
        ...state,
        loadingStates: { ...state.loadingStates, creating: true },
        errorStates: { ...state.errorStates, createError: null }
      }));

      try {
        const laboratoryApiService = getLaboratoryApiService();
        const response = await laboratoryApiService.createBloodChemistry(command);
        
        if (response.success && response.data) {
          // Add to blood chemistry results list (optimistic update)
          set(state => ({
            ...state,
            bloodChemistryResults: [response.data, ...state.bloodChemistryResults],
            loadingStates: { ...state.loadingStates, creating: false }
          }));
          return true;
        }
        
        throw new Error('Failed to create blood chemistry');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        set(state => ({
          ...state,
          loadingStates: { ...state.loadingStates, creating: false },
          errorStates: { ...state.errorStates, createError: errorMessage }
        }));
        return false;
      }
    },

    clearErrors: () => {
      set(state => ({
        ...state,
        errorStates: {
          createError: null,
          fetchError: null,
          updateError: null,
        }
      }));
    },

    reset: () => {
      set(initialState);
    },
  };
});