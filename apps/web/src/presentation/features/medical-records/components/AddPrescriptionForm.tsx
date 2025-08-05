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
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { AddPrescriptionFormSchema, type AddPrescriptionFormData } from '@nx-starter/application-shared';
import { Icon } from '../../../components/common';
import { FormSelect } from '../../../components/ui/FormSelect';
import { usePatientStore } from '../../../../infrastructure/state/PatientStore';
import { useDoctorStore } from '../../../../infrastructure/state/DoctorStore';
import { Medication } from '../types';

export interface AddPrescriptionFormProps {
  onSubmit: (data: AddPrescriptionFormData) => Promise<boolean>;
  isLoading: boolean;
  error?: string | null;
  onClearError?: () => void;
  // Edit mode props
  editMode?: boolean;
  initialData?: {
    patientId?: string;
    patientName?: string;
    patientNumber?: string;
    doctorId?: string;
    doctorName?: string;
    datePrescribed?: string;
    medications?: Medication[];
    notes?: string;
  };
}

// Common medications for quick selection
const COMMON_MEDICATIONS = [
  { name: 'Paracetamol', dosage: '500mg', frequency: 'Every 6 hours', duration: '3-5 days' },
  { name: 'Ibuprofen', dosage: '400mg', frequency: 'Every 8 hours', duration: '3-5 days' },
  { name: 'Amoxicillin', dosage: '500mg', frequency: 'Every 8 hours', duration: '7 days' },
  { name: 'Cetirizine', dosage: '10mg', frequency: 'Once daily', duration: '5-7 days' },
  { name: 'Omeprazole', dosage: '20mg', frequency: 'Once daily', duration: '14-28 days' },
  { name: 'Metformin', dosage: '850mg', frequency: 'Twice daily', duration: 'Ongoing' },
  { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', duration: 'Ongoing' },
  { name: 'Simvastatin', dosage: '40mg', frequency: 'Once daily', duration: 'Ongoing' },
];

const FREQUENCY_OPTIONS = [
  { value: 'Once daily', label: 'Once daily' },
  { value: 'Twice daily', label: 'Twice daily' },
  { value: 'Three times daily', label: 'Three times daily' },
  { value: 'Every 4 hours', label: 'Every 4 hours' },
  { value: 'Every 6 hours', label: 'Every 6 hours' },
  { value: 'Every 8 hours', label: 'Every 8 hours' },
  { value: 'Every 12 hours', label: 'Every 12 hours' },
  { value: 'As needed', label: 'As needed' },
];

const DURATION_OPTIONS = [
  { value: '3 days', label: '3 days' },
  { value: '5 days', label: '5 days' },
  { value: '7 days', label: '7 days' },
  { value: '10 days', label: '10 days' },
  { value: '14 days', label: '14 days' },
  { value: '21 days', label: '21 days' },
  { value: '28 days', label: '28 days' },
  { value: 'Ongoing', label: 'Ongoing' },
];

/**
 * AddPrescriptionForm component handles the creation and editing of prescriptions
 * with form validation and proper TypeScript typing.
 * 
 * Features:
 * - Real patient and doctor data from backend
 * - Dynamic medication list with add/remove functionality
 * - Common medication presets for quick selection
 * - Edit mode support for modifying existing prescriptions
 */
export const AddPrescriptionForm: React.FC<AddPrescriptionFormProps> = ({
  onSubmit,
  isLoading,
  error,
  onClearError,
  editMode = false,
  initialData,
}) => {
  // State for patients and doctors
  const [patients, setPatients] = useState<Array<{ value: string; label: string; patientNumber: string }>>([]);
  const [doctors, setDoctors] = useState<Array<{ value: string; label: string }>>([]);
  const [selectedPatientNumber, setSelectedPatientNumber] = useState<string>('');
  
  // Get stores
  const patientStore = usePatientStore();
  const doctorStore = useDoctorStore();

  // Load patients and doctors on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load patients
        await patientStore.loadPatients();
        
        // Load doctors
        await doctorStore.getAllDoctors(true, 'summary');
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };

    loadData();
  }, []);

  // Format patients for select component
  useEffect(() => {
    if (patientStore.patients.length > 0) {
      const formattedPatients = patientStore.patients.map(patient => ({
        value: patient.id,
        label: `${patient.firstName} ${patient.lastName}`,
        patientNumber: patient.patientNumber,
      }));
      setPatients(formattedPatients);
    }
  }, [patientStore.patients]);

  // Format doctors for select component
  useEffect(() => {
    if (doctorStore.doctorSummaries.length > 0) {
      const formattedDoctors = doctorStore.doctorSummaries.map(doctor => ({
        value: doctor.id,
        label: `Dr. ${doctor.fullName} - ${doctor.specialization}`,
      }));
      setDoctors(formattedDoctors);
    }
  }, [doctorStore.doctorSummaries]);

  // React Hook Form setup
  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<AddPrescriptionFormData>({
    resolver: zodResolver(AddPrescriptionFormSchema),
    mode: 'onBlur',
    defaultValues: {
      patientId: initialData?.patientId || '',
      doctorId: initialData?.doctorId || '',
      datePrescribed: initialData?.datePrescribed || new Date().toISOString().split('T')[0],
      medications: initialData?.medications || [{ 
        name: '', 
        dosage: '', 
        frequency: '', 
        duration: '', 
        instructions: '' 
      }],
      notes: initialData?.notes || '',
    },
  });

  // useFieldArray for dynamic medications
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'medications',
  });

  // Watch form values for button state and logic
  const patientId = watch('patientId');
  const doctorId = watch('doctorId');
  const datePrescribed = watch('datePrescribed');
  const medications = watch('medications');

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
  }, [patientId, doctorId, datePrescribed, medications, error, onClearError]);

  const handleFormSubmit = async (data: AddPrescriptionFormData) => {
    // Filter out empty medications
    const validMedications = data.medications.filter(med => 
      med.name.trim() && med.dosage.trim() && med.frequency.trim() && med.duration.trim()
    );

    if (validMedications.length === 0) {
      return false;
    }

    const formData = {
      ...data,
      medications: validMedications,
    };

    return await onSubmit(formData);
  };

  const addMedication = () => {
    append({ name: '', dosage: '', frequency: '', duration: '', instructions: '' });
  };

  const addCommonMedication = (medication: typeof COMMON_MEDICATIONS[0]) => {
    append({
      name: medication.name,
      dosage: medication.dosage,
      frequency: medication.frequency,
      duration: medication.duration,
      instructions: '',
    });
  };

  const isFormValid = patientId && doctorId && datePrescribed && 
    medications.some(med => med.name.trim() && med.dosage.trim() && med.frequency.trim() && med.duration.trim());

  const medicationOptions = COMMON_MEDICATIONS.map(med => ({
    value: med.name,
    label: med.name,
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
                label="Patient *"
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

        {/* Doctor Selection */}
        <Controller
          name="doctorId"
          control={control}
          render={({ field }) => (
            <FormSelect
              {...field}
              label="Doctor *"
              placeholder="Select a doctor"
              data={doctors}
              searchable
              clearable
              error={errors.doctorId?.message}
            />
          )}
        />

        {/* Date Prescribed */}
        <Controller
          name="datePrescribed"
          control={control}
          render={({ field }) => (
            <DateInput
              {...field}
              label="Date Prescribed *"
              placeholder="Select date"
              value={field.value ? new Date(field.value) : null}
              onChange={(date) => {
                if (date) {
                  const dateObj = date as unknown as Date;
                  field.onChange(dateObj.toISOString().split('T')[0]);
                } else {
                  field.onChange('');
                }
              }}
              maxDate={new Date()}
              error={errors.datePrescribed?.message}
              leftSection={<Icon icon="fas fa-calendar" />}
            />
          )}
        />

        {/* Medications Section */}
        <Box>
          <Group justify="space-between" align="center" mb="sm">
            <Text fw={500}>Medications *</Text>
            <Button
              variant="light"
              size="compact-sm"
              leftSection={<Icon icon="fas fa-plus" />}
              onClick={addMedication}
            >
              Add Medication
            </Button>
          </Group>

          {/* Common Medications Quick Add */}
          <Box mb="md">
            <Text size="sm" c="dimmed" mb="xs">Quick add common medications:</Text>
            <Group gap="xs">
              {COMMON_MEDICATIONS.slice(0, 4).map((medication) => (
                <Button
                  key={medication.name}
                  variant="light"
                  size="compact-xs"
                  onClick={() => addCommonMedication(medication)}
                >
                  {medication.name}
                </Button>
              ))}
            </Group>
          </Box>

          <Stack gap="md">
            {fields.map((field, index) => (
              <Box key={field.id} p="md" style={{ border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                <Group justify="space-between" align="center" mb="sm">
                  <Text size="sm" fw={500}>Medication {index + 1}</Text>
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
                  <Group grow>
                    <Controller
                      name={`medications.${index}.name`}
                      control={control}
                      render={({ field }) => (
                        <FormSelect
                          {...field}
                          label="Medication Name *"
                          placeholder="Select or type medication"
                          data={medicationOptions}
                          searchable
                          error={errors.medications?.[index]?.name?.message}
                        />
                      )}
                    />
                    <Controller
                      name={`medications.${index}.dosage`}
                      control={control}
                      render={({ field }) => (
                        <TextInput
                          {...field}
                          label="Dosage *"
                          placeholder="e.g., 500mg"
                          error={errors.medications?.[index]?.dosage?.message}
                        />
                      )}
                    />
                  </Group>

                  <Group grow>
                    <Controller
                      name={`medications.${index}.frequency`}
                      control={control}
                      render={({ field }) => (
                        <FormSelect
                          {...field}
                          label="Frequency *"
                          placeholder="Select frequency"
                          data={FREQUENCY_OPTIONS}
                          searchable
                          error={errors.medications?.[index]?.frequency?.message}
                        />
                      )}
                    />
                    <Controller
                      name={`medications.${index}.duration`}
                      control={control}
                      render={({ field }) => (
                        <FormSelect
                          {...field}
                          label="Duration *"
                          placeholder="Select duration"
                          data={DURATION_OPTIONS}
                          searchable
                          error={errors.medications?.[index]?.duration?.message}
                        />
                      )}
                    />
                  </Group>

                  <Controller
                    name={`medications.${index}.instructions`}
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        label="Instructions (Optional)"
                        placeholder="e.g., Take with food, Avoid alcohol"
                        minRows={2}
                        maxRows={4}
                        error={errors.medications?.[index]?.instructions?.message}
                      />
                    )}
                  />
                </Stack>
              </Box>
            ))}
          </Stack>

          {errors.medications && (
            <Text c="red" size="sm" mt="xs">
              {errors.medications.message}
            </Text>
          )}
        </Box>

        {/* Notes */}
        <Controller
          name="notes"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              label="Additional Notes (Optional)"
              placeholder="Any additional notes or instructions..."
              minRows={3}
              maxRows={6}
              error={errors.notes?.message}
            />
          )}
        />

        <Divider />

        {/* Submit Button */}
        <Group justify="flex-end">
          <Button
            type="submit"
            loading={isLoading}
            disabled={!isFormValid || isLoading}
            leftSection={<Icon icon="fas fa-pills" />}
          >
            {editMode ? 'Update Prescription' : 'Create Prescription'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
};
