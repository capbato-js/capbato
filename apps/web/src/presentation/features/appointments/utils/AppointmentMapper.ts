import { AddAppointmentFormData } from '@nx-starter/application-shared';

/**
 * Maps form data to API request format for appointment creation
 * Handles the transformation between form field names and API field names
 */
export const mapFormDataToApiData = (formData: AddAppointmentFormData) => {
  // The date field from the form is already a string, so we can use it directly
  return {
    // Map form fields to API fields
    patientId: formData.patientName, // Form uses patientName, API expects patientId
    reasonForVisit: formData.reasonForVisit,
    appointmentDate: formData.date, // Already a string in YYYY-MM-DD format
    appointmentTime: formData.time,
    doctorId: formData.doctor, // Form uses doctor, API expects doctorId
    status: 'confirmed' as const, // Default status
  };
};

/**
 * Type for the mapped API data
 */
export type AppointmentApiData = ReturnType<typeof mapFormDataToApiData>;
