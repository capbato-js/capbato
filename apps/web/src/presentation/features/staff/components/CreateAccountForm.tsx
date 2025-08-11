import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Button,
  Stack,
  Transition,
  Box,
  Group,
} from '@mantine/core';
import { RegisterUserFormSchema, RegisterUserCommand, RegisterUserFormData } from '@nx-starter/application-shared';
import { Step1Fields } from './Step1Fields';
import { Step2Fields } from './Step2Fields';

interface CreateAccountFormProps {
  onSubmit: (data: RegisterUserCommand) => Promise<boolean>;
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
    setValue,
    trigger,
    formState: { errors },
  } = useForm<RegisterUserFormData>({
    resolver: zodResolver(RegisterUserFormSchema) as any,
    mode: 'onBlur',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: '',
      mobile: '',
      specialization: '',
      licenseNumber: '',
      experienceYears: undefined,
      schedulePattern: '',
    },
  });

  // Watch form values for button state and role changes
  const firstName = watch('firstName');
  const lastName = watch('lastName');
  const email = watch('email');
  const password = watch('password');
  const confirmPassword = watch('confirmPassword');
  const role = watch('role');

  // State for multi-step form navigation
  const [currentStep, setCurrentStep] = useState(1);
  const [isMultiStep, setIsMultiStep] = useState(false);
  
  // State and refs for dynamic height calculation
  const [containerHeight, setContainerHeight] = useState<number | undefined>(undefined);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const measurementRef = useRef<HTMLDivElement>(null);

  // Watch for role changes and toggle multi-step mode
  useEffect(() => {
    const isDoctorRole = role === 'doctor';
    if (isDoctorRole !== isMultiStep) {
      if (isDoctorRole) {
        // Pre-measure Step1 height by temporarily rendering it
        setIsTransitioning(true);
        // Will be calculated in the next effect
      } else {
        // Reset when switching away from doctor
        setCurrentStep(1);
        setContainerHeight(undefined);
        setIsTransitioning(false);
      }
      
      setIsMultiStep(isDoctorRole);
    }
  }, [role, isMultiStep]);

  // Pre-measurement effect for smooth transitions
  useLayoutEffect(() => {
    if (isTransitioning && measurementRef.current) {
      const height = measurementRef.current.scrollHeight;
      const minHeight = 250;
      const calculatedHeight = Math.max(height, minHeight);
      setContainerHeight(calculatedHeight);
    }
  }, [isTransitioning]);

  // Dynamic height calculation with comprehensive dependencies
  useLayoutEffect(() => {

    const measureHeight = () => {
      if (!isMultiStep || isTransitioning) {
        return;
      }
      
      const currentRef = currentStep === 1 ? step1Ref : step2Ref;
      
      if (currentRef.current) {
        const height = currentRef.current.scrollHeight;
        const calculatedHeight = height; // Use actual height, no minimum
        
        if (calculatedHeight !== containerHeight) {
          setContainerHeight(calculatedHeight);
        }
      }
    };

    if (isMultiStep && !isTransitioning) {
      // Small delay to ensure all DOM updates are complete
      requestAnimationFrame(() => {
        measureHeight();
      });
    }
  }, [
    isMultiStep, 
    currentStep, 
    isTransitioning,
    // Add form field dependencies that affect height
    firstName,
    lastName, 
    email,
    password,
    confirmPassword,
    role,
    watch('mobile'),
    watch('specialization'),
    watch('licenseNumber'),
    watch('experienceYears'),
    watch('schedulePattern'),
    // Add error dependencies (safe stringify)
    Object.keys(errors).length,
    Object.keys(fieldErrors).length
  ]);

  // Complete transition after multi-step form is mounted
  useLayoutEffect(() => {
    if (isMultiStep && isTransitioning && step1Ref.current) {
      setIsTransitioning(false);
    }
  }, [isMultiStep, isTransitioning]);

  // Separate effect for step navigation height updates (waits for Mantine transitions)
  useLayoutEffect(() => {
    if (!isMultiStep || isTransitioning) {
      return;
    }

    // Multiple rapid measurement attempts for immediate height updates
    let attemptCount = 0;
    const maxAttempts = 5;
    const attemptIntervals = [0, 25, 50, 75, 100]; // Progressive delays
    
    const tryMeasurement = () => {
      attemptCount++;
      const currentRef = currentStep === 1 ? step1Ref : step2Ref;

      if (currentRef.current) {
        const height = currentRef.current.scrollHeight;
        const calculatedHeight = height; // Use actual height, no minimum

        if (calculatedHeight !== containerHeight) {
          setContainerHeight(calculatedHeight);
        }
        return; // Success - stop trying
      } else if (attemptCount < maxAttempts) {
        // Schedule next attempt
        setTimeout(tryMeasurement, attemptIntervals[attemptCount]);
      }
    };

    // Start first attempt immediately
    requestAnimationFrame(tryMeasurement);
  }, [currentStep]); // Only depend on currentStep for step navigation

  // Check if required form fields are empty based on current step
  const isStep1Empty = !firstName?.trim() || 
                      !lastName?.trim() || 
                      !email?.trim() || 
                      !password?.trim() || 
                      !confirmPassword?.trim() ||
                      !role?.trim();
  
  const isStep2Empty = isMultiStep && (
    !watch('specialization')?.trim() ||
    !watch('schedulePattern')?.trim()
  );
  
  const isFormEmpty = isMultiStep 
    ? (currentStep === 1 ? isStep1Empty : isStep1Empty || isStep2Empty)
    : isStep1Empty;

  const handleFormSubmit = handleSubmit(async (data) => {
    // Transform form data to command by excluding confirmPassword
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...commandData } = data as RegisterUserFormData;
    const command: RegisterUserCommand = commandData;
    
    const success = await onSubmit(command);
    
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
              setValue={setValue}
              watch={watch}
              trigger={trigger}
              onInputChange={handleInputChange}
              fieldErrors={fieldErrors}
            />
            
          </>
        )}

        {/* Hidden measurement container for pre-calculating heights */}
        {isTransitioning && (
          <div 
            ref={measurementRef}
            style={{ 
              position: 'absolute', 
              top: -9999, 
              left: -9999, 
              visibility: 'hidden',
              width: '100%'
            }}
          >
            <Step1Fields
              control={control}
              errors={errors}
              isLoading={isLoading}
              register={register}
              setValue={setValue}
              watch={watch}
              trigger={trigger}
              onInputChange={handleInputChange}
              fieldErrors={fieldErrors}
            />
          </div>
        )}

        {/* Multi-Step Form (Doctor role) */}
        {isMultiStep && (
          <Box style={{ 
            position: 'relative', 
            overflow: 'hidden',
            height: containerHeight ? `${containerHeight}px` : 'auto',
            transition: 'height 0.3s ease-in-out'
          }}>
            {/* Step 1 */}
            <Transition
              mounted={currentStep === 1}
              transition="slide-right"
              duration={300}
              timingFunction="ease"
            >
              {(styles) => (
                <Box 
                  ref={step1Ref}
                  style={{ 
                    ...styles, 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    width: '100%'
                  }}
                >
                  <Step1Fields
                    control={control}
                    errors={errors}
                    isLoading={isLoading}
                    register={register}
                    setValue={setValue}
                    watch={watch}
                    trigger={trigger}
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
                <Box 
                  ref={step2Ref}
                  style={{ 
                    ...styles, 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    width: '100%'
                  }}
                >
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
