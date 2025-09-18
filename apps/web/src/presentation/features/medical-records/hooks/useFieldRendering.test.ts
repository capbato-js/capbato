import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useFieldRendering } from './useFieldRendering';
import { LabTestFieldConfig } from '../constants/labTestFormConfig';

// Mock field config for testing
const mockField: LabTestFieldConfig = {
  id: 'fastingBloodSugar',
  label: 'Fasting Blood Sugar',
  normalRange: '70-100 mg/dL',
  column: 'left',
  order: 1
};

const mockField2: LabTestFieldConfig = {
  id: 'cholesterol',
  label: 'Total Cholesterol',
  normalRange: '<200 mg/dL',
  column: 'right',
  order: 2
};

describe('useFieldRendering', () => {
  describe('hook initialization', () => {
    it('returns expected functions', () => {
      const { result } = renderHook(() => 
        useFieldRendering({ enabledFields: [], viewMode: false })
      );

      expect(result.current).toEqual({
        isFieldEnabled: expect.any(Function),
        getFieldStyles: expect.any(Function),
      });
    });

    it('handles undefined enabledFields', () => {
      const { result } = renderHook(() => 
        useFieldRendering({ viewMode: false })
      );

      expect(result.current.isFieldEnabled).toBeDefined();
      expect(result.current.getFieldStyles).toBeDefined();
    });
  });

  describe('isFieldEnabled function', () => {
    it('returns false when in view mode regardless of enabledFields', () => {
      const { result } = renderHook(() => 
        useFieldRendering({ enabledFields: ['fastingBloodSugar'], viewMode: true })
      );

      const isEnabled = result.current.isFieldEnabled(mockField);
      expect(isEnabled).toBe(false);
    });

    it('returns true when no enabledFields specified and not in view mode', () => {
      const { result } = renderHook(() => 
        useFieldRendering({ enabledFields: [], viewMode: false })
      );

      const isEnabled = result.current.isFieldEnabled(mockField);
      expect(isEnabled).toBe(true);
    });

    it('returns true when no enabledFields provided (undefined) and not in view mode', () => {
      const { result } = renderHook(() => 
        useFieldRendering({ viewMode: false })
      );

      const isEnabled = result.current.isFieldEnabled(mockField);
      expect(isEnabled).toBe(true);
    });

    it('matches field by exact ID', () => {
      const { result } = renderHook(() => 
        useFieldRendering({ enabledFields: ['fastingBloodSugar'], viewMode: false })
      );

      const isEnabled = result.current.isFieldEnabled(mockField);
      expect(isEnabled).toBe(true);
    });

    it('matches field by exact label', () => {
      const { result } = renderHook(() => 
        useFieldRendering({ enabledFields: ['Fasting Blood Sugar'], viewMode: false })
      );

      const isEnabled = result.current.isFieldEnabled(mockField);
      expect(isEnabled).toBe(true);
    });

    it('matches field by partial label match', () => {
      const { result } = renderHook(() => 
        useFieldRendering({ enabledFields: ['Fasting'], viewMode: false })
      );

      const isEnabled = result.current.isFieldEnabled(mockField);
      expect(isEnabled).toBe(true);
    });

    it('matches field by partial ID match', () => {
      const { result } = renderHook(() => 
        useFieldRendering({ enabledFields: ['fasting'], viewMode: false })
      );

      const isEnabled = result.current.isFieldEnabled(mockField);
      expect(isEnabled).toBe(true);
    });

    it('handles case insensitive matching', () => {
      const { result } = renderHook(() => 
        useFieldRendering({ enabledFields: ['FASTING BLOOD SUGAR'], viewMode: false })
      );

      const isEnabled = result.current.isFieldEnabled(mockField);
      expect(isEnabled).toBe(true);
    });

    it('handles whitespace trimming in enabled fields', () => {
      const { result } = renderHook(() => 
        useFieldRendering({ enabledFields: ['  fastingBloodSugar  '], viewMode: false })
      );

      const isEnabled = result.current.isFieldEnabled(mockField);
      expect(isEnabled).toBe(true);
    });

    it('returns false when field does not match any enabled field', () => {
      const { result } = renderHook(() => 
        useFieldRendering({ enabledFields: ['cholesterol'], viewMode: false })
      );

      const isEnabled = result.current.isFieldEnabled(mockField);
      expect(isEnabled).toBe(false);
    });

    it('supports bidirectional partial matching', () => {
      const { result } = renderHook(() => 
        useFieldRendering({ enabledFields: ['Blood'], viewMode: false })
      );

      const isEnabled = result.current.isFieldEnabled(mockField);
      expect(isEnabled).toBe(true);
    });

    it('matches when enabled field contains field label', () => {
      const { result } = renderHook(() => 
        useFieldRendering({ enabledFields: ['Fasting Blood Sugar Test'], viewMode: false })
      );

      const isEnabled = result.current.isFieldEnabled(mockField);
      expect(isEnabled).toBe(true);
    });
  });

  describe('getFieldStyles function', () => {
    it('returns correct styles for enabled field in edit mode', () => {
      const { result } = renderHook(() => 
        useFieldRendering({ enabledFields: ['fastingBloodSugar'], viewMode: false })
      );

      const styles = result.current.getFieldStyles(true);
      
      expect(styles.container.opacity).toBe(1);
      expect(styles.label.color).toBe('inherit');
      expect(styles.input.backgroundColor).toBe('white');
      expect(styles.input.cursor).toBe('text');
      expect(styles.input.border).toBe('1px solid #007bff');
      expect(styles.normalRange.color).toBe('inherit');
    });

    it('returns correct styles for disabled field in edit mode', () => {
      const { result } = renderHook(() => 
        useFieldRendering({ enabledFields: [], viewMode: false })
      );

      const styles = result.current.getFieldStyles(false);
      
      expect(styles.container.opacity).toBe(0.5);
      expect(styles.label.color).toBe('#999');
      expect(styles.input.backgroundColor).toBe('#f5f5f5');
      expect(styles.input.cursor).toBe('not-allowed');
      expect(styles.input.border).toBe('1px solid #e9ecef');
      expect(styles.normalRange.color).toBe('#999');
    });

    it('returns correct styles for view mode regardless of enabled state', () => {
      const { result } = renderHook(() => 
        useFieldRendering({ enabledFields: ['fastingBloodSugar'], viewMode: true })
      );

      const styles = result.current.getFieldStyles(false); // disabled in view mode
      
      expect(styles.container.opacity).toBe(1);
      expect(styles.label.color).toBe('inherit');
      expect(styles.input.backgroundColor).toBe('#f8f9fa');
      expect(styles.input.cursor).toBe('default');
      expect(styles.input.border).toBe('1px solid #dee2e6');
      expect(styles.normalRange.color).toBe('inherit');
    });

    it('includes all required style properties', () => {
      const { result } = renderHook(() => 
        useFieldRendering({ enabledFields: [], viewMode: false })
      );

      const styles = result.current.getFieldStyles(true);
      
      expect(styles).toHaveProperty('container');
      expect(styles).toHaveProperty('label');
      expect(styles).toHaveProperty('input');
      expect(styles).toHaveProperty('normalRange');
      
      expect(styles.container).toHaveProperty('display');
      expect(styles.container).toHaveProperty('gridTemplateColumns');
      expect(styles.container).toHaveProperty('alignItems');
      expect(styles.container).toHaveProperty('marginBottom');
      expect(styles.container).toHaveProperty('fontSize');
      expect(styles.container).toHaveProperty('fontWeight');
      expect(styles.container).toHaveProperty('gap');
      expect(styles.container).toHaveProperty('opacity');
    });

    it('maintains consistent grid layout properties', () => {
      const { result } = renderHook(() => 
        useFieldRendering({ enabledFields: [], viewMode: false })
      );

      const styles = result.current.getFieldStyles(true);
      
      expect(styles.container.display).toBe('grid');
      expect(styles.container.gridTemplateColumns).toBe('1fr auto 1fr');
      expect(styles.container.alignItems).toBe('center');
      expect(styles.container.gap).toBe('10px');
    });
  });

  describe('multiple fields handling', () => {
    it('correctly identifies multiple enabled fields', () => {
      const { result } = renderHook(() => 
        useFieldRendering({ 
          enabledFields: ['fastingBloodSugar', 'cholesterol'], 
          viewMode: false 
        })
      );

      expect(result.current.isFieldEnabled(mockField)).toBe(true);
      expect(result.current.isFieldEnabled(mockField2)).toBe(true);
    });

    it('correctly identifies when field is not in enabled list', () => {
      const { result } = renderHook(() => 
        useFieldRendering({ 
          enabledFields: ['cholesterol'], 
          viewMode: false 
        })
      );

      expect(result.current.isFieldEnabled(mockField)).toBe(false);
      expect(result.current.isFieldEnabled(mockField2)).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('handles empty enabled fields array', () => {
      const { result } = renderHook(() => 
        useFieldRendering({ enabledFields: [], viewMode: false })
      );

      expect(result.current.isFieldEnabled(mockField)).toBe(true);
    });

    it('handles empty strings in enabled fields', () => {
      const { result } = renderHook(() => 
        useFieldRendering({ enabledFields: ['', 'fastingBloodSugar'], viewMode: false })
      );

      expect(result.current.isFieldEnabled(mockField)).toBe(true);
    });

    it('handles field with empty ID and label', () => {
      const emptyField: LabTestFieldConfig = {
        id: '',
        label: '',
        normalRange: 'Test range',
        column: 'left',
        order: 1
      };

      const { result } = renderHook(() => 
        useFieldRendering({ viewMode: false })
      );

      expect(result.current.isFieldEnabled(emptyField)).toBe(true);
    });
  });
});