/**
 * Configuration for appointments calendar component
 */

export const CALENDAR_CONSTANTS = {
  MONTHS: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ] as const,

  DAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const,

  MAX_VISIBLE_APPOINTMENTS: 3,
  
  GRID_COLUMNS: 7,
} as const;

/**
 * Calendar styling configuration
 */
export const CALENDAR_STYLES = {
  CONTAINER: {
    marginTop: '30px'
  },

  TITLE: {
    fontSize: '22px',
    fontWeight: 'bold',
    textAlign: 'center' as const,
    marginBottom: '8px'
  },

  NAVIGATION: {
    display: 'flex',
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: '12px'
  },

  NAV_BUTTON: {
    fontSize: '20px',
    padding: '4px 10px'
  },

  MONTH_YEAR: {
    fontWeight: 'bold',
    textAlign: 'center' as const,
    textTransform: 'uppercase' as const,
    fontSize: '1.25rem',
    flexGrow: 1
  },

  HEADER_GRID: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    textAlign: 'center' as const,
    fontWeight: 'bold',
    backgroundColor: '#dbe5ff',
    borderRadius: '12px 12px 0 0',
    overflow: 'hidden'
  },

  HEADER_CELL: {
    padding: '12px 0'
  },

  CALENDAR_GRID: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '12px',
    paddingTop: '12px'
  },

  EMPTY_CELL: {
    background: 'transparent',
    minHeight: '100px'
  },

  DAY_CELL_BASE: {
    borderRadius: '12px',
    padding: '10px',
    minHeight: '100px',
    fontWeight: 500,
    position: 'relative' as const,
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },

  DAY_NUMBER: {
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '6px'
  },

  APPOINTMENTS_CONTAINER: {
    fontSize: '11px',
    backgroundColor: 'transparent',
    fontWeight: 600,
    lineHeight: 1.2
  },

  APPOINTMENT_BADGE: {
    marginBottom: '2px',
    padding: '2px 4px',
    borderRadius: '4px',
    fontSize: '10px',
    fontWeight: 'bold',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const
  },

  MORE_APPOINTMENTS: {
    fontSize: '10px',
    fontWeight: 'bold',
    textAlign: 'center' as const,
    marginTop: '2px'
  }
} as const;

/**
 * Calendar color configuration
 */
export const CALENDAR_COLORS = {
  PRIMARY: '#0047ab',
  HEADER_BORDER: '#c0d6f7',
  
  DAY_CELL: {
    DEFAULT: '#ecf5ff',
    SELECTED: '#b9f6ca',
    TEXT: '#333'
  },

  DAY_CELL_SHADOW: {
    DEFAULT: '0 2px 4px rgba(0, 0, 0, 0.05)',
    SELECTED: '0 4px 8px rgba(77, 182, 172, 0.3)'
  },

  DAY_CELL_BORDER: {
    DEFAULT: 'transparent',
    SELECTED: '#4db6ac'
  }
} as const;

/**
 * Appointment status color mapping
 */
export const APPOINTMENT_STATUS_COLORS = {
  confirmed: {
    background: '#b9f6ca',
    text: '#006400'
  },
  pending: {
    background: '#ffcc80',
    text: '#8c5000'
  },
  cancelled: {
    background: '#ff8a80',
    text: '#8b0000'
  }
} as const;

export type AppointmentStatus = keyof typeof APPOINTMENT_STATUS_COLORS;