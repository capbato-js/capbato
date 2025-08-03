import { createTheme } from '@mantine/core';

export const mantineTheme = createTheme({
  primaryColor: 'blue', // Main theme color from logo is #37b7ff
  primaryShade: 7,
  colors: {
    blue: [
      "#dffaff",
      "#c9efff",
      "#98dcff",
      "#61c8ff",
      "#37b7ff",
      "#18acff",
      "#00a7ff",
      "#0091e6",
      "#0081ce",
      "#0070b7"
    ],
    tableBlue: [
      "#ebf3ff",
      "#d3e3fa",
      "#a2c4f7",
      "#6fa4f6",
      "#4989f5",
      "#3578f5",
      "#2b70f7",
      "#215fdc",
      "#1754c5",
      "#0047ab"
    ],
    // Custom gray scale to match existing hardcoded colors exactly
    customGray: [
      "#f8f9fa", // 0 - lightest backgrounds, hover states
      "#f5f5f5", // 1 - light borders, subtle backgrounds  
      "#f0f0f0", // 2 - borders
      "#e9ecef", // 3 - borders, dividers
      "#e5e5e5", // 4 - borders
      "#6c757d", // 5 - muted text
      "#495057", // 6 - dark text, focused borders
      "#888888", // 7 - muted text alt
      "#0f0f0f", // 8 - title text, darkest
      "#fafafa"  // 9 - very light backgrounds
    ],
    // Navigation icon colors - exact matches
    navIcons: [
      "#4A90E2", // 0 - blue (dashboard)
      "#F5A623", // 1 - orange (appointments)  
      "#7ED321", // 2 - green (patients)
      "#BD10E0", // 3 - purple (laboratory)
      "#E94B3C", // 4 - red (prescriptions)
      "#50E3C2", // 5 - teal (doctors)
      "#4A90E2", // 6 - duplicate for consistency
      "#4A90E2", // 7 - duplicate for consistency
      "#4A90E2", // 8 - duplicate for consistency  
      "#4A90E2"  // 9 - duplicate for consistency
    ],
  },

  fontFamily: 'Roboto, Arial, sans-serif',

  other: {
    titleColor: '#0F0F0F',
    // Semantic color mappings for better maintainability
    colors: {
      border: {
        light: '#f5f5f5',      // customGray.1
        default: '#e9ecef',    // customGray.3  
        subtle: '#f0f0f0',     // customGray.2
        muted: '#e5e5e5'       // customGray.4
      },
      background: {
        hover: '#f8f9fa',      // customGray.0
        subtle: '#fafafa',     // customGray.9
        table: '#fafafa'       // customGray.9
      },
      text: {
        primary: '#0f0f0f',    // customGray.8
        secondary: '#495057',  // customGray.6
        muted: '#6c757d',      // customGray.5
        mutedAlt: '#888888'    // customGray.7
      },
      navigation: {
        dashboard: '#4A90E2',    // navIcons.0
        appointments: '#F5A623', // navIcons.1
        patients: '#7ED321',     // navIcons.2
        laboratory: '#BD10E0',   // navIcons.3
        prescriptions: '#E94B3C', // navIcons.4
        doctors: '#50E3C2'       // navIcons.5
      }
    }
  },
  
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
    blue: [
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