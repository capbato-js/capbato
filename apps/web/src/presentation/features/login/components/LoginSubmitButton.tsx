import React from 'react';
import { Button } from '@mantine/core';
import { IconLogin } from '@tabler/icons-react';

interface LoginSubmitButtonProps {
  isFormEmpty: boolean;
  isSubmitting: boolean;
}

export const LoginSubmitButton: React.FC<LoginSubmitButtonProps> = ({
  isFormEmpty,
  isSubmitting,
}) => {
  return (
    <Button
      type="submit"
      disabled={isFormEmpty || isSubmitting}
      fullWidth
      leftSection={isSubmitting ? undefined : <IconLogin size={18} />}
      loading={isSubmitting}
      size="md"
      mt="28px"
      data-testid="login-submit-button"
    >
      Login
    </Button>
  );
};