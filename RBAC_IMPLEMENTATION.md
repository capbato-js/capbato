# Role-Based Access Control (RBAC) Implementation

This document describes the Role-Based Access Control implementation for the Clinic Management System.

## Overview

The RBAC system implements three distinct roles with different access levels:

1. **Admin** - Full access to all features and content
2. **Doctor** - Access to most features, but restricted access to accounts and filtered schedule view
3. **Receptionist** - Access to most features with full schedule view but no account management

## Roles and Permissions

### Admin Role
- **Full Access**: Can access all routes and features
- **Account Management**: Can manage user accounts at `/accounts`
- **Schedule View**: Can view all doctor schedules
- **Permissions**: Complete administrative privileges

### Doctor Role
- **Restricted Access**: Cannot access `/accounts` route
- **Schedule View**: Can only view their own schedule in the Doctor's Schedule calendar
- **Patient Management**: Can manage patients and appointments
- **Other Features**: Full access to laboratory, prescriptions, and other medical features

### Receptionist Role
- **Most Features**: Access to most medical features
- **Schedule View**: Can view all doctor schedules (like admin)
- **No Account Management**: Cannot access `/accounts` route
- **Patient Management**: Can manage patients and appointments

## Implementation Components

### 1. RBAC Utilities (`/infrastructure/auth/rbac.ts`)

Core utilities for role checking and permission validation:

```typescript
// Route permissions configuration
export const ROUTE_PERMISSIONS: Record<string, UserRole[]> = {
  '/accounts': [UserRole.ADMIN], // Only admin can access
  // ... other routes
};

// Permission checking functions
export const hasRouteAccess = (userRole: string, route: string): boolean => { ... }
export const canViewAllDoctorSchedules = (userRole: string): boolean => { ... }
export const canManageAccounts = (userRole: string): boolean => { ... }
```

### 2. RBAC Hooks (`/infrastructure/auth/useRBAC.ts`)

React hooks for easy permission checking in components:

```typescript
// Basic auth information
export const useAuth = () => { ... }

// Route access checking
export const useRouteAccess = () => { ... }

// Role checking
export const useUserRole = () => { ... }

// Feature permissions
export const usePermissions = () => { ... }

// Navigation filtering
export const useNavigationAccess = () => { ... }

// Doctor-specific functionality
export const useDoctorAccess = () => { ... }
```

### 3. Route Guard (`/presentation/features/auth/components/RoleGuard.tsx`)

Component for protecting routes based on user roles:

```tsx
<RoleGuard requiredRoute="/accounts">
  <AccountsPage />
</RoleGuard>
```

### 4. Navigation Filtering (`MedicalClinicSidebar.tsx`)

The sidebar automatically filters navigation items based on user roles:

```tsx
const navigationItems = useNavigationAccess();
// Only shows items the user has access to
```

### 5. Schedule Filtering (`useDoctorScheduleCalendarViewModel.ts`)

The doctor schedule calendar filters appointments based on user role:

- **Admin/Receptionist**: Shows all doctor schedules
- **Doctor**: Shows only their own appointments

## Usage Examples

### Checking Route Access

```tsx
import { useRouteAccess } from '../infrastructure/auth';

const MyComponent = () => {
  const { canAccessAccounts } = useRouteAccess();
  
  return (
    <div>
      {canAccessAccounts() && (
        <Link to="/accounts">Manage Accounts</Link>
      )}
    </div>
  );
};
```

### Checking User Role

```tsx
import { useUserRole } from '../infrastructure/auth';

const MyComponent = () => {
  const { isAdmin, isDoctor, isReceptionist } = useUserRole();
  
  return (
    <div>
      {isAdmin && <AdminPanel />}
      {isDoctor && <DoctorTools />}
      {isReceptionist && <ReceptionistTools />}
    </div>
  );
};
```

### Doctor-Specific Functionality

```tsx
import { useDoctorAccess } from '../infrastructure/auth';

const ScheduleComponent = () => {
  const { shouldFilterByDoctor, doctorId } = useDoctorAccess();
  
  // This will automatically filter schedules for doctor users
  const filteredSchedules = shouldFilterByDoctor 
    ? schedules.filter(s => s.doctorId === doctorId)
    : schedules;
    
  return <ScheduleView schedules={filteredSchedules} />;
};
```

## Configuration

### Adding New Routes

To add a new route with role restrictions:

1. Add the route to `ROUTE_PERMISSIONS` in `rbac.ts`:
```typescript
export const ROUTE_PERMISSIONS: Record<string, UserRole[]> = {
  '/new-feature': [UserRole.ADMIN, UserRole.DOCTOR], // Only admin and doctor
  // ... other routes
};
```

2. Add a corresponding navigation item in `useNavigationAccess` hook if needed.

### Modifying Permissions

To change which roles can access a feature:

1. Update the `ROUTE_PERMISSIONS` configuration
2. Update any specific permission functions if needed
3. The changes will automatically apply to all components using the RBAC hooks

## Security Notes

- Route protection is implemented at the component level with `RoleGuard`
- Navigation items are filtered to prevent confusion for users
- Backend API should also implement corresponding role checks
- The current user's role is stored in the authentication store
- All role checks are case-insensitive and normalized

## Testing Role-Based Access

To test different roles:

1. Log in with different user accounts having different roles
2. Verify that:
   - Navigation items are filtered correctly
   - Protected routes show access denied or redirect
   - Doctor users only see their own schedules
   - Only admins can access the accounts page

## Future Enhancements

Potential improvements to the RBAC system:

1. **Granular Permissions**: Move from role-based to permission-based system
2. **Dynamic Roles**: Support for custom roles defined in the database
3. **Resource-Level Permissions**: Restrict access to specific patients/records
4. **Audit Logging**: Track access attempts and permission changes
5. **Role Hierarchies**: Support for role inheritance (e.g., admin inherits doctor permissions)
