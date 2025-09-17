import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { AddAppointmentModal } from './AddAppointmentModal';

// Mock the container component
vi.mock('./AddAppointmentModalContainer', () => ({
  AddAppointmentModalContainer: ({ isOpen, onClose, editMode }: any) => (
    <div data-testid="add-appointment-modal-container">
      <div>Modal {isOpen ? 'Open' : 'Closed'}</div>
      <div>Edit Mode: {editMode ? 'true' : 'false'}</div>
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <MantineProvider>{children}</MantineProvider>
);

describe('AddAppointmentModal Component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('basic rendering', () => {
    it('renders container with correct props', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <AddAppointmentModal {...defaultProps} />
        </TestWrapper>
      );

      expect(getByTestId('add-appointment-modal-container')).toBeInTheDocument();
    });

    it('passes isOpen prop correctly', () => {
      const { getByText } = render(
        <TestWrapper>
          <AddAppointmentModal {...defaultProps} isOpen={true} />
        </TestWrapper>
      );

      expect(getByText('Modal Open')).toBeInTheDocument();
    });

    it('passes closed state correctly', () => {
      const { getByText } = render(
        <TestWrapper>
          <AddAppointmentModal {...defaultProps} isOpen={false} />
        </TestWrapper>
      );

      expect(getByText('Modal Closed')).toBeInTheDocument();
    });
  });

  describe('optional props', () => {
    it('renders without optional props', () => {
      const { getByText } = render(
        <TestWrapper>
          <AddAppointmentModal {...defaultProps} />
        </TestWrapper>
      );

      expect(getByText('Edit Mode: false')).toBeInTheDocument();
    });

    it('passes editMode prop correctly', () => {
      const { getByText } = render(
        <TestWrapper>
          <AddAppointmentModal {...defaultProps} editMode={true} />
        </TestWrapper>
      );

      expect(getByText('Edit Mode: true')).toBeInTheDocument();
    });

    it('passes all optional props', () => {
      const mockAppointment = { id: '1', patientName: 'John Doe' };
      const mockCallback = vi.fn();

      const { getByText } = render(
        <TestWrapper>
          <AddAppointmentModal
            {...defaultProps}
            editMode={true}
            appointment={mockAppointment}
            onAppointmentCreated={mockCallback}
            onAppointmentUpdated={mockCallback}
            isRescheduleMode={true}
          />
        </TestWrapper>
      );

      expect(getByText('Edit Mode: true')).toBeInTheDocument();
    });
  });

  describe('event handling', () => {
    it('calls onClose when close button is clicked', () => {
      const mockOnClose = vi.fn();
      const { getByText } = render(
        <TestWrapper>
          <AddAppointmentModal {...defaultProps} onClose={mockOnClose} />
        </TestWrapper>
      );

      getByText('Close').click();
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('snapshots', () => {
    it('matches snapshot with minimal props', () => {
      const { container } = render(
        <TestWrapper>
          <AddAppointmentModal {...defaultProps} />
        </TestWrapper>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with edit mode', () => {
      const { container } = render(
        <TestWrapper>
          <AddAppointmentModal {...defaultProps} editMode={true} />
        </TestWrapper>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot when closed', () => {
      const { container } = render(
        <TestWrapper>
          <AddAppointmentModal {...defaultProps} isOpen={false} />
        </TestWrapper>
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});