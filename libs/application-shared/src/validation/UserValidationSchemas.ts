import { z } from 'zod';
import { VALIDATION_MESSAGES } from './constants/ValidationMessages';

/**
 * User validation schemas
 * Contains all validation rules and error messages as specified in requirements
 */

// Custom error messages as per requirements
export const USER_VALIDATION_ERRORS = {
  REG_MISSING_FIRSTNAME: 'First name is required',
  REG_MISSING_LASTNAME: 'Last name is required', 
  REG_MISSING_EMAIL: 'Email address is required',
  REG_MISSING_PASSWORD: 'Password is required',
  REG_MISSING_ROLE: 'Role is required',
  REG_INVALID_EMAIL: 'Please provide a valid email address',
  REG_WEAK_PASSWORD: 'Password must be at least 8 characters long with at least one uppercase letter, one lowercase letter, and one number',
  REG_INVALID_ROLE: 'Role must be one of: admin, doctor, receptionist',
  REG_EMAIL_EXISTS: 'This email address is already registered',
  REG_INVALID_NAME: 'Names can only contain letters, spaces, and hyphens',
  REG_INVALID_MOBILE: VALIDATION_MESSAGES.PHONE.INVALID_PHILIPPINE_MOBILE,
  AUTH_MISSING_IDENTIFIER: 'Email or username is required',
  AUTH_MISSING_PASSWORD: 'Password is required',
  AUTH_INVALID_EMAIL: 'Please provide a valid email address'
} as const;

// Name validation schema (for firstName and lastName)
export const NameSchema = z
  .string()
  .min(1, 'Name is required')
  .max(50, 'Name cannot exceed 50 characters')
  .regex(/^[a-zA-ZñÑ\s-]+$/, USER_VALIDATION_ERRORS.REG_INVALID_NAME);

// First name validation
export const FirstNameSchema = z
  .string()
  .min(1, USER_VALIDATION_ERRORS.REG_MISSING_FIRSTNAME)
  .max(50, 'Name cannot exceed 50 characters')
  .regex(/^[a-zA-ZñÑ\s-]+$/, USER_VALIDATION_ERRORS.REG_INVALID_NAME);

// Last name validation  
export const LastNameSchema = z
  .string()
  .min(1, USER_VALIDATION_ERRORS.REG_MISSING_LASTNAME)
  .max(50, 'Name cannot exceed 50 characters')
  .regex(/^[a-zA-ZñÑ\s-]+$/, USER_VALIDATION_ERRORS.REG_INVALID_NAME);

// Email validation schema
export const EmailSchema = z
  .string()
  .min(1, USER_VALIDATION_ERRORS.REG_MISSING_EMAIL)
  .email(USER_VALIDATION_ERRORS.REG_INVALID_EMAIL)
  .max(254, 'Email address is too long');

// Password validation schema  
export const PasswordSchema = z
  .string()
  .min(1, USER_VALIDATION_ERRORS.REG_MISSING_PASSWORD)
  .min(8, USER_VALIDATION_ERRORS.REG_WEAK_PASSWORD)
  .regex(/[A-Z]/, USER_VALIDATION_ERRORS.REG_WEAK_PASSWORD)
  .regex(/[a-z]/, USER_VALIDATION_ERRORS.REG_WEAK_PASSWORD)
  .regex(/[0-9]/, USER_VALIDATION_ERRORS.REG_WEAK_PASSWORD);

// Mobile validation schema for Philippine numbers
export const MobileSchema = z
  .string()
  .optional()
  .refine((value) => {
    if (!value) return true; // Optional field
    const cleanMobile = value.replace(/[\s\-()]/g, '');
    // Philippine mobile: 09xxxxxxxxx or +639xxxxxxxxx
    return /^(\+639|09)\d{9}$/.test(cleanMobile);
  }, {
    message: USER_VALIDATION_ERRORS.REG_INVALID_MOBILE,
  });

// Role validation schema
export const RoleSchema = z
  .string()
  .min(1, USER_VALIDATION_ERRORS.REG_MISSING_ROLE)
  .refine((value) => ['admin', 'doctor', 'receptionist'].includes(value.toLowerCase()), {
    message: USER_VALIDATION_ERRORS.REG_INVALID_ROLE,
  });

// User ID validation schema for URL parameters
export const UserIdSchema = z.string().min(1, 'User ID cannot be empty');

// Register user command validation schema
export const RegisterUserCommandSchema = z.object({
  firstName: FirstNameSchema,
  lastName: LastNameSchema,
  email: EmailSchema,
  password: PasswordSchema,
  role: RoleSchema,
  mobile: MobileSchema,
  // Doctor profile fields (optional for validation, runtime validation handled in use case)
  specialization: z.string().optional(),
  licenseNumber: z.string().optional(),
  experienceYears: z
    .union([z.string(), z.number(), z.undefined(), z.null()])
    .optional()
    .transform((val) => {
      // Handle empty string, null, or undefined values
      if (val === '' || val === null || val === undefined) {
        return undefined;
      }
      // Convert string numbers to actual numbers
      if (typeof val === 'string') {
        const parsed = parseInt(val, 10);
        return isNaN(parsed) ? undefined : parsed;
      }
      // Handle NaN values from form inputs  
      if (typeof val === 'number' && isNaN(val)) {
        return undefined;
      }
      return val;
    })
    .refine((val) => {
      // Skip validation if undefined (optional field)
      if (val === undefined) return true;
      // Validate that it's a valid number
      return typeof val === 'number' && !isNaN(val) && Number.isInteger(val) && val >= 0 && val <= 50;
    }, {
      message: 'Years of experience must be a number between 0 and 50',
    }),
});

// Frontend form schema that includes confirmPassword for UI validation
export const RegisterUserFormSchema = RegisterUserCommandSchema.extend({
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});


// Login user command validation schema (matches DTO interface)
export const LoginUserCommandSchema = z.object({
  identifier: z
    .string()
    .min(1, USER_VALIDATION_ERRORS.AUTH_MISSING_IDENTIFIER)
    .refine((value) => {
      // If it looks like an email (contains @), validate email format
      if (value.includes('@')) {
        return z.string().email().safeParse(value).success;
      }
      // Otherwise, it's a username - just check it's not empty (already checked by min(1))
      return true;
    }, {
      message: USER_VALIDATION_ERRORS.AUTH_INVALID_EMAIL,
    }),
  password: z
    .string()
    .min(1, USER_VALIDATION_ERRORS.AUTH_MISSING_PASSWORD),
});

// Frontend form schema extends the command schema with UI-specific fields
export const LoginFormSchema = LoginUserCommandSchema.extend({
  rememberMe: z.boolean().optional(),
});

// Change password command validation schema
export const ChangeUserPasswordCommandSchema = z.object({
  userId: z.string().min(1, 'User ID is required').regex(/^[0-9a-fA-F]{32}$/, 'Invalid user ID format - must be dashless UUID'),
  newPassword: PasswordSchema,
});

// Update user details command validation schema
export const UpdateUserDetailsCommandSchema = z.object({
  id: z.string().min(1, 'User ID is required').regex(/^[0-9a-fA-F]{32}$/, 'Invalid user ID format - must be dashless UUID'),
  firstName: FirstNameSchema.optional(),
  lastName: LastNameSchema.optional(), 
  email: EmailSchema.optional(),
  mobile: MobileSchema,
  role: RoleSchema.optional(),
}).refine((data) => {
  // At least one field must be provided for update
  return data.firstName || data.lastName || data.email || data.mobile || data.role;
}, {
  message: 'At least one field must be provided for update',
});

// Change password form validation schema (with confirmation)
export const ChangePasswordFormSchema = z.object({
  newPassword: PasswordSchema,
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Get all users query schema (empty object)  
export const GetAllUsersQuerySchema = z.object({});

// Export all schemas for easy access
export const UserValidationSchemas = {
  RegisterUserCommand: RegisterUserCommandSchema,
  RegisterUserForm: RegisterUserFormSchema,
  LoginUserCommand: LoginUserCommandSchema,
  LoginForm: LoginFormSchema,
  ChangeUserPasswordCommand: ChangeUserPasswordCommandSchema,
  UpdateUserDetailsCommand: UpdateUserDetailsCommandSchema,
  ChangePasswordForm: ChangePasswordFormSchema,
  GetAllUsersQuery: GetAllUsersQuerySchema,
  FirstName: FirstNameSchema,
  LastName: LastNameSchema,
  Email: EmailSchema,
  Password: PasswordSchema,
  Name: NameSchema,
  Mobile: MobileSchema,
  Role: RoleSchema,
  UserId: UserIdSchema,
} as const;