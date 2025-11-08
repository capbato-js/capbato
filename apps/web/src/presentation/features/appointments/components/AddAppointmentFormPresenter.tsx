import React from 'react';
import { Controller, Control } from 'react-hook-form';
import { Button, Stack, Box, MultiSelect } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { AddAppointmentFormData } from '@nx-starter/application-shared';
import { Icon } from '../../../components/common';
import { FormSelect } from '../../../components/ui/FormSelect';
import { ReadOnlyField } from './ReadOnlyField';
import { DoctorAssignmentDisplay } from './DoctorAssignmentDisplay';
import { PatientNumberDisplay } from './PatientNumberDisplay';
import { FormErrorMessage } from './FormErrorMessage';
import {
  REASONS_FOR_VISIT_OPTIONS,
  FORM_LABELS,
  FORM_PLACEHOLDERS,
  FORM_MESSAGES
} from '../config/appointmentFormConfig';

interface AddAppointmentFormPresenterProps {
  // Form control
  control: Control<AddAppointmentFormData>;
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  
  // Data
  patients: Array<{ value: string; label: string; patientNumber: string }>;
  timeSlots: Array<{ value: string; label: string }>;
  selectedPatientNumber: string;
  assignedDoctor: string;
  
  // Handlers
  onPatientChange: (patientId: string) => void;
  onDateChange: (date: Date | null) => void;
  onInputChange: () => void;
  
  // States
  isLoading: boolean;
  error?: string | null;
  isFormValid: boolean;
  
  // Mode flags
  editMode: boolean;
  isRescheduleMode: boolean;
  
  // Initial data
  initialData?: {
    patientId?: string;
    patientName?: string;
    patientNumber?: string;
    reasonForVisit?: string;
    appointmentDate?: string;
    appointmentTime?: string;
    doctorId?: string;
    doctorName?: string;
  };
  
  // Store states
  isPatientStoreLoading: boolean;
}

export const AddAppointmentFormPresenter: React.FC<AddAppointmentFormPresenterProps> = ({
  control,
  handleSubmit,
  patients,
  timeSlots,
  selectedPatientNumber,
  assignedDoctor,
  onPatientChange,
  onDateChange,
  onInputChange,
  isLoading,
  error,
  isFormValid,
  editMode,
  isRescheduleMode,
  initialData,
  isPatientStoreLoading
}) => {
  const today = new Date();

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Stack gap="md">
        {/* Error message */}
        <FormErrorMessage error={error || ''} />

        {/* Patient Name Field */}
        <Controller
          name="patientName"
          control={control}
          render={({ field, fieldState }) => (
            <Box>
              {editMode ? (
                <ReadOnlyField
                  label={FORM_LABELS.PATIENT_NAME}
                  value={initialData?.patientName || 'Unknown Patient'}
                  icon="fas fa-user"
                  helperText={isRescheduleMode 
                    ? FORM_MESSAGES.EDIT_MODE.RESCHEDULE_PATIENT_READONLY
                    : FORM_MESSAGES.EDIT_MODE.PATIENT_READONLY
                  }
                  required
                />
              ) : (
                <FormSelect
                  {...field}
                  label={FORM_LABELS.PATIENT_NAME}
                  placeholder={FORM_PLACEHOLDERS.PATIENT_NAME}
                  data={patients}
                  error={fieldState.error}
                  disabled={isLoading || isPatientStoreLoading}
                  onChange={(value) => {
                    field.onChange(value);
                    if (value) onPatientChange(value);
                    onInputChange();
                  }}
                  leftSection={<Icon icon="fas fa-user" size={16} />}
                />
              )}
              <PatientNumberDisplay patientNumber={selectedPatientNumber} />
            </Box>
          )}
        />

        {/* Reason for Visit Field */}
        <Controller
          name="reasonForVisit"
          control={control}
          render={({ field, fieldState }) => (
            <>
              {isRescheduleMode ? (
                <ReadOnlyField
                  label={FORM_LABELS.REASON_FOR_VISIT}
                  value={Array.isArray(initialData?.reasonForVisit)
                    ? initialData.reasonForVisit.join(', ')
                    : initialData?.reasonForVisit || 'Unknown Reason'}
                  icon="fas fa-stethoscope"
                  helperText={FORM_MESSAGES.EDIT_MODE.RESCHEDULE_REASON_READONLY}
                  required
                />
              ) : (
                <MultiSelect
                  name={field.name}
                  ref={field.ref}
                  onBlur={field.onBlur}
                  label={FORM_LABELS.REASON_FOR_VISIT}
                  placeholder={FORM_PLACEHOLDERS.REASON_FOR_VISIT}
                  data={REASONS_FOR_VISIT_OPTIONS}
                  error={fieldState.error?.message}
                  disabled={isLoading}
                  value={(() => {
                    // Normalize value to clean array
                    if (Array.isArray(field.value)) {
                      return field.value.filter(v => v != null && v !== '');
                    }
                    if (field.value && typeof field.value === 'string') {
                      return [field.value];
                    }
                    return [];
                  })()}
                  onChange={(value) => {
                    field.onChange(value);
                    onInputChange();
                  }}
                  leftSection={<Icon icon="fas fa-stethoscope" size={16} />}
                  searchable
                  clearable
                />
              )}
            </>
          )}
        />

        {/* Appointment Date Field */}
        <Controller
          name="date"
          control={control}
          render={({ field, fieldState }) => (
            <>
              {isRescheduleMode ? (
                <ReadOnlyField
                  label={FORM_LABELS.APPOINTMENT_DATE}
                  value={initialData?.appointmentDate 
                    ? new Date(initialData.appointmentDate + 'T00:00:00').toLocaleDateString() 
                    : 'Unknown Date'
                  }
                  icon="fas fa-calendar"
                  helperText={FORM_MESSAGES.EDIT_MODE.RESCHEDULE_DATE_READONLY}
                  required
                />
              ) : (
                <DateInput
                  label={FORM_LABELS.APPOINTMENT_DATE}
                  placeholder={FORM_PLACEHOLDERS.APPOINTMENT_DATE}
                  minDate={today}
                  error={fieldState.error?.message}
                  disabled={isLoading}
                  value={field.value ? new Date(field.value) : null}
                  onChange={(value) => {
                    let dateString = '';
                    if (value && typeof value === 'object' && 'getTime' in value && !isNaN((value as Date).getTime())) {
                      dateString = (value as Date).toISOString().split('T')[0];
                    } else if (typeof value === 'string' && value) {
                      const parsedDate = new Date(value);
                      if (!isNaN(parsedDate.getTime())) {
                        dateString = parsedDate.toISOString().split('T')[0];
                      }
                    }
                    
                    field.onChange(dateString);
                    onDateChange(value && typeof value === 'object' && 'getTime' in value ? value as Date : (value ? new Date(value as string) : null));
                    onInputChange();
                  }}
                  leftSection={<Icon icon="fas fa-calendar" size={16} />}
                />
              )}
            </>
          )}
        />

        {/* Doctor Assignment Display */}
        <DoctorAssignmentDisplay assignedDoctor={assignedDoctor} />

        {/* Appointment Time Field */}
        <Controller
          name="time"
          control={control}
          render={({ field, fieldState }) => (
            <FormSelect
              {...field}
              label={FORM_LABELS.APPOINTMENT_TIME}
              placeholder={FORM_PLACEHOLDERS.APPOINTMENT_TIME}
              data={timeSlots}
              error={fieldState.error}
              disabled={isLoading}
              leftSection={<Icon icon="fas fa-clock" size={16} />}
              onChange={(value) => {
                field.onChange(value);
                onInputChange();
              }}
            />
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          size="md"
          loading={isLoading}
          disabled={!isFormValid || isLoading}
          leftSection={<Icon icon={editMode ? "fas fa-edit" : "fas fa-calendar-plus"} />}
          style={{ marginRight: '4px' }}
          data-testid="submit-appointment-button"
        >
          {isLoading 
            ? (editMode ? FORM_MESSAGES.LOADING.UPDATING : FORM_MESSAGES.LOADING.CREATING)
            : (editMode ? FORM_MESSAGES.BUTTONS.UPDATE : FORM_MESSAGES.BUTTONS.CREATE)
          }
        </Button>
      </Stack>
    </form>
  );
};