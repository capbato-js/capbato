import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Button,
  Stack,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { AddAppointmentFormSchema, type AddAppointmentFormData } from '@nx-starter/application-shared';
import { Icon } from '../../../components/common';
import { FormSelect } from '../../../components/ui/FormSelect';

export interface AddAppointmentFormProps {
  onSubmit: (data: AddAppointmentFormData) => Promise<boolean>;
  isLoading: boolean;
  error?: string | null;
  onClearError?: () => void;
}

/**
 * AddAppointmentForm component handles the creation of new appointments
 * with form validation and proper TypeScript typing.
 */
export const AddAppointmentForm: React.FC<AddAppointmentFormProps> = ({
  onSubmit,
  isLoading,
  error,
  onClearError,
}) => {
  // Mock data - to be replaced with actual API calls later
  const [patients] = useState([
    { value: 'Juan Dela Cruz', label: 'Juan Dela Cruz (P-001)' },
    { value: 'Maria Santos', label: 'Maria Santos (P-002)' },
    { value: 'Pedro Garcia', label: 'Pedro Garcia (P-003)' },
    { value: 'Ana Rodriguez', label: 'Ana Rodriguez (P-004)' },
    { value: 'Carlos Reyes', label: 'Carlos Reyes (P-005)' },
  ]);

  const [reasonsForVisit] = useState([
    { value: 'Consultation', label: 'Consultation' },
    { value: 'Laboratory: Blood chemistry', label: 'Laboratory: Blood chemistry' },
    { value: 'Laboratory: Hematology', label: 'Laboratory: Hematology' },
    { value: 'Laboratory: Serology & Immunology', label: 'Laboratory: Serology & Immunology' },
    { value: 'Laboratory: Urinalysis', label: 'Laboratory: Urinalysis' },
    { value: 'Laboratory: Fecalysis', label: 'Laboratory: Fecalysis' },
    { value: 'Prescription', label: 'Prescription' },
    { value: 'Follow-up check-up', label: 'Follow-up check-up' },
    { value: 'Medical Certificate', label: 'Medical Certificate' },
  ]);

  const [doctors] = useState([
    { value: 'Dr. Smith', label: 'Dr. Smith (General Medicine)' },
    { value: 'Dr. Johnson', label: 'Dr. Johnson (Pediatrics)' },
    { value: 'Dr. Brown', label: 'Dr. Brown (Cardiology)' },
    { value: 'Dr. Wilson', label: 'Dr. Wilson (Dermatology)' },
    { value: 'Dr. Davis', label: 'Dr. Davis (Orthopedics)' },
  ]);

  // Helper function to format time to 12-hour format
  const formatTimeLabel = (timeStr: string) => {
    const [hourStr, minuteStr] = timeStr.split(':');
    const hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${displayHour}:${minuteStr} ${ampm}`;
  };

  // Generate available time slots
  const [timeSlots] = useState(() => {
    const slots = [];
    for (let hour = 8; hour <= 17; hour++) {
      for (const minute of [0, 15, 30, 45]) {
        const timeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
        const displayTime = formatTimeLabel(timeStr);
        slots.push({ value: timeStr, label: displayTime });
      }
    }
    return slots;
  });

  // React Hook Form setup
  const {
    handleSubmit,
    reset,
    control,
    watch,
  } = useForm<AddAppointmentFormData>({
    resolver: zodResolver(AddAppointmentFormSchema),
    mode: 'onBlur',
    defaultValues: {
      patientName: '',
      reasonForVisit: '',
      date: '',
      time: '',
      doctor: '',
    },
  });

  // Watch form values for button state
  const patientName = watch('patientName');
  const reasonForVisit = watch('reasonForVisit');
  const date = watch('date');
  const time = watch('time');
  const doctor = watch('doctor');

  // Check if required form fields are empty
  const isFormEmpty = !patientName?.trim() || 
                      !reasonForVisit?.trim() || 
                      !date?.trim() || 
                      !time?.trim() || 
                      !doctor?.trim();

  const handleFormSubmit = handleSubmit(async (data: AddAppointmentFormData) => {
    const success = await onSubmit(data);
    
    // Only reset form on successful submission
    if (success) {
      reset();
    }
  });

  // Clear error when user starts typing
  const handleInputChange = () => {
    if (error && onClearError) {
      onClearError();
    }
  };

  // Set today as minimum date
  const today = new Date();

  // Set default date to today
  useEffect(() => {
    if (!date) {
      const defaultDate = new Date();
      defaultDate.setHours(0, 0, 0, 0);
      // We don't set the default here to avoid form validation issues
    }
  }, [date]);

  return (
    <form onSubmit={handleFormSubmit} noValidate>
      <Stack gap="md">
        {/* Error message */}
        {error && (
          <div 
            className="text-red-600 text-sm mb-4 text-center"
            data-testid="add-appointment-error"
          >
            {error}
          </div>
        )}

        {/* Patient Name */}
        <Controller
          name="patientName"
          control={control}
          render={({ field, fieldState }) => (
            <FormSelect
              {...field}
              label="Patient Name"
              placeholder="Search and select patient"
              data={patients}
              error={fieldState.error}
              disabled={isLoading}
              // leftSection={<Icon icon="fas fa-user" size={16} />}
              onChange={(value: string | null) => {
                field.onChange(value);
                handleInputChange();
              }}
            />
          )}
        />

        {/* Reason for Visit */}
        <Controller
          name="reasonForVisit"
          control={control}
          render={({ field, fieldState }) => (
            <FormSelect
              {...field}
              label="Reason for Visit"
              placeholder="Select reason for visit"
              data={reasonsForVisit}
              error={fieldState.error}
              disabled={isLoading}
              // leftSection={<Icon icon="fas fa-stethoscope" size={16} />}
              onChange={(value: string | null) => {
                field.onChange(value);
                handleInputChange();
              }}
            />
          )}
        />

        {/* Date */}
        <Controller
          name="date"
          control={control}
          render={({ field, fieldState }) => (
            <DateInput
              label="Appointment Date"
              placeholder={fieldState.error ? '' : "Enter date"}
              error={fieldState.error?.message}
              disabled={isLoading}
              required
              valueFormat="MMMM D, YYYY"
              minDate={today}
              maxDate={new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000)} // 6 months from now
              leftSection={<Icon icon="fas fa-calendar" size={14} />}
              onChange={(value: string | null) => {
                field.onChange(value);
                handleInputChange();
              }}
              value={field.value || ''}
            />
          )}
        />

        {/* Time */}
        <Controller
          name="time"
          control={control}
          render={({ field, fieldState }) => (
            <FormSelect
              {...field}
              label="Appointment Time"
              placeholder="Select available time"
              data={timeSlots}
              error={fieldState.error}
              disabled={isLoading}
              // leftSection={<Icon icon="fas fa-clock" size={16} />}
              onChange={(value: string | null) => {
                field.onChange(value);
                handleInputChange();
              }}
            />
          )}
        />

        {/* Select Doctor */}
        <Controller
          name="doctor"
          control={control}
          render={({ field, fieldState }) => (
            <FormSelect
              {...field}
              label="Select Doctor"
              placeholder="Choose doctor"
              data={doctors}
              error={fieldState.error}
              disabled={isLoading}
              // leftSection={<Icon icon="fas fa-user-md" size={16} />}
              onChange={(value: string | null) => {
                field.onChange(value);
                handleInputChange();
              }}
            />
          )}
        />
        
        {/* Action Button */}
        <Button
          type="submit"
          disabled={isFormEmpty || isLoading}
          loading={isLoading}
          color="#17A589"
          fullWidth
          mt="md"
        >
          <Icon icon="fas fa-calendar-plus" style={{ marginRight: '4px' }} />
          {isLoading ? 'Adding Appointment...' : 'Add Appointment'}
        </Button>
      </Stack>
    </form>
  );
};
