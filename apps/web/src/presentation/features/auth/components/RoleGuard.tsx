/**
 * Role-based Route Guard Component
 * Protects routes based on user roles and permissions
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, useRouteAccess } from '../../../../infrastructure/auth';
import { Alert, Box, Container } from '@mantine/core';
import { IconLock } from '@tabler/icons-react';

interface RoleGuardProps {
  children: React.ReactNode;
  requiredRoute?: string;
  fallbackPath?: string;
  showAccessDenied?: boolean;
}

/**
 * RoleGuard component that checks if the current user has access to the current route
 * Based on the route permissions defined in RBAC configuration
 */
export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  requiredRoute,
  fallbackPath = '/dashboard',
  showAccessDenied = true,
}) => {
  const location = useLocation();
  const { isAuthenticated, userRole } = useAuth();
  const { hasAccess } = useRouteAccess();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Determine which route to check - use provided route or current location
  const routeToCheck = requiredRoute || location.pathname;

  // Check if user has access to the route
  const hasRouteAccess = hasAccess(routeToCheck);

  // If user doesn't have access, show access denied or redirect
  if (!hasRouteAccess) {
    if (showAccessDenied) {
      return (
        <Container size="md" py="xl">
          <Box style={{ textAlign: 'center' }}>
            <Alert 
              icon={<IconLock size="1rem" />}
              title="Access Denied"
              color="red"
              variant="light"
            >
              <p>
                You don't have permission to access this page.
              </p>
              <p>
                <strong>Your role:</strong> {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
              </p>
              <p>
                <strong>Required permission:</strong> Access to {routeToCheck}
              </p>
              <p style={{ marginTop: '1rem' }}>
                Please contact your administrator if you believe this is an error.
              </p>
            </Alert>
          </Box>
        </Container>
      );
    } else {
      return <Navigate to={fallbackPath} replace />;
    }
  }

  // User has access, render the protected content
  return <>{children}</>;
};
