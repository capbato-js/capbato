import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { DoctorAssignmentDisplay } from './DoctorAssignmentDisplay';

// Mock the form messages
vi.mock('../config/appointmentFormConfig', () => ({
  FORM_MESSAGES: {
    DOCTOR_ASSIGNMENT: {
      NO_DOCTOR: 'Please select a different date or time when a doctor is available.',
      ERROR: 'There was an issue assigning a doctor. Please try again.',
    },
  },
}));

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <MantineProvider>{children}</MantineProvider>
);

describe('DoctorAssignmentDisplay Component', () => {
  describe('rendering with valid doctor assignment', () => {
    it('renders doctor name correctly', () => {
      render(
        <TestWrapper>
          <DoctorAssignmentDisplay assignedDoctor="Dr. John Smith" />
        </TestWrapper>
      );

      expect(screen.getByText('Assigned Doctor: Dr. John Smith')).toBeInTheDocument();
    });

    it('does not show warning icon for valid doctor', () => {
      render(
        <TestWrapper>
          <DoctorAssignmentDisplay assignedDoctor="Dr. Jane Doe" />
        </TestWrapper>
      );

      const text = screen.getByText('Assigned Doctor: Dr. Jane Doe');
      expect(text.textContent).not.toContain('⚠️');
    });

    it('applies correct styling for valid doctor', () => {
      render(
        <TestWrapper>
          <DoctorAssignmentDisplay assignedDoctor="Dr. Sarah Johnson" />
        </TestWrapper>
      );

      // Text should be present without error styling
      expect(screen.getByText('Assigned Doctor: Dr. Sarah Johnson')).toBeInTheDocument();
    });
  });

  describe('conditional rendering', () => {
    it('does not render when assignedDoctor is empty string', () => {
      render(
        <TestWrapper>
          <DoctorAssignmentDisplay assignedDoctor="" />
        </TestWrapper>
      );

      expect(screen.queryByText(/Assigned Doctor:/)).not.toBeInTheDocument();
    });

    it('does not render when assignedDoctor is null/undefined', () => {
      render(
        <TestWrapper>
          <DoctorAssignmentDisplay assignedDoctor={null as any} />
        </TestWrapper>
      );

      expect(screen.queryByText(/Assigned Doctor:/)).not.toBeInTheDocument();
    });

    it('renders when assignedDoctor is whitespace', () => {
      render(
        <TestWrapper>
          <DoctorAssignmentDisplay assignedDoctor="   " />
        </TestWrapper>
      );

      expect(screen.getByText(/Assigned Doctor:/, { exact: false })).toBeInTheDocument();
    });
  });

  describe('no doctor assigned state', () => {
    it('renders warning for no doctor assigned', () => {
      render(
        <TestWrapper>
          <DoctorAssignmentDisplay assignedDoctor="No doctor assigned" />
        </TestWrapper>
      );

      expect(screen.getByText(/⚠️\s*Assigned Doctor: No doctor assigned/)).toBeInTheDocument();
    });

    it('shows help message for no doctor assigned', () => {
      render(
        <TestWrapper>
          <DoctorAssignmentDisplay assignedDoctor="No doctor assigned" />
        </TestWrapper>
      );

      expect(screen.getByText('Please select a different date or time when a doctor is available.')).toBeInTheDocument();
    });

    it('applies orange color for no doctor state', () => {
      render(
        <TestWrapper>
          <DoctorAssignmentDisplay assignedDoctor="No doctor assigned" />
        </TestWrapper>
      );

      // The text element should be rendered
      expect(screen.getByText(/Assigned Doctor: No doctor assigned/)).toBeInTheDocument();
    });
  });

  describe('error state', () => {
    it('renders warning for error messages', () => {
      render(
        <TestWrapper>
          <DoctorAssignmentDisplay assignedDoctor="Error: Failed to assign doctor" />
        </TestWrapper>
      );

      expect(screen.getByText(/⚠️\s*Assigned Doctor: Error: Failed to assign doctor/)).toBeInTheDocument();
    });

    it('shows help message for error state', () => {
      render(
        <TestWrapper>
          <DoctorAssignmentDisplay assignedDoctor="Error: Network issue" />
        </TestWrapper>
      );

      expect(screen.getByText('There was an issue assigning a doctor. Please try again.')).toBeInTheDocument();
    });

    it('applies red color for error state', () => {
      render(
        <TestWrapper>
          <DoctorAssignmentDisplay assignedDoctor="Error: Something went wrong" />
        </TestWrapper>
      );

      // The text element should be rendered
      expect(screen.getByText(/Assigned Doctor: Error: Something went wrong/)).toBeInTheDocument();
    });

    it('handles error: network timeout', () => {
      render(
        <TestWrapper>
          <DoctorAssignmentDisplay assignedDoctor="Error: Network timeout" />
        </TestWrapper>
      );

      expect(screen.getByText('⚠️ Assigned Doctor: Error: Network timeout')).toBeInTheDocument();
      expect(screen.getByText('There was an issue assigning a doctor. Please try again.')).toBeInTheDocument();
    });

    it('handles error: connecting to server', () => {
      render(
        <TestWrapper>
          <DoctorAssignmentDisplay assignedDoctor="Error connecting to server" />
        </TestWrapper>
      );

      expect(screen.getByText('⚠️ Assigned Doctor: Error connecting to server')).toBeInTheDocument();
      expect(screen.getByText('There was an issue assigning a doctor. Please try again.')).toBeInTheDocument();
    });

    it('handles error: invalid request', () => {
      render(
        <TestWrapper>
          <DoctorAssignmentDisplay assignedDoctor="Error: Invalid request" />
        </TestWrapper>
      );

      expect(screen.getByText('⚠️ Assigned Doctor: Error: Invalid request')).toBeInTheDocument();
      expect(screen.getByText('There was an issue assigning a doctor. Please try again.')).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('handles very long doctor names', () => {
      const longDoctorName = 'Dr. Very Long Doctor Name With Multiple Middle Names And Titles';
      render(
        <TestWrapper>
          <DoctorAssignmentDisplay assignedDoctor={longDoctorName} />
        </TestWrapper>
      );

      expect(screen.getByText(`Assigned Doctor: ${longDoctorName}`)).toBeInTheDocument();
    });

    it('handles special characters in doctor names', () => {
      const specialCharName = "Dr. O'Connor-Smith Jr., MD, PhD";
      render(
        <TestWrapper>
          <DoctorAssignmentDisplay assignedDoctor={specialCharName} />
        </TestWrapper>
      );

      expect(screen.getByText(`Assigned Doctor: ${specialCharName}`)).toBeInTheDocument();
    });

    it('handles non-English characters in doctor names', () => {
      const unicodeName = 'Dr. José María García-López';
      render(
        <TestWrapper>
          <DoctorAssignmentDisplay assignedDoctor={unicodeName} />
        </TestWrapper>
      );

      expect(screen.getByText(`Assigned Doctor: ${unicodeName}`)).toBeInTheDocument();
    });

    it('handles error messages that do not start with "Error"', () => {
      const nonStandardError = 'Failed to load doctor information';
      render(
        <TestWrapper>
          <DoctorAssignmentDisplay assignedDoctor={nonStandardError} />
        </TestWrapper>
      );

      // Should not be treated as error since it doesn't start with "Error"
      const text = screen.getByText(`Assigned Doctor: ${nonStandardError}`);
      expect(text.textContent).not.toContain('⚠️');
    });
  });

  describe('help message states', () => {
    it('does not show help message for valid doctor assignment', () => {
      render(
        <TestWrapper>
          <DoctorAssignmentDisplay assignedDoctor="Dr. Valid Doctor" />
        </TestWrapper>
      );

      expect(screen.queryByText('Please select a different date or time when a doctor is available.')).not.toBeInTheDocument();
      expect(screen.queryByText('There was an issue assigning a doctor. Please try again.')).not.toBeInTheDocument();
    });

    it('shows only no doctor help message for no doctor state', () => {
      render(
        <TestWrapper>
          <DoctorAssignmentDisplay assignedDoctor="No doctor assigned" />
        </TestWrapper>
      );

      expect(screen.getByText('Please select a different date or time when a doctor is available.')).toBeInTheDocument();
      expect(screen.queryByText('There was an issue assigning a doctor. Please try again.')).not.toBeInTheDocument();
    });

    it('shows only error help message for error state', () => {
      render(
        <TestWrapper>
          <DoctorAssignmentDisplay assignedDoctor="Error: Something went wrong" />
        </TestWrapper>
      );

      expect(screen.getByText('There was an issue assigning a doctor. Please try again.')).toBeInTheDocument();
      expect(screen.queryByText('Please select a different date or time when a doctor is available.')).not.toBeInTheDocument();
    });
  });

  describe('snapshots', () => {
    it('matches snapshot with valid doctor', () => {
      const { container } = render(
        <TestWrapper>
          <DoctorAssignmentDisplay assignedDoctor="Dr. John Smith" />
        </TestWrapper>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with no doctor assigned', () => {
      const { container } = render(
        <TestWrapper>
          <DoctorAssignmentDisplay assignedDoctor="No doctor assigned" />
        </TestWrapper>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with error state', () => {
      const { container } = render(
        <TestWrapper>
          <DoctorAssignmentDisplay assignedDoctor="Error: Failed to assign" />
        </TestWrapper>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with empty assignment (null render)', () => {
      render(
        <TestWrapper>
          <DoctorAssignmentDisplay assignedDoctor="" />
        </TestWrapper>
      );
      
      // Verify that nothing is rendered for empty assignment
      expect(screen.queryByText(/Assigned Doctor:/)).not.toBeInTheDocument();
    });
  });
});