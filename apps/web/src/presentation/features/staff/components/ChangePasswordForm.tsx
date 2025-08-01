import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Button,
  Stack,
  Text,
  Alert,
} from '@mantine/core';
import { ChangePasswordFormSchema } from '@nx-starter/application-shared';
import { FormTextInput } from '../../../components/ui/FormTextInput';
import { Icon } from '../../../components/common';
import type { Account } from '../view-models/useAccountsViewModel';

// Type for change password form
interface ChangePasswordFormData {
  newPassword: string;
  confirmPassword: string;
}

interface ChangePasswordFormProps {
  account: Account;
  onSubmit: (newPassword: string) => Promise<void>;
  isLoading: boolean;
  error?: string | null;
}

/**
 * ChangePasswordForm component handles password changes for user accounts
 * with confirmation validation and proper error handling.
 */
export const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({
  account,
  onSubmit,
  isLoading,
  error
}) => {
  // React Hook Form setup
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(ChangePasswordFormSchema),
    mode: 'onChange',
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Watch form values for button state
  const newPassword = watch('newPassword');
  const confirmPassword = watch('confirmPassword');

  // Check if form fields are empty
  const isFormEmpty = !newPassword?.trim() || !confirmPassword?.trim();

  const handleFormSubmit = handleSubmit(async (data: ChangePasswordFormData) => {
    await onSubmit(data.newPassword);
  });

  return (
    <form onSubmit={handleFormSubmit} noValidate>
      <Stack gap="md">
        {error && (
          <Alert color="red" style={{ marginBottom: '10px' }}>
            {error}
          </Alert>
        )}

        <Text style={{ marginBottom: '10px', color: '#666' }}>
          New Password for <strong style={{ color: '#1976d2' }}>{account.firstName} {account.lastName}</strong>
        </Text>

        <FormTextInput
          {...register('newPassword')}
          label="New Password"
          type="password"
          placeholder="Enter new password"
          disabled={isLoading}
          required
          error={errors.newPassword}
        />
        
        <FormTextInput
          {...register('confirmPassword')}
          label="Confirm Password"
          type="password"
          placeholder="Confirm new password"
          disabled={isLoading}
          required
          error={errors.confirmPassword}
        />
        
        <Button
          type="submit"
          disabled={isFormEmpty || isLoading}
          loading={isLoading}
          fullWidth
          mt="md"
        >
          <Icon icon="fas fa-key" style={{ marginRight: '4px' }} />
          {isLoading ? 'Changing Password...' : 'Change Password'}
        </Button>
      </Stack>
    </form>
  );
};
