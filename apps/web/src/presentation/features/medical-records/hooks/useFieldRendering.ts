import { LabTestFieldConfig } from '../constants/labTestFormConfig';

interface UseFieldRenderingProps {
  enabledFields?: string[];
  viewMode: boolean;
}

export const useFieldRendering = ({ enabledFields, viewMode }: UseFieldRenderingProps) => {
  
  // Determine if a field should be enabled
  const isFieldEnabled = (field: LabTestFieldConfig): boolean => {
    // In view mode, all fields are disabled but visible
    if (viewMode) return false;
    
    // If no enabledFields specified, enable all
    if (!enabledFields || enabledFields.length === 0) return true;
    
    // Check if this field matches any enabled field
    return enabledFields.some(enabledField => {
      const normalizedEnabledField = enabledField.toLowerCase().trim();
      const normalizedFieldId = field.id.toLowerCase().trim();
      const normalizedFieldLabel = field.label.toLowerCase().trim();
      
      // Match by ID, label, or bidirectional partial matching
      return normalizedEnabledField === normalizedFieldId ||
             normalizedEnabledField === normalizedFieldLabel ||
             normalizedFieldLabel.includes(normalizedEnabledField) ||
             normalizedFieldId.includes(normalizedEnabledField) ||
             normalizedEnabledField.includes(normalizedFieldLabel) ||
             normalizedEnabledField.includes(normalizedFieldId);
    });
  };

  const getFieldStyles = (isEnabled: boolean) => ({
    container: {
      display: 'grid',
      gridTemplateColumns: '1fr auto 1fr',
      alignItems: 'center',
      marginBottom: '5px',
      fontSize: '14px',
      fontWeight: 'bold',
      gap: '10px',
      opacity: viewMode || isEnabled ? 1 : 0.5
    },
    label: {
      color: viewMode || isEnabled ? 'inherit' : '#999'
    },
    input: {
      backgroundColor: viewMode ? '#f8f9fa' : (isEnabled ? 'white' : '#f5f5f5'),
      color: viewMode || isEnabled ? 'inherit' : '#999',
      cursor: viewMode ? 'default' : (isEnabled ? 'text' : 'not-allowed'),
      border: viewMode ? '1px solid #dee2e6' : (isEnabled ? '1px solid #007bff' : '1px solid #e9ecef'),
    },
    normalRange: {
      fontSize: '14px',
      color: viewMode || isEnabled ? 'inherit' : '#999'
    }
  });

  return {
    isFieldEnabled,
    getFieldStyles,
  };
};