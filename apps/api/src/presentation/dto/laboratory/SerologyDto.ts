import { z } from 'zod';

/**
 * DTO for creating serology results
 */
export interface CreateSerologyResultDto {
  labRequestId: string;
  patientId: string;
  patientName: string;
  age?: string;
  sex?: string;
  dateTaken: string; // DateTime string
  vdrl?: string;
  rpr?: string;
  hbsag?: string;
  antiHcv?: string;
  hivTest?: string;
  pregnancyTest?: string;
  dengueNs1?: string;
  dengueTourniquet?: string;
  weilFelix?: string;
  typhidot?: string;
  bloodType?: string;
  rhFactor?: string;
  others?: string;
}

/**
 * DTO for updating serology results
 */
export interface UpdateSerologyResultDto extends Partial<CreateSerologyResultDto> {
  id: string;
}

/**
 * Validation schema for creating serology results
 */
export const CreateSerologyResultSchema = z.object({
  labRequestId: z.string().min(1, 'Lab request ID is required'),
  patientId: z.string().min(1, 'Patient ID is required'),
  patientName: z.string().min(1, 'Patient name is required'),
  age: z.string().optional(),
  sex: z.string().optional(),
  dateTaken: z.string().datetime('Invalid date format'),
  vdrl: z.string().optional(),
  rpr: z.string().optional(),
  hbsag: z.string().optional(),
  antiHcv: z.string().optional(),
  hivTest: z.string().optional(),
  pregnancyTest: z.string().optional(),
  dengueNs1: z.string().optional(),
  dengueTourniquet: z.string().optional(),
  weilFelix: z.string().optional(),
  typhidot: z.string().optional(),
  bloodType: z.string().optional(),
  rhFactor: z.string().optional(),
  others: z.string().optional(),
});

/**
 * Validation schema for updating serology results
 */
export const UpdateSerologyResultSchema = CreateSerologyResultSchema.partial().extend({
  id: z.string().min(1, 'ID is required'),
});
