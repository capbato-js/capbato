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
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        background: 'white', // Clean white background
        paddingTop: '64px', // Reduced header height
        margin: 0
      }}
    >
      {/* Header */}
      <MedicalClinicHeader />

      {/* Sidebar */}
      <MedicalClinicSidebar />

      {/* Main Content Area - No Boxing */}
      <Box
        component="main"
        style={{
          marginLeft: '240px', // Wider sidebar
          paddingLeft: '32px', // Add left padding for proper spacing
          paddingRight: '32px',
          paddingTop: '32px',
          paddingBottom: '32px',
          maxWidth: 'calc(100% - 240px)',
          boxSizing: 'border-box'
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
