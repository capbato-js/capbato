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
  });

  const handleFormSubmit = (data: AddLabTestResultFormData) => {
    onSubmit(data);
  };

  // Reusable field component
  const renderField = (field: LabTestFieldConfig) => (
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
        gap: '10px' 
      }}
    >
      <Text size="sm" fw={500}>{field.label}</Text>
      <input
        {...register(field.id)}
        type="text"
        className={classes.nativeInput}
      />
      <Text size="sm" style={{ fontSize: '14px' }}>
        {field.normalRange ? ` ${field.normalRange} ` : ''}
      </Text>
    </Box>
  );

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
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              style={{ minWidth: '100px' }}
              loading={isLoading}
              disabled={isLoading}
              leftSection={<Icon icon="fas fa-save" size={14} />}
            >
              Submit
            </Button>
          </Box>
        </Stack>
      </form>
    </Box>
  );
};
