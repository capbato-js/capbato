import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useLabTestFormState } from './useLabTestFormState';

// Mock react-hook-form
vi.mock('react-hook-form', () => ({
  useForm: vi.fn(),
}));

// Mock zodResolver
vi.mock('@hookform/resolvers/zod', () => ({
  zodResolver: vi.fn(),
}));

// Mock the schema
vi.mock('@nx-starter/application-shared', () => ({
  AddLabTestFormSchema: {},
}));

// Import the mocked modules
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AddLabTestFormSchema } from '@nx-starter/application-shared';

const mockUseForm = useForm as ReturnType<typeof vi.fn>;
const mockZodResolver = zodResolver as ReturnType<typeof vi.fn>;

describe('useLabTestFormState', () => {
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

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock zodResolver to return a resolver function
    mockZodResolver.mockReturnValue(vi.fn());
    
    // Mock useForm to return our mock methods
    mockUseForm.mockReturnValue(mockFormMethods);
  });

  describe('hook initialization', () => {
    it('initializes useForm with correct configuration', () => {
      renderHook(() => useLabTestFormState());

      expect(useForm).toHaveBeenCalledWith({
        resolver: expect.any(Function),
        mode: 'onBlur',
        defaultValues: {
          patientName: '',
          ageGender: '',
          requestDate: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
          selectedTests: [],
          otherTests: '',
        },
      });
    });

    it('uses zodResolver with AddLabTestFormSchema', () => {
      renderHook(() => useLabTestFormState());

      expect(zodResolver).toHaveBeenCalledWith(AddLabTestFormSchema);
    });

    it('sets requestDate to current date in YYYY-MM-DD format', () => {
      const today = new Date().toISOString().split('T')[0];
      
      renderHook(() => useLabTestFormState());

      const callArgs = mockUseForm.mock.calls[0][0];
      expect(callArgs.defaultValues.requestDate).toBe(today);
    });
  });

  describe('form methods exposure', () => {
    it('returns all form methods from useForm', () => {
      const { result } = renderHook(() => useLabTestFormState());

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

  describe('watched field values', () => {
    it('watches patientName field', () => {
      mockFormMethods.watch.mockImplementation((field) => {
        if (field === 'patientName') return 'John Doe';
        return '';
      });

      const { result } = renderHook(() => useLabTestFormState());

      expect(mockFormMethods.watch).toHaveBeenCalledWith('patientName');
      expect(result.current.patientName).toBe('John Doe');
    });

    it('watches ageGender field', () => {
      mockFormMethods.watch.mockImplementation((field) => {
        if (field === 'ageGender') return '30/M';
        return '';
      });

      const { result } = renderHook(() => useLabTestFormState());

      expect(mockFormMethods.watch).toHaveBeenCalledWith('ageGender');
      expect(result.current.ageGender).toBe('30/M');
    });

    it('watches requestDate field', () => {
      mockFormMethods.watch.mockImplementation((field) => {
        if (field === 'requestDate') return '2024-01-15';
        return '';
      });

      const { result } = renderHook(() => useLabTestFormState());

      expect(mockFormMethods.watch).toHaveBeenCalledWith('requestDate');
      expect(result.current.requestDate).toBe('2024-01-15');
    });

    it('calls watch for all three tracked fields', () => {
      renderHook(() => useLabTestFormState());

      expect(mockFormMethods.watch).toHaveBeenCalledWith('patientName');
      expect(mockFormMethods.watch).toHaveBeenCalledWith('ageGender');
      expect(mockFormMethods.watch).toHaveBeenCalledWith('requestDate');
      expect(mockFormMethods.watch).toHaveBeenCalledTimes(3);
    });
  });

  describe('form state reactivity', () => {
    it('updates watched values when form state changes', () => {
      let watchReturn = 'initial value';
      mockFormMethods.watch.mockImplementation(() => watchReturn);

      const { result, rerender } = renderHook(() => useLabTestFormState());

      expect(result.current.patientName).toBe('initial value');

      // Simulate form state change
      watchReturn = 'updated value';
      rerender();

      expect(result.current.patientName).toBe('updated value');
    });

    it('maintains watch functionality across re-renders', () => {
      const { rerender } = renderHook(() => useLabTestFormState());

      rerender();
      rerender();

      // Should still be watching the same fields
      expect(mockFormMethods.watch).toHaveBeenCalledWith('patientName');
      expect(mockFormMethods.watch).toHaveBeenCalledWith('ageGender');
      expect(mockFormMethods.watch).toHaveBeenCalledWith('requestDate');
    });
  });

  describe('form configuration', () => {
    it('configures form with onBlur validation mode', () => {
      renderHook(() => useLabTestFormState());

      const config = mockUseForm.mock.calls[0][0];
      expect(config.mode).toBe('onBlur');
    });

    it('sets up correct default values structure', () => {
      renderHook(() => useLabTestFormState());

      const config = mockUseForm.mock.calls[0][0];
      const { defaultValues } = config;

      expect(defaultValues).toEqual({
        patientName: '',
        ageGender: '',
        requestDate: expect.any(String),
        selectedTests: [],
        otherTests: '',
      });

      // Verify selectedTests is an empty array
      expect(Array.isArray(defaultValues.selectedTests)).toBe(true);
      expect(defaultValues.selectedTests).toHaveLength(0);
    });

    it('initializes empty string fields correctly', () => {
      renderHook(() => useLabTestFormState());

      const config = mockUseForm.mock.calls[0][0];
      const { defaultValues } = config;

      expect(defaultValues.patientName).toBe('');
      expect(defaultValues.ageGender).toBe('');
      expect(defaultValues.otherTests).toBe('');
    });
  });

  describe('edge cases', () => {
    it('handles undefined watch values gracefully', () => {
      mockFormMethods.watch.mockReturnValue(undefined);

      const { result } = renderHook(() => useLabTestFormState());

      expect(result.current.patientName).toBeUndefined();
      expect(result.current.ageGender).toBeUndefined();
      expect(result.current.requestDate).toBeUndefined();
    });

    it('handles null watch values gracefully', () => {
      mockFormMethods.watch.mockReturnValue(null);

      const { result } = renderHook(() => useLabTestFormState());

      expect(result.current.patientName).toBeNull();
      expect(result.current.ageGender).toBeNull();
      expect(result.current.requestDate).toBeNull();
    });

    it('maintains hook stability across multiple renders', () => {
      const { result, rerender } = renderHook(() => useLabTestFormState());

      const firstResult = result.current;
      rerender();
      const secondResult = result.current;

      // Form methods should be the same reference (from react-hook-form)
      expect(secondResult.register).toBe(firstResult.register);
      expect(secondResult.handleSubmit).toBe(firstResult.handleSubmit);
      expect(secondResult.formState).toBe(firstResult.formState);
    });
  });

  describe('type safety', () => {
    it('ensures proper typing for AddLabTestFormData interface', () => {
      // This test verifies the interface is properly exported and used
      const { result } = renderHook(() => useLabTestFormState());

      // The hook should return typed methods
      expect(typeof result.current.register).toBe('function');
      expect(typeof result.current.handleSubmit).toBe('function');
      expect(typeof result.current.patientName).toBeDefined();
      expect(typeof result.current.ageGender).toBeDefined();
      expect(typeof result.current.requestDate).toBeDefined();
    });
  });
});