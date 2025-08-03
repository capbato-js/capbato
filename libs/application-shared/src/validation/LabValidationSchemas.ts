import { z } from 'zod';

// Lab test category enum
export const LabTestCategory = z.enum([
  'ROUTINE',
  'BLOOD_CHEMISTRY', 
  'SEROLOGY_IMMUNOLOGY',
  'THYROID_FUNCTION',
  'MISCELLANEOUS'
]);

// Individual lab test schema
const LabTestItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  category: LabTestCategory,
  selected: z.boolean().default(false),
});

// Add lab test form validation schema
const AddLabTestFormSchema = z.object({
  patientName: z.string().min(1, 'Please select a patient'),
  ageGender: z.string().min(1, 'Age/Gender is required'),
  requestDate: z.string().min(1, 'Request date is required'),
  selectedTests: z.array(z.string()).min(1, 'Please select at least one test'),
  otherTests: z.string().optional(),
});

// Lab test result schema
const LabTestResultSchema = z.object({
  id: z.string(),
  patientNumber: z.string(),
  patientName: z.string(),
  testType: z.string(),
  datePerformed: z.string(),
  status: z.enum(['Pending', 'In Progress', 'Completed']),
  results: z.string().optional(),
});

// Export all lab-related schemas
export const LabValidationSchemas = {
  AddLabTestForm: AddLabTestFormSchema,
  LabTestItem: LabTestItemSchema,
  LabTestResult: LabTestResultSchema,
  LabTestCategory,
} as const;

// Export individual schemas for easier importing
export {
  AddLabTestFormSchema,
  LabTestItemSchema,
  LabTestResultSchema,
};
