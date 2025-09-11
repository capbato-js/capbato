import { UseFormReset, UseFormHandleSubmit } from 'react-hook-form';
import type { LoginFormData } from '../types';

interface LoginFormActionsProps {
  viewModel: {
    handleFormSubmit: (identifier: string, password: string, rememberMe: boolean) => Promise<boolean>;
    isSubmitting: boolean;
    error: string | null;
    clearError: () => void;
  };
  reset: UseFormReset<LoginFormData>;
  handleSubmit: UseFormHandleSubmit<LoginFormData>;
}

export const useLoginFormActions = (props: LoginFormActionsProps) => {
  const { viewModel, reset, handleSubmit } = props;

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

  return {
    onSubmit,
    handleKeyDown,
    handleInputChange,
  };
};