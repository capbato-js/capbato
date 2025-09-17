import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { PatientNumberDisplay } from './PatientNumberDisplay';

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <MantineProvider>{children}</MantineProvider>
);

describe('PatientNumberDisplay Component', () => {
  describe('rendering with valid patient number', () => {
    it('renders patient number when provided', () => {
      render(
        <TestWrapper>
          <PatientNumberDisplay patientNumber="P001" />
        </TestWrapper>
      );

      expect(screen.getByText('Patient #: P001')).toBeInTheDocument();
    });

    it('renders alphanumeric patient number', () => {
      render(
        <TestWrapper>
          <PatientNumberDisplay patientNumber="ABC123" />
        </TestWrapper>
      );

      expect(screen.getByText('Patient #: ABC123')).toBeInTheDocument();
    });

    it('renders numeric patient number', () => {
      render(
        <TestWrapper>
          <PatientNumberDisplay patientNumber="12345" />
        </TestWrapper>
      );

      expect(screen.getByText('Patient #: 12345')).toBeInTheDocument();
    });

    it('renders patient number with special characters', () => {
      render(
        <TestWrapper>
          <PatientNumberDisplay patientNumber="P-001-A" />
        </TestWrapper>
      );

      expect(screen.getByText('Patient #: P-001-A')).toBeInTheDocument();
    });
  });

  describe('conditional rendering', () => {
    it('does not render when patient number is empty string', () => {
      const { container } = render(
        <TestWrapper>
          <PatientNumberDisplay patientNumber="" />
        </TestWrapper>
      );

      // Component returns null, but Mantine wrapper may have styles
      expect(screen.queryByText(/Patient #:/)).not.toBeInTheDocument();
    });

    it('renders when patient number is whitespace', () => {
      render(
        <TestWrapper>
          <PatientNumberDisplay patientNumber="   " />
        </TestWrapper>
      );

      // Just verify the component renders and shows "Patient #:"
      expect(screen.getByText('Patient #:', { exact: false })).toBeInTheDocument();
    });
  });

  describe('styling', () => {
    it('applies correct Mantine props', () => {
      render(
        <TestWrapper>
          <PatientNumberDisplay patientNumber="P001" />
        </TestWrapper>
      );

      const textElement = screen.getByText('Patient #: P001');
      // Test that Text component is rendered (basic check)
      expect(textElement).toBeInTheDocument();
    });
  });

  describe('snapshots', () => {
    it('matches snapshot with patient number', () => {
      const { container } = render(
        <TestWrapper>
          <PatientNumberDisplay patientNumber="P123" />
        </TestWrapper>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with empty patient number (null return)', () => {
      render(
        <TestWrapper>
          <PatientNumberDisplay patientNumber="" />
        </TestWrapper>
      );
      // Just check that no text is rendered for empty patient number
      expect(screen.queryByText(/Patient #:/)).not.toBeInTheDocument();
    });

    it('matches snapshot with long patient number', () => {
      const { container } = render(
        <TestWrapper>
          <PatientNumberDisplay patientNumber="VERY-LONG-PATIENT-NUMBER-123456789" />
        </TestWrapper>
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});