/**
 * Request DTOs for Prescription API endpoints
 * These define the shape of HTTP request bodies for type safety
 * Shared between frontend and backend for consistent API contracts
 * Validation is still handled by Zod schemas in the application layer
 */

/**
 * Request body for creating a new prescription
 * POST /api/prescriptions
 */
export interface CreatePrescriptionRequestDto {
  patientId: string;
  doctorId: string;
  medicationName: string;
  dosage: string;
  instructions: string;
  frequency: string;
  duration: string;
  prescribedDate?: string; // ISO datetime string
  expiryDate?: string; // ISO datetime string
  quantity?: string;
  additionalNotes?: string;
  status?: 'active' | 'completed' | 'discontinued' | 'on-hold';
}

/**
 * Request body for updating an existing prescription
 * PUT /api/prescriptions/:id
 * Note: id comes from route parameter, not request body
 */
export interface UpdatePrescriptionRequestDto {
  medicationName?: string;
  dosage?: string;
  instructions?: string;
  frequency?: string;
  duration?: string;
  expiryDate?: string; // ISO datetime string
  quantity?: string;
  additionalNotes?: string;
  status?: 'active' | 'completed' | 'discontinued' | 'on-hold';
}