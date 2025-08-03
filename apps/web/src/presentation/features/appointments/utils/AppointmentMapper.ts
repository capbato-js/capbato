import { AddAppointmentFormData } from '@nx-starter/application-shared';

/**
 * Maps form data to API request format for appointment creation
 * Handles the transformation between form field names and API field names
 */
export const mapFormDataToApiData = (formData: AddAppointmentFormData) => {
  // Since backend now returns simple YYYY-MM-DD format, we can handle dates more simply
  let appointmentDate = formData.date;
  
  // The date should already be a string in YYYY-MM-DD format from the form
  // But handle edge cases where it might be in different formats
  if (typeof appointmentDate === 'string' && appointmentDate.includes('T')) {
    // If it's an ISO string, extract just the date part
    appointmentDate = appointmentDate.split('T')[0];
  }
  // If for some reason it's not a string, convert it to YYYY-MM-DD format
  else if (!appointmentDate || typeof appointmentDate !== 'string') {
    // This shouldn't happen with proper form validation, but as a fallback
    appointmentDate = new Date().toISOString().split('T')[0];
  }

  console.log('DEBUG: AppointmentMapper - formData:', formData);
  console.log('DEBUG: AppointmentMapper - formData.date (original):', formData.date);
  console.log('DEBUG: AppointmentMapper - appointmentDate (processed):', appointmentDate);
  console.log('DEBUG: AppointmentMapper - formData.time:', formData.time);
  console.log('DEBUG: AppointmentMapper - formData.patientName (will be patientId):', formData.patientName);
  console.log('DEBUG: AppointmentMapper - formData.doctor (will be doctorId):', formData.doctor);

  const apiData = {
    // Map form fields to API fields
    patientId: formData.patientName, // Form uses patientName, API expects patientId
    reasonForVisit: formData.reasonForVisit,
    appointmentDate, // Simple YYYY-MM-DD string
    appointmentTime: formData.time,
    doctorId: formData.doctor, // Form uses doctor, API expects doctorId
    status: 'confirmed' as const, // Default status
  };

  console.log('DEBUG: AppointmentMapper - final apiData:', apiData);
  
  return apiData;
};

/**
 * Type for the mapped API data
 */
export type AppointmentApiData = ReturnType<typeof mapFormDataToApiData>;
