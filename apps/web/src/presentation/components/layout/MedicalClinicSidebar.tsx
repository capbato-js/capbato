import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Box, UnstyledButton, Group, Text, useMantineTheme } from '@mantine/core';
import { Icon } from '../common';
import styles from './MedicalClinicSidebar.module.css';

interface NavigationItem {
  path: string;
  label: string;
  icon: string; // FontAwesome icon class
  color: string; // Color for the icon
}

const getNavigationItems = (theme: any): NavigationItem[] => [
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: 'fas fa-tachometer-alt',
    color: theme.colors.navIcons[0] // Blue - Overview/analytics
  },
  {
    path: '/appointments',
    label: 'Appointments',
    icon: 'fas fa-calendar-check',
    color: theme.colors.navIcons[1] // Orange - Scheduling/calendar
  },
  {
    path: '/patients',
    label: 'Patients',
    icon: 'fas fa-users',
    color: theme.colors.navIcons[2] // Green - Health/people
  },
  {
    path: '/laboratory',
    label: 'Laboratory', 
    icon: 'fas fa-flask',
    color: theme.colors.navIcons[3] // Purple - Science/testing
  },
  {
    path: '/prescriptions',
    label: 'Prescriptions',
    icon: 'fas fa-prescription-bottle',
    color: theme.colors.navIcons[4] // Red - Medicine/pharmacy
  },
  {
    path: '/doctors',
    label: 'Doctors',
    icon: 'fas fa-user-md',
    color: theme.colors.navIcons[5] // Teal - Medical professionals
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

// Helper function to determine if a navigation item should be active
const isNavigationItemActive = (currentPath: string, itemPath: string): boolean => {
  // For exact matches
  if (currentPath === itemPath) {
    return true;
  }
  
  // For nested routes, check if current path starts with the item path
  // This handles cases like /patients/new or /patients/:id under /patients
  const itemsWithNestedRoutes = ['/patients', '/doctors', '/appointments'];
  
  if (itemsWithNestedRoutes.includes(itemPath)) {
    return currentPath.startsWith(itemPath + '/') || currentPath === itemPath;
  }
  
  return false;
};

export const MedicalClinicSidebar: React.FC<MedicalClinicSidebarProps> = ({ className }) => {
  const location = useLocation();
  const theme = useMantineTheme();
  const navigationItems = getNavigationItems(theme);

  return (
    <Box
      component="nav"
      className={`fixed left-0 w-[280px] h-full bg-white ${className || ''}`}
      style={{
        top: '64px', // Below header
        borderRight: `1px solid ${theme.colors.customGray[4]}`, // Subtle border instead of shadow
        padding: '24px 12px 24px 12px' // Add horizontal padding to container instead
      }}
    >
      <Box component="ul" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {navigationItems.map((item) => {
          const isActive = isNavigationItemActive(location.pathname, item.path);
          
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
                  color: theme.colors.customGray[8],
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
                    color: theme.colors.customGray[8],
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
