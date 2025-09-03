import React from 'react';
import { useLoginFormViewModel } from '../view-models/useLoginFormViewModel';
import { useLoginFormState } from '../hooks/useLoginFormState';
import { useLoginFormActions } from '../hooks/useLoginFormActions';
import { LoginFormPresenter } from './LoginFormPresenter';

export const LoginFormContainer: React.FC = () => {
  const viewModel = useLoginFormViewModel();
  
  // Get remembered credentials
  const rememberedCredentials = viewModel.getRememberedCredentials();
  
  // Use extracted hooks
  const formState = useLoginFormState({ rememberedCredentials });
  const formActions = useLoginFormActions({
    viewModel,
    reset: formState.reset,
    handleSubmit: formState.handleSubmit,
  });

  return (
    <LoginFormPresenter
      viewModel={viewModel}
      formState={formState}
      formActions={formActions}
    />
  );
};