import { MantineTheme } from '@mantine/core';

export const getPageHeaderStyles = (theme: MantineTheme) => ({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: `2px solid ${theme.colors.gray[3]}`,
  },
  backButton: {
    fontSize: '14px',
  },
  title: {
    fontSize: '32px',
    fontWeight: 700,
    color: '#0F0F0F',
    margin: 0,
  },
});

export const PAGE_CONFIG = {
  title: 'View Lab Test Result',
  backButtonText: 'Back to Laboratory Tests',
  backButtonSize: 'sm' as const,
  titleOrder: 2 as const,
  headerGap: 'lg' as const,
};