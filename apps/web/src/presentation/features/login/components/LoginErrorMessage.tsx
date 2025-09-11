import React from 'react';

interface LoginErrorMessageProps {
  error: string | null;
}

export const LoginErrorMessage: React.FC<LoginErrorMessageProps> = ({ error }) => {
  if (!error) return null;

  return (
    <div 
      className="text-red-600 text-sm mb-4 text-center"
      data-testid="login-error"
    >
      {error}
    </div>
  );
};