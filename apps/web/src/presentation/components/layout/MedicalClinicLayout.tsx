import React from 'react';
import { Box } from '@mantine/core';
import { MedicalClinicHeader } from './MedicalClinicHeader';
import { MedicalClinicSidebar } from './MedicalClinicSidebar';

interface MedicalClinicLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const MedicalClinicLayout: React.FC<MedicalClinicLayoutProps> = ({ 
  children, 
  className 
}) => {
  return (
    <Box
      className={className}
      style={{
        minHeight: '100vh',
        position: 'relative',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        background: 'linear-gradient(to bottom right, rgb(109, 174, 218), #4db6ac)',
        paddingTop: '100px',
        margin: 0
      }}
    >
      {/* Background blur effect */}
      <Box
        style={{
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          minHeight: '100%',
          background: 'inherit',
          backgroundSize: 'cover',
          filter: 'blur(10px)',
          zIndex: -1
        }}
      />

      {/* Header */}
      <MedicalClinicHeader />

      {/* Sidebar */}
      <MedicalClinicSidebar />

      {/* Main Content Area */}
      <Box
        component="main"
        style={{
          marginLeft: '220px', // Sidebar width + margin
          marginRight: '20px',
          marginTop: '20px',
          marginBottom: '20px',
          maxWidth: 'calc(100% - 240px)',
          boxSizing: 'border-box'
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
