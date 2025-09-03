import React from 'react';
import { IconUser, IconLock, IconLogin } from '@tabler/icons-react';

export const LOGIN_FORM_CONFIG = {
  fields: {
    identifier: {
      name: 'identifier' as const,
      type: 'text',
      label: 'Username or Email',
      placeholder: 'Enter your username or email',
      icon: <IconUser size={18} />,
      testId: 'login-identifier-input',
    },
    password: {
      name: 'password' as const,
      type: 'password',
      label: 'Password',
      placeholder: 'Enter your password',
      icon: <IconLock size={18} />,
      testId: 'login-password-input',
    },
    rememberMe: {
      name: 'rememberMe' as const,
      label: 'Remember Me',
      testId: 'login-remember-me-checkbox',
    },
  },
  submitButton: {
    text: 'Login',
    icon: <IconLogin size={18} />,
    size: 'md' as const,
    testId: 'login-submit-button',
  },
  forgotPassword: {
    text: 'Forgot Password?',
    variant: 'subtle' as const,
    size: 'sm' as const,
    testId: 'forgot-password-link',
  },
  form: {
    mode: 'onBlur' as const,
    stackGap: 'md' as const,
  },
} as const;