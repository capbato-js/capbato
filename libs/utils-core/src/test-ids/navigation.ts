/**
 * Navigation Feature Test IDs  
 * Test IDs for sidebar navigation, header, breadcrumbs, and navigation components
 */

// Sidebar Navigation Test IDs
export const sidebarTestIds = {
  sidebar: 'sidebar',
  sidebarToggle: 'sidebar-toggle',
  homeNav: 'home-nav',
  patientsNav: 'patients-nav',
  appointmentsNav: 'appointments-nav',
  doctorsNav: 'doctors-nav',
  labTestsNav: 'lab-tests-nav',
  prescriptionsNav: 'prescriptions-nav',
  medicalRecordsNav: 'medical-records-nav',
  settingsNav: 'settings-nav',
  logoutNav: 'logout-nav'
} as const

// Header Navigation Test IDs
export const headerTestIds = {
  header: 'header',
  logo: 'logo',
  userProfile: 'user-profile',
  userDropdown: 'user-dropdown',
  notificationsButton: 'notifications-button',
  notificationsBadge: 'notifications-badge',
  searchInput: 'search-input',
  searchButton: 'search-button'
} as const

// Breadcrumb Navigation Test IDs
export const breadcrumbTestIds = {
  breadcrumb: 'breadcrumb',
  breadcrumbHome: 'breadcrumb-home',
  breadcrumbCurrent: 'breadcrumb-current',
  breadcrumbSeparator: 'breadcrumb-separator'
} as const

// Mobile Navigation Test IDs
export const mobileNavTestIds = {
  mobileMenuButton: 'mobile-menu-button',
  mobileMenu: 'mobile-menu',
  mobileMenuOverlay: 'mobile-menu-overlay',
  mobileNavClose: 'mobile-nav-close'
} as const

// Type definitions
export type SidebarTestIds = typeof sidebarTestIds
export type HeaderTestIds = typeof headerTestIds
export type BreadcrumbTestIds = typeof breadcrumbTestIds
export type MobileNavTestIds = typeof mobileNavTestIds