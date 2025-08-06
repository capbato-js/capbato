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
 * - Automatic doctor assignment based on date (MWF = Doctor 1, TTh = Doctor 2)
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

  // Doctor assignment logic based on day of week
  const getDoctorForDate = (date: Date): string => {
    // Ensure we have a valid Date object
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      console.error('Invalid date passed to getDoctorForDate:', date);
      return 'Dr. Smith (General Physician)'; // Default fallback
    }
    
    // Check if doctors are loaded
    if (doctorStore.doctorSummaries.length === 0) {
      return 'Loading doctor assignment...';
    }

    const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // MWF (Monday=1, Wednesday=3, Friday=5) = Doctor 1
    // TTh (Tuesday=2, Thursday=4) = Doctor 2
    if ([1, 3, 5].includes(dayOfWeek)) {
      // Find first doctor (assuming they are ordered)
      const doctor1 = doctorStore.doctorSummaries[0];
      return doctor1 ? `${doctor1.fullName} - ${doctor1.specialization}` : 'Dr. Smith (General Physician)';
    } else if ([2, 4].includes(dayOfWeek)) {
      // Find second doctor
      const doctor2 = doctorStore.doctorSummaries[1];  
      return doctor2 ? `${doctor2.fullName} - ${doctor2.specialization}` : 'Dr. Johnson (General Physician)';
    } else {
      // Weekend - default to first doctor
      const doctor1 = doctorStore.doctorSummaries[0];
      return doctor1 ? `${doctor1.fullName} - ${doctor1.specialization}` : 'Dr. Smith (General Physician)';
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
  }, [editMode, initialData, reset]);

  // Initialize form in edit mode
  useEffect(() => {
    if (editMode && initialData) {
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
  }, [editMode, initialData]);

  // Handle patient selection to show patient number
  const handlePatientChange = (patientId: string) => {
    const selectedPatient = patients.find(p => p.value === patientId);
    if (selectedPatient) {
      setSelectedPatientNumber(selectedPatient.patientNumber);
      setValue('patientName', patientId);
    }
  };

  // Handle date change to auto-assign doctor
  const handleDateChange = (selectedDate: Date | null) => {
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
      
      const doctor = getDoctorForDate(selectedDate);
      setAssignedDoctor(doctor);
      
      // For backend compatibility, we'll use the doctor ID instead of name
      // Find the actual doctor ID based on the day
      const dayOfWeek = selectedDate.getDay();
      let doctorId = '';
      
      if ([1, 3, 5].includes(dayOfWeek)) {
        // MWF - Doctor 1
        doctorId = doctorStore.doctorSummaries[0]?.id || 'doctor1';
      } else if ([2, 4].includes(dayOfWeek)) {
        // TTh - Doctor 2  
        doctorId = doctorStore.doctorSummaries[1]?.id || 'doctor2';
      } else {
        // Weekend - default to first doctor
        doctorId = doctorStore.doctorSummaries[0]?.id || 'doctor1';
      }
      
      setValue('doctor', doctorId);
    } else {
      // Clear doctor assignment if no valid date is selected
      setAssignedDoctor('');
      setValue('doctor', '');
      // Reset time slots to default (empty)
      setTimeSlots(getAvailableTimeSlots('', currentAppointmentId));
    }
  };

  // Check if form is valid and complete
  const isFormValid = patientName && reasonForVisit && date && time;

  // Form submission handler
  const handleFormSubmit = handleSubmit(async (data) => {
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
            <Text size="sm" c="dimmed" mt={4}>
              Assigned Doctor: {assignedDoctor}
            </Text>
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
          leftSection={<Icon icon="fas fa-calendar-plus" />}
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
