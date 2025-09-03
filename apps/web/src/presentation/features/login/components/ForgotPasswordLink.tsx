import React from 'react';
import { Button, Group } from '@mantine/core';

export const ForgotPasswordLink: React.FC = () => {
  const handleForgotPasswordClick = () => {
    // TODO: Implement forgot password functionality
    console.log('Forgot password clicked');
  };

  return (
    <Group justify="center" mt="lg">
      <Button
        variant="subtle"
        size="sm"
        onClick={handleForgotPasswordClick}
        data-testid="forgot-password-link"
      >
        Forgot Password?
      </Button>
    </Group>
  );
};