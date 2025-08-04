import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Box, UnstyledButton, Group, Text, useMantineTheme } from '@mantine/core';
import { Icon } from '../common';
import { useNavigationAccess } from '../../../infrastructure/auth';
import styles from './MedicalClinicSidebar.module.css';

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
  const navigationItems = useNavigationAccess();

  return (
    <Box
      component="nav"
      className={`fixed left-0 w-[280px] h-full bg-white z-10 ${className || ''}`}
      style={{
        top: '64px', // Below header
        borderRight: `1px solid ${theme.colors.customGray[4]}`, // Subtle border instead of shadow
        padding: '24px 12px 24px 12px' // Add horizontal padding to container instead
      }}
    >
      <Box component="ul" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {navigationItems
          .filter(item => item.hasAccess) // Filter out items user doesn't have access to
          .map((item) => {
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
