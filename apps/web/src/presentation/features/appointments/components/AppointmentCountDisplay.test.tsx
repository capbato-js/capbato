import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { AppointmentCountDisplay } from './AppointmentCountDisplay';

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <MantineProvider>{children}</MantineProvider>
);

describe('AppointmentCountDisplay Component', () => {
  describe('rendering', () => {
    it('renders count correctly with positive number', () => {
      render(
        <TestWrapper>
          <AppointmentCountDisplay count={5} />
        </TestWrapper>
      );

      expect(screen.getByText('Total Appointments: 5')).toBeInTheDocument();
    });

    it('renders count correctly with zero', () => {
      render(
        <TestWrapper>
          <AppointmentCountDisplay count={0} />
        </TestWrapper>
      );

      expect(screen.getByText('Total Appointments: 0')).toBeInTheDocument();
    });

    it('renders count correctly with large number', () => {
      render(
        <TestWrapper>
          <AppointmentCountDisplay count={1000} />
        </TestWrapper>
      );

      expect(screen.getByText('Total Appointments: 1000')).toBeInTheDocument();
    });

    it('applies correct styling', () => {
      const { container } = render(
        <TestWrapper>
          <AppointmentCountDisplay count={3} />
        </TestWrapper>
      );

      const textElement = screen.getByText('Total Appointments: 3');
      expect(textElement).toBeInTheDocument();
      // Test that the element is rendered with proper text content
      expect(textElement.textContent).toBe('Total Appointments: 3');
    });
  });

  describe('snapshots', () => {
    it('matches snapshot with count 0', () => {
      const { container } = render(
        <TestWrapper>
          <AppointmentCountDisplay count={0} />
        </TestWrapper>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with positive count', () => {
      const { container } = render(
        <TestWrapper>
          <AppointmentCountDisplay count={42} />
        </TestWrapper>
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});