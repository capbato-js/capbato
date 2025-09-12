import React from 'react';
import { LoginTitle } from './LoginTitle';
import { LoginErrorMessage } from './LoginErrorMessage';
import { LoginFormFields } from './LoginFormFields';
import { LoginSubmitButton } from './LoginSubmitButton';

interface LoginFormPresenterProps {
  viewModel: {
    error: string | null;
    isSubmitting: boolean;
  };
  formState: {
    register: any;
    formState: { errors: any };
    watch: any;
    setValue: any;
    isFormEmpty: boolean;
  };
  formActions: {
    onSubmit: () => void;
    handleKeyDown: (event: React.KeyboardEvent) => void;
    handleInputChange: () => void;
  };
}

const containerStyles = {
  width: '100%'
};

export const LoginFormPresenter: React.FC<LoginFormPresenterProps> = ({
  viewModel,
  formState,
  formActions,
}) => {
  return (
    <div style={containerStyles}>
      <LoginTitle />
      
      <LoginErrorMessage error={viewModel.error} />

      <form onSubmit={formActions.onSubmit} onKeyDown={formActions.handleKeyDown}>
        <LoginFormFields
          register={formState.register}
          errors={formState.formState.errors}
          watch={formState.watch}
          setValue={formState.setValue}
          isSubmitting={viewModel.isSubmitting}
          onInputChange={formActions.handleInputChange}
        />

        <LoginSubmitButton
          isFormEmpty={formState.isFormEmpty}
          isSubmitting={viewModel.isSubmitting}
        />
      </form>

    </div>
  );
};