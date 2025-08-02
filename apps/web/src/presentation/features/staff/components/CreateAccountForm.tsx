import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Button,
  Select,
  Stack,
  Transition,
  Box,
  Group,
} from '@mantine/core';
import { RegisterUserCommandSchema } from '@nx-starter/application-shared';
import { FormTextInput } from '../../../components/ui/FormTextInput';
import type { CreateAccountData } from '../view-models/useEnhancedAccountsViewModel';
import { Step1Fields } from './Step1Fields';
import { Step2Fields } from './Step2Fields';

interface CreateAccountFormProps {
  onSubmit: (data: CreateAccountData) => Promise<boolean>;
  isLoading: boolean;
  error?: string | null;
  onClearError?: () => void;
  fieldErrors?: Record<string, string>;
  onClearFieldErrors?: () => void;
}

/**
 * CreateAccountForm component handles the creation of new user accounts
 * with form validation and proper TypeScript typing.
 */
export const CreateAccountForm: React.FC<CreateAccountFormProps> = ({
  onSubmit,
  isLoading,
  error,
  onClearError,
  fieldErrors = {},
  onClearFieldErrors,
}) => {
  // React Hook Form setup
  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm<CreateAccountData>({
    resolver: zodResolver(RegisterUserCommandSchema),
    mode: 'onBlur',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: '',
      mobile: '',
      specialization: '',
      licenseNumber: '',
      experienceYears: undefined,
    },
  });

  // Watch form values for button state and role changes
  const firstName = watch('firstName');
  const lastName = watch('lastName');
  const email = watch('email');
  const password = watch('password');
  const role = watch('role');

  // State for multi-step form navigation
  const [currentStep, setCurrentStep] = useState(1);
  const [isMultiStep, setIsMultiStep] = useState(false);

  // Watch for role changes and toggle multi-step mode
  useEffect(() => {
    const isDoctorRole = role === 'doctor';
    if (isDoctorRole !== isMultiStep) {
      setIsMultiStep(isDoctorRole);
      // Reset to step 1 when changing role type
      if (!isDoctorRole) {
        setCurrentStep(1);
      }
    }
  }, [role, isMultiStep]);

  // Check if required form fields are empty based on current step
  const isStep1Empty = !firstName?.trim() || 
                      !lastName?.trim() || 
                      !email?.trim() || 
                      !password?.trim() || 
                      !role?.trim();
  
  const isStep2Empty = isMultiStep && (
    !watch('specialization')?.trim()
  );
  
  const isFormEmpty = isMultiStep 
    ? (currentStep === 1 ? isStep1Empty : isStep1Empty || isStep2Empty)
    : isStep1Empty;

  const handleFormSubmit = handleSubmit(async (data: CreateAccountData) => {
    const success = await onSubmit(data);
    
    // Only reset form on successful submission
    if (success) {
      reset(); // Reset form after successful submission
      setCurrentStep(1); // Reset to step 1
      setIsMultiStep(false); // Reset multi-step state
    }
  });

  // Navigation functions
  const goToNextStep = () => setCurrentStep(2);
  const goToPreviousStep = () => setCurrentStep(1);

  // Clear error when user starts typing
  const handleInputChange = () => {
    if (error && onClearError) {
      onClearError();
    }
    if (Object.keys(fieldErrors).length > 0 && onClearFieldErrors) {
      onClearFieldErrors();
    }
  };

  return (
    <form onSubmit={handleFormSubmit} noValidate>
      <Stack gap="md">
        {/* Error message - only show if there are no field-specific errors */}
        {error && Object.keys(fieldErrors).length === 0 && (
          <div 
            className="text-red-600 text-sm mb-4 text-center"
            data-testid="create-account-error"
          >
            {error}
          </div>
        )}
        {/* Single Step Form (Non-Doctor roles) */}
        {!isMultiStep && (
          <>
            <Step1Fields
              control={control}
              errors={errors}
              isLoading={isLoading}
              register={register}
              onInputChange={handleInputChange}
              fieldErrors={fieldErrors}
            />
            
            <FormTextInput
              label="Mobile Number"
              placeholder="09XXXXXXXXX"
              error={errors.mobile}
              maxLength={11}
              disabled={isLoading}
              {...register('mobile')}
              onChange={(e) => {
                register('mobile').onChange(e);
                handleInputChange();
              }}
            />
          </>
        )}

        {/* Multi-Step Form (Doctor role) */}
        {isMultiStep && (
          <Box style={{ 
            position: 'relative', 
            overflow: 'hidden',
            minHeight: '400px' // Fixed minimum height to prevent jumping
          }}>
            {/* Step 1 */}
            <Transition
              mounted={currentStep === 1}
              transition="slide-right"
              duration={300}
              timingFunction="ease"
            >
              {(styles) => (
                <Box style={{ 
                  ...styles, 
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  width: '100%'
                }}>
                  <Step1Fields
                    control={control}
                    errors={errors}
                    isLoading={isLoading}
                    register={register}
                    onInputChange={handleInputChange}
                    fieldErrors={fieldErrors}
                  />
                </Box>
              )}
            </Transition>

            {/* Step 2 */}
            <Transition
              mounted={currentStep === 2}
              transition="slide-left"
              duration={300}
              timingFunction="ease"
            >
              {(styles) => (
                <Box style={{ 
                  ...styles, 
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  width: '100%'
                }}>
                  <Step2Fields
                    control={control}
                    errors={errors}
                    isLoading={isLoading}
                    register={register}
                    onInputChange={handleInputChange}
                    fieldErrors={fieldErrors}
                  />
                </Box>
              )}
            </Transition>
          </Box>
        )}
        
        {/* Action Buttons */}
        <Box mt="md">
          {isMultiStep && currentStep === 2 ? (
            <Group grow>
              <Button
                variant="outline"
                onClick={goToPreviousStep}
                disabled={isLoading}
              >
                Previous
              </Button>
              <Button
                type="submit"
                disabled={isFormEmpty || isLoading}
                loading={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </Group>
          ) : (
            <Button
              type={isMultiStep && currentStep === 1 ? "button" : "submit"}
              onClick={isMultiStep && currentStep === 1 ? goToNextStep : undefined}
              disabled={isFormEmpty || isLoading}
              loading={isLoading}
              fullWidth
            >
              {isLoading 
                ? 'Creating Account...' 
                : isMultiStep && currentStep === 1 
                  ? 'Next' 
                  : 'Create Account'
              }
            </Button>
          )}
        </Box>
      </Stack>
    </form>
  );
};
