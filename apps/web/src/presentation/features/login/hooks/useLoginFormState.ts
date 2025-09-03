import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginFormSchema } from '@nx-starter/application-shared';
import type { LoginFormData } from '../types';

interface LoginFormStateProps {
  rememberedCredentials?: { identifier: string; rememberMe: boolean } | null;
}

export const useLoginFormState = (props: LoginFormStateProps) => {
  const { rememberedCredentials } = props;
  
  // Track if initial focus has been set to prevent re-running focus logic
  const initialFocusSet = useRef(false);
  
  const formMethods = useForm<LoginFormData>({
    resolver: zodResolver(LoginFormSchema),
    mode: 'onBlur',
    defaultValues: {
      identifier: rememberedCredentials?.identifier || '',
      password: '',
      rememberMe: rememberedCredentials?.rememberMe || false,
    },
  });

  const { watch, setFocus } = formMethods;
  
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
  }, [setFocus, rememberedCredentials?.identifier]);

  return {
    ...formMethods,
    identifier,
    password,
    isFormEmpty,
  };
};