import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useFormDataHandling } from './useFormDataHandling';
import type { AddLabTestResultFormData } from './useLabTestResultFormState';

describe('useFormDataHandling', () => {
  describe('hook initialization', () => {
    it('returns expected functions', () => {
      const mockOnSubmit = vi.fn();
      const { result } = renderHook(() => 
        useFormDataHandling({ onSubmit: mockOnSubmit })
      );

      expect(result.current).toEqual({
        handleFormSubmit: expect.any(Function),
      });
    });

    it('accepts onSubmit callback in props', () => {
      const mockOnSubmit = vi.fn();
      const { result } = renderHook(() => 
        useFormDataHandling({ onSubmit: mockOnSubmit })
      );

      expect(result.current.handleFormSubmit).toBeDefined();
    });
  });

  describe('handleFormSubmit function', () => {
    it('calls onSubmit with cleaned data when all values are valid', () => {
      const mockOnSubmit = vi.fn();
      const { result } = renderHook(() => 
        useFormDataHandling({ onSubmit: mockOnSubmit })
      );

      const formData: AddLabTestResultFormData = {
        fastingBloodSugar: '120',
        cholesterol: '180',
        triglycerides: '150',
      };

      result.current.handleFormSubmit(formData);

      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      expect(mockOnSubmit).toHaveBeenCalledWith(formData);
    });

    it('removes undefined values from form data', () => {
      const mockOnSubmit = vi.fn();
      const { result } = renderHook(() => 
        useFormDataHandling({ onSubmit: mockOnSubmit })
      );

      const formData: AddLabTestResultFormData = {
        fastingBloodSugar: '120',
        cholesterol: undefined,
        triglycerides: '150',
      };

      result.current.handleFormSubmit(formData);

      expect(mockOnSubmit).toHaveBeenCalledWith({
        fastingBloodSugar: '120',
        triglycerides: '150',
      });
    });

    it('removes empty string values from form data', () => {
      const mockOnSubmit = vi.fn();
      const { result } = renderHook(() => 
        useFormDataHandling({ onSubmit: mockOnSubmit })
      );

      const formData: AddLabTestResultFormData = {
        fastingBloodSugar: '120',
        cholesterol: '',
        triglycerides: '150',
      };

      result.current.handleFormSubmit(formData);

      expect(mockOnSubmit).toHaveBeenCalledWith({
        fastingBloodSugar: '120',
        triglycerides: '150',
      });
    });

    it('removes null values from form data', () => {
      const mockOnSubmit = vi.fn();
      const { result } = renderHook(() => 
        useFormDataHandling({ onSubmit: mockOnSubmit })
      );

      const formData: AddLabTestResultFormData = {
        fastingBloodSugar: '120',
        cholesterol: null as unknown as string,
        triglycerides: '150',
      };

      result.current.handleFormSubmit(formData);

      expect(mockOnSubmit).toHaveBeenCalledWith({
        fastingBloodSugar: '120',
        triglycerides: '150',
      });
    });

    it('handles form data with all invalid values', () => {
      const mockOnSubmit = vi.fn();
      const { result } = renderHook(() => 
        useFormDataHandling({ onSubmit: mockOnSubmit })
      );

      const formData: AddLabTestResultFormData = {
        fastingBloodSugar: '',
        cholesterol: undefined,
        triglycerides: null as unknown as string,
      };

      result.current.handleFormSubmit(formData);

      expect(mockOnSubmit).toHaveBeenCalledWith({});
    });

    it('handles empty form data object', () => {
      const mockOnSubmit = vi.fn();
      const { result } = renderHook(() => 
        useFormDataHandling({ onSubmit: mockOnSubmit })
      );

      const formData: AddLabTestResultFormData = {};

      result.current.handleFormSubmit(formData);

      expect(mockOnSubmit).toHaveBeenCalledWith({});
    });

    it('preserves valid zero values', () => {
      const mockOnSubmit = vi.fn();
      const { result } = renderHook(() => 
        useFormDataHandling({ onSubmit: mockOnSubmit })
      );

      const formData: AddLabTestResultFormData = {
        fastingBloodSugar: '0',
        cholesterol: '0',
        triglycerides: '',
      };

      result.current.handleFormSubmit(formData);

      expect(mockOnSubmit).toHaveBeenCalledWith({
        fastingBloodSugar: '0',
        cholesterol: '0',
      });
    });

    it('preserves valid string values with spaces', () => {
      const mockOnSubmit = vi.fn();
      const { result } = renderHook(() => 
        useFormDataHandling({ onSubmit: mockOnSubmit })
      );

      const formData: AddLabTestResultFormData = {
        fastingBloodSugar: '120 mg/dL',
        cholesterol: ' 180 ',
        triglycerides: '',
      };

      result.current.handleFormSubmit(formData);

      expect(mockOnSubmit).toHaveBeenCalledWith({
        fastingBloodSugar: '120 mg/dL',
        cholesterol: ' 180 ',
      });
    });

    it('calls onSubmit exactly once per call', () => {
      const mockOnSubmit = vi.fn();
      const { result } = renderHook(() => 
        useFormDataHandling({ onSubmit: mockOnSubmit })
      );

      const formData: AddLabTestResultFormData = {
        fastingBloodSugar: '120',
      };

      result.current.handleFormSubmit(formData);
      result.current.handleFormSubmit(formData);

      expect(mockOnSubmit).toHaveBeenCalledTimes(2);
    });

    it('handles complex form data with mixed valid and invalid values', () => {
      const mockOnSubmit = vi.fn();
      const { result } = renderHook(() => 
        useFormDataHandling({ onSubmit: mockOnSubmit })
      );

      const formData: AddLabTestResultFormData = {
        fastingBloodSugar: '120',
        cholesterol: '',
        triglycerides: '150',
        hdl: undefined,
        ldl: '90',
        vldl: null as unknown as string,
        creatinine: '1.2',
        bun: '',
      };

      result.current.handleFormSubmit(formData);

      expect(mockOnSubmit).toHaveBeenCalledWith({
        fastingBloodSugar: '120',
        triglycerides: '150',
        ldl: '90',
        creatinine: '1.2',
      });
    });
  });

  describe('callback persistence', () => {
    it('creates new function reference on each render', () => {
      const mockOnSubmit = vi.fn();
      const { result, rerender } = renderHook(() => 
        useFormDataHandling({ onSubmit: mockOnSubmit })
      );

      const firstHandle = result.current.handleFormSubmit;
      
      rerender();
      
      const secondHandle = result.current.handleFormSubmit;
      expect(firstHandle).not.toBe(secondHandle);
    });

    it('updates when onSubmit callback changes', () => {
      const mockOnSubmit1 = vi.fn();
      const mockOnSubmit2 = vi.fn();
      
      const { result, rerender } = renderHook(
        ({ onSubmit }) => useFormDataHandling({ onSubmit }),
        { initialProps: { onSubmit: mockOnSubmit1 } }
      );

      const formData: AddLabTestResultFormData = { fastingBloodSugar: '120' };
      
      result.current.handleFormSubmit(formData);
      expect(mockOnSubmit1).toHaveBeenCalledWith({ fastingBloodSugar: '120' });
      expect(mockOnSubmit2).not.toHaveBeenCalled();

      rerender({ onSubmit: mockOnSubmit2 });
      
      result.current.handleFormSubmit(formData);
      expect(mockOnSubmit2).toHaveBeenCalledWith({ fastingBloodSugar: '120' });
      expect(mockOnSubmit1).toHaveBeenCalledTimes(1);
    });
  });
});