import { z } from 'zod';

/**
 * DTO for creating fecalysis results
 */
export interface CreateFecalysisResultDto {
  labRequestId: string;
  patientId: string;
  patientName: string;
  age?: string;
  sex?: string;
  dateTaken: string; // DateTime string
  color?: string;
  consistency?: string;
  rbc?: string;
  wbc?: string;
  occultBlood?: string;
  urobilinogen?: string;
  others?: string;
}

/**
 * DTO for updating fecalysis results
 */
export interface UpdateFecalysisResultDto extends Partial<CreateFecalysisResultDto> {
  id: string;
}

/**
 * Validation schema for creating fecalysis results
 */
export const CreateFecalysisResultSchema = z.object({
  labRequestId: z.string().min(1, 'Lab request ID is required'),
  patientId: z.string().min(1, 'Patient ID is required'),
  patientName: z.string().min(1, 'Patient name is required'),
  age: z.string().optional(),
  sex: z.string().optional(),
  dateTaken: z.string().datetime('Invalid date format'),
  color: z.string().optional(),
  consistency: z.string().optional(),
  rbc: z.string().optional(),
  wbc: z.string().optional(),
  occultBlood: z.string().optional(),
  urobilinogen: z.string().optional(),
  others: z.string().optional(),
});

/**
 * Validation schema for updating fecalysis results
 */
export const UpdateFecalysisResultSchema = CreateFecalysisResultSchema.partial().extend({
  id: z.string().min(1, 'ID is required'),
});
