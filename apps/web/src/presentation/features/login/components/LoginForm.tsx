import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginFormSchema } from '@nx-starter/application-shared';
import { FormTextInput } from '../../../components/ui/FormTextInput';
import { Button, Title, Checkbox, Group, Stack, useMantineTheme } from '@mantine/core';
import { IconUser, IconLock, IconLogin } from '@tabler/icons-react';
import { useLoginFormViewModel } from '../view-models/useLoginFormViewModel';
import type { LoginFormData } from '../types';

export const LoginForm: React.FC = () => {
  const theme = useMantineTheme();
  const viewModel = useLoginFormViewModel();
  
  // Get remembered credentials
  const rememberedCredentials = viewModel.getRememberedCredentials();
  
  // Track if initial focus has been set to prevent re-running focus logic
  const initialFocusSet = useRef(false);
  
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
    setFocus,
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginFormSchema),
    mode: 'onBlur', // Enable onBlur validation
    defaultValues: {
      identifier: rememberedCredentials?.identifier || '',
      password: '',
      rememberMe: rememberedCredentials?.rememberMe || false,
    },
  });
  
  // Watch form values directly for button state
  const identifier = watch('identifier');
  const password = watch('password');
  
  // Check if form is empty based on watched values
  const isFormEmpty = !identifier?.trim() || !password?.trim();

  // Set focus on appropriate field when component mounts (only once)
  useEffect(() => {
    if (!initialFocusSet.current) {
      if (rememberedCredentials?.identifier) {
        // If identifier is remembered, focus on password field
        setFocus('password');
      } else {
        // Otherwise focus on identifier field
        setFocus('identifier');
      }
      initialFocusSet.current = true;
    }
  }, [setFocus]);

  const onSubmit = handleSubmit(async (data: LoginFormData) => {
    const success = await viewModel.handleFormSubmit(data.identifier, data.password, data.rememberMe);
    if (success) {
      reset();
    }
  });

  // Handle keyboard events (Enter key)
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !viewModel.isSubmitting) {
      event.preventDefault();
      onSubmit();
    }
  };

  // Clear error when user starts typing
  const handleInputChange = () => {
    if (viewModel.error) {
      viewModel.clearError();
    }
  };

  return (
    <div style={{ width: '100%' }}>
        <Title order={2} ta="center" mb="lg" style={{ color: theme.other.titleColor }}>
          Login
        </Title>
        
        {/* Error message */}
        {/* {viewModel.error && (
          <Alert 
            color="red" 
            mb="md"
            data-testid="login-error"
          >
            {viewModel.error}
          </Alert>
        )} */}

          {/* Error message */}
          {viewModel.error && (
            <div 
              className="text-red-600 text-sm mb-4 text-center"
              data-testid="login-error"
            >
              {viewModel.error}
            </div>
          )}

        <form onSubmit={onSubmit} onKeyDown={handleKeyDown}>
          <Stack gap="md">
            {/* Username/Email Field */}
            <FormTextInput
              {...register('identifier')}
              label="Username or Email"
              placeholder="Enter your username or email"
              leftSection={<IconUser size={18} />}
              disabled={viewModel.isSubmitting}
              onChange={(e) => {
                register('identifier').onChange(e);
                handleInputChange();
              }}
              error={errors.identifier}
              data-testid="login-identifier-input"
            />

            {/* Password Field */}
            <FormTextInput
              {...register('password')}
              type="password"
              label="Password"
              placeholder="Enter your password"
              leftSection={<IconLock size={18} />}
              disabled={viewModel.isSubmitting}
              onChange={(e) => {
                register('password').onChange(e);
                handleInputChange();
              }}
              error={errors.password}
              data-testid="login-password-input"
            />

            {/* Remember Me Checkbox */}
            <Group mt="sm">
              <Checkbox
                checked={watch('rememberMe')}
                onChange={(event) => setValue('rememberMe', event.currentTarget.checked)}
                label="Remember Me"
                disabled={viewModel.isSubmitting}
                data-testid="login-remember-me-checkbox"
              />
            </Group>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isFormEmpty || viewModel.isSubmitting}
              fullWidth
              leftSection={viewModel.isSubmitting ? undefined : <IconLogin size={18} />}
              loading={viewModel.isSubmitting}
              size="md"
              mt="md"
              data-testid="login-submit-button"
            >
              Login
            </Button>
          </Stack>
        </form>

        {/* Forgot Password Link */}
        {/* <Group justify="center" mt="lg">
          <Button
            variant="subtle"
            size="sm"
            onClick={() => {
              // TODO: Implement forgot password functionality
              console.log('Forgot password clicked');
            }}
            data-testid="forgot-password-link"
          >
            Forgot Password?
          </Button>
        </Group> */}
    </div>
  );
};