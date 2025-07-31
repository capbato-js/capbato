import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Box, UnstyledButton, Group, Text } from '@mantine/core';
import { Icon } from '../common';

interface NavigationItem {
  path: string;
  label: string;
  icon: string; // FontAwesome icon class
}

const navigationItems: NavigationItem[] = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: 'fas fa-tachometer-alt'
  },
  {
    path: '/appointments',
    label: 'Appointments',
    icon: 'fas fa-calendar-check'
  },
  {
    path: '/patients',
    label: 'Patients',
    icon: 'fas fa-users'
  },
  {
    path: '/laboratory',
    label: 'Laboratory', 
    icon: 'fas fa-flask'
  },
  {
    path: '/prescriptions',
    label: 'Prescriptions',
    icon: 'fas fa-prescription-bottle'
  },
  {
    path: '/doctors',
    label: 'Doctors',
    icon: 'fas fa-user-md'
  },
  {
    path: '/accounts',
    label: 'Accounts',
    icon: 'fas fa-users-cog'
  }
];

interface MedicalClinicSidebarProps {
  className?: string;
}

export const MedicalClinicSidebar: React.FC<MedicalClinicSidebarProps> = ({ className }) => {
  const location = useLocation();

  return (
    <Box
      component="nav"
      className={`fixed left-0 w-[200px] h-full bg-white z-[999] ${className || ''}`}
      style={{
        top: '90px', // Below header
        boxShadow: '2px 0 10px rgba(0, 0, 0, 0.1)',
        padding: '20px 0'
      }}
    >
      <Box component="ul" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Box 
              key={item.path} 
              component="li"
              style={{ margin: 0, padding: 0 }}
            >
              <UnstyledButton
                component={NavLink}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  padding: '12px 20px',
                  color: isActive ? '#4db6ac' : '#666',
                  backgroundColor: isActive ? '#e8f5e8' : 'transparent',
                  borderLeft: isActive ? '3px solid #4db6ac' : '3px solid transparent',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '14px',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  position: 'relative'
                }}
              >
              <Group gap="sm">
                <Icon 
                  icon={item.icon} 
                  style={{ 
                    fontSize: '16px',
                    color: isActive ? '#4db6ac' : '#666',
                    transition: 'color 0.3s ease'
                  }} 
                />
                <Text 
                  size="sm" 
                  data-text-element="true"
                  style={{ 
                    color: isActive ? '#4db6ac' : '#666',
                    fontSize: '14px',
                    fontWeight: isActive ? 600 : 500,
                    transition: 'color 0.3s ease'
                  }}
                >
                  {item.label}
                </Text>
              </Group>                {/* Active indicator on right side */}
                {isActive && (
                  <Box
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 0,
                      bottom: 0,
                      width: '3px',
                      backgroundColor: '#4db6ac'
                    }}
                  />
                )}
              </UnstyledButton>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
