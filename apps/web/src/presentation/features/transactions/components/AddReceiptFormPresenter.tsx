import React from 'react';
import { Control, FieldErrors, UseFormHandleSubmit, UseFormWatch, FieldArrayWithId } from 'react-hook-form';
import { 
  Button,
  Stack,
  Text,
  Box,
  Group,
  Alert,
  Divider,
} from '@mantine/core';
import { AddTransactionFormData } from '@nx-starter/application-shared';
import { Icon } from '../../../components/common';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { PatientSelectionField } from './fields/PatientSelectionField';
import { LabRequestSelectionField } from './fields/LabRequestSelectionField';
import { DateField } from './fields/DateField';
import { ServiceItemCard } from './ServiceItemCard';
import { FormattedPatient } from '../hooks/usePatientData';
import { calculateTotal, isFormValid } from '../utils/receiptCalculations';

interface LabRequestOption {
  value: string;
  label: string;
  testCount: number;
  requestDate: string;
}

interface AddReceiptFormPresenterProps {
  // Form state
  control: Control<AddTransactionFormData>;
  handleSubmit: UseFormHandleSubmit<AddTransactionFormData>;
  watch: UseFormWatch<AddTransactionFormData>;
  errors: FieldErrors<AddTransactionFormData>;
  fields: FieldArrayWithId<AddTransactionFormData, 'items', 'id'>[];

  // Data
  patients: FormattedPatient[];
  selectedPatientNumber: string;
  items: AddTransactionFormData['items'];
  patientId: string;
  date: string;
  paymentMethod: string;

  // Lab request data
  labRequests: LabRequestOption[];
  selectedLabRequestId: string | null;
  isLoadingLabRequests: boolean;
  isLoadingLabItems: boolean;

  // Actions
  onFormSubmit: (data: AddTransactionFormData) => Promise<boolean>;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  onLabRequestSelect: (labRequestId: string | null) => void;

  // Props
  isLoading: boolean;
  error?: string | null;
}

export const AddReceiptFormPresenter: React.FC<AddReceiptFormPresenterProps> = ({
  control,
  handleSubmit,
  watch,
  errors,
  fields,
  patients,
  selectedPatientNumber,
  items,
  patientId,
  date,
  paymentMethod,
  labRequests,
  selectedLabRequestId,
  isLoadingLabRequests,
  isLoadingLabItems,
  onFormSubmit,
  onAddItem,
  onRemoveItem,
  onLabRequestSelect,
  isLoading,
  error,
}) => {
  const { currentStaffName } = useCurrentUser();
  const formIsValid = isFormValid(patientId, date, paymentMethod, items);

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <Stack gap="md">
        {/* Error Alert */}
        {error && (
          <Alert variant="light" color="red" title="Error">
            {error}
          </Alert>
        )}

        {/* Patient Selection */}
        <PatientSelectionField
          control={control}
          errors={errors}
          patients={patients}
          selectedPatientNumber={selectedPatientNumber}
        />

        {/* Lab Request Selection */}
        <LabRequestSelectionField
          labRequests={labRequests}
          selectedLabRequestId={selectedLabRequestId}
          isLoadingLabRequests={isLoadingLabRequests}
          isLoadingLabItems={isLoadingLabItems}
          onLabRequestSelect={onLabRequestSelect}
          patientId={patientId}
        />

        {/* Date */}
        <DateField
          control={control}
          errors={errors}
        />

        {/* Services/Items Section */}
        <Box>
          <Group justify="space-between" align="center" mb="sm">
            <Text fw={500}>Services/Items</Text>
            <Button
              variant="light"
              size="compact-sm"
              leftSection={<Icon icon="fas fa-plus" />}
              onClick={onAddItem}
            >
              Add Item
            </Button>
          </Group>

          <Stack gap="md">
            {fields.map((field, index) => (
              <ServiceItemCard
                key={field.id}
                control={control}
                errors={errors}
                watch={watch}
                index={index}
                fieldId={field.id}
                canRemove={fields.length > 1}
                onRemove={() => onRemoveItem(index)}
              />
            ))}
          </Stack>

          {errors.items && (
            <Text c="red" size="sm" mt="xs">
              {errors.items.message}
            </Text>
          )}
        </Box>

        {/* Total Amount Display */}
        <Box p="md" style={{ border: '2px solid #228be6', borderRadius: '8px', backgroundColor: '#f8f9ff' }}>
          <Text size="lg" fw={700} c="blue">
            Total Amount: ₱{calculateTotal(items).toFixed(2)}
          </Text>
        </Box>

        {/* Payment Method (Cash Only - Read-only) */}
        <Box>
          <Text size="sm" fw={500} mb={4}>Payment Method</Text>
          <Text size="sm" c="dimmed">
            Cash
          </Text>
        </Box>

        {/* Received by (Auto-filled) */}
        <Box>
          <Text size="sm" fw={500} mb={4}>Received by</Text>
          <Text size="sm" c="dimmed">
            {currentStaffName}
          </Text>
        </Box>

        <Divider />

        {/* Submit Button */}
        <Group justify="flex-end">
          <Button
            type="submit"
            loading={isLoading}
            disabled={!formIsValid || isLoading}
            leftSection={<Icon icon="fas fa-receipt" />}
          >
            Create Receipt
          </Button>
        </Group>
      </Stack>
    </form>
  );
};