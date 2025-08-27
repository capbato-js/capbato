import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Button,
  Stack,
  Text,
  Box,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { AddAppointmentFormSchema, type AddAppointmentFormData } from '@nx-starter/application-shared';
import { Icon } from '../../../components/common';
import { FormSelect } from '../../../components/ui/FormSelect';
import { usePatientStore } from '../../../../infrastructure/state/PatientStore';
import { useDoctorStore } from '../../../../infrastructure/state/DoctorStore';
import { useAppointmentStore } from '../../../../infrastructure/state/AppointmentStore';
import { doctorAssignmentService } from '../services/DoctorAssignmentService';

export interface AddAppointmentFormProps {
  onSubmit: (data: AddAppointmentFormData) => Promise<boolean>;
  isLoading: boolean;
  error?: string | null;
  onClearError?: () => void;
  // Edit mode props
  editMode?: boolean;
  currentAppointmentId?: string;
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
}

/**
 * AddAppointmentForm component handles the creation and editing of appointments
 * with form validation and proper TypeScript typing.
 * 
 * Features:
 * - Real patient data from backend
 * - Schedule-aware doctor assignment that follows Doctor Schedule Calendar logic
 * - Considers doctor schedule patterns (MWF, TTH) and override schedules from API
 * - Patient number display
 * - Edit mode support for modifying existing appointments
 */
export const AddAppointmentForm: React.FC<AddAppointmentFormProps> = ({
  onSubmit,
  isLoading,
  error,
  onClearError,
  editMode = false,
  currentAppointmentId,
  initialData,
}) => {
  // State for patients and doctors
  const [patients, setPatients] = useState<Array<{ value: string; label: string; patientNumber: string }>>([]);
  const [selectedPatientNumber, setSelectedPatientNumber] = useState<string>('');
  const [assignedDoctor, setAssignedDoctor] = useState<string>('');
  
  // Get stores
  const patientStore = usePatientStore();
  const doctorStore = useDoctorStore();
  const appointmentStore = useAppointmentStore();

  // Load patients and doctors on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Clear the doctor assignment cache to ensure fresh data
        doctorAssignmentService.getInstance().clearCache();
        
        // Load patients
        await patientStore.loadPatients();
        
        // Load doctors
        await doctorStore.getAllDoctors(true, 'summary');
        
        // Load appointments for filtering time slots
        await appointmentStore.fetchAllAppointments();
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

  // Doctor assignment logic using schedule calendar logic
  const getDoctorForDate = async (date: Date): Promise<string> => {
    // Ensure we have a valid Date object
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      console.error('Invalid date passed to getDoctorForDate:', date);
      return 'Invalid date selected'; // Default fallback
    }
    
    try {
      // Use the doctor assignment service to get the correct doctor
      const displayName = await doctorAssignmentService.getInstance().getAssignedDoctorDisplayName(date);
      return displayName;
    } catch (error) {
      console.error('Error getting doctor assignment:', error);
      return 'Error loading doctor assignment';
    }
  };

  // Helper function to get doctor ID for form submission
  const getDoctorIdForDate = async (date: Date): Promise<string | null> => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return null;
    }
    
    try {
      return await doctorAssignmentService.getInstance().getAssignedDoctorId(date);
    } catch (error) {
      console.error('Error getting doctor ID:', error);
      return null;
    }
  };

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

  // Helper function to format time to 12-hour format
  const formatTimeLabel = (timeStr: string) => {
    const [hourStr, minuteStr] = timeStr.split(':');
    const hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${displayHour}:${minuteStr} ${ampm}`;
  };

  // Generate available time slots based on selected date, filtering out booked times
  const getAvailableTimeSlots = (selectedDate: string, excludeCurrentAppointmentId?: string) => {
    const slots = [];
    const now = new Date();
    const isToday = selectedDate === now.toISOString().split('T')[0];
    
    // Get existing appointments for the selected date
    const existingAppointments = selectedDate ? appointmentStore.getAppointmentsByDate(selectedDate) : [];
    const bookedTimes = existingAppointments
      .filter(apt => {
        // In edit mode, exclude the current appointment being edited
        return excludeCurrentAppointmentId ? apt.id !== excludeCurrentAppointmentId : true;
      })
      .map(apt => apt.appointmentTime);
    
    for (let hour = 8; hour <= 17; hour++) {
      for (const minute of [0, 15, 30, 45]) {
        const timeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
        
        // If it's today, only show times that are in the future
        if (isToday) {
          const currentHour = now.getHours();
          const currentMinute = now.getMinutes();
          
          // Skip if this time slot is in the past
          if (hour < currentHour || (hour === currentHour && minute <= currentMinute)) {
            continue;
          }
        }
        
        // Skip if this time slot is already booked
        if (bookedTimes.includes(timeStr)) {
          continue;
        }
        
        const displayTime = formatTimeLabel(timeStr);
        slots.push({ value: timeStr, label: displayTime });
      }
    }
    
    return slots;
  };

  // Generate time slots - will be updated when date changes
  const [timeSlots, setTimeSlots] = useState(() => getAvailableTimeSlots('', currentAppointmentId));

  // React Hook Form setup
  const {
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
  } = useForm<AddAppointmentFormData>({
    resolver: zodResolver(AddAppointmentFormSchema),
    mode: 'onBlur',
    defaultValues: {
      patientName: initialData?.patientId || '',
      reasonForVisit: initialData?.reasonForVisit || '',
      date: initialData?.appointmentDate || '',
      time: initialData?.appointmentTime || '',
      doctor: initialData?.doctorId || '',
    },
  });

  // Watch form values for button state and logic
  const patientName = watch('patientName');
  const reasonForVisit = watch('reasonForVisit');
  const date = watch('date');
  const time = watch('time');

  // Initialize form in edit mode
  useEffect(() => {
    if (editMode && initialData) {
      // Reset form with initial data
      reset({
        patientName: initialData.patientId || '',
        reasonForVisit: initialData.reasonForVisit || '',
        date: initialData.appointmentDate || '',
        time: initialData.appointmentTime || '',
        doctor: initialData.doctorId || '',
      });
      
      // Set patient number if provided
      if (initialData.patientNumber) {
        setSelectedPatientNumber(initialData.patientNumber);
      }
      
      // Set assigned doctor display if provided
      if (initialData.doctorName) {
        setAssignedDoctor(initialData.doctorName);
      }
      
      // If we have a date, update time slots
      if (initialData.appointmentDate) {
        const newTimeSlots = getAvailableTimeSlots(initialData.appointmentDate, currentAppointmentId);
        setTimeSlots(newTimeSlots);
      }
    }
  }, [editMode, initialData, reset, currentAppointmentId]);

  // Handle patient selection to show patient number
  const handlePatientChange = (patientId: string) => {
    const selectedPatient = patients.find(p => p.value === patientId);
    if (selectedPatient) {
      setSelectedPatientNumber(selectedPatient.patientNumber);
      setValue('patientName', patientId);
    }
  };

  // Handle date change to auto-assign doctor
  const handleDateChange = async (selectedDate: Date | null) => {
    if (selectedDate && selectedDate instanceof Date && !isNaN(selectedDate.getTime())) {
      const dateString = selectedDate.toISOString().split('T')[0];
      
      // Update available time slots based on selected date
      const newTimeSlots = getAvailableTimeSlots(dateString, currentAppointmentId);
      setTimeSlots(newTimeSlots);
      
      // Clear the time selection if currently selected time is no longer available
      const currentTime = watch('time');
      if (currentTime && !newTimeSlots.some(slot => slot.value === currentTime)) {
        setValue('time', '');
      }
      
      // Get the correct doctor assignment using the service
      try {
        const [doctor, doctorId] = await Promise.all([
          getDoctorForDate(selectedDate),
          getDoctorIdForDate(selectedDate)
        ]);
        
        setAssignedDoctor(doctor);
        setValue('doctor', doctorId || '');
        
        // Clear any previous doctor assignment errors
        if (onClearError) {
          onClearError();
        }
      } catch (error) {
        console.error('Error assigning doctor for date:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setAssignedDoctor(`Error: ${errorMessage}`);
        setValue('doctor', '');
      }
    } else {
      // Clear doctor assignment if no valid date is selected
      setAssignedDoctor('');
      setValue('doctor', '');
      // Reset time slots to default (empty)
      setTimeSlots(getAvailableTimeSlots('', currentAppointmentId));
    }
  };

  // Check if form is valid and complete
  // In edit mode, patientName might be empty (since it's read-only), but we consider it valid if initialData exists
  const isPatientValid = editMode ? (initialData?.patientId || initialData?.patientName) : patientName;
  const isFormValid = isPatientValid && reasonForVisit && date && time && assignedDoctor && !assignedDoctor.startsWith('Error') && assignedDoctor !== 'No doctor assigned';

  // Form submission handler
  const handleFormSubmit = handleSubmit(async (data) => {
    // In edit mode, if patientName is empty, use the original patient ID from initialData
    if (editMode && !data.patientName && initialData?.patientId) {
      data.patientName = initialData.patientId;
    }
    
    // Data is already in the correct format (date as string)
    const success = await onSubmit(data);
    // Only reset form on successful submission
    if (success) {
      reset();
      setSelectedPatientNumber('');
      setAssignedDoctor('');
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
            <Box>
              {editMode ? (
                // Edit mode - Display patient name as read-only text
                <Box>
                  <Text size="sm" fw={500} mb={8}>
                    Patient Name
                    <Text component="span" c="red" ml={4}>*</Text>
                  </Text>
                  <Box
                    style={{
                      padding: '10px 12px',
                      border: '1px solid #e9ecef',
                      borderRadius: '6px',
                      backgroundColor: '#f8f9fa',
                      minHeight: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <Icon icon="fas fa-user" size={16} style={{ color: '#6c757d' }} />
                    <Text c="dark" size="sm" fw={500}>
                      {initialData?.patientName || 'Unknown Patient'}
                    </Text>
                  </Box>
                  {/* Patient Number Display */}
                  {selectedPatientNumber && (
                    <Text size="sm" c="dimmed" mt={4}>
                      Patient #: {selectedPatientNumber}
                    </Text>
                  )}
                  <Text size="xs" c="dimmed" mt={4} fs="italic">
                    Patient information cannot be changed when modifying an appointment
                  </Text>
                </Box>
              ) : (
                // Add mode - Editable FormSelect
                <>
                  <FormSelect
                    {...field}
                    label="Patient Name"
                    placeholder="Search and select patient"
                    data={patients}
                    error={fieldState.error}
                    disabled={isLoading || patientStore.getIsLoading()}
                    onChange={(value) => {
                      field.onChange(value);
                      if (value) handlePatientChange(value);
                      handleInputChange();
                    }}
                    leftSection={<Icon icon="fas fa-user" size={16} />}
                  />
                  {/* Patient Number Display */}
                  {selectedPatientNumber && (
                    <Text size="sm" c="dimmed" mt={4}>
                      Patient #: {selectedPatientNumber}
                    </Text>
                  )}
                </>
              )}
            </Box>
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
              onChange={(value) => {
                field.onChange(value);
                handleInputChange();
              }}
              leftSection={<Icon icon="fas fa-stethoscope" size={16} />}
            />
          )}
        />

        {/* Appointment Date */}
        <Controller
          name="date"
          control={control}
          render={({ field, fieldState }) => (
            <DateInput
              label="Appointment Date"
              placeholder="Select appointment date"
              minDate={today}
              error={fieldState.error?.message}
              disabled={isLoading}
              value={field.value ? new Date(field.value) : null}
              onChange={(value) => {
                // Handle different types that DateInput might pass
                let dateString = '';
                if (value && typeof value === 'object' && 'getTime' in value && !isNaN((value as Date).getTime())) {
                  dateString = (value as Date).toISOString().split('T')[0];
                } else if (typeof value === 'string' && value) {
                  // If it's already a string, try to parse it
                  const parsedDate = new Date(value);
                  if (!isNaN(parsedDate.getTime())) {
                    dateString = parsedDate.toISOString().split('T')[0];
                  }
                }
                
                field.onChange(dateString);
                handleDateChange(value && typeof value === 'object' && 'getTime' in value ? value as Date : (value ? new Date(value as string) : null));
                handleInputChange();
              }}
              leftSection={<Icon icon="fas fa-calendar" size={16} />}
            />
          )}
        />

        {/* Assigned Doctor Display */}
        {assignedDoctor && (
          <Box>
            <Text 
              size="sm" 
              c={assignedDoctor.startsWith('Error') ? 'red' : 
                 assignedDoctor === 'No doctor assigned' ? 'orange' : 
                 'dimmed'} 
              mt={4}
            >
              {assignedDoctor.startsWith('Error') ? '⚠️ ' : ''}
              {assignedDoctor === 'No doctor assigned' ? '⚠️ ' : ''}
              Assigned Doctor: {assignedDoctor}
            </Text>
            {(assignedDoctor.startsWith('Error') || assignedDoctor === 'No doctor assigned') && (
              <Text size="xs" c="dimmed" mt={2}>
                {assignedDoctor === 'No doctor assigned' 
                  ? 'No doctor is scheduled for this day. Please select a different date or contact an administrator.'
                  : 'There was an issue determining doctor availability. Please try selecting the date again or contact support.'}
              </Text>
            )}
          </Box>
        )}

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
              leftSection={<Icon icon="fas fa-clock" size={16} />}
              onChange={(value) => {
                field.onChange(value);
                handleInputChange();
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
          style={{
            marginRight: '4px'
          }}
          data-testid="submit-appointment-button"
        >
          {isLoading 
            ? (editMode ? 'Updating Appointment...' : 'Creating Appointment...') 
            : (editMode ? 'Update Appointment' : 'Create Appointment')
          }
        </Button>
      </Stack>
    </form>
  );
};
