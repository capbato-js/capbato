import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Box, UnstyledButton, Group, Text } from '@mantine/core';
import { Icon } from '../common';
import styles from './MedicalClinicSidebar.module.css';

interface NavigationItem {
  path: string;
  label: string;
  icon: string; // FontAwesome icon class
  color: string; // Color for the icon
}

const navigationItems: NavigationItem[] = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: 'fas fa-tachometer-alt',
    color: '#4A90E2' // Blue - Overview/analytics
  },
  {
    path: '/appointments',
    label: 'Appointments',
    icon: 'fas fa-calendar-check',
    color: '#F5A623' // Orange - Scheduling/calendar
  },
  {
    path: '/patients',
    label: 'Patients',
    icon: 'fas fa-users',
    color: '#7ED321' // Green - Health/people
  },
  {
    path: '/laboratory',
    label: 'Laboratory', 
    icon: 'fas fa-flask',
    color: '#BD10E0' // Purple - Science/testing
  },
  {
    path: '/prescriptions',
    label: 'Prescriptions',
    icon: 'fas fa-prescription-bottle',
    color: '#E94B3C' // Red - Medicine/pharmacy
  },
  {
    path: '/doctors',
    label: 'Doctors',
    icon: 'fas fa-user-md',
    color: '#50E3C2' // Teal - Medical professionals
  },
  {
    path: '/accounts',
    label: 'Accounts',
    icon: 'fas fa-users-cog',
    color: '#9013FE' // Violet - Administration/settings
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
      className={`fixed left-0 w-[280px] h-full bg-white z-[999] ${className || ''}`}
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
                  fontWeight: isActive ? 500 : 400,
                  fontSize: '14px',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  position: 'relative'
                }}
              >
              <Group gap="md">
                <Icon 
                  icon={item.icon} 
                  className={styles.navIcon}
                  style={{ 
                    fontSize: '16px',
                    color: item.color,
                    transition: 'color 0.2s ease',
                    width: '20px',
                    textAlign: 'center',
                    display: 'inline-block'
                  }} 
                />
                <Text 
                  size="sm" 
                  data-text-element="true"
                  className={styles.navText}
                  style={{ 
                    color: '#0F0F0F',
                    fontSize: '14px',
                    fontWeight: isActive ? 500 : 400,
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
