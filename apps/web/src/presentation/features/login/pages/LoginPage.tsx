import React from 'react';
import { Box } from '@mantine/core';
import { LoginForm } from '../components/LoginForm';
import { MedicalClinicHeader } from '../../../components/layout/MedicalClinicHeader';

export const LoginPage: React.FC = () => {
  return (
    <Box
      style={{
        position: 'relative',
        fontFamily: 'Arial, sans-serif',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        paddingTop: '100px',
        background: 'linear-gradient(to bottom right, rgb(109, 174, 218), #4db6ac)',
        margin: 0
      }}
      data-testid="login-page"
    >

      
      {/* Header */}
      {/* <MedicalClinicHeader /> */}
      
      {/* Login Form */}
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </Box>
  );
};