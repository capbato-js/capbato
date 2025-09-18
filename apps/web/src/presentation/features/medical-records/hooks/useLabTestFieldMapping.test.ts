import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useLabTestFieldMapping } from './useLabTestFieldMapping';

describe('useLabTestFieldMapping', () => {
  describe('hook initialization', () => {
    it('returns expected functions', () => {
      const { result } = renderHook(() => useLabTestFieldMapping());

      expect(result.current).toEqual({
        mapLabRequestFieldsToFormIds: expect.any(Function),
        expandLipidProfile: expect.any(Function),
      });
    });

    it('functions are memoized and stable across re-renders', () => {
      const { result, rerender } = renderHook(() => useLabTestFieldMapping());

      const firstMapFunction = result.current.mapLabRequestFieldsToFormIds;
      const firstExpandFunction = result.current.expandLipidProfile;

      rerender();

      expect(result.current.mapLabRequestFieldsToFormIds).toBe(firstMapFunction);
      expect(result.current.expandLipidProfile).toBe(firstExpandFunction);
    });
  });

  describe('mapLabRequestFieldsToFormIds function', () => {
    it('maps fbs to fastingBloodSugar', () => {
      const { result } = renderHook(() => useLabTestFieldMapping());
      
      const mapped = result.current.mapLabRequestFieldsToFormIds(['fbs']);
      expect(mapped).toEqual(['fastingBloodSugar']);
    });

    it('maps multiple fbs variations to fastingBloodSugar', () => {
      const { result } = renderHook(() => useLabTestFieldMapping());
      
      const tests = ['fbs', 'fasting_blood_sugar', 'fastingBloodSugar'];
      const mapped = result.current.mapLabRequestFieldsToFormIds(tests);
      expect(mapped).toEqual(['fastingBloodSugar', 'fastingBloodSugar', 'fastingBloodSugar']);
    });

    it('maps rbs variations to randomBloodSugar', () => {
      const { result } = renderHook(() => useLabTestFieldMapping());
      
      const tests = ['rbs', 'random_blood_sugar', 'randomBloodSugar'];
      const mapped = result.current.mapLabRequestFieldsToFormIds(tests);
      expect(mapped).toEqual(['randomBloodSugar', 'randomBloodSugar', 'randomBloodSugar']);
    });

    it('maps cholesterol variations to cholesterol', () => {
      const { result } = renderHook(() => useLabTestFieldMapping());
      
      const tests = ['totalCholesterol', 'total_cholesterol', 'cholesterol'];
      const mapped = result.current.mapLabRequestFieldsToFormIds(tests);
      expect(mapped).toEqual(['cholesterol', 'cholesterol', 'cholesterol']);
    });

    it('maps HDL variations to hdl', () => {
      const { result } = renderHook(() => useLabTestFieldMapping());
      
      const tests = ['hdl', 'hdl_cholesterol', 'hdlCholesterol'];
      const mapped = result.current.mapLabRequestFieldsToFormIds(tests);
      expect(mapped).toEqual(['hdl', 'hdl', 'hdl']);
    });

    it('maps LDL variations to ldl', () => {
      const { result } = renderHook(() => useLabTestFieldMapping());
      
      const tests = ['ldl', 'ldl_cholesterol', 'ldlCholesterol'];
      const mapped = result.current.mapLabRequestFieldsToFormIds(tests);
      expect(mapped).toEqual(['ldl', 'ldl', 'ldl']);
    });

    it('maps VLDL variations to vldl', () => {
      const { result } = renderHook(() => useLabTestFieldMapping());
      
      const tests = ['vldl', 'vldl_cholesterol', 'vldlCholesterol'];
      const mapped = result.current.mapLabRequestFieldsToFormIds(tests);
      expect(mapped).toEqual(['vldl', 'vldl', 'vldl']);
    });

    it('maps BUN variations to bloodUreaNitrogen', () => {
      const { result } = renderHook(() => useLabTestFieldMapping());
      
      const tests = ['bun', 'blood_urea_nitrogen', 'bloodUreaNitrogen'];
      const mapped = result.current.mapLabRequestFieldsToFormIds(tests);
      expect(mapped).toEqual(['bloodUreaNitrogen', 'bloodUreaNitrogen', 'bloodUreaNitrogen']);
    });

    it('maps liver enzyme variations', () => {
      const { result } = renderHook(() => useLabTestFieldMapping());
      
      const tests = ['sgpt', 'alt', 'sgot', 'ast'];
      const mapped = result.current.mapLabRequestFieldsToFormIds(tests);
      expect(mapped).toEqual(['sgpt', 'sgpt', 'sgot', 'sgot']);
    });

    it('maps uric acid variations to uricAcid', () => {
      const { result } = renderHook(() => useLabTestFieldMapping());
      
      const tests = ['blood_uric_acid', 'uricAcid'];
      const mapped = result.current.mapLabRequestFieldsToFormIds(tests);
      expect(mapped).toEqual(['uricAcid', 'uricAcid']);
    });

    it('preserves unmapped test names', () => {
      const { result } = renderHook(() => useLabTestFieldMapping());
      
      const tests = ['unmappedTest', 'anotherTest', 'customTest'];
      const mapped = result.current.mapLabRequestFieldsToFormIds(tests);
      expect(mapped).toEqual(['unmappedTest', 'anotherTest', 'customTest']);
    });

    it('handles mixed mapped and unmapped tests', () => {
      const { result } = renderHook(() => useLabTestFieldMapping());
      
      const tests = ['fbs', 'unmappedTest', 'cholesterol', 'customTest'];
      const mapped = result.current.mapLabRequestFieldsToFormIds(tests);
      expect(mapped).toEqual(['fastingBloodSugar', 'unmappedTest', 'cholesterol', 'customTest']);
    });

    it('handles empty array', () => {
      const { result } = renderHook(() => useLabTestFieldMapping());
      
      const mapped = result.current.mapLabRequestFieldsToFormIds([]);
      expect(mapped).toEqual([]);
    });

    it('handles single test mapping', () => {
      const { result } = renderHook(() => useLabTestFieldMapping());
      
      const mapped = result.current.mapLabRequestFieldsToFormIds(['creatinine']);
      expect(mapped).toEqual(['creatinine']);
    });
  });

  describe('expandLipidProfile function', () => {
    it('expands exact "lipid profile" to lipid components', () => {
      const { result } = renderHook(() => useLabTestFieldMapping());
      
      const expanded = result.current.expandLipidProfile(['lipid profile']);
      expect(expanded).toEqual(['cholesterol', 'triglycerides', 'hdl', 'ldl', 'vldl']);
    });

    it('expands "lipid_profile" to lipid components', () => {
      const { result } = renderHook(() => useLabTestFieldMapping());
      
      const expanded = result.current.expandLipidProfile(['lipid_profile']);
      expect(expanded).toEqual(['cholesterol', 'triglycerides', 'hdl', 'ldl', 'vldl']);
    });

    it('expands "lipidProfile" to lipid components', () => {
      const { result } = renderHook(() => useLabTestFieldMapping());
      
      const expanded = result.current.expandLipidProfile(['lipidProfile']);
      expect(expanded).toEqual(['cholesterol', 'triglycerides', 'hdl', 'ldl', 'vldl']);
    });

    it('expands "cholesterol panel" to lipid components', () => {
      const { result } = renderHook(() => useLabTestFieldMapping());
      
      const expanded = result.current.expandLipidProfile(['cholesterol panel']);
      expect(expanded).toEqual(['cholesterol', 'triglycerides', 'hdl', 'ldl', 'vldl']);
    });

    it('expands "lipid panel" to lipid components', () => {
      const { result } = renderHook(() => useLabTestFieldMapping());
      
      const expanded = result.current.expandLipidProfile(['lipid panel']);
      expect(expanded).toEqual(['cholesterol', 'triglycerides', 'hdl', 'ldl', 'vldl']);
    });

    it('handles case insensitive lipid profile matching', () => {
      const { result } = renderHook(() => useLabTestFieldMapping());
      
      const expanded = result.current.expandLipidProfile(['LIPID PROFILE']);
      expect(expanded).toEqual(['cholesterol', 'triglycerides', 'hdl', 'ldl', 'vldl']);
    });

    it('preserves non-lipid profile tests', () => {
      const { result } = renderHook(() => useLabTestFieldMapping());
      
      const expanded = result.current.expandLipidProfile(['fbs', 'creatinine']);
      expect(expanded).toEqual(['fbs', 'creatinine']);
    });

    it('expands lipid profile and preserves other tests', () => {
      const { result } = renderHook(() => useLabTestFieldMapping());
      
      const expanded = result.current.expandLipidProfile(['fbs', 'lipid profile', 'creatinine']);
      expect(expanded).toEqual(['fbs', 'creatinine', 'cholesterol', 'triglycerides', 'hdl', 'ldl', 'vldl']);
    });

    it('avoids duplicate components when lipid components already exist', () => {
      const { result } = renderHook(() => useLabTestFieldMapping());
      
      const expanded = result.current.expandLipidProfile(['cholesterol', 'lipid profile', 'hdl']);
      expect(expanded).toEqual(['cholesterol', 'hdl', 'triglycerides', 'ldl', 'vldl']);
    });

    it('handles partial matches for lipid profile', () => {
      const { result } = renderHook(() => useLabTestFieldMapping());
      
      const expanded = result.current.expandLipidProfile(['lipid']);
      expect(expanded).toEqual(['cholesterol', 'triglycerides', 'hdl', 'ldl', 'vldl']);
    });

    it('handles multiple lipid profile identifiers', () => {
      const { result } = renderHook(() => useLabTestFieldMapping());
      
      const expanded = result.current.expandLipidProfile(['lipid profile', 'cholesterol panel']);
      expect(expanded).toEqual(['cholesterol', 'triglycerides', 'hdl', 'ldl', 'vldl']);
    });

    it('removes duplicates from final result', () => {
      const { result } = renderHook(() => useLabTestFieldMapping());
      
      const expanded = result.current.expandLipidProfile(['cholesterol', 'cholesterol', 'triglycerides']);
      expect(expanded).toEqual(['cholesterol', 'triglycerides']);
    });

    it('handles case insensitive duplicate removal', () => {
      const { result } = renderHook(() => useLabTestFieldMapping());
      
      const expanded = result.current.expandLipidProfile(['Cholesterol', 'cholesterol', 'CHOLESTEROL']);
      expect(expanded).toEqual(['Cholesterol']);
      expect(expanded).toEqual(['Cholesterol']);
    });

    it('handles empty array', () => {
      const { result } = renderHook(() => useLabTestFieldMapping());
      
      const expanded = result.current.expandLipidProfile([]);
      expect(expanded).toEqual([]);
    });

    it('handles tests with existing lipid components and partial matches', () => {
      const { result } = renderHook(() => useLabTestFieldMapping());
      
      const expanded = result.current.expandLipidProfile(['total cholesterol', 'lipid profile']);
      expect(expanded).toEqual(['total cholesterol', 'triglycerides', 'hdl', 'ldl', 'vldl']);
    });

    it('handles bidirectional partial matching for lipid components', () => {
      const { result } = renderHook(() => useLabTestFieldMapping());
      
      const expanded = result.current.expandLipidProfile(['hdl cholesterol', 'lipid profile']);
      expect(expanded).toEqual(['hdl cholesterol', 'triglycerides', 'ldl', 'vldl']);
    });
  });

  describe('combined functionality', () => {
    it('can use both functions together', () => {
      const { result } = renderHook(() => useLabTestFieldMapping());
      
      const tests = ['fbs', 'lipid profile', 'creatinine'];
      const expanded = result.current.expandLipidProfile(tests);
      const mapped = result.current.mapLabRequestFieldsToFormIds(expanded);
      
      expect(mapped).toEqual([
        'fastingBloodSugar', 
        'creatinine', 
        'cholesterol', 
        'triglycerides', 
        'hdl', 
        'ldl', 
        'vldl'
      ]);
    });

    it('maintains function stability for combined operations', () => {
      const { result, rerender } = renderHook(() => useLabTestFieldMapping());
      
      const tests = ['fbs', 'lipid profile'];
      const firstResult = result.current.expandLipidProfile(tests);
      
      rerender();
      
      const secondResult = result.current.expandLipidProfile(tests);
      expect(firstResult).toEqual(secondResult);
    });
  });

  describe('edge cases', () => {
    it('handles tests with special characters', () => {
      const { result } = renderHook(() => useLabTestFieldMapping());
      
      const mapped = result.current.mapLabRequestFieldsToFormIds(['test-with-dashes', 'test_with_underscores']);
      expect(mapped).toEqual(['test-with-dashes', 'test_with_underscores']);
    });

    it('handles empty strings in test array', () => {
      const { result } = renderHook(() => useLabTestFieldMapping());
      
      const expanded = result.current.expandLipidProfile(['', 'fbs', '']);
      expect(expanded).toEqual(['', 'fbs', '']);
    });

    it('handles whitespace in test names', () => {
      const { result } = renderHook(() => useLabTestFieldMapping());
      
      const mapped = result.current.mapLabRequestFieldsToFormIds([' fbs ', ' cholesterol ']);
      expect(mapped).toEqual([' fbs ', ' cholesterol ']);
    });
  });
});