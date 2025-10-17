import { z } from 'zod';

/**
 * DTO for creating hematology results
 */
export interface CreateHematologyResultDto {
  labRequestId: string;
  patientId: string;
  patientName: string;
  age?: string;
  sex?: string;
  dateTaken: string; // DateTime string
  hemoglobin?: string;
  hemoglobinCategory?: string; // 'male' | 'female' | 'child' | 'newborn' | 'pregnant'
  hematocrit?: string;
  hematocritCategory?: string; // 'male' | 'female' | 'child' | 'newborn'
  rbc?: string;
  wbc?: string;
  plateletCount?: string;
  neutrophils?: string;
  lymphocytes?: string;
  monocytes?: string;
  eosinophils?: string;
  basophils?: string;
  mcv?: string;
  mch?: string;
  mchc?: string;
  esr?: string;
}

/**
 * DTO for updating hematology results
 */
export interface UpdateHematologyResultDto extends Partial<CreateHematologyResultDto> {
  id: string;
}

/**
 * Validation schema for creating hematology results
 */
export const CreateHematologyResultSchema = z.object({
  labRequestId: z.string().min(1, 'Lab request ID is required'),
  patientId: z.string().min(1, 'Patient ID is required'),
  patientName: z.string().min(1, 'Patient name is required'),
  age: z.string().optional(),
  sex: z.string().optional(),
  dateTaken: z.string().datetime('Invalid date format'),
  hemoglobin: z.string().optional(),
  hemoglobinCategory: z.enum(['male', 'female', 'child', 'newborn', 'pregnant']).optional(),
  hematocrit: z.string().optional(),
  hematocritCategory: z.enum(['male', 'female', 'child', 'newborn']).optional(),
  rbc: z.string().optional(),
  wbc: z.string().optional(),
  plateletCount: z.string().optional(),
  neutrophils: z.string().optional(),
  lymphocytes: z.string().optional(),
  monocytes: z.string().optional(),
  eosinophils: z.string().optional(),
  basophils: z.string().optional(),
  mcv: z.string().optional(),
  mch: z.string().optional(),
  mchc: z.string().optional(),
  esr: z.string().optional(),
});

/**
 * Validation schema for updating hematology results
 */
export const UpdateHematologyResultSchema = CreateHematologyResultSchema.partial().extend({
  id: z.string().min(1, 'ID is required'),
});
