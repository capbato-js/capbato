/**
 * Appointments Feature Test IDs
 * Test IDs for appointments page, appointment forms, and appointment-related components
 */

export const appointmentsPageTestIds = {
  pageTitle: 'page-title',
  addNewButton: 'add-new-button',
  appointmentsTable: 'appointments-table',
  appointmentRow: 'appointment-row',
  appointmentDate: 'appointment-date',
  appointmentTime: 'appointment-time',
  patientName: 'patient-name',
  doctorName: 'doctor-name',
  appointmentStatus: 'appointment-status',
  viewAppointmentButton: 'view-appointment-button',
  editAppointmentButton: 'edit-appointment-button',
  cancelAppointmentButton: 'cancel-appointment-button'
} as const

// Appointment Form Test IDs
export const appointmentFormTestIds = {
  form: 'appointment-form',
  patientSelect: 'patient-select',
  doctorSelect: 'doctor-select',
  dateInput: 'date-input',
  timeInput: 'time-input',
  reasonTextarea: 'reason-textarea',
  notesTextarea: 'notes-textarea',
  saveAppointmentButton: 'save-appointment-button',
  cancelAppointmentButton: 'cancel-appointment-button'
} as const

// Dashboard Appointments Test IDs
export const dashboardTestIds = {
  pageTitle: 'page-title',
  statsContainer: 'stats-container',
  totalPatientsCard: 'total-patients-card',
  totalAppointmentsCard: 'total-appointments-card',
  todayAppointmentsCard: 'today-appointments-card',
  recentPatientsSection: 'recent-patients-section',
  upcomingAppointmentsSection: 'upcoming-appointments-section',
  quickActionsSection: 'quick-actions-section'
} as const

// Type definitions
export type AppointmentsPageTestIds = typeof appointmentsPageTestIds
export type AppointmentFormTestIds = typeof appointmentFormTestIds
export type DashboardTestIds = typeof dashboardTestIds