import React, { useState, useEffect } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Button,
  Stack,
  Text,
  Box,
  Group,
  TextInput,
  Textarea,
  ActionIcon,
  Alert,
  Divider,
  NumberInput,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { AddTransactionFormSchema, type AddTransactionFormData } from '@nx-starter/application-shared';
import { Icon } from '../../../components/common';
import { FormSelect } from '../../../components/ui/FormSelect';
import { usePatientStore } from '../../../../infrastructure/state/PatientStore';
import { useAuthStore } from '../../../../infrastructure/state/AuthStore';
import { TransactionItemData } from '@nx-starter/application-shared';

export interface AddReceiptFormProps {
  onSubmit: (data: AddTransactionFormData) => Promise<boolean>;
  isLoading: boolean;
  error?: string | null;
  onClearError?: () => void;
}

// Common services for quick selection
const COMMON_SERVICES = [
  { name: 'Consultation', unitPrice: 800.0 },
  { name: 'Lab Tests', unitPrice: 350.0 },
  { name: 'Medication', unitPrice: 100.0 },
];

const PAYMENT_METHOD_OPTIONS = [
  { value: 'Cash', label: 'Cash' },
  { value: 'GCash', label: 'GCash' },
  { value: 'Card', label: 'Credit/Debit Card' },
  { value: 'Bank Transfer', label: 'Bank Transfer' },
  { value: 'Check', label: 'Check' },
];

/**
 * AddReceiptForm component handles the creation of transaction receipts
 * with form validation and proper TypeScript typing.
 * 
 * Features:
 * - Real patient data from backend
 * - Dynamic service items list with add/remove functionality
 * - Common service presets for quick selection
 * - Automatic subtotal and total calculations
 * - Payment method selection
 */
export const AddReceiptForm: React.FC<AddReceiptFormProps> = ({
  onSubmit,
  isLoading,
  error,
  onClearError,
}) => {
  // State for patients
  const [patients, setPatients] = useState<Array<{ value: string; label: string; patientNumber: string }>>([]);
  const [selectedPatientNumber, setSelectedPatientNumber] = useState<string>('');
  
  // Get current user from auth store
  const currentUser = useAuthStore((state) => state.user);
  
  // Fallback to get user from localStorage if auth store is not populated
  const getUserFromLocalStorage = () => {
    try {
      const userJson = localStorage.getItem('auth_user');
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Failed to parse user from localStorage:', error);
      return null;
    }
  };
  
  const effectiveUser = currentUser || getUserFromLocalStorage();
  const currentStaffId = effectiveUser?.id || '';
  const currentStaffName = effectiveUser ? `${effectiveUser.firstName} ${effectiveUser.lastName}` : '';
  
  // Get stores with selectors to prevent unnecessary re-renders
  const patientStorePatients = usePatientStore((state) => state.patients);
  const patientStoreLoadPatients = usePatientStore((state) => state.loadPatients);

  // Load patients on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load patients
        await patientStoreLoadPatients();
      } catch (error) {
        console.error('Failed to load patients:', error);
      }
    };

    loadData();
  }, [patientStoreLoadPatients]);

  // Format patients for select component
  useEffect(() => {
    if (patientStorePatients.length > 0) {
      const formattedPatients = patientStorePatients.map(patient => ({
        value: patient.id,
        label: `${patient.firstName} ${patient.lastName}`,
        patientNumber: patient.patientNumber,
      }));
      setPatients(formattedPatients);
    }
  }, [patientStorePatients]);

  // React Hook Form setup
  const {
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AddTransactionFormData>({
    resolver: zodResolver(AddTransactionFormSchema),
    mode: 'onBlur',
    defaultValues: {
      patientId: '',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: '',
      receivedById: currentStaffId,
      items: [{ 
        serviceName: '', 
        description: '', 
        quantity: 1, 
        unitPrice: 0 
      }],
    },
  });

  // useFieldArray for dynamic items
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  // Watch form values for button state and logic
  const patientId = watch('patientId');
  const date = watch('date');
  const paymentMethod = watch('paymentMethod');
  const items = watch('items');

  // Update patient number when patient changes
  useEffect(() => {
    if (patientId) {
      const selectedPatient = patients.find(p => p.value === patientId);
      if (selectedPatient) {
        setSelectedPatientNumber(selectedPatient.patientNumber);
      }
    } else {
      setSelectedPatientNumber('');
    }
  }, [patientId, patients]);

  // Clear errors when form values change
  useEffect(() => {
    if (error && onClearError) {
      onClearError();
    }
  }, [patientId, date, paymentMethod, items, error, onClearError]);

  const handleFormSubmit = async (data: AddTransactionFormData) => {
    // Filter out empty items and only include description if it's not empty
    const validItems = data.items
      .filter(item => 
        item.serviceName.trim() && item.quantity > 0 && item.unitPrice > 0
      )
      .map(item => {
        const cleanItem: {
          serviceName: string;
          quantity: number;
          unitPrice: number;
          description?: string;
        } = {
          serviceName: item.serviceName.trim(),
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        };
        
        // Only include description if it's not empty
        if (item.description && item.description.trim()) {
          cleanItem.description = item.description.trim();
        }
        
        return cleanItem;
      });

    if (validItems.length === 0) {
      return false;
    }

    const formData = {
      ...data,
      receivedById: currentStaffId,
      items: validItems,
    } as AddTransactionFormData;

    return await onSubmit(formData);
  };

  const addItem = () => {
    append({ serviceName: '', description: '', quantity: 1, unitPrice: 0 });
  };

  const addCommonService = (service: typeof COMMON_SERVICES[0]) => {
    append({
      serviceName: service.name,
      description: '', // No default description - user can add if needed
      quantity: 1,
      unitPrice: service.unitPrice,
    });
  };

  // Calculate subtotal for each item
  const calculateSubtotal = (quantity: number, unitPrice: number): number => {
    return quantity * unitPrice;
  };

  // Calculate total amount
  const calculateTotal = (): number => {
    return items.reduce((total, item) => {
      const subtotal = calculateSubtotal(item.quantity || 0, item.unitPrice || 0);
      return total + subtotal;
    }, 0);
  };

  const isFormValid = patientId && date && paymentMethod && 
    items.some(item => item.serviceName.trim() && item.quantity > 0 && item.unitPrice > 0);

  const serviceOptions = COMMON_SERVICES.map(service => ({
    value: service.name,
    label: service.name,
  }));

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Stack gap="md">
        {/* Error Alert */}
        {error && (
          <Alert variant="light" color="red" title="Error">
            {error}
          </Alert>
        )}

        {/* Patient Selection */}
        <Box>
          <Controller
            name="patientId"
            control={control}
            render={({ field }) => (
              <FormSelect
                {...field}
                label="Patient"
                placeholder="Select a patient"
                data={patients}
                searchable
                clearable
                error={errors.patientId?.message}
              />
            )}
          />
          {selectedPatientNumber && (
            <Text size="sm" c="dimmed" mt={4}>
              Patient Number: {selectedPatientNumber}
            </Text>
          )}
        </Box>

        {/* Date */}
        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <DateInput
              {...field}
              label="Date"
              placeholder="Select date"
              value={field.value ? new Date(field.value) : null}
              onChange={(date) => {
                if (date) {
                  // Ensure we have a proper Date object
                  const dateObj = date instanceof Date ? date : new Date(date);
                  
                  // Check if the date is valid
                  if (!isNaN(dateObj.getTime())) {
                    field.onChange(dateObj.toISOString().split('T')[0]);
                  } else {
                    field.onChange('');
                  }
                } else {
                  field.onChange('');
                }
              }}
              maxDate={new Date()}
              error={errors.date?.message}
              required
              leftSection={<Icon icon="fas fa-calendar" />}
            />
          )}
        />

        {/* Services/Items Section */}
        <Box>
          <Group justify="space-between" align="center" mb="sm">
            <Text fw={500}>Services/Items</Text>
            <Button
              variant="light"
              size="compact-sm"
              leftSection={<Icon icon="fas fa-plus" />}
              onClick={addItem}
            >
              Add Item
            </Button>
          </Group>

          {/* Quick add common services */}
          {/* <Box mb="md">
            <Text size="sm" c="dimmed" mb="xs">Quick add common services:</Text>
            <Group gap="xs">
              {COMMON_SERVICES.slice(0, 3).map((service) => (
                <Button
                  key={service.name}
                  variant="light"
                  size="compact-xs"
                  onClick={() => addCommonService(service)}
                >
                  {service.name}
                </Button>
              ))}
            </Group>
          </Box> */}

          <Stack gap="md">
            {fields.map((field, index) => (
              <Box key={field.id} p="md" style={{ border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                <Group justify="space-between" align="center" mb="sm">
                  <Text size="sm" fw={500}>Item {index + 1}</Text>
                  {fields.length > 1 && (
                    <ActionIcon
                      variant="light"
                      color="red"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      <Icon icon="fas fa-trash" />
                    </ActionIcon>
                  )}
                </Group>

                <Stack gap="sm">
                  <Controller
                    name={`items.${index}.serviceName`}
                    control={control}
                    render={({ field }) => (
                      <FormSelect
                        {...field}
                        label="Service/Item Name"
                        placeholder="Select or type service"
                        data={serviceOptions}
                        searchable
                        error={errors.items?.[index]?.serviceName?.message}
                      />
                    )}
                  />

                  <Controller
                    name={`items.${index}.description`}
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        label="Description (Optional)"
                        placeholder="Additional details about the service..."
                        minRows={2}
                        maxRows={3}
                        error={errors.items?.[index]?.description?.message}
                      />
                    )}
                  />

                  <Group grow>
                    <Controller
                      name={`items.${index}.quantity`}
                      control={control}
                      render={({ field }) => (
                        <NumberInput
                          {...field}
                          label="Quantity"
                          placeholder="1"
                          min={1}
                          max={999}
                          value={field.value}
                          onChange={(value) => field.onChange(Number(value) || 1)}
                          error={errors.items?.[index]?.quantity?.message}
                          required
                        />
                      )}
                    />
                    <Controller
                      name={`items.${index}.unitPrice`}
                      control={control}
                      render={({ field }) => (
                        <NumberInput
                          {...field}
                          label="Unit Price"
                          placeholder="0.00"
                          min={0}
                          max={999999}
                          decimalScale={2}
                          fixedDecimalScale
                          prefix="₱"
                          value={field.value || undefined}
                          onChange={(value) => field.onChange(Number(value) || 0)}
                          error={errors.items?.[index]?.unitPrice?.message}
                        />
                      )}
                    />
                  </Group>

                  {/* Subtotal Display */}
                  <Box>
                    <Text size="sm" fw={500}>
                      Subtotal: ₱{calculateSubtotal(
                        watch(`items.${index}.quantity`) || 0, 
                        watch(`items.${index}.unitPrice`) || 0
                      ).toFixed(2)}
                    </Text>
                  </Box>
                </Stack>
              </Box>
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
            Total Amount: ₱{calculateTotal().toFixed(2)}
          </Text>
        </Box>

        {/* Payment Method */}
        <Controller
          name="paymentMethod"
          control={control}
          render={({ field }) => (
            <FormSelect
              {...field}
              label="Payment Method *"
              placeholder="Select payment method"
              data={PAYMENT_METHOD_OPTIONS}
              error={errors.paymentMethod?.message}
            />
          )}
        />

        {/* Received by (Auto-filled) */}
        <Box>
          <Text size="sm" fw={500} mb={4}>Received by *</Text>
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
            disabled={!isFormValid || isLoading}
            leftSection={<Icon icon="fas fa-receipt" />}
          >
            Create Receipt
          </Button>
        </Group>
      </Stack>
    </form>
  );
};