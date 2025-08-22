import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Button,
  Stack,
  Box,
  Title,
  Text,
  Divider,
} from '@mantine/core';
import { Icon } from '../../../components/common/Icon';
import { 
  LabTestType, 
  getLabTestConfig, 
  getFieldsByColumn, 
  generateLabTestSchema,
  LabTestFieldConfig 
} from '../constants/labTestFormConfig';
import classes from './AddLabTestResultForm.module.css';

// Dynamic form data type based on test type
export type AddLabTestResultFormData = Record<string, string | undefined>;

interface AddLabTestResultFormProps {
  testType?: LabTestType;
  enabledFields?: string[]; // Array of field IDs that should be enabled (e.g., ['blood_chemistry_fbs', 'blood_chemistry_bun'])
  viewMode?: boolean; // If true, all fields are read-only and form shows existing data
  existingData?: AddLabTestResultFormData; // Pre-populate form with existing results
  patientData?: {
    patientNumber?: string;
    patientName?: string;
    name?: string;
    age?: number;
    gender?: string;
    sex?: string;
    address?: string;
    doctorName?: string;
    dateRequested?: string;
  };
  onSubmit: (data: AddLabTestResultFormData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export const AddLabTestResultForm: React.FC<AddLabTestResultFormProps> = ({
  testType = 'BLOOD_CHEMISTRY',
  enabledFields, // Array of field IDs that should be enabled
  viewMode = false, // Read-only mode for viewing existing results
  existingData, // Pre-populated data for view mode
  patientData,
  onSubmit,
  onCancel,
  isLoading = false,
  error = null,
}) => {
  // Generate dynamic schema and config based on test type
  const testConfig = getLabTestConfig(testType);
  const schema = generateLabTestSchema(testType);
  const leftFields = getFieldsByColumn(testType, 'left');
  const rightFields = getFieldsByColumn(testType, 'right');



  const {
    register,
    handleSubmit,
  } = useForm<AddLabTestResultFormData>({
    resolver: zodResolver(schema),
    defaultValues: existingData || {}, // Pre-populate with existing data in view mode
  });

  const handleFormSubmit = (data: AddLabTestResultFormData) => {
    onSubmit(data);
  };

  // Reusable field component
  const renderField = (field: LabTestFieldConfig) => {
    // Determine if this field should be enabled
    // In view mode, all fields are disabled but visible
    // In edit mode, respect the enabledFields array
    const isFieldEnabled = !viewMode && (!enabledFields || enabledFields.length === 0 || 
      enabledFields.some(enabledField => {
        const normalizedEnabledField = enabledField.toLowerCase().trim();
        const normalizedFieldId = field.id.toLowerCase().trim();
        const normalizedFieldLabel = field.label.toLowerCase().trim();
        
        // Match by ID, label, or bidirectional partial matching
        const matches = normalizedEnabledField === normalizedFieldId ||
               normalizedEnabledField === normalizedFieldLabel ||
               normalizedFieldLabel.includes(normalizedEnabledField) ||
               normalizedFieldId.includes(normalizedEnabledField) ||
               normalizedEnabledField.includes(normalizedFieldLabel) ||  // Check if enabled field contains label
               normalizedEnabledField.includes(normalizedFieldId);       // Check if enabled field contains ID
        
        return matches;
      }));
    
    return (
      <Box 
        key={field.id}
        component="label" 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr auto 1fr', 
          alignItems: 'center', 
          marginBottom: '5px', 
          fontSize: '14px', 
          fontWeight: 'bold', 
          gap: '10px',
          opacity: viewMode || isFieldEnabled ? 1 : 0.5 // In view mode, show all fields clearly
        }}
      >
        <Text size="sm" fw={500} style={{ color: viewMode || isFieldEnabled ? 'inherit' : '#999' }}>
          {field.label}
        </Text>
        <input
          {...register(field.id)}
          type="text"
          className={classes.nativeInput}
          disabled={viewMode || !isFieldEnabled} // Disable all fields in view mode
          readOnly={viewMode} // Make read-only in view mode for better UX
          style={{
            backgroundColor: viewMode ? '#f8f9fa' : (isFieldEnabled ? 'white' : '#f5f5f5'),
            color: viewMode || isFieldEnabled ? 'inherit' : '#999',
            cursor: viewMode ? 'default' : (isFieldEnabled ? 'text' : 'not-allowed'),
            border: viewMode ? '1px solid #dee2e6' : (isFieldEnabled ? '1px solid #007bff' : '1px solid #e9ecef'),
          }}
        />
        <Text size="sm" style={{ fontSize: '14px', color: viewMode || isFieldEnabled ? 'inherit' : '#999' }}>
          {field.normalRange ? ` ${field.normalRange} ` : ''}
        </Text>
      </Box>
    );
  };

  return (
    <Box p="sm" data-id="add-lab" style={{ background: 'white', maxWidth: '850px', margin: 'auto', paddingTop: 0}}>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Stack gap="sm">
          {/* Header */}
          <Box style={{ textAlign: 'center' }}>
            <Title order={2} size="h3" style={{ margin: '0', fontSize: '20px' }}>
              DMYM DIAGNOSTIC & LABORATORY CENTER
            </Title>
            <Text size="sm" style={{ margin: '0' }}>
              696 Commonwealth Ave., Litex Rd. Quezon City
            </Text>
            <Text size="sm" style={{ margin: '0' }}>
              TEL No. 263-1036
            </Text>
            <Text size="sm" fw={700} style={{ margin: '0' }}>
              LICENSE NUMBER. 1-3-CL-592-06-P
            </Text>
            <Title order={3} style={{ 
              margin: '10px 0', 
              color: '#cc0000', 
              letterSpacing: '3px',
              fontSize: '18px'
            }}>
              {testConfig.title}
            </Title>
          </Box>

          {/* Patient Information */}
          <Box style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            gap: '30px',
            marginBottom: '20px',
            flexWrap: 'wrap',
            alignItems: 'flex-start'
          }}>
            {/* Left Group */}
            <Box style={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
              <Box style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px',
                fontWeight: 'bold'
              }}>
                <Text size="sm" fw={700}>Patient Name:</Text>
                <Box style={{ 
                  padding: '5px',
                  border: 'none',
                  borderBottom: '1px solid #000',
                  outline: 'none',
                  width: '200px',
                  maxWidth: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  <Text size="sm">{patientData?.patientName || patientData?.name || ''}</Text>
                </Box>
              </Box>

              <Box style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px',
                fontWeight: 'bold'
              }}>
                <Text size="sm" fw={700}>Date:</Text>
                <Box style={{ 
                  padding: '5px',
                  border: 'none',
                  borderBottom: '1px solid #000',
                  outline: 'none',
                  width: '250px'
                }}>
                  <Text size="sm">{patientData?.dateRequested || new Date().toLocaleDateString()}</Text>
                </Box>
              </Box>
            </Box>

            {/* Right Group */}
            <Box style={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
              <Box style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px',
                fontWeight: 'bold'
              }}>
                <Text size="sm" fw={700}>Age:</Text>
                <Box style={{ 
                  padding: '5px',
                  border: 'none',
                  borderBottom: '1px solid #000',
                  outline: 'none',
                  width: '250px'
                }}>
                  <Text size="sm">{patientData?.age || ''}</Text>
                </Box>
              </Box>

              <Box style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px',
                fontWeight: 'bold'
              }}>
                <Text size="sm" fw={700}>Sex:</Text>
                <Box style={{ 
                  padding: '5px',
                  border: 'none',
                  borderBottom: '1px solid #000',
                  outline: 'none',
                  width: '250px'
                }}>
                  <Text size="sm">{patientData?.sex || patientData?.gender || ''}</Text>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Lab Test Results Section */}
          <Box style={{ display: 'flex', gap: '40px', marginTop: '0px' }} className="results">
            {/* Left Column */}
            <Box style={{ flex: 1 }} className="column">
              {leftFields.map(field => renderField(field))}
            </Box>

            {/* Right Column */}
            <Box style={{ flex: 1 }}>
              {rightFields.map(field => renderField(field))}
            </Box>
          </Box>

          <Divider />

          {/* Error Display */}
          {error && (
            <Box style={{ 
              color: 'red', 
              marginTop: '10px', 
              padding: '10px', 
              backgroundColor: '#ffebee', 
              borderRadius: '4px' 
            }}>
              <Text size="sm">{error}</Text>
            </Box>
          )}

          {/* Signatures Section */}
          <Box style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginTop: '20px', 
            fontSize: '14px', 
            fontWeight: 'bold', 
            textAlign: 'center' 
          }}>
            <Box>
              <Text size="sm" fw={700}>MARK C. MADRIAGA, RMT LIC. 42977</Text>
              <Text size="sm" fw={700}>Medical Technologist</Text>
            </Box>
            <Box>
              <Text size="sm" fw={700}>FREDERICK R. LLANERA, MD, FPSP LIC. #86353</Text>
              <Text size="sm" fw={700}>Pathologist</Text>
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '24px' }}>
            {onCancel && (
              <Button
                variant="outline"
                onClick={onCancel}
                style={{ minWidth: '100px' }}
                disabled={isLoading}
                leftSection={<Icon icon="fas fa-times" size={14} />}
              >
                {viewMode ? 'Close' : 'Cancel'}
              </Button>
            )}
            {!viewMode && (
              <Button
                type="submit"
                style={{ minWidth: '100px' }}
                loading={isLoading}
                disabled={isLoading}
                leftSection={<Icon icon="fas fa-save" size={14} />}
              >
                Submit
              </Button>
            )}
          </Box>
        </Stack>
      </form>
    </Box>
  );
};
