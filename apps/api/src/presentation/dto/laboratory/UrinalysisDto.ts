import { z } from 'zod';

/**
 * DTO for creating urinalysis results
 */
export interface CreateUrinalysisResultDto {
  labRequestId: string;
  patientId: string;
  patientName: string;
  age?: string;
  sex?: string;
  dateTaken: string; // DateTime string
  color?: string;
  transparency?: string;
  specificGravity?: string;
  ph?: string;
  protein?: string;
  glucose?: string;
  epithelialCells?: string;
  redCells?: string;
  pusCells?: string;
  mucusThread?: string;
  amorphousUrates?: string;
  amorphousPhosphate?: string;
  crystals?: string;
  bacteria?: string;
  others?: string;
  pregnancyTest?: string;
}

/**
 * DTO for updating urinalysis results
 */
export interface UpdateUrinalysisResultDto extends Partial<CreateUrinalysisResultDto> {
  id: string;
}

/**
 * Validation schema for creating urinalysis results
 */
export const CreateUrinalysisResultSchema = z.object({
  labRequestId: z.string().min(1, 'Lab request ID is required'),
  patientId: z.string().min(1, 'Patient ID is required'),
  patientName: z.string().min(1, 'Patient name is required'),
  age: z.string().optional(),
  sex: z.string().optional(),
  dateTaken: z.string().datetime('Invalid date format'),
  color: z.string().optional(),
  transparency: z.string().optional(),
  specificGravity: z.string().optional(),
  ph: z.string().optional(),
  protein: z.string().optional(),
  glucose: z.string().optional(),
  epithelialCells: z.string().optional(),
  redCells: z.string().optional(),
  pusCells: z.string().optional(),
  mucusThread: z.string().optional(),
  amorphousUrates: z.string().optional(),
  amorphousPhosphate: z.string().optional(),
  crystals: z.string().optional(),
  bacteria: z.string().optional(),
  others: z.string().optional(),
  pregnancyTest: z.string().optional(),
});

/**
 * Validation schema for updating urinalysis results
 */
export const UpdateUrinalysisResultSchema = CreateUrinalysisResultSchema.partial().extend({
  id: z.string().min(1, 'ID is required'),
});
