import { z } from 'zod';

/**
 * Zod schemas for Address query validation
 * These schemas define the validation rules and generate TypeScript types
 */

// Province code validation
export const ProvinceCodeSchema = z
  .string()
  .min(1, 'Province code is required')
  .transform((val) => val.trim())
  .refine((val) => val.length > 0, {
    message: 'Province code cannot be empty',
  });

// City code validation
export const CityCodeSchema = z
  .string()
  .min(1, 'City code is required')
  .transform((val) => val.trim())
  .refine((val) => val.length > 0, {
    message: 'City code cannot be empty',
  });

// Query validation schemas
export const GetCitiesQuerySchema = z.object({
  provinceCode: ProvinceCodeSchema,
});

export const GetBarangaysQuerySchema = z.object({
  cityCode: CityCodeSchema,
});

// Generated TypeScript types
export type GetCitiesQuery = z.infer<typeof GetCitiesQuerySchema>;
export type GetBarangaysQuery = z.infer<typeof GetBarangaysQuerySchema>;