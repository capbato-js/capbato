import { doctorAssignmentService } from '../services/DoctorAssignmentService';

/**
 * Formats a time string from 24-hour format to 12-hour format
 * @param timeStr - Time string in HH:MM format
 * @returns Formatted time string in 12-hour format with AM/PM
 */
export const formatTimeLabel = (timeStr: string): string => {
  const [hourStr, minuteStr] = timeStr.split(':');
  const hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${minuteStr} ${ampm}`;
};

/**
 * Generates available time slots for appointment booking
 * @param selectedDate - Date string in YYYY-MM-DD format
 * @param existingAppointments - Array of existing appointments for the date
 * @param excludeCurrentAppointmentId - Optional ID to exclude (for edit mode)
 * @returns Array of available time slot options
 */
export const getAvailableTimeSlots = (
  selectedDate: string, 
  existingAppointments: Array<{ id: string; appointmentTime: string; status: string }> = [],
  excludeCurrentAppointmentId?: string
) => {
  const slots = [];
  const now = new Date();
  const isToday = selectedDate === now.toISOString().split('T')[0];
  
  // Filter booked times - only confirmed appointments block time slots
  const bookedTimes = existingAppointments
    .filter(apt => {
      const isNotCurrentEdit = excludeCurrentAppointmentId ? apt.id !== excludeCurrentAppointmentId : true;
      const isConfirmed = apt.status === 'confirmed';
      return isNotCurrentEdit && isConfirmed;
    })
    .map(apt => apt.appointmentTime);
  
  // Generate time slots from 8:00 AM to 5:45 PM in 15-minute intervals
  for (let hour = 8; hour <= 17; hour++) {
    for (const minute of [0, 15, 30, 45]) {
      const timeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      
      // Skip past times for today
      if (isToday) {
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        
        if (hour < currentHour || (hour === currentHour && minute <= currentMinute)) {
          continue;
        }
      }
      
      // Skip booked time slots
      if (bookedTimes.includes(timeStr)) {
        continue;
      }
      
      const displayTime = formatTimeLabel(timeStr);
      slots.push({ value: timeStr, label: displayTime });
    }
  }
  
  return slots;
};

/**
 * Gets the assigned doctor display name for a specific date
 * @param date - Date object
 * @returns Promise resolving to doctor display name
 */
export const getDoctorForDate = async (date: Date): Promise<string> => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    console.error('Invalid date passed to getDoctorForDate:', date);
    return 'Invalid date selected';
  }
  
  try {
    const displayName = await doctorAssignmentService.getInstance().getAssignedDoctorDisplayName(date);
    return displayName;
  } catch (error) {
    console.error('Error getting doctor assignment:', error);
    return 'Error loading doctor assignment';
  }
};

/**
 * Gets the assigned doctor ID for a specific date
 * @param date - Date object
 * @returns Promise resolving to doctor ID or null
 */
export const getDoctorIdForDate = async (date: Date): Promise<string | null> => {
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

/**
 * Formats patient data for form select options
 * @param patients - Array of patient objects
 * @returns Formatted patient options for select component
 */
export const formatPatientsForSelect = (patients: Array<{ id: string; firstName: string; lastName: string; patientNumber: string }>) => {
  return patients.map(patient => ({
    value: patient.id,
    label: `${patient.firstName} ${patient.lastName}`,
    patientNumber: patient.patientNumber,
  }));
};

/**
 * Validates form completeness for appointment creation/editing
 * @param isPatientValid - Whether patient selection is valid
 * @param reasonForVisit - Reason for visit value
 * @param date - Date value
 * @param time - Time value
 * @param assignedDoctor - Assigned doctor display name
 * @returns Boolean indicating if form is valid
 */
export const validateAppointmentForm = (
  isPatientValid: boolean,
  reasonForVisit: string,
  date: string,
  time: string,
  assignedDoctor: string
): boolean => {
  return !!(
    isPatientValid && 
    reasonForVisit && 
    date && 
    time && 
    assignedDoctor && 
    !assignedDoctor.startsWith('Error') && 
    assignedDoctor !== 'No doctor assigned'
  );
};