import React from 'react';
import { Controller, FieldArrayWithId } from 'react-hook-form';
import { 
  Button,
  Stack,
  Text,
  Box,
  Group,
  Alert,
  Divider,
  Textarea,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { AddPrescriptionFormData } from '@nx-starter/application-shared';
import { Icon } from '../../../components/common';
import { FormSelect } from '../../../components/ui/FormSelect';
import { MedicationRow } from './MedicationRow';
import { CommonMedicationsQuickAdd } from './CommonMedicationsQuickAdd';
import { PatientInfoDisplay } from './PatientInfoDisplay';
import { handleDateChange } from '../utils/prescriptionFormUtils';
import { 
  PrescriptionFormControl, 
  PrescriptionFormErrors, 
  PrescriptionFormHandleSubmit 
} from '../hooks/usePrescriptionFormState';
import { FormattedPatient, FormattedDoctor } from '../hooks/usePrescriptionFormData';

interface AddPrescriptionFormPresenterProps {
  control: PrescriptionFormControl;
  handleSubmit: PrescriptionFormHandleSubmit;
  errors: PrescriptionFormErrors;
  fields: FieldArrayWithId<AddPrescriptionFormData, "medications", "id">[];
  patients: FormattedPatient[];
  doctors: FormattedDoctor[];
  selectedPatientNumber: string;
  addMedication: () => void;
  removeMedication: (index: number) => void;
  onFormSubmit: (data: AddPrescriptionFormData) => Promise<boolean>;
  isLoading: boolean;
  error?: string | null;
  isFormValid: boolean;
  editMode: boolean;
  hasAnyPatientsWithAppointmentsToday?: boolean;
  isLoadingAppointments?: boolean;
}

export const AddPrescriptionFormPresenter: React.FC<AddPrescriptionFormPresenterProps> = ({
  control,
  handleSubmit,
  errors,
  fields,
  patients,
  doctors,
  selectedPatientNumber,
  addMedication,
  removeMedication,
  onFormSubmit,
  isLoading,
  error,
  isFormValid,
  editMode,
  hasAnyPatientsWithAppointmentsToday = true,
  isLoadingAppointments = false,
}) => {
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
                disabled={isLoadingAppointments}
              />
            )}
          />
          <PatientInfoDisplay patientNumber={selectedPatientNumber} />
          {!isLoadingAppointments && !hasAnyPatientsWithAppointmentsToday && (
            <Text size="sm" c="red" mt={4}>
              There are no patients who have appointments for today.
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
              onChange={(date) => handleDateChange(date, field.onChange)}
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
          <CommonMedicationsQuickAdd onAddMedication={addMedication} />

          <Stack gap="md">
            {fields.map((field, index) => (
              <MedicationRow
                key={field.id}
                index={index}
                fieldId={field.id}
                control={control}
                errors={errors}
                onRemove={() => removeMedication(index)}
                canRemove={fields.length > 1}
              />
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