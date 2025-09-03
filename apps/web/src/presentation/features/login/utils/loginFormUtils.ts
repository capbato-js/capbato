import type { LoginFormData } from '../types';

export const determineInitialFocus = (rememberedCredentials?: { identifier: string; rememberMe: boolean } | null): 'identifier' | 'password' => {
  return rememberedCredentials?.identifier ? 'password' : 'identifier';
};

export const isFormEmpty = (identifier?: string, password?: string): boolean => {
  return !identifier?.trim() || !password?.trim();
};

export const shouldHandleKeyPress = (key: string, isSubmitting: boolean): boolean => {
  return key === 'Enter' && !isSubmitting;
};

export const createFormSubmitHandler = (
  viewModel: {
    handleFormSubmit: (identifier: string, password: string, rememberMe: boolean) => Promise<boolean>;
  },
  reset: () => void
) => {
  return async (data: LoginFormData): Promise<void> => {
    const success = await viewModel.handleFormSubmit(data.identifier, data.password, data.rememberMe);
    if (success) {
      reset();
    }
  };
};