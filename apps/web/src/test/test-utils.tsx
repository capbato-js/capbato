import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { mantineTheme } from '../lib/mantine-theme';

/**
 * Custom render function that wraps components with necessary providers
 * for testing - including React Router and Mantine Provider with theme
 */
export const renderWithProviders = (ui: React.ReactElement, options = {}) => {
  const AllTheProviders = ({ children }: { children: React.ReactNode }) => (
    <MantineProvider theme={mantineTheme}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </MantineProvider>
  );

  return render(ui, { wrapper: AllTheProviders, ...options });
};

/**
 * Re-export everything from React Testing Library
 */
export * from '@testing-library/react';

/**
 * Override the default render method
 */
export { renderWithProviders as render };
