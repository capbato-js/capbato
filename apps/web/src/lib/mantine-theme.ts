import { createTheme } from '@mantine/core';

export const mantineTheme = createTheme({
  primaryColor: 'teal',
  primaryShade: 9,
  colors: {
    teal: [
    "#edfdfa",
    "#dcf8f2",
    "#b3f1e4",
    "#87ebd6",
    "#67e5ca",
    "#54e2c2",
    "#49e0be",
    "#3bc7a7",
    "#2eb194",
    "#16a589"
  ],
  },

  fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  
  radius: {
    xs: '0.25rem',
    sm: 'calc(0.625rem - 4px)',
    md: 'calc(0.625rem - 2px)',
    lg: '0.625rem',
    xl: 'calc(0.625rem + 4px)'
  },

  breakpoints: {
    xs: '30em',
    sm: '48em', 
    md: '64em',
    lg: '74em',
    xl: '90em'
  },

  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    md: '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',
    lg: '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)',
    xl: '0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)'
  },

  components: {
    Button: {
      defaultProps: {
        radius: 'md'
      },
      styles: {
        root: {
          cursor: 'pointer'
        }
      }
    },
    
    Card: {
      defaultProps: {
        radius: 'md',
        shadow: 'sm'
      }
    },

    Input: {
      defaultProps: {
        radius: 'md'
      }
    },

    Modal: {
      defaultProps: {
        radius: 'md'
      }
    }
  }
});

export const darkMantineTheme = createTheme({
  ...mantineTheme,
  primaryShade: 9,
  
  colors: {
    ...mantineTheme.colors,
    teal: [
      "#e7fefa",
      "#d5f9f2", 
      "#acf2e4",
      "#7febd5",
      "#5ce5c9",
      "#47e2c1",
      "#39e0bd",
      "#29c7a6",
      "#17a589",
      "#00997e"
    ],
    dark: [
      '#d5d7e0',
      '#acaebf', 
      '#8c8fa3',
      '#666980',
      '#4d4f66',
      '#34354a',
      '#2b2c3d',
      '#1d1e30',
      '#0c0d21',
      '#01010a'
    ]
  }
});