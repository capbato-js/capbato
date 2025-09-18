import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useLabTestResultFormState } from './useLabTestResultFormState';

// Mock react-hook-form
vi.mock('react-hook-form', () => ({
  useForm: vi.fn(),
}));

// Mock zodResolver
vi.mock('@hookform/resolvers/zod', () => ({
  zodResolver: vi.fn(),
}));

// Mock the lab test config
vi.mock('../constants/labTestFormConfig', () => ({
  generateLabTestSchema: vi.fn(),
}));

// Import the mocked modules
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { generateLabTestSchema } from '../constants/labTestFormConfig';

const mockUseForm = useForm as ReturnType<typeof vi.fn>;
const mockZodResolver = zodResolver as ReturnType<typeof vi.fn>;
const mockGenerateLabTestSchema = generateLabTestSchema as ReturnType<typeof vi.fn>;

// Define test type constants
const TEST_TYPES = {
  HEMATOLOGY: 'hematology',
  CLINICAL_CHEMISTRY: 'clinical_chemistry',
  MICROBIOLOGY: 'microbiology',
  SEROLOGY: 'serology',
} as const;

type TestType = typeof TEST_TYPES[keyof typeof TEST_TYPES];

describe('useLabTestResultFormState', () => {
  const mockFormMethods = {
    register: vi.fn(),
    handleSubmit: vi.fn(),
    formState: {
      errors: {},
      isValid: true,
      isSubmitting: false,
      isDirty: false,
      isSubmitSuccessful: false,
    },
    setValue: vi.fn(),
    getValues: vi.fn(),
    watch: vi.fn(),
    reset: vi.fn(),
    clearErrors: vi.fn(),
    setError: vi.fn(),
    trigger: vi.fn(),
    control: {},
  };

  const mockSchema = { parse: vi.fn() };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock console.log to avoid noise in tests
    vi.spyOn(console, 'log').mockImplementation(vi.fn());
    
    // Mock generateLabTestSchema to return a schema
    mockGenerateLabTestSchema.mockReturnValue(mockSchema);
    
    // Mock zodResolver to return a resolver function
    mockZodResolver.mockReturnValue(vi.fn());
    
    // Mock useForm to return our mock methods
    mockUseForm.mockReturnValue(mockFormMethods);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('hook initialization', () => {
    it('generates schema for the provided test type', () => {
      const props = {
        testType: TEST_TYPES.HEMATOLOGY as TestType,
      };

      renderHook(() => useLabTestResultFormState(props));

      expect(generateLabTestSchema).toHaveBeenCalledWith(TEST_TYPES.HEMATOLOGY);
    });

    it('uses zodResolver with generated schema', () => {
      const props = {
        testType: TEST_TYPES.CLINICAL_CHEMISTRY as TestType,
      };

      renderHook(() => useLabTestResultFormState(props));

      expect(zodResolver).toHaveBeenCalledWith(mockSchema);
    });

    it('initializes useForm with correct configuration and no existing data', () => {
      const props = {
        testType: TEST_TYPES.MICROBIOLOGY as TestType,
      };

      renderHook(() => useLabTestResultFormState(props));

      expect(useForm).toHaveBeenCalledWith({
        resolver: expect.any(Function),
        defaultValues: {},
      });
    });

    it('initializes useForm with existing data when provided', () => {
      const existingData = {
        hemoglobin: '12.5',
        hematocrit: '38.0',
        plateletCount: '250000',
      };

      const props = {
        testType: TEST_TYPES.HEMATOLOGY as TestType,
        existingData,
      };

      renderHook(() => useLabTestResultFormState(props));

      expect(useForm).toHaveBeenCalledWith({
        resolver: expect.any(Function),
        defaultValues: existingData,
      });
    });
  });

  describe('form methods exposure', () => {
    it('returns all form methods from useForm', () => {
      const props = {
        testType: TEST_TYPES.SEROLOGY as TestType,
      };

      const { result } = renderHook(() => useLabTestResultFormState(props));

      // Check that all expected form methods are exposed
      expect(result.current.register).toBe(mockFormMethods.register);
      expect(result.current.handleSubmit).toBe(mockFormMethods.handleSubmit);
      expect(result.current.formState).toBe(mockFormMethods.formState);
      expect(result.current.setValue).toBe(mockFormMethods.setValue);
      expect(result.current.getValues).toBe(mockFormMethods.getValues);
      expect(result.current.watch).toBe(mockFormMethods.watch);
      expect(result.current.reset).toBe(mockFormMethods.reset);
      expect(result.current.clearErrors).toBe(mockFormMethods.clearErrors);
      expect(result.current.setError).toBe(mockFormMethods.setError);
      expect(result.current.trigger).toBe(mockFormMethods.trigger);
      expect(result.current.control).toBe(mockFormMethods.control);
    });
  });

  describe('existing data handling', () => {
    it('resets form when existingData is provided initially', () => {
      const existingData = {
        glucose: '95.0',
        cholesterol: '180.0',
      };

      const props = {
        testType: TEST_TYPES.CLINICAL_CHEMISTRY as TestType,
        existingData,
      };

      renderHook(() => useLabTestResultFormState(props));

      expect(mockFormMethods.reset).toHaveBeenCalledWith(existingData);
    });

    it('resets form when existingData changes', () => {
      const initialData = {
        glucose: '95.0',
        cholesterol: '180.0',
      };

      const updatedData = {
        glucose: '105.0',
        cholesterol: '190.0',
        triglycerides: '150.0',
      };

      const { rerender } = renderHook(
        ({ testType, existingData }) => useLabTestResultFormState({ testType, existingData }),
        {
          initialProps: {
            testType: TEST_TYPES.CLINICAL_CHEMISTRY as TestType,
            existingData: initialData,
          },
        }
      );

      // Clear previous calls
      mockFormMethods.reset.mockClear();

      // Update with new data
      rerender({
        testType: TEST_TYPES.CLINICAL_CHEMISTRY as TestType,
        existingData: updatedData,
      });

      expect(mockFormMethods.reset).toHaveBeenCalledWith(updatedData);
    });

    it('does not reset form when existingData is undefined', () => {
      const props = {
        testType: TEST_TYPES.HEMATOLOGY as TestType,
        existingData: undefined,
      };

      renderHook(() => useLabTestResultFormState(props));

      expect(mockFormMethods.reset).not.toHaveBeenCalled();
    });

    it('does not reset form when existingData is null', () => {
      const props = {
        testType: TEST_TYPES.HEMATOLOGY as TestType,
        existingData: null as unknown as Record<string, string | undefined>,
      };

      renderHook(() => useLabTestResultFormState(props));

      expect(mockFormMethods.reset).not.toHaveBeenCalled();
    });

    it('logs reset operation when existingData is provided', () => {
      const existingData = {
        wbc: '7500',
        rbc: '4.5',
      };

      const props = {
        testType: TEST_TYPES.HEMATOLOGY as TestType,
        existingData,
      };

      renderHook(() => useLabTestResultFormState(props));

      expect(console.log).toHaveBeenCalledWith(
        '🔄 Resetting form with existing data:',
        existingData
      );
    });
  });

  describe('test type variations', () => {
    it('works with hematology test type', () => {
      const props = {
        testType: TEST_TYPES.HEMATOLOGY as TestType,
      };

      const { result } = renderHook(() => useLabTestResultFormState(props));

      expect(generateLabTestSchema).toHaveBeenCalledWith(TEST_TYPES.HEMATOLOGY);
      expect(result.current).toBeDefined();
    });

    it('works with clinical chemistry test type', () => {
      const props = {
        testType: TEST_TYPES.CLINICAL_CHEMISTRY as TestType,
      };

      const { result } = renderHook(() => useLabTestResultFormState(props));

      expect(generateLabTestSchema).toHaveBeenCalledWith(TEST_TYPES.CLINICAL_CHEMISTRY);
      expect(result.current).toBeDefined();
    });

    it('works with microbiology test type', () => {
      const props = {
        testType: TEST_TYPES.MICROBIOLOGY as TestType,
      };

      const { result } = renderHook(() => useLabTestResultFormState(props));

      expect(generateLabTestSchema).toHaveBeenCalledWith(TEST_TYPES.MICROBIOLOGY);
      expect(result.current).toBeDefined();
    });

    it('works with serology test type', () => {
      const props = {
        testType: TEST_TYPES.SEROLOGY as TestType,
      };

      const { result } = renderHook(() => useLabTestResultFormState(props));

      expect(generateLabTestSchema).toHaveBeenCalledWith(TEST_TYPES.SEROLOGY);
      expect(result.current).toBeDefined();
    });
  });

  describe('schema regeneration', () => {
    it('regenerates schema when test type changes', () => {
      const { rerender } = renderHook(
        ({ testType, existingData }) => useLabTestResultFormState({ testType, existingData }),
        {
          initialProps: {
            testType: TEST_TYPES.HEMATOLOGY as TestType,
            existingData: undefined,
          },
        }
      );

      // Clear previous calls
      mockGenerateLabTestSchema.mockClear();

      // Change test type
      rerender({
        testType: TEST_TYPES.CLINICAL_CHEMISTRY as TestType,
        existingData: undefined,
      });

      expect(generateLabTestSchema).toHaveBeenCalledWith(TEST_TYPES.CLINICAL_CHEMISTRY);
    });

    it('creates new form instance when test type changes', () => {
      const { rerender } = renderHook(
        ({ testType, existingData }) => useLabTestResultFormState({ testType, existingData }),
        {
          initialProps: {
            testType: TEST_TYPES.HEMATOLOGY as TestType,
            existingData: undefined,
          },
        }
      );

      const initialCallCount = mockUseForm.mock.calls.length;

      // Change test type
      rerender({
        testType: TEST_TYPES.CLINICAL_CHEMISTRY as TestType,
        existingData: undefined,
      });

      expect(mockUseForm.mock.calls.length).toBeGreaterThan(initialCallCount);
    });
  });

  describe('edge cases', () => {
    it('handles empty existing data object', () => {
      const props = {
        testType: TEST_TYPES.HEMATOLOGY as TestType,
        existingData: {},
      };

      renderHook(() => useLabTestResultFormState(props));

      expect(useForm).toHaveBeenCalledWith({
        resolver: expect.any(Function),
        defaultValues: {},
      });
      expect(mockFormMethods.reset).toHaveBeenCalledWith({});
    });

    it('handles existing data with undefined values', () => {
      const existingData = {
        hemoglobin: '12.5',
        hematocrit: undefined,
        plateletCount: '250000',
      };

      const props = {
        testType: TEST_TYPES.HEMATOLOGY as TestType,
        existingData,
      };

      renderHook(() => useLabTestResultFormState(props));

      expect(useForm).toHaveBeenCalledWith({
        resolver: expect.any(Function),
        defaultValues: existingData,
      });
      expect(mockFormMethods.reset).toHaveBeenCalledWith(existingData);
    });

    it('maintains hook stability when props do not change', () => {
      const props = {
        testType: TEST_TYPES.HEMATOLOGY as TestType,
        existingData: { hemoglobin: '12.5' },
      };

      const { result, rerender } = renderHook(() => useLabTestResultFormState(props));

      const firstResult = result.current;
      rerender();
      const secondResult = result.current;

      // Form methods should be the same reference (from react-hook-form)
      expect(secondResult.register).toBe(firstResult.register);
      expect(secondResult.handleSubmit).toBe(firstResult.handleSubmit);
      expect(secondResult.formState).toBe(firstResult.formState);
    });

    it('handles multiple rapid existingData changes', () => {
      const { rerender } = renderHook(
        ({ testType, existingData }) => useLabTestResultFormState({ testType, existingData }),
        {
          initialProps: {
            testType: TEST_TYPES.CLINICAL_CHEMISTRY as TestType,
            existingData: { glucose: '95.0' },
          },
        }
      );

      // Clear initial reset call
      mockFormMethods.reset.mockClear();

      // Rapid changes
      rerender({
        testType: TEST_TYPES.CLINICAL_CHEMISTRY as TestType,
        existingData: { glucose: '100.0' },
      });

      rerender({
        testType: TEST_TYPES.CLINICAL_CHEMISTRY as TestType,
        existingData: { glucose: '105.0' },
      });

      rerender({
        testType: TEST_TYPES.CLINICAL_CHEMISTRY as TestType,
        existingData: { glucose: '110.0' },
      });

      expect(mockFormMethods.reset).toHaveBeenCalledTimes(3);
      expect(mockFormMethods.reset).toHaveBeenLastCalledWith({ glucose: '110.0' });
    });
  });

  describe('type safety', () => {
    it('ensures proper typing for AddLabTestResultFormData', () => {
      const props = {
        testType: TEST_TYPES.HEMATOLOGY as TestType,
        existingData: {
          hemoglobin: '12.5',
          hematocrit: '38.0',
        } as Record<string, string | undefined>,
      };

      const { result } = renderHook(() => useLabTestResultFormState(props));

      // The hook should return typed methods
      expect(typeof result.current.register).toBe('function');
      expect(typeof result.current.handleSubmit).toBe('function');
      expect(typeof result.current.formState).toBe('object');
    });

    it('accepts undefined values in existing data', () => {
      const props = {
        testType: TEST_TYPES.CLINICAL_CHEMISTRY as TestType,
        existingData: {
          glucose: '95.0',
          cholesterol: undefined,
          triglycerides: '150.0',
        } as Record<string, string | undefined>,
      };

      expect(() => {
        renderHook(() => useLabTestResultFormState(props));
      }).not.toThrow();
    });
  });
});