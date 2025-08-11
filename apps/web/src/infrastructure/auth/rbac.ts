/**
 * Role-Based Access Control (RBAC) utilities
 * Provides functions to check permissions and access control based on user roles
 */

import { UserRole } from '@nx-starter/domain';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  role: string;
  mobile?: string;
}

/**
 * Route permissions configuration
 * Maps routes to allowed roles
 */
export const ROUTE_PERMISSIONS: Record<string, UserRole[]> = {
  '/dashboard': [UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST],
  '/appointments': [UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST],
  '/patients': [UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST],
  '/laboratory': [UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST],
  '/prescriptions': [UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST],
  '/transactions': [UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST],
  '/doctors': [UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST],
  '/accounts': [UserRole.ADMIN], // Only admin can access accounts
  '/todo': [UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST],
  '/about': [UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST],
} as const;

/**
 * Check if a user has permission to access a specific route
 */
export const hasRouteAccess = (userRole: string, route: string): boolean => {
  const allowedRoles = ROUTE_PERMISSIONS[route];
  if (!allowedRoles) {
    // If route is not configured, allow access by default
    return true;
  }

  const normalizedRole = userRole.toLowerCase() as UserRole;
  return allowedRoles.includes(normalizedRole);
};

/**
 * Check if user is admin
 */
export const isAdmin = (userRole: string): boolean => {
  return userRole.toLowerCase() === UserRole.ADMIN;
};

/**
 * Check if user is doctor
 */
export const isDoctor = (userRole: string): boolean => {
  return userRole.toLowerCase() === UserRole.DOCTOR;
};

/**
 * Check if user is receptionist
 */
export const isReceptionist = (userRole: string): boolean => {
  return userRole.toLowerCase() === UserRole.RECEPTIONIST;
};

/**
 * Check if user has admin privileges
 */
export const hasAdminPrivileges = (userRole: string): boolean => {
  return isAdmin(userRole);
};

/**
 * Check if user can manage patients (all roles can)
 */
export const canManagePatients = (userRole: string): boolean => {
  return [UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST].includes(
    userRole.toLowerCase() as UserRole
  );
};

/**
 * Check if user can view all doctor schedules
 * Only admin and receptionist can view all schedules
 * Doctors can only view their own schedule
 */
export const canViewAllDoctorSchedules = (userRole: string): boolean => {
  return isAdmin(userRole) || isReceptionist(userRole);
};

/**
 * Check if user can manage accounts (only admin)
 */
export const canManageAccounts = (userRole: string): boolean => {
  return isAdmin(userRole);
};

/**
 * Get filtered navigation items based on user role
 */
export const getFilteredNavigationItems = (userRole: string) => {
  const allRoutes = Object.keys(ROUTE_PERMISSIONS);
  return allRoutes.filter(route => hasRouteAccess(userRole, route));
};

/**
 * Permission checking utilities for specific features
 */
export const permissions = {
  routes: {
    canAccessAccounts: (userRole: string) => hasRouteAccess(userRole, '/accounts'),
    canAccessDashboard: (userRole: string) => hasRouteAccess(userRole, '/dashboard'),
    canAccessAppointments: (userRole: string) => hasRouteAccess(userRole, '/appointments'),
    canAccessPatients: (userRole: string) => hasRouteAccess(userRole, '/patients'),
    canAccessLaboratory: (userRole: string) => hasRouteAccess(userRole, '/laboratory'),
    canAccessPrescriptions: (userRole: string) => hasRouteAccess(userRole, '/prescriptions'),
    canAccessTransactions: (userRole: string) => hasRouteAccess(userRole, '/transactions'),
    canAccessDoctors: (userRole: string) => hasRouteAccess(userRole, '/doctors'),
  },
  
  features: {
    canViewAllSchedules: canViewAllDoctorSchedules,
    canManageAccounts: canManageAccounts,
    canManagePatients: canManagePatients,
    hasAdminPrivileges: hasAdminPrivileges,
  },
  
  roles: {
    isAdmin,
    isDoctor, 
    isReceptionist,
  }
};
