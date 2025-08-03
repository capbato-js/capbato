import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Box, UnstyledButton, Group, Text } from '@mantine/core';
import { Icon } from '../common';
import styles from './MedicalClinicSidebar.module.css';

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
      className={`fixed left-0 w-[240px] h-full bg-white z-[999] ${className || ''}`}
      style={{
        top: '64px', // Below header
        borderRight: '1px solid #e5e5e5', // Subtle border instead of shadow
        padding: '24px 12px 24px 12px' // Add horizontal padding to container instead
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
                className={styles.navItem}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  padding: '10px 12px',
                  // margin: '2px 0', // Only vertical margin, no horizontal
                  color: '#0F0F0F',
                  backgroundColor: isActive ? '#f1f1f1' : 'transparent',
                  fontWeight: 500,
                  fontSize: '14px',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  position: 'relative'
                }}
              >
              <Group gap="sm">
                <Icon 
                  icon={item.icon} 
                  className={styles.navIcon}
                  style={{ 
                    fontSize: '16px',
                    color: '#0F0F0F',
                    transition: 'color 0.2s ease'
                  }} 
                />
                <Text 
                  size="sm" 
                  data-text-element="true"
                  className={styles.navText}
                  style={{ 
                    color: '#0F0F0F',
                    fontSize: '14px',
                    fontWeight: 500,
                    transition: 'color 0.2s ease'
                  }}
                >
                  {item.label}
                </Text>
              </Group>
              </UnstyledButton>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
