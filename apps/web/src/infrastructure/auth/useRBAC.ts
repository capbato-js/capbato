/**
 * RBAC React hooks for role-based access control
 * Provides easy-to-use hooks for checking permissions in components
 */

import { useMemo } from 'react';
import { useMantineTheme } from '@mantine/core';
import { useAuthStore } from '../state/AuthStore';
import { 
  hasRouteAccess, 
  canViewAllDoctorSchedules,
  canManageAccounts,
  isAdmin,
  isDoctor,
  isReceptionist,
  permissions
} from './rbac';

/**
 * Hook to get current user's role and permissions
 */
export const useAuth = () => {
  const { user, isAuthenticated } = useAuthStore();
  
  return useMemo(() => ({
    user,
    isAuthenticated,
    userRole: user?.role || '',
    userId: user?.id || '',
  }), [user, isAuthenticated]);
};

/**
 * Hook to check if current user has access to specific routes
 */
export const useRouteAccess = () => {
  const { userRole } = useAuth();
  
  return useMemo(() => ({
    hasAccess: (route: string) => hasRouteAccess(userRole, route),
    canAccessAccounts: () => permissions.routes.canAccessAccounts(userRole),
    canAccessDashboard: () => permissions.routes.canAccessDashboard(userRole),
    canAccessAppointments: () => permissions.routes.canAccessAppointments(userRole),
    canAccessPatients: () => permissions.routes.canAccessPatients(userRole),
    canAccessLaboratory: () => permissions.routes.canAccessLaboratory(userRole),
    canAccessPrescriptions: () => permissions.routes.canAccessPrescriptions(userRole),
    canAccessDoctors: () => permissions.routes.canAccessDoctors(userRole),
  }), [userRole]);
};

/**
 * Hook to check user roles
 */
export const useUserRole = () => {
  const { userRole } = useAuth();
  
  return useMemo(() => ({
    isAdmin: isAdmin(userRole),
    isDoctor: isDoctor(userRole),
    isReceptionist: isReceptionist(userRole),
    role: userRole,
  }), [userRole]);
};

/**
 * Hook to check feature permissions
 */
export const usePermissions = () => {
  const { userRole, userId } = useAuth();
  
  return useMemo(() => ({
    // Schedule permissions
    canViewAllSchedules: canViewAllDoctorSchedules(userRole),
    canViewOwnScheduleOnly: isDoctor(userRole),
    
    // Account management permissions
    canManageAccounts: canManageAccounts(userRole),
    
    // General permissions
    hasAdminPrivileges: permissions.features.hasAdminPrivileges(userRole),
    canManagePatients: permissions.features.canManagePatients(userRole),
    
    // User context
    currentUserId: userId,
    userRole,
  }), [userRole, userId]);
};

/**
 * Hook to get filtered navigation items based on user role
 */
export const useNavigationAccess = () => {
  const routeAccess = useRouteAccess();
  const theme = useMantineTheme();
  
  return useMemo(() => {
    const navigationItems = [
      {
        path: '/dashboard',
        label: 'Dashboard',
        icon: 'fas fa-tachometer-alt',
        color: theme.colors.navIcons[0], // Unified dark color
        hasAccess: routeAccess.canAccessDashboard(),
      },
      {
        path: '/appointments',
        label: 'Appointments',
        icon: 'fas fa-calendar-check',
        color: theme.colors.navIcons[0], // Unified dark color
        hasAccess: routeAccess.canAccessAppointments(),
      },
      {
        path: '/patients',
        label: 'Patients',
        icon: 'fas fa-users',
        color: theme.colors.navIcons[0], // Unified dark color
        hasAccess: routeAccess.canAccessPatients(),
      },
      {
        path: '/laboratory',
        label: 'Laboratory',
        icon: 'fas fa-flask',
        color: theme.colors.navIcons[0], // Unified dark color
        hasAccess: routeAccess.canAccessLaboratory(),
      },
      {
        path: '/prescriptions',
        label: 'Prescriptions',
        icon: 'fas fa-prescription-bottle',
        color: theme.colors.navIcons[0], // Unified dark color
        hasAccess: routeAccess.canAccessPrescriptions(),
      },
      {
        path: '/doctors',
        label: 'Doctors',
        icon: 'fas fa-user-md',
        color: theme.colors.navIcons[0], // Unified dark color
        hasAccess: routeAccess.canAccessDoctors(),
      },
      {
        path: '/accounts',
        label: 'Accounts',
        icon: 'fas fa-users-cog',
        color: theme.colors.navIcons[0], // Unified dark color
        hasAccess: routeAccess.canAccessAccounts(),
      },
    ];

    // Filter items based on access permissions
    return navigationItems.filter(item => item.hasAccess);
  }, [routeAccess]);
};

/**
 * Hook for doctor-specific functionality
 */
export const useDoctorAccess = () => {
  const { userRole, userId } = useAuth();
  const isCurrentUserDoctor = isDoctor(userRole);
  
  return useMemo(() => ({
    isDoctor: isCurrentUserDoctor,
    userId: isCurrentUserDoctor ? userId : null, // Only provide userId for doctors
    shouldFilterByDoctor: isCurrentUserDoctor,
    canViewAllDoctorSchedules: canViewAllDoctorSchedules(userRole),
  }), [userRole, userId, isCurrentUserDoctor]);
};
