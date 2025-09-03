import React, { useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AddAppointmentFormSchema, type AddAppointmentFormData } from '@nx-starter/application-shared';
import { AddAppointmentFormProps } from './AddAppointmentForm';
import { AddAppointmentFormPresenter } from './AddAppointmentFormPresenter';
import { useAppointmentFormData } from '../hooks/useAppointmentFormData';
import { useDoctorAssignment } from '../hooks/useDoctorAssignment';
import { useTimeSlotManagement } from '../hooks/useTimeSlotManagement';
import { useAppointmentFormState } from '../hooks/useAppointmentFormState';
import { validateAppointmentForm } from '../utils/appointmentFormUtils';

export const AddAppointmentFormContainer: React.FC<AddAppointmentFormProps> = ({
  onSubmit,
  isLoading,
  error,
  onClearError,
  editMode = false,
  currentAppointmentId,
  initialData,
  isRescheduleMode = false,
}) => {
  // Data loading hook
  const { patients, isLoadingData, stores } = useAppointmentFormData();
  
  // Patient state management
  const { selectedPatientNumber, setSelectedPatientNumber, handlePatientChange } = useAppointmentFormState();
  
  // Doctor assignment management
  const { 
    assignedDoctor, 
    assignDoctorForDate, 
    clearDoctorAssignment, 
    isDoctorAssignmentValid,
    setAssignedDoctor 
  } = useDoctorAssignment(onClearError);
  
  // Time slot management
  const { timeSlots, updateTimeSlotsForDate, clearTimeSlots, isTimeSlotAvailable } = useTimeSlotManagement(
    stores.appointmentStore.getAppointmentsByDate.bind(stores.appointmentStore),
    currentAppointmentId
  );

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

  // Watch form values
  const patientName = watch('patientName');
  const reasonForVisit = watch('reasonForVisit');
  const date = watch('date');
  const time = watch('time');

  // Initialize form in edit mode
  useEffect(() => {
    if (editMode && initialData) {
      reset({
        patientName: initialData.patientId || '',
        reasonForVisit: initialData.reasonForVisit || '',
        date: initialData.appointmentDate || '',
        time: initialData.appointmentTime || '',
        doctor: initialData.doctorId || '',
      });
      
      if (initialData.patientNumber) {
        setSelectedPatientNumber(initialData.patientNumber);
      }
      
      if (initialData.doctorName) {
        setAssignedDoctor(initialData.doctorName);
      }
      
      if (initialData.appointmentDate) {
        updateTimeSlotsForDate(initialData.appointmentDate);
      }
    }
  }, [editMode, initialData, reset, currentAppointmentId, setSelectedPatientNumber, setAssignedDoctor, updateTimeSlotsForDate]);

  // Handle patient selection
  const onPatientChange = useCallback((patientId: string) => {
    handlePatientChange(patientId, patients, setValue);
  }, [handlePatientChange, patients, setValue]);

  // Handle date change with doctor assignment and time slot updates
  const handleDateChange = useCallback(async (selectedDate: Date | null) => {
    if (selectedDate && selectedDate instanceof Date && !isNaN(selectedDate.getTime())) {
      const dateString = selectedDate.toISOString().split('T')[0];
      
      // Update available time slots
      const newTimeSlots = updateTimeSlotsForDate(dateString);
      
      // Clear time selection if current time is no longer available
      const currentTime = watch('time');
      if (currentTime && !isTimeSlotAvailable(currentTime, newTimeSlots)) {
        setValue('time', '');
      }
      
      // Assign doctor for the selected date
      const { doctorName, doctorId } = await assignDoctorForDate(selectedDate);
      setValue('doctor', doctorId || '');
    } else {
      clearDoctorAssignment();
      setValue('doctor', '');
      clearTimeSlots();
    }
  }, [assignDoctorForDate, clearDoctorAssignment, clearTimeSlots, updateTimeSlotsForDate, isTimeSlotAvailable, setValue, watch]);

  // Form validation
  const isPatientValid = editMode ? (initialData?.patientId || initialData?.patientName) : patientName;
  const isFormValid = validateAppointmentForm(!!isPatientValid, reasonForVisit, date, time, assignedDoctor);

  // Form submission handler
  const handleFormSubmit = handleSubmit(async (data) => {
    if (editMode && !data.patientName && initialData?.patientId) {
      data.patientName = initialData.patientId;
    }
    
    const success = await onSubmit(data);
    if (success) {
      reset();
      setSelectedPatientNumber('');
      clearDoctorAssignment();
    }
  });

  // Clear error handler
  const handleInputChange = useCallback(() => {
    if (error && onClearError) {
      onClearError();
    }
  }, [error, onClearError]);

  return (
    <AddAppointmentFormPresenter
      // Form control
      control={control}
      handleSubmit={handleFormSubmit}
      
      // Data
      patients={patients}
      timeSlots={timeSlots}
      selectedPatientNumber={selectedPatientNumber}
      assignedDoctor={assignedDoctor}
      
      // Handlers
      onPatientChange={onPatientChange}
      onDateChange={handleDateChange}
      onInputChange={handleInputChange}
      
      // States
      isLoading={isLoading || isLoadingData}
      error={error}
      isFormValid={isFormValid}
      
      // Mode flags
      editMode={editMode}
      isRescheduleMode={isRescheduleMode}
      
      // Initial data
      initialData={initialData}
      
      // Store states
      isPatientStoreLoading={stores.patientStore.getIsLoading()}
    />
  );
};