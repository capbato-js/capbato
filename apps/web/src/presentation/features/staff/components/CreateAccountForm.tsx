import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Button,
  Select,
  Stack,
} from '@mantine/core';
import { RegisterUserCommandSchema } from '@nx-starter/application-shared';
import { FormTextInput } from '../../../components/ui/FormTextInput';
import type { CreateAccountData } from '../view-models/useAccountsViewModel';

interface CreateAccountFormProps {
  onSubmit: (data: CreateAccountData) => Promise<void>;
  isLoading: boolean;
}

/**
 * CreateAccountForm component handles the creation of new user accounts
 * with form validation and proper TypeScript typing.
 */
export const CreateAccountForm: React.FC<CreateAccountFormProps> = ({
  onSubmit,
  isLoading
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
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: '',
      mobile: '',
    },
  });

  // Watch form values for button state
  const firstName = watch('firstName');
  const lastName = watch('lastName');
  const email = watch('email');
  const password = watch('password');
  const role = watch('role');

  // Check if required form fields are empty
  const isFormEmpty = !firstName?.trim() || 
                     !lastName?.trim() || 
                     !email?.trim() || 
                     !password?.trim() || 
                     !role?.trim();

  const handleFormSubmit = handleSubmit(async (data: CreateAccountData) => {
    await onSubmit(data);
    reset(); // Reset form after successful submission
  });

  return (
    <form onSubmit={handleFormSubmit} noValidate>
      <Stack gap="md">
        <FormTextInput
          label="First Name"
          placeholder="Enter first name"
          error={errors.firstName}
          disabled={isLoading}
          required
          {...register('firstName')}
        />
        
        <FormTextInput
          label="Last Name"
          placeholder="Enter last name"
          error={errors.lastName}
          disabled={isLoading}
          required
          {...register('lastName')}
        />
        
        <FormTextInput
          label="Email"
          type="email"
          placeholder="Enter email"
          error={errors.email}
          disabled={isLoading}
          required
          {...register('email')}
        />
        
        <FormTextInput
          label="Password"
          type="password"
          placeholder="Enter password"
          error={errors.password}
          disabled={isLoading}
          required
          {...register('password')}
        />
        
        <Controller
          name="role"
          control={control}
          render={({ field, fieldState }) => (
            <Select
              label="Role"
              placeholder="Select role"
              error={fieldState.error?.message}
              data={[
                { value: 'admin', label: 'Admin' },
                { value: 'receptionist', label: 'Receptionist' },
                { value: 'doctor', label: 'Doctor' }
              ]}
              disabled={isLoading}
              required
              {...field}
            />
          )}
        />
        
        <FormTextInput
          label="Mobile Number"
          placeholder="09XXXXXXXXX"
          error={errors.mobile}
          maxLength={11}
          disabled={isLoading}
          {...register('mobile')}
        />
        
        <Button
          type="submit"
          disabled={isFormEmpty || isLoading}
          loading={isLoading}
          fullWidth
          mt="md"
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </Stack>
    </form>
  );
};
