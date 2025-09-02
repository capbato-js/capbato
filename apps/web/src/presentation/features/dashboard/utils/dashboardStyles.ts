import { MantineTheme } from '@mantine/core';

export const getDashboardStyles = (theme: MantineTheme) => ({
  statsGrid: {
    marginBottom: '32px'
  },
  
  headerContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '0',
    position: 'relative' as const
  },
  
  headerTitle: {
    color: theme.colors.customGray[8],
    fontSize: '18px',
    fontWeight: 600,
    margin: 0,
    textAlign: 'center' as const
  },
  
  seeAllButton: {
    color: theme.colors.blue[7],
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    position: 'absolute' as const,
    right: 0
  },
  
  appointmentsContainer: {
    marginBottom: '24px'
  },
  
  loadingContainer: {
    textAlign: 'center' as const,
    marginTop: '40px',
    color: '#9ca3af'
  }
});